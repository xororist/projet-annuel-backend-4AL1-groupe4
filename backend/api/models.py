import os
import uuid
from django.db import models
from django.contrib.auth.models import User
from django.db.models import CharField


def get_unique_filename(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('programs', new_filename)


class Program(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="programs")
    file = models.FileField(upload_to=get_unique_filename, default=True, blank=True)
    isVisible = models.BooleanField(default=True)

    def __str__(self) -> CharField:
        return self.title
