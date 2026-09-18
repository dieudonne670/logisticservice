
# locations/admin.py
from django.contrib import admin
from .models import LocationPoint

@admin.register(LocationPoint)
class LocationPointAdmin(admin.ModelAdmin):
    list_display = ('shipment', 'timestamp')

# Register your models here.
