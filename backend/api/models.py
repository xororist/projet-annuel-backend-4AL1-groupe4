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

    def __str__(self) -> str:
        return self.title


class ProgramAction(models.Model):
    ACTION_CHOICES = [
        ('like', 'Like'),
        ('dislike', 'Dislike'),
        ('heart', 'Heart'),
        ('comment', 'Comment')
    ]

    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name="actions")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="actions")
    action = models.CharField(max_length=10, choices=ACTION_CHOICES, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        if self.action:
            return f"{self.user.username} {self.action} {self.program.title}"
        return f"{self.user.username} commented on {self.program.title}"


class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    action = models.CharField(max_length=50)
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.recipient.username} by {self.author.username} on {self.program.title}"


class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_groups")  # Changement ici
    members = models.ManyToManyField(User, related_name='group_memberships')

    def __str__(self):
        return self.name


class Friendship(models.Model):
    user = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name='_friends', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'friend')

    def __str__(self):
        return f"{self.user.username} is friends with {self.friend.username}"
