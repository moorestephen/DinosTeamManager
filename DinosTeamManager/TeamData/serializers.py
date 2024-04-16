from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .models import (Club, Swimmer, Group, SwimmerGroup, Coach, GroupCoaches, Admin, 
                     GroupPractices, Competition, CompetitionCoachDelegations, 
                     CompetitionSwimmersAttending, EventRecord, Event, Entry)

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
        else:
            raise serializers.ValidationError('Must include "username" and "password"')
        attrs['user'] = user
        return attrs

class UserSerializer(serializers.ModelSerializer):
    class Meta(object):
        model = User
        fields = ['id', 'email', 'username', 'password']
    
class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = '__all__'

class SwimmerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Swimmer
        fields = '__all__'