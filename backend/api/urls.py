from django.urls import path, include
from api.users.routers import router
from . import views

urlpatterns = [
    path("", include(router.urls)),
    # path("user/informations/<int:pk>/", views.UserRetrieveView.as_view(), name="user-detail"),
    # path("user/update/<int:pk>/", views.UserUpdateView.as_view(), name="user-update"),
    path("programs/", views.ProgramListCreate.as_view(), name="program-list"),
    path("programs/<int:pk>/", views.ProgramUpdate.as_view(), name="update-program"),
    path("programs/delete/<int:pk>/", views.ProgramDelete.as_view(), name="delete-program")
]