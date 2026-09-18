from django.urls import path
from .views import (
    ShipmentListCreateView,
    ShipmentDetailView,
    ShipmentByIdView,
    PublicShipmentDetailView,
)

urlpatterns = [
    # Public — reachable at /api/shipments/public/<tn>/
    path('public/<str:tracking_number>/', PublicShipmentDetailView.as_view(), name='public-shipment-detail'),

    # Admin — reachable at /api/shipments/...
    path('', ShipmentListCreateView.as_view(), name='shipment-list-create'),
    path('<int:id>/by-id/', ShipmentByIdView.as_view(), name='shipment-by-id'),
    path('<str:tracking_number>/', ShipmentDetailView.as_view(), name='shipment-detail'),
]