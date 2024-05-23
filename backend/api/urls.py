from django.urls import path
from . import views

urlpatterns = [
    path("user/informations/<int:pk>/", views.UserRetrieveView.as_view(), name="user-detail"),
    path("user/update/<int:pk>/", views.UserUpdateView.as_view(), name="user-update"),
    path("programs/", views.ProgramListCreate.as_view(), name="program-list"),
    path("programs/public/all/", views.ProgramList.as_view(), name="program-list-public-all"),
    path("programs/<int:pk>/", views.ProgramUpdate.as_view(), name="update-program"),
    path("programs/delete/<int:pk>/", views.ProgramDelete.as_view(), name="delete-program")
]