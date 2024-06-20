from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class ProgramAccessTests(APITestCase):
    def test_public_access(self):
        response = self.client.get(reverse('program-list-public-all'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_private_access_without_auth(self):
        response = self.client.get(reverse('program-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
