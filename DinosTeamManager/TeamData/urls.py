from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from TeamData import views
from django.urls import include

urlpatterns = [
    # Authorization and authentication
    path('signup/', views.UserListCreate.as_view(), name='signup'),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('check-login-status/', views.CheckLoginStatus.as_view(), name='check-login-status'),
    path('user-info/', views.UserInfo.as_view(), name='get-user-info'),

    # Other
    path('groups/', views.GroupListCreate.as_view(), name='groups'),
    path('group-names/', views.GroupNameOnlyList.as_view(), name='group-names'),
    path('create-user/', views.UserListCreate.as_view(), name='create-user'),
    path('swimmers/', views.SwimmerListCreate.as_view(), name='swimmers'),
    path('swimmers-group/', views.SwimmerGroupListCreate.as_view(), name='swimmers-group'),
    path('swimmers-and-group/', views.SwimmerAndGroupList.as_view(), name='swimmers-and-group'),
    path('coaches/', views.CoachListCreate.as_view(), name='coaches'),
    path('group-coaches/', views.GroupCoachesListCreate.as_view(), name='group-coaches'),
    path('coach-and-group/', views.CoachAndGroupList.as_view(), name='coach-and-group'),
    path('administrators/', views.AdminListCreate.as_view(), name='administrators'),

    path('event_record/', views.EventRecordListCreate.as_view()),
    path('event_record/<int:id>', views.EventRecordRetrieveUpdateDestroy.as_view()),

    path('competitions/', views.CompetitionListCreate.as_view()),   
    path('competitions/<str:name>/', views.CompetitionRetrieveUpdateDestroy.as_view()),
]

urlpatterns = format_suffix_patterns(urlpatterns)