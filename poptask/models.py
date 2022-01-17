from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MaxValueValidator, MinValueValidator
# Create your models here.
class User(AbstractUser):
    score = models.IntegerField(default=0)
    picture = models.FileField(blank=True)
    email = models.EmailField(unique=True)
    content_type =  models.CharField(max_length=50)

class Group(models.Model):
    name = models.CharField(primary_key=True, max_length=200)
    manager = models.ForeignKey(User, on_delete=models.PROTECT, related_name="manage_groups")
    members = models.ManyToManyField(User, related_name="mygroups")
    class Meta:
        ordering = ('name',)

class Task(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="tasks_created")
    assigned_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="tasks_giveout", null=True, blank=True)
    assigned_to = models.ForeignKey(User, on_delete=models.PROTECT, related_name="tasks_assigned", null=True, blank=True)
    name = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    created_by = models.ForeignKey(User, on_delete=models.PROTECT, related_name="tasks_created")
    group = models.ForeignKey(Group, on_delete=models.PROTECT, related_name="tasks", null=True, blank=True)
    score = models.IntegerField(
        default=1,
        validators=[
            MinValueValidator(1)
        ])
    creation_at = models.DateTimeField()
    assigned_at = models.DateTimeField(null=True, blank=True)
    deadline = models.DateTimeField()
    done_at = models.DateTimeField(null=True, blank=True)
    class Meta:
        ordering = ('deadline', 'score')

class Role(models.Model):
    name = models.CharField(max_length=200)
    assigned_to = models.ManyToManyField(User, related_name="roles")
