from django.db import models
from django.contrib.auth.models import User

class Program(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="program")

    def __str__(self) -> str:
        return self.title
    