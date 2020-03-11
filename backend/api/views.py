from django.shortcuts import render
from api.serializers import ProjectSerializer, ProjectSaveSerializer
from api.models import Project
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.response import Response



# Show the list of Project Created by a user
class ProjectsListViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user_id=self.request.user.id)



# Get the data of the project using the project id(pid)
class ProjectsViewSet(APIView):
    def get(self, request):
        pid = request.GET.get("id", -1)
        if pid == -1:
            # if no query parameter is set then send no data found
            return Response({'found': False})
        else:
            try:
                # Get Data from the database
                obj = Project.objects.get(id=pid)
                return Response({
                    "title": obj.name,
                    "data": obj.saved
                })
            except:
                return Response({'found': False})



# Save Project
class ProjectSave(APIView):
    # For Post request
    def post(self, request):
        # Change the request data to mutable
        _mutable = request.data._mutable
        request.data._mutable = True
        # set the user_id in request data
        request.data['user_id'] = str(self.request.user.id)
        # Change request data back to immutable
        request.data._mutable = _mutable
        # Get the serializer
        serializer = ProjectSaveSerializer(data=request.data)
        # if can be serialize save it into database and respond with the project id
        if serializer.is_valid():
            x = serializer.save()
            return Response({"done": True,"id":x.id})
        return Response({"done": False})



# Update Project
class ProjectUpdate(APIView):
    # Post Request
    def post(self, request):
        # Get the old project object
        obj = Project.objects.get(id=request.data['id'])

        _mutable = request.data._mutable
        request.data._mutable = True
        # Add user id
        request.data['user_id'] = str(self.request.user.id)
        del request.data['id']
        request.data._mutable = _mutable
        # Update project and respond if done
        serializer = ProjectSaveSerializer(obj, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"done": True})
        return Response({"done": False})
