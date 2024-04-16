from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, logout, login
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from django.http import Http404
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import Club, Swimmer, User
from .serializers import ClubSerializer, SwimmerSerializer, UserSerializer, LoginSerializer
from django.contrib.auth import SESSION_KEY, BACKEND_SESSION_KEY

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if user is not None:
            login(request, user)
            print(request.user.is_authenticated)
            print(request.user.email)
            return Response(status=status.HTTP_200_OK, headers={'Access-Control-Allow-Credentials': 'true'})
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, headers={'Access-Control-Allow-Credentials': 'true'})

class LogoutView(APIView):
    def get(self, request):
        print(request.user.is_authenticated)
        print(request.user)
        print(request.session)
        logout(request)
        return Response({"success":True}, status=status.HTTP_200_OK, headers={'Access-Control-Allow-Credentials': 'true'})
    
class CheckLoginStatus(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            print(request.user.username)
            return Response({'is_authenticated': True}, headers={'Access-Control-Allow-Credentials': 'true'})
        else:
            return Response({'is_authenticated': False}, headers={'Access-Control-Allow-Credentials': 'true'})

class UserListCreate(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def perform_create(self, serializer):
        serializer = UserSerializer(data=self.request.data)
        if serializer.is_valid():
            user = serializer.save()
            user = User.objects.get(username=self.request.data['username'])
            user.set_password(self.request.data['password'])
            user.save()
            return Response({'user': serializer.data})
        return Response(serializer.errors)

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class ClubListCreate(generics.ListCreateAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer

class ClubDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer

class SwimmerListCreate(generics.ListCreateAPIView):
    queryset = Swimmer.objects.all()
    serializer_class = SwimmerSerializer
    # authentication_classes = [SessionAuthentication]
    permission_classes = [IsAuthenticated]



class SwimmerDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Swimmer.objects.all()
    serializer_class = SwimmerSerializer