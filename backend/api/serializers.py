from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Program, ProgramAction, Notification, Group, Friendship


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


class ProgramActionSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(source='author', read_only=True)
    replies = serializers.SerializerMethodField()

    class Meta:
        model = ProgramAction
        fields = ["id", "program", "author_id", "action", "comment", "parent", "replies", "created_at"]
        extra_kwargs = {
            "author": {"read_only": True},
            "parent": {"read_only": True},
            "program": {"read_only": True}
        }

    def get_replies(self, obj):
        if obj.replies.exists():
            return ProgramActionSerializer(obj.replies.all(), many=True).data
        return None

    def validate(self, data):
        if not data.get('action') and not data.get('comment'):
            raise serializers.ValidationError("Either action or comment must be provided.")
        return data


class NotificationSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(source='author', read_only=True)
    program_id = serializers.PrimaryKeyRelatedField(source='program', read_only=True)
    recipient_id = serializers.PrimaryKeyRelatedField(source='recipient', read_only=True)

    class Meta:
        model = Notification
        fields = ["id", "recipient_id", "author_id", "action", "program_id", "created_at", "is_read"]


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


