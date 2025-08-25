from django.urls import path
from . import views
from . import user_views

urlpatterns = [
    # Test endpoints
    path('test/', views.test_connection, name='test_connection'),
    path('test-auth/', views.test_auth, name='test_auth'),
    
    # Main functionality
    path('refine/', views.refine_requirements, name='refine_requirements'),
    path('history/', views.get_history, name='get_history'),
    path('user-history/', views.get_user_history, name='get_user_history'),
    path('generate-title/', views.generate_title, name='generate_title'),
    path('user-insights/', views.get_user_insights, name='get_user_insights'),
    path('idea/<int:idea_id>/', views.get_idea_details, name='get_idea_details'),
    
    # User Management URLs (now require authentication)
    path('users/profile/', user_views.get_user_profile, name='get_user_profile'),
    path('users/deduct-credits/', user_views.deduct_credits, name='deduct_credits'),
    path('users/transactions/', user_views.get_user_transactions, name='get_user_transactions'),
]
