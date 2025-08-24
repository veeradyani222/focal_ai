import json
import requests
from django.http import JsonResponse
from django.conf import settings
from functools import wraps
from .services.mongodb_service import MongoDBService


def verify_google_token(id_token):
    """
    Verify Google ID token with Google's servers
    """
    try:
        # Verify the token with Google
        response = requests.get(
            f'https://oauth2.googleapis.com/tokeninfo?id_token={id_token}'
        )
        
        if response.status_code == 200:
            token_info = response.json()
            
            # Check if token is valid and not expired
            if token_info.get('aud') == settings.GOOGLE_CLIENT_ID:
                return {
                    'success': True,
                    'user_info': {
                        'email': token_info.get('email'),
                        'name': token_info.get('name'),
                        'picture': token_info.get('picture'),
                        'sub': token_info.get('sub')  # Google user ID
                    }
                }
        
        return {'success': False, 'error': 'Invalid or expired token'}
        
    except Exception as e:
        return {'success': False, 'error': f'Token verification failed: {str(e)}'}


def require_auth(view_func):
    """
    Decorator to require authentication for API endpoints
    """
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        # Get the Authorization header
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            return JsonResponse({
                'success': False,
                'error': 'Authorization header required'
            }, status=401)
        
        # Extract the token
        id_token = auth_header.split(' ')[1]
        
        # Verify the token
        token_verification = verify_google_token(id_token)
        
        if not token_verification['success']:
            return JsonResponse({
                'success': False,
                'error': token_verification['error']
            }, status=401)
        
        # Get or create user
        user_info = token_verification['user_info']
        mongodb_service = MongoDBService()
        
        try:
            # Check if user exists
            user = mongodb_service.get_user_by_email(user_info['email'])
            
            if not user:
                # Create new user
                user_data = {
                    'email': user_info['email'],
                    'name': user_info['name'],
                    'picture': user_info['picture'],
                    'google_id': user_info['sub']
                }
                user_id = mongodb_service.create_user(user_data)
                user = mongodb_service.get_user_by_id(user_id)
            else:
                # Update last login
                mongodb_service.update_user_login(user['_id'])
            
            # Add user info to request
            request.user = user
            request.user_info = user_info
            
            mongodb_service.close()
            
            # Call the original view
            return view_func(request, *args, **kwargs)
            
        except Exception as e:
            mongodb_service.close()
            return JsonResponse({
                'success': False,
                'error': f'Authentication failed: {str(e)}'
            }, status=500)
    
    return wrapper


def get_user_from_request(request):
    """
    Helper function to get user from request
    """
    return getattr(request, 'user', None)


def get_user_info_from_request(request):
    """
    Helper function to get user info from request
    """
    return getattr(request, 'user_info', None)
