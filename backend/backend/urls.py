from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken import views as authviews
from api import views

router = routers.DefaultRouter()
# Show projects
router.register(r'list', views.ProjectsListViewSet, base_name="ProjectList")

urlpatterns = [
    path('', include(router.urls)),
    path('apiauth/', include('rest_framework.urls')),
    path('admin/', admin.site.urls),
    path('save', views.ProjectSave.as_view(), name="ProjectSave"),# Save route
    path('update', views.ProjectUpdate.as_view(), name="ProjectUpdate"),# Updare route
    path('project', views.ProjectsViewSet.as_view(), name="ViewProject"),# Get Project
    path('api-auth-token', authviews.obtain_auth_token, name='api-auth-token')
]
