from django.shortcuts import render
# tracking/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.gis.geos import Point
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import LocationPoint
from shipments.models import Shipment

class LocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        shipment_id = request.data.get('shipment_id')
        lat = request.data.get('latitude')
        lng = request.data.get('longitude')

        shipment = Shipment.objects.get(id=shipment_id)
        point = LocationPoint.objects.create(
            shipment=shipment,
            geom=Point(float(lng), float(lat))
        )

        # Broadcast to WebSocket group for this shipment
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'shipment_{shipment_id}',
            {
                'type': 'location_update',
                'latitude': lat,
                'longitude': lng,
                'timestamp': str(point.timestamp),
            }
        )

        return Response({'status': 'ok'})

# Create your views here.
