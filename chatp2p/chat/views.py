
from django.shortcuts import render
from rest_framework.response import Response
from django.db.models import Q

from chat.models import OnlineUser, Conversation
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from chat.serializers import OnlineUserSerializer, ConversationSerializer

# Create your views here.

class OnlineUserViewSet(viewsets.ModelViewSet):
    queryset = OnlineUser.objects.all()
    serializer_class = OnlineUserSerializer
    lookup_field = 'name'
    
    @detail_route()
    def chats(self, request, name):
        user = OnlineUser.objects.get(name=name)
        chats = Conversation.objects.filter(Q(user1 = user.id) | Q(user2 = user.id))
        serializer = ConversationSerializer(chats, many=True, context={'request': request})
        return Response(serializer.data)
    
class ConversationViewSet(viewsets.ModelViewSet):
    queryset = Conversation.objects.all()
    serializer_class = ConversationSerializer
    lookup_field = 'idc'
