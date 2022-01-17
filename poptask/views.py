import datetime
from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import viewsets
from rest_framework import permissions
from poptask.models import User, Task, Group
from poptask.serializers import UserSerializer, TaskSerializer, GroupSerializer
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import action
from rest_framework.response import Response
from poptask.permissions import IsManagerOrReadOnly
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
# from rest_auth.registration.views import SocialLoginView
from dj_rest_auth.registration.views import SocialLoginView

from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import render

def page_not_found_view(request, exception):
    return render(request, '../templates/404.html', status=404)

# Create your views here.
def test(request):
    return HttpResponse("Hello, PopTask!")

class GoogleLogin(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('score')
    serializer_class = UserSerializer
    lookup_field = "email"
    lookup_value_regex = "[^/]+"

    filter_backends = [DjangoFilterBackend]
    filter_fields = ['username']
    http_method_names = ['get', 'post']
    # permission_classes = [permissions.IsAuthenticated]

class TaskViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['assigned_to__email']
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'post', 'put', 'delete']

    def perform_create(self, serializer):
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        serializer.save(created_by=self.request.user,
                        creation_at=now)

    def perform_update(self, serializer):
        now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        serializer.save(assigned_by=self.request.user, assigned_at=now)

class GroupViewSet(viewsets.ModelViewSet):
    """
    This viewset automatically provides `list`, `create`, `retrieve`,
    `update` and `destroy` actions.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    # filter_backends = [DjangoFilterBackend]
    # filterset_fields = ['manager__email', 'members_email']
    permission_classes = [permissions.IsAuthenticated,
                          IsManagerOrReadOnly]
    http_method_names = ['get', 'post', 'put']

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated], url_name='leave')
    def leave_group(self, request, pk=None):
        group = self.get_object()
        user = self.request.user
        if user == group.manager:
            # kick out all members, clear all tasks
            manager_email = user.email
            group_name = group.name
            group.members.clear()
            group.tasks.clear()
            group.delete()
            return Response({'message': 'group '+group_name+' is removed by manager '+manager_email})
        elif group.members.filter(email=user.email).exists():
            group.members.remove(user)
            return Response({'message': 'user '+user.email+' has left group '+group.name})
        else:
            return Response(serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated], url_name='ranking')
    def group_ranking(self, request, pk=None):
        group = self.get_object()
        members = list(group.members.values('email'))
        for member in members:
            member['score'] = 0
        tasks = group.tasks.all()
        for task in group.tasks.all():
            if task.done_at is not None:
                for member in members:
                    if member['email'] == task.assigned_to.email:
                        member['score'] += task.score
                        break
        resp = {}
        for member in members:
            resp[member['email']] = member['score']
        return Response(resp)
