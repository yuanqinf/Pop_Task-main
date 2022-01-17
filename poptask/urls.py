from django.urls import path, include
from rest_framework.routers import DefaultRouter
from poptask import views

# Create a router and register our viewsets with it.
router = DefaultRouter()
router.register(r'tasks', views.TaskViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)

urlpatterns = [
    path('test', views.test, name='test'),
    path('', include(router.urls)),
]
