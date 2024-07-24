import json
from django.conf import settings
from rest_framework import generics, viewsets, status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from django.contrib.auth.models import User
import os
import subprocess
import boto3
from .serializers import (
    UserSerializer, ProgramSerializer, GroupSerializer,
    FriendshipSerializer, ActionSerializer, CommentSerializer, NotificationSerializer, MessageSerializer
)
from .models import Program, Group, Friendship, Action, Comment, Notification, Message


# View to list all programs, accessible by anyone
class ProgramList(generics.ListAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return Program.objects.all()


# View to list and create programs, accessible only by authenticated users
class ProgramListCreate(generics.ListCreateAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Program.objects.filter(author=self.request.user)

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# View to update programs, accessible only by the author of the programs
class ProgramUpdate(generics.UpdateAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Program.objects.filter(author=self.request.user)

    def perform_update(self, serializer):
        serializer.save()

    def get_object(self):
        return self.get_queryset().filter(pk=self.kwargs.get("pk")).first()


# View to delete programs, accessible only by the author of the programs
class ProgramDelete(generics.DestroyAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Program.objects.filter(author=self.request.user)


# View to create a new user, accessible by anyone
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


# View to retrieve a specific user, accessible only by authenticated users
class UserRetrieveView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.get_queryset().filter(pk=self.kwargs.get("pk")).first()


# View to update user details, accessible only by the authenticated user
class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.pk)

    def perform_update(self, serializer):
        serializer.save()

    def get_object(self):
        return self.get_queryset().first()


# View to delete a user, accessible only by the authenticated user
class UserDeleteView(generics.DestroyAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.filter(pk=self.request.user.pk)

    def get_object(self):
        return self.get_queryset().first()

    def perform_destroy(self, instance):
        instance.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


# View to execute code and upload the output to S3, accessible only by authenticated users
class ExecuteCodeView(APIView):
    permission_classes = [IsAuthenticated]

    def upload_file_to_s3(self, file_path, bucket_name, object_name=None):
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        object_name = object_name or os.path.basename(file_path)

        try:
            s3_client.upload_file(file_path, bucket_name, object_name)
            return f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        except Exception as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")

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
        program_extension = os.path.splitext(program)[1].lower()

        if not os.path.exists(script_path):
            return Response({"error": "Program script file not found"}, status=status.HTTP_404_NOT_FOUND)

        try:
            if program_extension == '.py':
                process = subprocess.Popen(
                    ['python', script_path, uploaded_file_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
            elif program_extension == '.go':
                process = subprocess.Popen(
                    ['go', 'run', script_path, uploaded_file_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
            elif program_extension == '.cpp':
                executable_path = os.path.join(settings.MEDIA_ROOT, 'programs', 'a.out')
                compile_process = subprocess.Popen(
                    ['g++', script_path, '-o', executable_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                compile_stdout, compile_stderr = compile_process.communicate()

                if compile_process.returncode != 0:
                    return Response({"error": compile_stderr}, status=status.HTTP_400_BAD_REQUEST)

                process = subprocess.Popen(
                    [executable_path, uploaded_file_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
            else:
                return Response({"error": "Unsupported file extension"}, status=status.HTTP_400_BAD_REQUEST)

            stdout, stderr = process.communicate()

            if process.returncode != 0:
                return Response({"error": stderr}, status=status.HTTP_400_BAD_REQUEST)

            file_path = stdout.strip().split(": ")[-1]
            s3_bucket_name = 'scripts-output-pa-esgi'
            s3_file_url = self.upload_file_to_s3(file_path, s3_bucket_name)

            return Response({"file_url": s3_file_url}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# View to list all users, accessible only by authenticated users
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]


# View to list and create groups, accessible only by authenticated users
class GroupListCreate(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


# View to retrieve, update, and delete groups, accessible only by authenticated users
class GroupRetrieveUpdateDelete(generics.RetrieveUpdateDestroyAPIView):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save()


# View to list and create friendships, accessible only by authenticated users
class FriendshipListCreate(generics.ListCreateAPIView):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        user = self.request.user
        friend_id = self.request.data.get('friend')
        friend = User.objects.get(id=friend_id)
        serializer.save(user=user, friend=friend, status=Friendship.DEMANDE_ENVOYEE)


# View to delete friendships, accessible only by authenticated users
class FriendshipDelete(generics.DestroyAPIView):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return Friendship.objects.get(user=self.request.user, friend_id=self.kwargs['friend_id'])


class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Message.objects.filter(receiver=user) | Message.objects.filter(sender=user) | Message.objects.filter(
            group_id__isnull=False)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


class FriendshipUpdate(generics.UpdateAPIView):
    queryset = Friendship.objects.all()
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        friendship_id = self.kwargs['friendship_id']
        return Friendship.objects.get(id=friendship_id)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        status = request.data.get('status')
        if status in [Friendship.DEMANDE_ENVOYEE, Friendship.DEMANDE_ACCEPTEE, Friendship.DEMANDE_REFUSEE]:
            instance.status = status
            instance.save()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        else:
            return Response({"error": "Invalid status"}, status=400)


# View to add a friend, accessible only by authenticated users
class AddFriendView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        friend_id = request.data.get('friend_id')
        if not friend_id:
            return Response({"error": "Friend ID is required"}, status=400)

        try:
            friend = User.objects.get(id=friend_id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        if Friendship.objects.filter(user=user, friend=friend).exists():
            return Response({"error": "Friendship request already sent"}, status=400)
        Friendship.objects.create(user=user, friend=friend, status=Friendship.DEMANDE_ENVOYEE)
        return Response({"success": "Friend request sent"}, status=201)


class ManageFriendRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, friend_id, action):
        user = request.user
        try:
            friendship = Friendship.objects.get(user=friend_id, friend=user)
        except Friendship.DoesNotExist:
            return Response({"error": "Friend request not found"}, status=404)

        if action == 'accept':
            friendship.status = Friendship.DEMANDE_ACCEPTEE
            friendship.save()
            # Create the reverse friendship
            Friendship.objects.create(user=user, friend=friendship.user, status=Friendship.DEMANDE_ACCEPTEE)
            return Response({"success": "Friend request accepted"}, status=200)
        elif action == 'reject':
            friendship.status = Friendship.DEMANDE_REFUSEE
            friendship.save()
            return Response({"success": "Friend request rejected"}, status=200)
        else:
            return Response({"error": "Invalid action"}, status=400)


class ListFriendsView(generics.ListAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Friendship.objects.filter(user=self.request.user)


# ViewSet to handle actions, accessible only by authenticated users
class ActionViewSet(viewsets.ModelViewSet):
    queryset = Action.objects.all()
    serializer_class = ActionSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        action_instance = serializer.save(author=self.request.user)
        recipient = action_instance.program.author if action_instance.program else action_instance.comment.author

        if recipient:
            Notification.objects.create(
                recipient=recipient,
                sender=self.request.user,
                action_type=action_instance.action,
                program=action_instance.program,
                comment=action_instance.comment
            )


# ViewSet to handle comments, accessible only by authenticated users
class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        program_id = self.request.data.get('program')
        program = Program.objects.get(id=program_id)

        parent_id = self.request.data.get('parent')
        parent = Comment.objects.get(id=parent_id) if parent_id else None

        comment_instance = serializer.save(author=self.request.user, program=program, parent=parent)

        recipient = comment_instance.parent.author if comment_instance.parent else comment_instance.program.author

        Notification.objects.create(
            recipient=recipient,
            sender=self.request.user,
            action_type='comment',
            program=comment_instance.program,
            comment=comment_instance
        )


# ViewSet to handle notifications, accessible only by authenticated users
class NotificationViewSet(viewsets.ModelViewSet):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return self.queryset.filter(recipient=self.request.user)

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)


# View to handle pipelines, accessible only by authenticated users
class PipelineView(APIView):
    permission_classes = [IsAuthenticated]

    def upload_file_to_s3(self, file_path, bucket_name, object_name=None):
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        object_name = object_name or os.path.basename(file_path)

        try:
            s3_client.upload_file(file_path, bucket_name, object_name)
            return f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        except Exception as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")

    def post(self, request, *args, **kwargs):
        programs = request.data.get('programs')
        input_file = request.FILES.get('input_file')

        if not programs or not input_file:
            return JsonResponse({"error": "Program list and input file are required."},
                                status=status.HTTP_400_BAD_REQUEST)

        if isinstance(programs, str):
            programs = json.loads(programs)

        input_file_path = os.path.join(settings.MEDIA_ROOT, 'programs', input_file.name)

        with open(input_file_path, 'wb+') as destination:
            for content in input_file.chunks():
                destination.write(content)

        current_input_path = input_file_path
        intermediary_files = []

        try:
            for program in programs:
                script_path = os.path.join(settings.MEDIA_ROOT, 'programs', program)
                program_extension = os.path.splitext(program)[1].lower()

                if not os.path.exists(script_path):
                    return JsonResponse({"error": f"Program script file '{program}' not found"},
                                        status=status.HTTP_404_NOT_FOUND)

                if program_extension == '.py':
                    process = subprocess.Popen(
                        ['python', script_path, current_input_path],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True
                    )
                elif program_extension == '.go':
                    process = subprocess.Popen(
                        ['go', 'run', script_path, current_input_path],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True
                    )
                elif program_extension == '.cpp':
                    executable_path = os.path.join(settings.MEDIA_ROOT, 'programs', 'a.out')
                    compile_process = subprocess.Popen(
                        ['g++', script_path, '-o', executable_path],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True
                    )
                    compile_stdout, compile_stderr = compile_process.communicate()

                    if compile_process.returncode != 0:
                        return JsonResponse({"error": compile_stderr}, status=status.HTTP_400_BAD_REQUEST)

                    process = subprocess.Popen(
                        [executable_path, current_input_path],
                        stdout=subprocess.PIPE,
                        stderr=subprocess.PIPE,
                        text=True
                    )
                else:
                    return JsonResponse({"error": f"Unsupported file extension '{program_extension}'"},
                                        status=status.HTTP_400_BAD_REQUEST)

                stdout, stderr = process.communicate()

                if process.returncode != 0:
                    return JsonResponse({"error": stderr}, status=status.HTTP_400_BAD_REQUEST)

                current_input_path = stdout.strip().split(": ")[-1]
                intermediary_files.append(current_input_path)

            s3_bucket_name = 'scripts-output-pa-esgi'
            s3_file_urls = {f"step_{i+1}": self.upload_file_to_s3(file_path, s3_bucket_name) for i, file_path in enumerate(intermediary_files)}

            return JsonResponse({"files_url": s3_file_urls}, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class UploadAndExecuteView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def upload_file_to_s3(self, file_path, bucket_name, object_name=None):
        s3_client = boto3.client(
            's3',
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME
        )

        object_name = object_name or os.path.basename(file_path)

        try:
            s3_client.upload_file(file_path, bucket_name, object_name)
            return f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
        except Exception as e:
            raise Exception(f"Failed to upload file to S3: {str(e)}")

    def post(self, request, *args, **kwargs):
        script_file = request.FILES.get('script_file')
        input_file = request.FILES.get('input_file')

        if not script_file or not input_file:
            return Response({"error": "Both script file and input file are required."},
                            status=status.HTTP_400_BAD_REQUEST)

        script_path = os.path.join(settings.MEDIA_ROOT, 'scripts', script_file.name)
        input_path = os.path.join(settings.MEDIA_ROOT, 'inputs', input_file.name)

        os.makedirs(os.path.dirname(script_path), exist_ok=True)
        os.makedirs(os.path.dirname(input_path), exist_ok=True)

        with open(script_path, 'wb+') as script_dest:
            for chunk in script_file.chunks():
                script_dest.write(chunk)

        with open(input_path, 'wb+') as input_dest:
            for chunk in input_file.chunks():
                input_dest.write(chunk)

        script_extension = os.path.splitext(script_file.name)[1].lower()

        try:
            if script_extension == '.py':
                process = subprocess.Popen(
                    ['python', script_path, input_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
            elif script_extension == '.go':
                process = subprocess.Popen(
                    ['go', 'run', script_path, input_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
            elif script_extension == '.cpp':
                executable_path = os.path.join(settings.MEDIA_ROOT, 'scripts', 'a.out')
                compile_process = subprocess.Popen(
                    ['g++', script_path, '-o', executable_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
                compile_stdout, compile_stderr = compile_process.communicate()

                if compile_process.returncode != 0:
                    return Response({"error": compile_stderr}, status=status.HTTP_400_BAD_REQUEST)

                process = subprocess.Popen(
                    [executable_path, input_path],
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )
            else:
                return Response({"error": "Unsupported script file extension"}, status=status.HTTP_400_BAD_REQUEST)

            stdout, stderr = process.communicate()

            if process.returncode != 0:
                return Response({"error": stderr}, status=status.HTTP_400_BAD_REQUEST)

            output_file_path = stdout.strip().split(": ")[-1]
            s3_bucket_name = 'scripts-output-pa-esgi'
            s3_file_url = self.upload_file_to_s3(output_file_path, s3_bucket_name)

            return Response({"file_url": s3_file_url}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)