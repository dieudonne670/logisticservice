from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Max, Count, Q
from shipments.models import Shipment
from .models import Message


class ConversationListView(APIView):
    """
    Admin only. Returns one entry per shipment that has messages.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        shipments = (
            Shipment.objects.filter(messages__isnull=False)
            .distinct()
            .annotate(
                message_count=Count('messages'),
                last_message_at=Max('messages__timestamp'),
            )
            .order_by('-last_message_at')
        )

        conversations = []
        for s in shipments:
            last = s.messages.order_by('-timestamp').first()
            conversations.append({
                'shipment_id': s.id,
                'tracking_number': s.tracking_number,
                'origin': s.origin,
                'destination': s.destination,
                'message_count': s.message_count,
                'last_message_at': s.last_message_at.isoformat(),
                'last_message': last.content if last else '',
                'last_from_admin': last.from_admin if last else False,
            })

        return Response(conversations)


class ShipmentMessagesView(APIView):
    """
    Admin only. Returns all messages for a shipment.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request, shipment_id):
        messages = Message.objects.filter(shipment_id=shipment_id).order_by('timestamp')
        return Response([
            {
                'id': m.id,
                'message': m.content,
                'sender_label': m.sender_label,
                'from_admin': m.from_admin,
                'timestamp': m.timestamp.isoformat(),
            }
            for m in messages
        ])
# Create your views here.
