from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, ProgramSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Program
from rest_framework.parsers import MultiPartParser, FormParser


class ProgramList(generics.ListAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user = self.request.user
        return Program.objects.all()


class ProgramListCreate(generics.ListCreateAPIView):
    serializer_class = ProgramSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)  # Add these parsers to handle file uploads

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