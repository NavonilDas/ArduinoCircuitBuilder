from rest_framework import serializers
from rest_framework.authtoken.models import Token
from api.models import Project
class ProjectSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['name','id']

class ProjectSaveSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Project
        fields = ['name','saved','user_id']