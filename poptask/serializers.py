from .models import User, Task, Group
from rest_framework import serializers

class UserSerializer(serializers.HyperlinkedModelSerializer):
    mygroups = serializers.PrimaryKeyRelatedField(
        many=True,
        required=False,
        read_only=True)
    tasks_assigned = serializers.PrimaryKeyRelatedField(
        many=True,
        required=False,
        read_only=True)
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'score', 'mygroups', 'tasks_assigned']
        lookup_field = "email"

    def create(self, validated_data):
        """
        Create and return a new `User` instance, given the validated data.
        """
        return User.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `User` instance, given the validated data.
        """
        # only allow to update the following fields
        instance.score = validated_data.get('score', instance.score)
        instance.picture = validated_data.get('picture', instance.picture)
        instance.content_type = validated_data.get('content_type', instance.content_type)
        instance.save()
        return instance


class TaskSerializer(serializers.HyperlinkedModelSerializer):
    created_by = serializers.SlugRelatedField(
                                queryset=User.objects.all(),
                                slug_field='email',
                                many=False,
                                required=False)
    assigned_by = serializers.SlugRelatedField(
                                queryset=User.objects.all(),
                                slug_field='email',
                                many=False,
                                required=False)
    assigned_to = serializers.SlugRelatedField(
                                queryset=User.objects.all(),
                                slug_field='email',
                                many=False,
                                required=False)
    group = serializers.SlugRelatedField(
                                queryset=Group.objects.all(),
                                slug_field='name',
                                many=False,
                                required=False)
    name = serializers.CharField(required=False, max_length=200)
    description = serializers.CharField(required=False, max_length=200)
    score = serializers.IntegerField(required=False)
    creation_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False, read_only=True)
    assigned_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False, read_only=True)
    deadline = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False, read_only=False)
    done_at = serializers.DateTimeField(format="%Y-%m-%d %H:%M:%S", required=False, read_only=False)

    class Meta:
        model = Task
        fields = ['url', 'id', 'created_by', 'assigned_by', 'group',
                  'assigned_to', 'name', 'description','score', 'creation_at',
                  'assigned_at', 'deadline', 'done_at']


    def create(self, validated_data):
        """
        Create and return a new `Task` instance, given the validated data.
        """
        return Task.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Update and return an existing `Task` instance, given the validated data.
        """
        assigned_by = validated_data.get('assigned_by', instance.assigned_by)
        if not can_update(assigned_by, instance):
            return instance
        assigned_to = validated_data.get('assigned_to', instance.assigned_to)
        # print('------------------------debug message---------------------------')
        # print(can_assign(instance.assigned_by, assigned_to, instance))

        # when assignee is not empty, set the assigner and assign time
        if assigned_to:
            if can_assign(assigned_by, assigned_to, instance):
                instance.assigned_by = assigned_by
                instance.assigned_at = validated_data.get('assigned_at', instance.assigned_at)
                instance.assigned_to = assigned_to
                # print('assigned task to '+assigned_to.email)
            # invalid assign, don't update task
            else:
                # print('------------------------debug message---------------------------')
                # print(instance)
                return instance

        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.score = validated_data.get('score', instance.score)
        instance.deadline = validated_data.get('deadline', instance.deadline)

        # instance.assigned_by = validated_data.get('assigned_by')
        # instance.assigned_at = validated_data.get('assigned_at')
        instance.done_at = validated_data.get('done_at', instance.done_at)
        instance.save()
        return instance

def can_assign(assigner, assignee, task):
    # assigner and assignee and the task are in the same group
    if not (can_update(assigner, task) and can_update(assignee, task)):
        return False
    return True

def can_update(editor, task):
    # assigner and assignee and the task are in the same group
    group = task.group
    if not group.members.filter(email=editor.email).exists():
        # print('editor '+editor.email +" not in group "+task.group.name)
        return False
    return True




class GroupSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.CharField(required=False, read_only=False, max_length=200)
    manager = serializers.ReadOnlyField(source='manager.email')
    members = serializers.SlugRelatedField(
        queryset=User.objects.all(),
        many=True,
        slug_field='email',
        required=False)

    class Meta:
        model = Group
        fields = ['url', 'name', 'manager', 'members']


    def create(self, validated_data):
        """
        Create and return a new `Group` instance, given the validated data.
        """
        instance = Group.objects.create(**validated_data)
        instance.members.add(validated_data.get('manager'))
        return instance

    def update(self, instance, validated_data):
        """
        Update and return an existing `Group` instance, given the validated data.
        """

        members_data = validated_data.pop('members')
        instance = super(GroupSerializer, self).update(instance, validated_data)
        instance.members.clear()
        for member in members_data:
            instance.members.add(member)


        # instance.save()
        return instance
