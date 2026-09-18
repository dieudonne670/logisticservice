from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.gis.geos import Point
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from shipments.models import Shipment
from .models import LocationPoint
from .serializers import LocationPointSerializer
from rest_framework.permissions import AllowAny
from .models import LocationPoint


class LocationUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        shipment_id = request.data.get('shipment_id')
        lat = request.data.get('latitude')
        lng = request.data.get('longitude')

        if not all([shipment_id, lat, lng]):
            return Response({'error': 'shipment_id, latitude, longitude required'}, status=400)

        try:
            shipment = Shipment.objects.get(id=shipment_id)
        except Shipment.DoesNotExist:
            return Response({'error': 'Shipment not found'}, status=404)

        point = LocationPoint.objects.create(
            shipment=shipment,
            geom=Point(float(lng), float(lat), srid=4326)
        )

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

        return Response(LocationPointSerializer(point).data, status=201)


class LocationHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, shipment_id):
        points = LocationPoint.objects.filter(shipment_id=shipment_id).order_by('timestamp')
        return Response(LocationPointSerializer(points, many=True).data)



class LatestLocationView(APIView):
    """
    Public. Returns the most recent location point for a shipment.
    Used by the client map to show the last known position on page load.
    """
    permission_classes = [AllowAny]

    def get(self, request, shipment_id):
        point = LocationPoint.objects.filter(shipment_id=shipment_id).order_by('-timestamp').first()
        if not point:
            return Response({'latitude': None, 'longitude': None, 'timestamp': None})
        return Response({
            'latitude': point.geom.y,
            'longitude': point.geom.x,
            'timestamp': point.timestamp.isoformat(),
        })

# Create your views here.
