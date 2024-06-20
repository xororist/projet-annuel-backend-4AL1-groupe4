from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Program, Group, Friendship, Action, Comment, Notification


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "email", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.save()
        return instance


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ["id", "title", "description", "created_at", "author", "file", "isVisible"]
        extra_kwargs = {
            "author": {"read_only": True},
            "file": {"required": False}
        }


class GroupSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(source='author', read_only=True)
    members = UserSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ["id", "name", "description", "created_at", "author_id", "members"]


class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ["id", "user", "friend", "created_at"]


class ActionSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(source='author', read_only=True)

    class Meta:
        model = Action
        fields = ["id", "author_id", "program", "comment", "action", "created_at"]
        extra_kwargs = {
            "author": {"read_only": True},
            "program": {"read_only": True},
            "comment": {"read_only": True}
        }


class CommentSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(source='author', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ["id", "program", "author_id", "text", "parent", "replies", "created_at", "updated_at"]
        extra_kwargs = {
            "author": {"read_only": True},
            "parent": {"read_only": True},
            "program": {"read_only": True}
        }

    def get_replies(self, obj):
        if obj.replies.exists():
            return CommentSerializer(obj.replies.all(), many=True).data
        return None



class NotificationSerializer(serializers.ModelSerializer):
    sender_id = serializers.PrimaryKeyRelatedField(source='sender', read_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(source='recipient', read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "recipient_id", "sender_id", "action_type", "program", "comment", "created_at", "read"]
        extra_kwargs = {
            "sender": {"read_only": True},
            "recipient": {"read_only": True}
        }