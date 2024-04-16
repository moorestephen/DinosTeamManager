from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Club(models.Model):
    name = models.CharField(primary_key=True, max_length=100)
    city = models.CharField(max_length=100)

class Swimmer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank = True, null = True)
    email = models.EmailField(primary_key=True, max_length = 50)
    dob = models.DateField()
    fname = models.CharField(max_length=15)
    lname = models.CharField(max_length=30)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)

class Group(models.Model):
    name = models.CharField(primary_key=True, max_length=100)
    monthly_fee = models.DecimalField(max_digits=5, decimal_places=2)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)

class SwimmerGroup(models.Model):
    swimmer = models.ForeignKey(Swimmer, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

class Coach(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank = True, null = True)
    email = models.EmailField(primary_key=True, max_length = 50)
    tenure_start = models.DateField()
    contract_start = models.DateField()
    fname = models.CharField(max_length=15)
    lname = models.CharField(max_length=30)
    club = models.ForeignKey(Club, on_delete=models.CASCADE)

class GroupCoaches(models.Model):
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, blank = True, null = True)
    email = models.EmailField(primary_key=True, max_length = 50)
    tenure_start = models.DateField()
    fname = models.CharField(max_length=15)
    lname = models.CharField(max_length=30)
    club_name = models.ForeignKey(Club, on_delete=models.CASCADE)

class GroupPractices(models.Model):
    day = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

class Competition(models.Model):
    name = models.CharField(primary_key=True, max_length=100)
    sanctioned = models.BooleanField()
    start_date = models.DateField()
    end_date = models.DateField()

class CompetitionCoachDelegations(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE)
    delegating_admin = models.ForeignKey(Admin, on_delete=models.CASCADE)

class CompetitionSwimmersAttending(models.Model):
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)
    swimmer = models.ForeignKey(Swimmer, on_delete=models.CASCADE)

class EventRecord(models.Model):
    entry_time = models.TimeField()
    final_time_seconds = models.PositiveIntegerField()
    distance = models.PositiveIntegerField()
    stroke = models.CharField(max_length=30)
    course = models.CharField(max_length=20)
    swimmer = models.ForeignKey(Swimmer, on_delete=models.CASCADE)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)

class Event(models.Model):
    distance = models.PositiveIntegerField()
    stroke = models.CharField(max_length=30)
    course = models.CharField(max_length=20)
    competition = models.ForeignKey(Competition, on_delete=models.CASCADE)

class Entry(models.Model):
    entry_time = models.TimeField()
    final_time = models.PositiveIntegerField()
    swimmer = models.ForeignKey(Swimmer, on_delete=models.CASCADE)