from django.db import models

# Project Table(name,user_id,saved)
class Project(models.Model):
    name = models.TextField('Project Name',max_length=100)
    user_id = models.IntegerField('User id')
    saved = models.TextField('Project Output')
