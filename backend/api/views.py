from django.contrib.auth.models import User
from rest_framework import generics, viewsets

from .serializers import UserSerializer, ProgramSerializer, \
    GroupSerializer, FriendshipSerializer, ActionSerializer, CommentSerializer, NotificationSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Program, Group, Friendship, Action, Comment, Notification
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

    def post(self, request, *args, **kwargs):
        program = request.data.get('program')
        file = request.FILES.get('file')

        if not program or not file:
            return Response({"error": "Program file name and uploaded file are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        uploaded_file_path = os.path.join(settings.MEDIA_ROOT, 'programs', file.name)
        with open(uploaded_file_path, 'wb+') as destination:
            for content in file.chunks():
                destination.write(content)

        script_path = os.path.join(settings.MEDIA_ROOT, 'programs', program)

        if not os.path.exists(script_path):
            return Response({"error": "Script file not found"}, status=status.HTTP_404_NOT_FOUND)

        # Determine the command to run based on the script type
        file_extension = os.path.splitext(program)[1]
        output_dir = "/tmp"
        env = os.environ.copy()
        env["OUTPUT_DIR"] = output_dir

        if file_extension == '.py':
            command = ['python', script_path, uploaded_file_path]
        elif file_extension == '.go':
            # Build and run the Go program
            build_command = ['go', 'build', '-o', '/tmp/go_program', script_path]
            try:
                subprocess.run(build_command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
            except subprocess.CalledProcessError as e:
                return Response({"error": e.stderr}, status=status.HTTP_400_BAD_REQUEST)
            command = ['/tmp/go_program', uploaded_file_path]
        else:
            return Response({"error": "Unsupported script type"}, status=status.HTTP_400_BAD_REQUEST)

        # Execute the script in a subprocess
        try:
            process = subprocess.Popen(
                command,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                env=env
            )
            stdout, stderr = process.communicate()

            if process.returncode != 0:
                return Response({"error": stderr}, status=status.HTTP_400_BAD_REQUEST)

            file_path = os.path.join(output_dir, "output.txt")

            return FileResponse(open(file_path, 'rb'), as_attachment=True, filename="output.txt")

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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


class ActionViewSet(viewsets.ModelViewSet):
    queryset = Action.objects.all()
    serializer_class = ActionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        action_instance = serializer.save(author=self.request.user)
        if action_instance.program:
            recipient = action_instance.program.author
        elif action_instance.comment:
            recipient = action_instance.comment.author
        else:
            return

        Notification.objects.create(
            recipient=recipient,
            sender=self.request.user,
            action_type=action_instance.action,
            program=action_instance.program,
            comment=action_instance.comment
        )


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        program_id = self.request.data.get('program')
        program = Program.objects.get(id=program_id)
        comment_instance = serializer.save(author=self.request.user, program=program)
        recipient = comment_instance.parent.author if comment_instance.parent else comment_instance.program.author

        Notification.objects.create(
            recipient=recipient,
            sender=self.request.user,
            action_type='comment',
            program=comment_instance.program,
            comment=comment_instance
        )


class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(recipient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)
