from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json
from .services.mongodb_service import MongoDBService
from .auth_middleware import require_auth, get_user_from_request


@require_http_methods(["GET"])
@require_auth
def get_user_profile(request):
    """API endpoint to get authenticated user's profile and credits"""
    try:
        user = get_user_from_request(request)
        if not user:
            return JsonResponse({
                'success': False,
                'error': 'User authentication required'
            }, status=401)
        
        print(f"✅ User profile retrieved successfully: {user['email']}")
        return JsonResponse({
            'success': True,
            'user': user
        })
        
    except Exception as e:
        print(f"❌ Unexpected error in get_user_profile: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def deduct_credits(request):
    """API endpoint to deduct credits for requirement generation"""
    try:
        print(f"🔧 Deduct credits request received: {request.body}")
        data = json.loads(request.body)
        amount = data.get('amount', 2)  # Default 2 credits
        description = data.get('description', 'Requirement generation')
        
        user = get_user_from_request(request)
        if not user:
            return JsonResponse({
                'success': False,
                'error': 'User authentication required'
            }, status=401)
        
        print(f"💰 Processing credit deduction: {amount} credits for user {user['email']}")
        
        try:
            mongodb_service = MongoDBService()
            print(f"✅ MongoDB service initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize MongoDB service: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': f'Database connection failed: {str(e)}'
            }, status=500)
        
        # Deduct credits
        success, message = mongodb_service.deduct_credits(user['_id'], amount, description)
        
        if success:
            # Get updated user data
            updated_user = mongodb_service.get_user_by_id(user['_id'])
            mongodb_service.close()
            
            print(f"✅ Credits deducted successfully: {message}")
            return JsonResponse({
                'success': True,
                'message': message,
                'user': updated_user
            })
        else:
            mongodb_service.close()
            print(f"❌ Credit deduction failed: {message}")
            return JsonResponse({
                'success': False,
                'error': message
            }, status=400)
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON decode error: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
    except Exception as e:
        print(f"❌ Unexpected error in deduct_credits: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
@require_auth
def get_user_transactions(request):
    """API endpoint to get authenticated user's credit transaction history"""
    try:
        user = get_user_from_request(request)
        if not user:
            return JsonResponse({
                'success': False,
                'error': 'User authentication required'
            }, status=401)
        
        print(f"🔧 Get user transactions request for user: {user['email']}")
        
        try:
            mongodb_service = MongoDBService()
            print(f"✅ MongoDB service initialized successfully")
        except Exception as e:
            print(f"❌ Failed to initialize MongoDB service: {str(e)}")
            return JsonResponse({
                'success': False,
                'error': f'Database connection failed: {str(e)}'
            }, status=500)
        
        # Get transactions
        transactions = mongodb_service.get_user_transactions(user['_id'])
        mongodb_service.close()
        
        print(f"✅ User transactions retrieved successfully: {len(transactions)} transactions")
        return JsonResponse({
            'success': True,
            'transactions': transactions
        })
        
    except Exception as e:
        print(f"❌ Unexpected error in get_user_transactions: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
