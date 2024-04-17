from django.contrib.auth import authenticate, logout, login
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import generics
from .models import (User, Club, Swimmer, Group, SwimmerGroup, Coach, GroupCoaches, Admin, 
                    GroupPractices, Competition, CompetitionCoachDelegations, CompetitionSwimmersAttending, 
                    EventRecord, Event, Entry)
from .serializers import (UserSerializer, ClubSerializer, SwimmerSerializer, GroupSerializer, 
                          SwimmerGroupSerializer, SwimmerAndGroupListSerializer, SwimmerAndGroupListSerializer,
                          CoachSerializer, GroupCoachesSerializer, CoachAndGroupListSerializer, AdminSerializer,
                          GroupPracticesSerializer, CompetitionSerializer, CompetitionCoachDelegationsSerializer,
                          CompetitionSwimmersAttendingSerializer, EventRecordSerializer, EventSerializer,
                          EntrySerializer, UserInfoSerializer)

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

class UserInfo(APIView):
    def get(self, request):
        if request.user.is_authenticated:
            user = User.objects.get(username=request.user.username)
            data = {}
            if Swimmer.objects.filter(email=request.user.email).exists():
                data['email'] = user.email
                data['role'] = 'Swimmer'
            elif Coach.objects.filter(email=request.user.email).exists():
                data['email'] = user.email
                data['role'] = 'Coach'
            elif Admin.objects.filter(email=request.user.email).exists():
                data['email'] = user.email
                data['role'] = 'Admin'
            else:
                return Response({'error': 'User not linked to any role'}, headers={'Access-Control-Allow-Credentials': 'true'})
            return Response(data, headers={'Access-Control-Allow-Credentials': 'true'})
        else:
            return Response({'error': 'User not authenticated'}, headers={'Access-Control-Allow-Credentials': 'true'})

class ClubListCreate(generics.ListCreateAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer

class ClubRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Club.objects.all()
    serializer_class = ClubSerializer

class SwimmerListCreate(generics.ListCreateAPIView):
    queryset = Swimmer.objects.all()
    serializer_class = SwimmerSerializer

class SwimmerRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Swimmer.objects.all()
    serializer_class = SwimmerSerializer

class GroupListCreate(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer

class GroupNameOnlyList(APIView):
    def get(self, request):
        queryset = Group.objects.raw(
            'SELECT name FROM TeamData_group'
        )
        serialized = GroupSerializer(queryset, many=True)
        return Response(serialized.data)

class SwimmerGroupListCreate(generics.ListCreateAPIView):
    queryset = SwimmerGroup.objects.all()
    serializer_class = SwimmerGroupSerializer

class SwimmerGroupRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = SwimmerGroup.objects.all()
    serializer_class = SwimmerGroupSerializer

class SwimmerAndGroupList(APIView):
    def get(self, request):
        queryset = Swimmer.objects.raw(
            'SELECT email, fname, lname, dob, group_id FROM TeamData_swimmer INNER JOIN TeamData_swimmergroup ON TeamData_swimmer.email = TeamData_swimmergroup.swimmer_id'
        )
        serialized = SwimmerAndGroupListSerializer(queryset, many=True)
        return Response(serialized.data)

class CoachListCreate(generics.ListCreateAPIView):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer

class CoachRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer

class GroupCoachesListCreate(generics.ListCreateAPIView):
    queryset = GroupCoaches.objects.all()
    serializer_class = GroupCoachesSerializer

class CoachAndGroupList(APIView):
    def get(self, request):
        queryset = Coach.objects.raw(
            'SELECT email, fname, lname, group_id FROM TeamData_coach INNER JOIN TeamData_groupcoaches ON TeamData_coach.email = TeamData_groupcoaches.coach_id'
        )
        serialized = CoachAndGroupListSerializer(queryset, many=True)
        return Response(serialized.data)

class GroupCoachesRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = GroupCoaches.objects.all()
    serializer_class = GroupCoachesSerializer

class AdminListCreate(generics.ListCreateAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class AdminRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class GroupPracticesListCreate(generics.ListCreateAPIView):
    queryset = GroupPractices.objects.all()
    serializer_class = GroupPracticesSerializer

class GroupPracticesRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = GroupPractices.objects.all()
    serializer_class = GroupPracticesSerializer

class CompetitionListCreate(generics.ListCreateAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

class UpcomingCompetitionListCreate(generics.ListCreateAPIView):
    def get(self, request):
        queryset = Competition.objects.raw(
            "SELECT * FROM TeamData_competition WHERE end_date >= Date('now')"
        )
        serialized = CompetitionSerializer(queryset, many = True)
        return Response(serialized.data)

class CompetitionRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Competition.objects.all()
    serializer_class = CompetitionSerializer

    def delete(self, request, *args, **kwargs):
        name = kwargs.get('name')
        competition = self.queryset.filter(name = name).first()
        if competition:
            competition.delete()
            return Response({'message': 'Competition deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Competition not found'}, status=status.HTTP_404_NOT_FOUND)

class CompetitionCoachDelegationsListCreate(generics.ListCreateAPIView):
    queryset = CompetitionCoachDelegations.objects.all()
    serializer_class = CompetitionCoachDelegationsSerializer

class CompetitionCoachDelegationsRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CompetitionCoachDelegations.objects.all()
    serializer_class = CompetitionCoachDelegationsSerializer

class CompetitionSwimmersAttendingListCreate(generics.ListCreateAPIView):
    queryset = CompetitionSwimmersAttending.objects.all()
    serializer_class = CompetitionSwimmersAttendingSerializer

class CompetitionSwimmersAttendingRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = CompetitionSwimmersAttending.objects.all()
    serializer_class = CompetitionSwimmersAttendingSerializer

class EventRecordListCreate(generics.ListCreateAPIView):
    queryset = EventRecord.objects.all()
    serializer_class = EventRecordSerializer

class EventRecordRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = EventRecord.objects.all()
    serializer_class = EventRecordSerializer

    def delete(self, request, *args, **kwargs):
        id = kwargs.get('id')
        event_record = self.queryset.filter(id = id).first()
        if event_record:
            event_record.delete()
            return Response({'message': 'Event record deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'error': 'Event record not found'}, status=status.HTTP_404_NOT_FOUND)

class EventListCreate(generics.ListCreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EventRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class EntryListCreate(generics.ListCreateAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer

class EntryRetrieveUpdateDestroy(generics.RetrieveUpdateDestroyAPIView):
    queryset = Entry.objects.all()
    serializer_class = EntrySerializer