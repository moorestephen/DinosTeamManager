from django.urls import path
from rest_framework.urlpatterns import format_suffix_patterns
from TeamData import views
from django.urls import include

urlpatterns = [
    path('club/', views.ClubListCreate.as_view()),
    path('club/<int:pk>/', views.ClubDetail.as_view()),
    path('swimmer/', views.SwimmerListCreate.as_view()),
    path('swimmer/<int:pk>/', views.SwimmerDetail.as_view()),
    path('user/', views.UserListCreate.as_view()),
    path('user/<int:pk>/', views.UserDetail.as_view()),
    path('login/', views.LoginView.as_view(), name='login'),
    path('logout/', views.LogoutView.as_view(), name='logout'),
    path('signup/', views.UserListCreate.as_view(), name='signup'),
    path('check-login-status/', views.CheckLoginStatus.as_view(), name='check-login-status'),
]

urlpatterns = format_suffix_patterns(urlpatterns)