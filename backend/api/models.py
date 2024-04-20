import os
import uuid
from django.db import models
from django.contrib.auth.models import User

def get_unique_filename(instance, filename):
    ext = filename.split('.')[-1]  # Extract the extension from the filename
    new_filename = f"{uuid.uuid4()}.{ext}"  # Generate a UUID and append the file extension
    return os.path.join('programs', new_filename)  # Define the path within the 'programs' folder

class Program(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="programs")
    file = models.FileField(upload_to=get_unique_filename, default=True, blank=True)  # Use the custom function

    def __str__(self) -> str:
        return self.title
