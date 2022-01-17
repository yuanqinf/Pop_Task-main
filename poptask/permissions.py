from rest_framework import permissions


class IsManagerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow manager of a group to edit it.
    """

    def has_object_permission(self, request, view, group):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return group.manager == request.user
