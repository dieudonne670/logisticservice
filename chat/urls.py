from django.urls import path
from .views import ConversationListView, ShipmentMessagesView

urlpatterns = [
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('shipments/<int:shipment_id>/', ShipmentMessagesView.as_view(), name='shipment-messages'),
]