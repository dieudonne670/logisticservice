from rest_framework import serializers
from .models import LocationPoint

class LocationPointSerializer(serializers.ModelSerializer):
    latitude = serializers.SerializerMethodField()
    longitude = serializers.SerializerMethodField()

    class Meta:
        model = LocationPoint
        fields = ('id', 'shipment', 'latitude', 'longitude', 'timestamp')

    def get_latitude(self, obj):
        return obj.geom.y

    def get_longitude(self, obj):
        return obj.geom.x