# f21_team_2
Repository for f21_team_2

# Poptask development backend setup:
1. clone the repository to local machine
2. create a python virtual environment:> `python3 -m venv my_env `
3. in the project root directory, install all the dependencies:> `pip install -r requirements.txt`
4. make sure the schema is up to date:> `python manage.py makemigrations poptask`
5. migrate the database:> `python manage.py migrate`
6. run the service:> `python manage.py runserver`
7. go to http://localhost:8000/accounts/signup/ and register a test account
8. go to http://localhost:8000/api-doc to see all the available REST APIs
9. to enable the OAuth, you must set up the Google Client App in http://localhost:8000/admin. Follow this guide: https://dev.to/gajesh/the-complete-django-allauth-guide-la3
10. to use Token authentication, check these api endpoints: https://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html; add a header "Authorization": "Token key_generated_from_login_or_register" to all requests

# Reference
1. allauth tutorial: https://dev.to/gajesh/the-complete-django-allauth-guide-la3
