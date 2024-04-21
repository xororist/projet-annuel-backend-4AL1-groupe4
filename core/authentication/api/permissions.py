from rest_framework import permissions


class AuthorOrReadOnly(permissions.BasePermission):
    """
    All users have permission to view data
    Only the author has permission to modify or delete an object
    """

    def has_object_permission(
        self,
        request,
        view,
        obj,
    ):
        return obj == request.user or request.method in permissions.SAFE_METHODS
