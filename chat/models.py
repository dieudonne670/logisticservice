from django.db import models
from django.contrib.auth import get_user_model
from shipments.models import Shipment

User = get_user_model()

class Message(models.Model):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    sender_label = models.CharField(max_length=100, blank=True, default='Client')
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    from_admin = models.BooleanField(default=False)

    class Meta:
        ordering = ['timestamp']

    def __str__(self):
        name = self.sender.username if self.sender else self.sender_label
        return f"{name}: {self.content[:40]}"