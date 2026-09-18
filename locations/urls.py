from django.urls import path
from .views import LocationUpdateView, LocationHistoryView, LatestLocationView

urlpatterns = [
    path('', LocationUpdateView.as_view(), name='location-update'),
    path('history/<int:shipment_id>/', LocationHistoryView.as_view(), name='location-history'),
    path('latest/<int:shipment_id>/', LatestLocationView.as_view(), name='location-latest'),
]