from django.db import models
# locations/models.py
from django.contrib.gis.db import models

class LocationPoint(models.Model):
    shipment = models.ForeignKey('shipments.Shipment', on_delete=models.CASCADE, related_name='tracking_points')
    geom = models.PointField(srid=4326)  # WGS84 coordinate system [citation:16]
    timestamp = models.DateTimeField(auto_now_add=True)
    # Optional: driver identifier, speed, heading

# Create your models here.
