"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path , include
from rest_framework import routers
from rest_framework.authtoken import views as authviews
from api import views

router = routers.DefaultRouter()
router.register(r'list', views.ProjectsListViewSet,base_name="ProjectList")

urlpatterns = [
    path('',include(router.urls)),
    path('apiauth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
    path('save', views.ProjectSave.as_view(),name="ProjectSave"),
    path('api-auth-token',authviews.obtain_auth_token,name='api-auth-token')
]
