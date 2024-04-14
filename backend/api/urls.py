from django.urls import path
from . import views

urlpatterns = [
    path("programs/", views.ProgramListCreate.as_view(), name="program-list"),
    path("programs/delete/<int:pk>/", views.ProgramDelete.as_view(), name="delete-program")
]