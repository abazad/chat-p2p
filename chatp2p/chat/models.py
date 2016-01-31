from django.db import models

# Create your models here.

class OnlineUser(models.Model):
    name = models.CharField(max_length=255, unique=True)
    
class Conversation(models.Model):
    idc = models.CharField(max_length=255, unique=True)
    user1 = models.ForeignKey(OnlineUser, on_delete=models.CASCADE, related_name='user1')
    user2 = models.ForeignKey(OnlineUser, on_delete=models.CASCADE, related_name='user2')
