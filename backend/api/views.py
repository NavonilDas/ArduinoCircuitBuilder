from django.shortcuts import render
from api.serializers import ProjectSerializer, ProjectSaveSerializer
from api.models import Project
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response


class ProjectsListViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user_id=self.request.user.id)


class ProjectsViewSet(APIView):
    def get(self, request):
        pid = request.GET.get("id", -1)
        if pid == -1:
            return Response({'found': False})
        else:
            try:
                print(pid)
                obj = Project.objects.get(id=pid)
                return Response({
                    "title": obj.name,
                    "data": obj.saved
                })
            except:
                return Response({'found': False})


class ProjectSave(APIView):
    def post(self, request):
        _mutable = request.data._mutable
        request.data._mutable = True
        request.data['user_id'] = str(self.request.user.id)
        request.data._mutable = _mutable
        serializer = ProjectSaveSerializer(data=request.data)
        if serializer.is_valid():
            x = serializer.save()
            return Response({"done": True,"id":x.id})
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
