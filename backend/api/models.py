from django.db import models
from django.contrib.auth.models import User
import os
import uuid

def get_unique_filename(instance, filename):
    ext = filename.split('.')[-1]
    new_filename = f"{uuid.uuid4()}.{ext}"
    return os.path.join('programs', new_filename)

class Program(models.Model):
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=1000)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="programs")
    file = models.FileField(upload_to=get_unique_filename, default='', blank=True)
    isVisible = models.BooleanField(default=True)
    input_type = models.CharField(max_length=50, default='.txt')  
    output_type = models.CharField(max_length=50, default='.txt') 
    def __str__(self) -> str:
        return self.title


class Group(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="created_groups")  # Changement ici
    members = models.ManyToManyField(User, related_name='group_memberships')

    def __str__(self):
        return self.name


class Friendship(models.Model):
    DEMANDE_ENVOYEE = 'sent'
    DEMANDE_ACCEPTEE = 'accepted'
    DEMANDE_REFUSEE = 'rejected'

    STATUS_CHOICES = [
        (DEMANDE_ENVOYEE, 'Demande envoyée'),
        (DEMANDE_ACCEPTEE, 'Demande acceptée'),
        (DEMANDE_REFUSEE, 'Demande refusée'),
    ]

    user = models.ForeignKey(User, related_name='friends', on_delete=models.CASCADE)
    friend = models.ForeignKey(User, related_name='_friends', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default=DEMANDE_ENVOYEE)

    class Meta:
        unique_together = ('user', 'friend')

    def __str__(self):
        return f"{self.user.username} is friends with {self.friend.username} ({self.get_status_display()})"


class Action(models.Model):
    ACTION_CHOICES = [
        ('like', 'Like'),
        ('dislike', 'Dislike'),
        ('share', 'Share'),
        ('unshare', 'Unshare'),
        ('love', 'Love'),
        ('unlove', 'Unlove')
    ]

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="actions")
    program = models.ForeignKey('Program', on_delete=models.CASCADE, related_name="actions", null=True, blank=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name="actions", null=True, blank=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        target = self.program.title if self.program else f"comment {self.comment.id}"
        return f"{self.author.username} {self.action} {target}"


class Comment(models.Model):
    program = models.ForeignKey('Program', on_delete=models.CASCADE, related_name="comments", null=True, blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replies', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Comment by {self.author.username} on {self.program.title if self.program else 'another comment'}"


class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_notifications")
    action_type = models.CharField(max_length=50)
    program = models.ForeignKey('Program', on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    comment = models.ForeignKey('Comment', on_delete=models.CASCADE, related_name="notifications", null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return f"Notification for {self.recipient.username} from {self.sender.username}"