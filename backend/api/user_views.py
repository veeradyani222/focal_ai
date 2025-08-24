from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .services.mongodb_service import MongoDBService


@csrf_exempt
@require_http_methods(["POST"])
def create_user(request):
    """API endpoint to create a new user with initial credits"""
    try:
        data = json.loads(request.body)
        email = data.get('email', '').strip()
        name = data.get('name', '').strip()
        avatar = data.get('avatar', '').strip()
        
        if not email:
            return JsonResponse({
                'success': False,
                'error': 'Email is required'
            }, status=400)
        
        mongodb_service = MongoDBService()
        
        # Check if user already exists
        existing_user = mongodb_service.get_user_by_email(email)
        if existing_user:
            mongodb_service.close()
            return JsonResponse({
                'success': False,
                'error': 'User already exists'
            }, status=409)
        
        # Create new user
        user_data = {
            'email': email,
            'name': name,
            'picture': avatar  # Google OAuth uses 'picture' field
        }
        user_id = mongodb_service.create_user(user_data)
        
        # Get the created user
        user = mongodb_service.get_user_by_id(user_id)
        mongodb_service.close()
        
        return JsonResponse({
            'success': True,
            'user': user
        })
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_user_profile(request, email):
    """API endpoint to get user profile and credits"""
    try:
        mongodb_service = MongoDBService()
        user = mongodb_service.get_user_by_email(email)
        mongodb_service.close()
        
        if not user:
            return JsonResponse({
                'success': False,
                'error': 'User not found'
            }, status=404)
        
        return JsonResponse({
            'success': True,
            'user': user
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def deduct_credits(request):
    """API endpoint to deduct credits for requirement generation"""
    try:
        data = json.loads(request.body)
        user_id = data.get('user_id', '').strip()
        amount = data.get('amount', 2)  # Default 2 credits
        description = data.get('description', 'Requirement generation')
        
        if not user_id:
            return JsonResponse({
                'success': False,
                'error': 'User ID is required'
            }, status=400)
        
        mongodb_service = MongoDBService()
        
        # Check if user exists
        user = mongodb_service.get_user_by_id(user_id)
        if not user:
            mongodb_service.close()
            return JsonResponse({
                'success': False,
                'error': 'User not found'
            }, status=404)
        
        # Deduct credits
        success, message = mongodb_service.deduct_credits(user_id, amount, description)
        
        if success:
            # Get updated user data
            updated_user = mongodb_service.get_user_by_id(user_id)
            mongodb_service.close()
            
            return JsonResponse({
                'success': True,
                'message': message,
                'user': updated_user
            })
        else:
            mongodb_service.close()
            return JsonResponse({
                'success': False,
                'error': message
            }, status=400)
        
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_user_transactions(request, user_id):
    """API endpoint to get user's credit transaction history"""
    try:
        mongodb_service = MongoDBService()
        
        # Check if user exists
        user = mongodb_service.get_user_by_id(user_id)
        if not user:
            mongodb_service.close()
            return JsonResponse({
                'success': False,
                'error': 'User not found'
            }, status=404)
        
        # Get transactions
        transactions = mongodb_service.get_user_transactions(user_id)
        mongodb_service.close()
        
        return JsonResponse({
            'success': True,
            'transactions': transactions
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
