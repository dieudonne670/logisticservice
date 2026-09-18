from django.db import models
# core/models.py
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True)
    # Add a role field for admin vs client distinction
    ROLE_CHOICES = [('admin', 'Admin'), ('client', 'Client')]
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='client')
# Create your models here.
