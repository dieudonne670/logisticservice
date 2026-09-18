
from django.contrib import admin
from .models import Shipment


@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ('tracking_number', 'shipper_name', 'receiver_name', 'origin', 'destination', 'status', 'created_at')
    search_fields = ('tracking_number', 'shipper_name', 'receiver_name', 'origin', 'destination')
    list_filter = ('status', 'freight_type')