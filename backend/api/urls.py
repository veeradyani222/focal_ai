from django.urls import path
from . import views

urlpatterns = [
    path('refine/', views.refine_requirements, name='refine_requirements'),
    path('history/', views.get_history, name='get_history'),
    path('idea/<int:idea_id>/', views.get_idea_details, name='get_idea_details'),
]
