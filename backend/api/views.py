from django.shortcuts import render
from api.serializers import ProjectSerializer, ProjectSaveSerializer
from api.models import Project
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response


class ProjectsListViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        print("This one")
        return Project.objects.filter(user_id=self.request.user.id)


class ProjectSave(APIView):
    def post(self, request):
        _mutable = request.data._mutable
        request.data._mutable = True
        request.data['user_id'] = str(self.request.user.id)
        request.data._mutable = _mutable
        serializer = ProjectSaveSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"done": True})
        return Response({"done": False})


class ProjectUpdate(APIView):
    def post(self, request):
        obj = Project.objects.get(id=request.data['id'])

        _mutable = request.data._mutable
        request.data._mutable = True
        request.data['user_id'] = str(self.request.user.id)
        del request.data['id']
        request.data._mutable = _mutable
        serializer = ProjectSaveSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"done": True})
        return Response({"done": False})
