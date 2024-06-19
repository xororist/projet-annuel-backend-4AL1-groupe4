from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.decorators import action

from .serializers import UserSerializer, ProgramSerializer, ProgramActionSerializer, NotificationSerializer, \
    GroupSerializer, FriendshipSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Program, ProgramAction, Notification, Group, Friendship
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from django.http import FileResponse
import os
import subprocess


class ProgramList(generics.ListAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Program.objects.all()


class ProgramListCreate(generics.ListCreateAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        user = self.request.user
        return Program.objects.filter(author=user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class ProgramUpdate(generics.UpdateAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Program.objects.filter(author=user)

    def perform_update(self, serializer):
        serializer.save()

    def get_object(self):
        pk = self.kwargs.get("pk")
        if pk is None:
            return None
        return self.get_queryset().filter(pk=pk).first()


class ProgramDelete(generics.DestroyAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Program.objects.filter(author=user)


class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserRetrieveView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        pk = self.kwargs.get("pk")
        if pk is None:
            return None
        return self.get_queryset().filter(pk=pk).first()


class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return User.objects.filter(pk=user.pk)

    def perform_update(self, serializer):
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)

    def get_object(self):
        return self.get_queryset().first()


class ExecuteCodeView(APIView):
    permission_classes = [IsAuthenticated]

    # We get script name to be executed and file that will be modified from the request body form-data
    def post(self, request, *args, **kwargs):
        program = request.data.get('program')
        file = request.FILES.get('file')

        # Checking if bot param are filled, if not we throw a 404 error.
        if not program or not file:
            return Response({"error": "Program file name and uploaded file are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        uploaded_file_path = os.path.join(settings.MEDIA_ROOT, 'programs', file.name)

        with open(uploaded_file_path, 'wb+') as destination:
            for content in file.chunks():
                destination.write(content)

        script_path = os.path.join(settings.MEDIA_ROOT, 'programs', program)

        if not os.path.exists(script_path):
            print(script_path)
            return Response({"error": "Python script file not found"}, status=status.HTTP_404_NOT_FOUND)

        # Executing the script in a subprocess
        try:
            process = subprocess.Popen(
                ['python', script_path, uploaded_file_path],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True
            )
            stdout, stderr = process.communicate()

            if process.returncode != 0:
                return Response({"error": stderr}, status=status.HTTP_400_BAD_REQUEST)

            file_path = stdout.strip().split(": ")[-1]
            file_name = os.path.basename("output")

            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename=file_name)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProgramActionUpdateView(generics.UpdateAPIView):
    queryset = ProgramAction.objects.all()
    serializer_class = ProgramActionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ProgramAction.objects.filter(author=user)

    def perform_update(self, serializer):
        serializer.save()


class ProgramActionDeleteView(generics.DestroyAPIView):
    queryset = ProgramAction.objects.all()
    serializer_class = ProgramActionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return ProgramAction.objects.filter(author=user)


class ProgramActionListCreate(generics.ListCreateAPIView):
    serializer_class = ProgramActionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return ProgramAction.objects.none()  # Retourne un queryset vide pour Swagger
        program_id = self.kwargs.get('program_id')
        if program_id:
            return ProgramAction.objects.filter(program__id=program_id, parent=None)
        return ProgramAction.objects.none()

    def perform_create(self, serializer):
        parent_id = self.request.data.get('parent')
        parent_action = None
        if parent_id:
            parent_action = ProgramAction.objects.get(id=parent_id)
        action = serializer.save(author=self.request.user, parent=parent_action, program_id=self.kwargs['program_id'])

        # Create a notification for the program owner
        program = Program.objects.get(id=self.kwargs['program_id'])
        Notification.objects.create(
            recipient=program.author,
            author=self.request.user,
            action=action.action if action.action else "comment",
            program=program
        )


class ProgramActionRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = ProgramAction.objects.all()
    serializer_class = ProgramActionSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return ProgramAction.objects.none()  # Retourne un queryset vide pour Swagger
        return ProgramAction.objects.filter(program__id=self.kwargs['program_id'])


class NotificationListCreate(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if getattr(self, 'swagger_fake_view', False):
            return Notification.objects.none()  # Retourne un queryset vide pour Swagger
        return Notification.objects.filter(recipient=self.request.user).order_by('-created_at')


class NotificationUpdate(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, request, *args, **kwargs):
        notification_id = kwargs.get('pk')
        notification = Notification.objects.get(id=notification_id, recipient=request.user)
        notification.is_read = True
        notification.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class GroupListCreate(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class GroupRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]


class FriendshipListCreate(generics.ListCreateAPIView):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        friend_id = self.request.data.get('friend')
        friend = User.objects.get(id=friend_id)
        Friendship.objects.create(user=user, friend=friend)


class FriendshipDelete(generics.DestroyAPIView):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        user = self.request.user
        friend_id = self.kwargs['friend_id']
        return Friendship.objects.get(user=user, friend_id=friend_id)


class AddFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        friend_id = request.data.get('friend_id')
        if not friend_id:
            return Response({"error": "Friend ID is required"}, status=400)
        try:
            friend = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if Friendship.objects.filter(user=user, friend=friend).exists():
            return Response({"error": "Already friends"}, status=400)
        Friendship.objects.create(user=user, friend=friend)
        Friendship.objects.create(user=friend, friend=user)  # Create the reverse friendship
        return Response({"success": "Friend added"}, status=201)


class ListFriendsView(generics.ListAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(user=self.request.user)


