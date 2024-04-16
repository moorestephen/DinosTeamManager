from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth import logout
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404, redirect
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib.auth.views import LoginView

from .serializers import UserSerializer

class LoginView(APIView):
    def post(self, request):
        user = get_object_or_404(User, username=request.data["username"])
        if not user.check_password(request.data["password"]):
            return Response({"success": False})
        return Response({"success": True})
    
class SignupView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            user = User.objects.get(username=request.data['username'])
            user.set_password(request.data['password'])
            user.save()
            return Response({'user': serializer.data})
        return Response(serializer.errors)
    
class LogoutView(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request):
        logout(request)
        return Response({"message": "Successfully logged out"})
    
class TestDataOutput(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        queryset = User.objects.raw(
            'SELECT * FROM auth_user'
        )
        serialized = UserSerializer(queryset)
        return Response(serialized.data)