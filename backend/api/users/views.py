from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

from django.conf import settings
from django.contrib.auth.models import User

from django.core.mail import EmailMessage
from django.template.loader import render_to_string

from .permissions import AuthorOrReadOnly
from .serializers import (
    UserSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
)
from .utils import generate_password


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AuthorOrReadOnly]

    def perform_create(self, serializer):
        user = serializer.save()
        user.set_password(serializer.validated_data["password"])
        user.save()

    @swagger_auto_schema(responses={200: UserSerializer(many=False)})
    @action(
        detail=False,
        methods=["get"],
        serializer_class=UserSerializer,
        permission_classes=[IsAuthenticated],
    )
    def me(self, request, *args, **kwargs):
        serailzer = UserSerializer(instance=request.user)
        return Response(serailzer.data, status=status.HTTP_200_OK)

    @action(
        detail=True,
        methods=["put"],
        url_path="set-password",
        serializer_class=ChangePasswordSerializer,
    )
    def set_password(self, request, pk=None):
        user = self.get_object()
        serializer = ChangePasswordSerializer(
            data=request.data, context={"request": request}
        )
        if serializer.is_valid():
            user.set_password(serializer.validated_data["password"])
            user.save()

            user_serialer = UserSerializer(instance=user)
            return Response(user_serialer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(
        detail=False,
        methods=["post"],
        url_path="forgot-password",
        serializer_class=ForgotPasswordSerializer,
    )
    def forgot_password(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            # send email
            user_email = serializer.validated_data["email"]
            user = User.objects.filter(email=user_email).first()
            new_password = generate_password()

            context = {
                "new_password": new_password,
                "user_full_name": user.get_full_name(),
            }

            html_text = render_to_string("forgot_password.html", context)
            msg = EmailMessage(
                "ChancyApi: Réinitialisation de votre mot de passe - Action requise",
                html_text,
                f"ChancyApi <{settings.EMAIL_HOST_USER}>",
                [user_email],
            )

            msg.content_subtype = "html"
            msg.send()

            user.set_password(new_password)
            user.save()
            return Response(
                {
                    "message": "A new password has been sent to you by email.",
                },
                status=status.HTTP_200_OK,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
