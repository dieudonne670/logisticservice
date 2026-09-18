from rest_framework import generics, permissions
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Shipment
from .serializers import ShipmentSerializer


class ShipmentListCreateView(generics.ListCreateAPIView):
    """
    Admin only. Lists all shipments, or creates a new one.
    """
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) == 'admin' or user.is_staff or user.is_superuser:
            return Shipment.objects.all().order_by('-created_at')
        return Shipment.objects.filter(client=user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)


class ShipmentDetailView(generics.RetrieveUpdateAPIView):
    """
    Authenticated. Retrieve or update a shipment by tracking_number.
    """
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'tracking_number'

    def get_queryset(self):
        user = self.request.user
        if getattr(user, 'role', None) == 'admin' or user.is_staff or user.is_superuser:
            return Shipment.objects.all()
        return Shipment.objects.filter(client=user)


class ShipmentByIdView(generics.RetrieveUpdateAPIView):
    """
    Admin. Retrieve or update a shipment by numeric id.
    Used by the admin's ShipmentDetail page.
    """
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]
    queryset = Shipment.objects.all()
    lookup_field = 'id'


class PublicShipmentDetailView(generics.RetrieveAPIView):
    """
    Public. Any client can look up their shipment by tracking number.
    The tracking number itself is the only credential.
    """
    serializer_class = ShipmentSerializer
    permission_classes = [AllowAny]
    lookup_field = 'tracking_number'
    queryset = Shipment.objects.all()