from django.urls import path
from . import views
from .views import ExecuteCodeView, GroupListCreate, GroupRetrieveUpdateDelete, FriendshipListCreate, FriendshipDelete, \
    AddFriendView, ListFriendsView, PipelineView, UploadAndExecuteView, UserDeleteView, UserListView, NotificationViewSet
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import  ActionViewSet, CommentViewSet

router = DefaultRouter()
router.register(r'actions', ActionViewSet, basename='action')
router.register(r'comments', CommentViewSet, basename='comment')
router.register(r'notifications', NotificationViewSet, basename='notification')

urlpatterns = [
    path('', include(router.urls)),
    path("user/informations/<int:pk>/", views.UserRetrieveView.as_view(), name="user-detail"),
    path("user/update/<int:pk>/", views.UserUpdateView.as_view(), name="user-update"),
    path('user/all/', UserListView.as_view(), name='user-list'),
    path('users/delete/', UserDeleteView.as_view(), name='user-delete'),
    path("programs/", views.ProgramListCreate.as_view(), name="program-list"),
    path("programs/public/all/", views.ProgramList.as_view(), name="program-list-public-all"),
    path("programs/<int:pk>/", views.ProgramUpdate.as_view(), name="update-program"),
    path("programs/delete/<int:pk>/", views.ProgramDelete.as_view(), name="delete-program"),
    path("execute/", ExecuteCodeView.as_view(), name="execute-code"),
    path('groups/', GroupListCreate.as_view(), name='group-list-create'),
    path('groups/<int:pk>/', GroupRetrieveUpdateDelete.as_view(), name='group-retrieve-update-delete'),
    path('friendships/', FriendshipListCreate.as_view(), name='friendship-list-create'),
    path('friendships/<int:friend_id>/', FriendshipDelete.as_view(), name='friendship-delete'),
    path('friends/add/', AddFriendView.as_view(), name='add-friend'),
    path('friends/', ListFriendsView.as_view(), name='list-friends'),
    path('pipeline/', PipelineView.as_view(), name="pipeline-view"),  # Added PipelineView URL
    path('run/', UploadAndExecuteView.as_view(), name="upload-and-excute-view"),  # Added PipelineView URL

]