import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from shipments.models import Shipment
from chat.models import Message

User = get_user_model()


class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.shipment_id = self.scope['url_route']['kwargs']['shipment_id']
        self.group_name = f'shipment_{self.shipment_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def location_update(self, event):
        await self.send(text_data=json.dumps({
            'latitude': event.get('latitude'),
            'longitude': event.get('longitude'),
            'timestamp': event.get('timestamp'),
        }))


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Chat room for a specific shipment.
    - Admin connects with ?token=<JWT> and is identified by username.
    - Client connects with ?tracking=<tracking_number> and is anonymous.
    """

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'
        self.user = self.scope.get('user')

        # Parse query string
        from urllib.parse import parse_qs
        params = parse_qs(self.scope['query_string'].decode())
        self.tracking = params.get('tracking', [None])[0]

        # Validate access: admin (authenticated) OR client (with matching tracking number)
        if self.user and self.user.is_authenticated:
            self.sender_label = self.user.username
            self.from_admin = True
        elif self.tracking:
            # Verify tracking number matches the shipment in the room
            if not await self.tracking_matches():
                await self.close()
                return
            self.sender_label = 'Client'
            self.from_admin = False
        else:
            await self.close()
            return

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

        history = await self.get_history()
        await self.send(text_data=json.dumps({
            'type': 'history',
            'messages': history,
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        content = data.get('message', '').strip()
        if not content:
            return

        msg = await self.save_message(content)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'id': msg['id'],
                'message': content,
                'sender_label': self.sender_label,
                'from_admin': self.from_admin,
                'timestamp': msg['timestamp'],
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'id': event['id'],
            'message': event['message'],
            'sender_label': event['sender_label'],
            'from_admin': event['from_admin'],
            'timestamp': event['timestamp'],
        }))

    @database_sync_to_async
    def tracking_matches(self):
        shipment_id = self.room_name.replace('shipment_', '')
        try:
            shipment = Shipment.objects.get(id=shipment_id)
            return shipment.tracking_number == self.tracking
        except Shipment.DoesNotExist:
            return False

    @database_sync_to_async
    def save_message(self, content):
        shipment_id = self.room_name.replace('shipment_', '')
        shipment = Shipment.objects.get(id=shipment_id)
        m = Message.objects.create(
            shipment=shipment,
            sender=self.user if (self.user and self.user.is_authenticated) else None,
            sender_label=self.sender_label,
            content=content,
            from_admin=self.from_admin,
        )
        return {'id': m.id, 'timestamp': m.timestamp.isoformat()}

    @database_sync_to_async
    def get_history(self):
        shipment_id = self.room_name.replace('shipment_', '')
        messages = Message.objects.filter(shipment_id=shipment_id).select_related('sender')[:200]
        return [
            {
                'id': m.id,
                'message': m.content,
                'sender_label': m.sender_label,
                'from_admin': m.from_admin,
                'timestamp': m.timestamp.isoformat(),
            }
            for m in messages
        ]