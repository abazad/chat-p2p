from chat.models import OnlineUser, Conversation
from rest_framework import serializers

class OnlineUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = OnlineUser
        fields = ('id', 'name')
        
class ConversationSerializer(serializers.ModelSerializer):
    
  
    class Meta:
        model = Conversation
        fields = ('id', 'idc', 'user1', 'user2')