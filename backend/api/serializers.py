from rest_framework import serializers
from rest_framework.authtoken.models import Token
from api.models import Project

# Serializer for list of project
class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'id']

# Serializer Used for Save and Update project
class ProjectSaveSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['name', 'saved', 'user_id']