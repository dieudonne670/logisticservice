from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class Shipment(models.Model):
    tracking_number = models.CharField(max_length=20, unique=True, blank=True)
    client = models.ForeignKey(User, on_delete=models.CASCADE, related_name='shipments')
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    weight = models.FloatField()
    height = models.FloatField()
    length = models.FloatField()
    width = models.FloatField()
    FREIGHT_CHOICES = [
        ('land', 'Land Freight'),
        ('air', 'Air Freight'),
        ('sea', 'Sea Freight'),
    ]
    # ... existing fields ...
    freight_type = models.CharField(max_length=10, choices=FREIGHT_CHOICES, default='land')
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            self.tracking_number = f"TRK{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)


class Shipment(models.Model):
    FREIGHT_CHOICES = [
        ('land', 'Land Freight'),
        ('air', 'Air Freight'),
        ('sea', 'Sea Freight'),
    ]

    tracking_number = models.CharField(max_length=20, unique=True, blank=True)
    client = models.ForeignKey('core.CustomUser', on_delete=models.CASCADE, related_name='shipments')
    origin = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    weight = models.FloatField()
    height = models.FloatField()
    length = models.FloatField()
    width = models.FloatField()
    freight_type = models.CharField(max_length=10, choices=FREIGHT_CHOICES, default='land')
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    # NEW — shipper and receiver details
    shipper_name = models.CharField(max_length=120, blank=True)
    shipper_address = models.CharField(max_length=255, blank=True)
    shipper_phone = models.CharField(max_length=40, blank=True)
    shipper_email = models.EmailField(blank=True)

    receiver_name = models.CharField(max_length=120, blank=True)
    receiver_address = models.CharField(max_length=255, blank=True)
    receiver_phone = models.CharField(max_length=40, blank=True)
    receiver_email = models.EmailField(blank=True)

    def save(self, *args, **kwargs):
        if not self.tracking_number:
            import uuid
            self.tracking_number = f"CEL{uuid.uuid4().hex[:11].upper()}-CARGO"
        super().save(*args, **kwargs)

# Create your models here.
