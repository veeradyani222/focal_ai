from django.urls import path
from . import views

urlpatterns = [
    path('refine/', views.refine_requirements, name='refine_requirements'),
    path('history/', views.get_history, name='get_history'),
    path('idea/<int:idea_id>/', views.get_idea_details, name='get_idea_details'),
    
    # User Management URLs
    path('users/create/', views.create_user, name='create_user'),
    path('users/profile/<str:email>/', views.get_user_profile, name='get_user_profile'),
    path('users/deduct-credits/', views.deduct_credits, name='deduct_credits'),
    path('users/<str:user_id>/transactions/', views.get_user_transactions, name='get_user_transactions'),
]
