import json
import datetime
from django.test import TestCase
from django.urls import reverse
from poptask.models import User, Task, Group
from poptask.serializers import UserSerializer, TaskSerializer, GroupSerializer
from rest_framework import status
from rest_framework.test import APITestCase
from rest_framework.test import APIRequestFactory
from rest_framework.authtoken.models import Token
# Create your tests here.

# class UserManagementTests(APITestCase):
#     list_url = reverse('user-list')
#     def setUp(self):
#         self.user = User.objects.create_user(username="test_user1", email="test_user1@test.com",
#                                              password="strong_password")
#         self.user2 = User.objects.create_user(username="test_user2", email="test_user2@test.com",
#                                              password="strong_password")
#         self.token = Token.objects.create(user=self.user)
#         self.api_authentication()
#         # self.client.login(username="test_user1",
#         #                   password="strong_password")
#     def api_authentication(self):
#         self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
#
#     def test_create_account(self):
#         """
#         Ensure we can create a new account object.
#         """
#         url = '/rest-auth/registration/'
#         data = {'username': 'test_user', 'email':'test_user@gmail.com',
#                 'first_name': 'fn', 'last_name': 'ln',
#                 "password1": "strong_password",  "password2": "strong_password",}
#         response = self.client.post(url, data)
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#
#     def test_search_by_email(self):
#         """
#         --- test search user by email ---
#         """
#         response = self.client.get(reverse("user-detail", kwargs={'email':"test_user1@test.com"}))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         response_user = json.loads(response.content)
#         self.assertEqual(response_user['username'], 'test_user1')
#         self.assertEqual(response_user['id'], 1)
#         self.assertEqual(response_user['score'], 0)

class TaskManagementTests(APITestCase):
    list_url = reverse('task-list')
    task1 = {
        "name": "task1",
        "score": "100",
        "deadline": "2021-11-11 11:11:11",
        "group": 'test_group'
    }
    task = {
        "name": "test_task",
        "score": 99,
        "deadline": "2021-12-12 12:12:12",
    }
    group = {
        "name": "test_group",
        "manager": "test_user1",
    }
    def setUp(self):
        self.user = User.objects.create_user(username="test_user1", email="test_user1@test.com",
                                             password="strong_password")
        self.user2 = User.objects.create_user(username="test_user2", email="test_user2@test.com",
                                             password="strong_password")
        self.user3 = User.objects.create_user(username="test_user3", email="test_user3@test.com",
                                             password="strong_password")
        self.group = Group.objects.create(name=self.group['name'],
                                          manager=self.user)
        self.group.members.add(self.user)
        self.group.members.add(self.user2)
        self.task = Task.objects.create(name=self.task['name'], score=self.task['score'],
                                        deadline=self.task['deadline'],
                                        created_by=self.user,
                                        assigned_by=self.user,
                                        assigned_to=self.user,
                                        group=self.group,
                                        creation_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
        self.token = Token.objects.create(user=self.user)
        self.api_authentication()
        # self.client.login(username="test_user1",
        #                   password="strong_password")

    def api_authentication(self):
        self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)

    # def test_create_task(self):
    #     response = self.client.post(self.list_url, self.task1, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    #     response_task = json.loads(response.content)
    #     self.assertEqual(response_task['group'], 'test_group')
    #
    # def test_create_task_unauthenticated(self):
    #     self.client.force_authenticate(user=None, token=None)
    #     response = self.client.post(self.list_url, self.task1, format='json')
    #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    #
    # def test_task_list_all(self):
    #     response = self.client.get(self.list_url)
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #
    # def test_task_list_by_user_email(self):
    #     response = self.client.get(self.list_url, {'assigned_to__email': 'test_user1@test.com'})
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     response_task = json.loads(response.content)
    #     # print('---------------------------debug message-----------------------------')
    #     # print(response_task)
    #     self.assertEqual(response_task[0]['name'], 'test_task')
    #
    # def test_user_tasks_assigned(self):
    #     response = self.client.get(reverse('user-detail', kwargs={'email': 'test_user1@test.com'}))
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     response_task = json.loads(response.content)
    #     # print('---------------------------debug message-----------------------------')
    #     # print(response_task)
    #     self.assertEqual(response_task['tasks_assigned'][0], 1)
    #
    # def test_task_retrieve_detail(self):
    #     response = self.client.get(reverse("task-detail", kwargs={'pk':1}))
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_task_update(self):
        response = self.client.put(reverse("task-detail", kwargs={'pk':1}),
            {'name': 'test_task_updated',
             'description': 'description of test_task_updated',
             'score': 88,
             'group': 'test_group',
             'deadline':'2021-12-12 13:13:13',
             'assigned_to': 'test_user2@test.com',
             'done_at': '2021-12-12 14:14:14'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_task = json.loads(response.content)
        self.assertEqual(response_task['name'], 'test_task_updated')
        self.assertEqual(response_task['description'], 'description of test_task_updated')
        self.assertEqual(response_task['score'], 88)
        self.assertEqual(response_task['deadline'], '2021-12-12 13:13:13')
        self.assertEqual(response_task['assigned_to'], 'test_user2@test.com')
        self.assertEqual(response_task['assigned_by'], 'test_user1@test.com')
        self.assertEqual(response_task['group'], 'test_group')
        self.assertEqual(response_task['done_at'], '2021-12-12 14:14:14')

    # def test_task_update_assignee_not_group_member(self):
    #     # self.client.force_authenticate(user=self.user3, token=Token.objects.create(user=self.user2))
    #     response = self.client.put(reverse("task-detail", kwargs={'pk':1}),
    #         {'name': 'test_task_should_not_be_updated',
    #          'description': 'description of test_task_updated',
    #          'score': 88,
    #          'deadline':'2021-12-12 13:13:13',
    #          'assigned_to': 'test_user3@test.com',
    #          'done_at': '2021-12-12 14:14:14'})
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     response_task = json.loads(response.content)
    #     self.assertEqual(response_task['name'], 'test_task')
    #     self.assertEqual(response_task['assigned_by'], 'test_user1@test.com')
    #     self.assertEqual(response_task['assigned_to'], 'test_user1@test.com')
    #
    # def test_task_update_assigner_not_group_member(self):
    #     # self.client.force_authenticate(user=self.user3, token=Token.objects.create(user=self.user2))
    #     response = self.client.put(reverse("task-detail", kwargs={'pk':1}),
    #         {'name': 'test_task_should_not_be_updated',
    #          'description': 'description of test_task_updated',
    #          'score': 88,
    #          'deadline':'2021-12-12 13:13:13',
    #          'assigned_to': 'test_user3@test.com',
    #          'done_at': '2021-12-12 14:14:14'})
    #     self.assertEqual(response.status_code, status.HTTP_200_OK)
    #     response_task = json.loads(response.content)
    #     self.assertEqual(response_task['name'], 'test_task')
    #     self.assertEqual(response_task['assigned_by'], 'test_user1@test.com')
    #     self.assertEqual(response_task['assigned_to'], 'test_user1@test.com')

# class GroupManagementTests(APITestCase):
#     list_url = reverse('group-list')
#     group2 = {
#         "name": "group2",
#         "manager": "test_user2@test.com",
#     }
#     group = {
#         "name": "test_group",
#         "manager": "test_user1@test.com",
#         "members": ["test_user1@test.com", "test_user3@test.com"]
#     }
#     task = {
#         "name": "test_task",
#         "score": 99,
#         "deadline": "2021-12-12 12:12:12",
#         "done_at": "2021-12-12 14:14:14",
#     }
#     def setUp(self):
#         self.user = User.objects.create_user(username="test_user1", email="test_user1@test.com",
#                                              password="strong_password")
#         self.user2 = User.objects.create_user(username="test_user2", email="test_user2@test.com",
#                                              password="strong_password")
#         self.user3 = User.objects.create_user(username="test_user3", email="test_user3@test.com",
#                                              password="strong_password")
#         self.group = Group.objects.create(name=self.group['name'],
#                                           manager=self.user)
#         self.group.members.add(self.user)
#         self.group.members.add(self.user3)
#
#         self.task = Task.objects.create(name=self.task['name'], score=self.task['score'],
#            deadline=self.task['deadline'],
#            created_by=self.user,
#            assigned_by=self.user,
#            assigned_to=self.user,
#            done_at=self.task['done_at'],
#            group=self.group,
#            creation_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))
#
#         self.token = Token.objects.create(user=self.user)
#         self.api_authentication()
#     def api_authentication(self):
#         self.client.credentials(HTTP_AUTHORIZATION='Token ' + self.token.key)
#
#     def test_create_group(self):
#         response = self.client.post(self.list_url, self.group2, format='json')
#         self.assertEqual(response.status_code, status.HTTP_201_CREATED)
#
#     def test_create_group_unauthenticated(self):
#         self.client.force_authenticate(user=None, token=None)
#         response = self.client.post(self.list_url, self.group2, format='json')
#         self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
#
#     def test_group_list_all(self):
#         response = self.client.get(self.list_url)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_group_retrieve_detail(self):
#         response = self.client.get(reverse("group-detail", kwargs={'pk':'test_group'}))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#
#     def test_user_my_groups(self):
#         response = self.client.get(reverse('user-detail', kwargs={'email': 'test_user1@test.com'}))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         response_task = json.loads(response.content)
#         self.assertEqual(response_task['mygroups'][0], 'test_group')
#
#     def test_group_update_add(self):
#         response = self.client.put(reverse("group-detail", kwargs={'pk':'test_group'}),
#             {'members':['test_user1@test.com', 'test_user2@test.com', 'test_user3@test.com']})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         response_group = json.loads(response.content)
#         self.assertEqual(response_group['members'], ['test_user1@test.com', 'test_user2@test.com', 'test_user3@test.com'])
#
#     def test_group_update_remove(self):
#         response = self.client.put(reverse("group-detail", kwargs={'pk':'test_group'}),
#             {'members':['test_user1@test.com']})
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         response_group = json.loads(response.content)
#         self.assertEqual(response_group['members'], ['test_user1@test.com'])
#
#
#
#     def test_member_leave_group(self):
#         self.client.force_authenticate(user=self.user3)
#         response = self.client.post(reverse("group-leave", kwargs={'pk':'test_group'}))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         response_group = json.loads(response.content)
#         self.assertEqual(response_group['message'], 'user test_user3@test.com has left group test_group')
#
#         response = self.client.get(reverse("group-detail", kwargs={'pk':'test_group'}))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         response_group = json.loads(response.content)
#         self.assertEqual(response_group['members'], ['test_user1@test.com'])
#         # print('---------------------------debug message-----------------------------')
#         # print(response_group)
#
#     def test_manager_leave_group(self):
#         response = self.client.post(reverse("group-leave", kwargs={'pk':'test_group'}))
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         response_group = json.loads(response.content)
#         self.assertEqual(response_group['message'], 'group test_group is removed by manager test_user1@test.com')
#
#         response = self.client.get(reverse("group-detail", kwargs={'pk':'test_group'}))
#         self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
#         # response_group = json.loads(response.content)
#         # print('---------------------------debug message-----------------------------')
#         # print(response_group)
#
#     def test_group_update_not_manager(self):
#         self.client.force_authenticate(user=self.user2, token=Token.objects.create(user=self.user2))
#         response = self.client.put(reverse("group-detail", kwargs={'pk':'test_group'}),
#             {'members':['test_user1@test.com', 'test_user2@test.com']})
#         self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
#
#     def test_group_ranking(self):
#         # print('---------------------------debug message log url-----------------------------')
#         # print(reverse("group-ranking", kwargs={'pk':'test_group'}))
#         response = self.client.get(reverse("group-ranking", kwargs={'pk':'test_group'}),
#             {'members':['test_user1@test.com', 'test_user2@test.com']})
#         response_group = json.loads(response.content)
#         self.assertEqual(response.status_code, status.HTTP_200_OK)
#         self.assertEqual(response_group['test_user1@test.com'], self.task.score)
