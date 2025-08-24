from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.utils import timezone
import json
from .services.multi_agent import MultiAgentSystem
from .services.mongodb_service import MongoDBService
from .auth_middleware import require_auth, get_user_from_request
from .user_views import get_user_profile, deduct_credits, get_user_transactions


@csrf_exempt
@require_http_methods(["GET"])
def test_connection(request):
    """Test endpoint to verify frontend-backend communication"""
    return JsonResponse({
        'success': True,
        'message': 'Backend is running and accessible',
        'timestamp': timezone.now().isoformat()
    })


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def test_auth(request):
    """Test endpoint to verify authentication is working"""
    user = get_user_from_request(request)
    return JsonResponse({
        'success': True,
        'message': 'Authentication is working',
        'user': user,
        'timestamp': timezone.now().isoformat()
    })


@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def refine_requirements(request):
    """API endpoint to refine requirements using multi-agent debate"""
    try:
        data = json.loads(request.body)
        idea_text = data.get('idea', '').strip()
        
        if not idea_text:
            return JsonResponse({
                'success': False,
                'error': 'Idea text is required'
            }, status=400)
        
        # Get authenticated user
        user = get_user_from_request(request)
        if not user:
            return JsonResponse({
                'success': False,
                'error': 'User authentication required'
            }, status=401)
        
        # Check if user has sufficient credits
        mongodb_service = MongoDBService()
        current_credits = mongodb_service.get_user_credits(user['_id'])
        
        if current_credits < 2:
            mongodb_service.close()
            return JsonResponse({
                'success': False,
                'error': f'Insufficient credits. Required: 2, Available: {current_credits}'
            }, status=402)
        
        # Deduct credits first
        success, message = mongodb_service.deduct_credits(user['_id'], 2, 'Requirement generation')
        if not success:
            mongodb_service.close()
            return JsonResponse({
                'success': False,
                'error': message
            }, status=402)
        
        # Initialize services
        agent_system = MultiAgentSystem()
        
        # Save idea to MongoDB with user_id
        idea_data = {
            'title': idea_text[:200],  # Truncate if too long
            'description': idea_text,
            'user_id': user['_id']
        }
        idea_id = mongodb_service.save_idea(idea_data)
        
        # Run requirement refinement
        result = agent_system.refine_requirements(idea_text)
        
        if result['success']:
            # Save debate log to MongoDB
            mongodb_service.save_debates(idea_id, result['debate_log'])
            
            # Parse refined requirements to extract sections
            refined_text = result['refined_requirements']
            
            # Simple parsing - look for section headers
            sections = {
                'refined_requirements': '',
                'trade_offs': '',
                'next_steps': ''
            }
            
            # Try to parse the sections
            lines = refined_text.split('\n')
            current_section = None
            
            for line in lines:
                line = line.strip()
                if 'REFINED REQUIREMENTS' in line.upper():
                    current_section = 'refined_requirements'
                elif 'TRADE-OFFS' in line.upper() or 'TRADE OFFS' in line.upper():
                    current_section = 'trade_offs'
                elif 'NEXT STEPS' in line.upper():
                    current_section = 'next_steps'
                elif current_section and line:
                    sections[current_section] += line + '\n'
            
            # Save requirements to MongoDB
            requirements_data = {
                'refined_requirements': sections['refined_requirements'].strip(),
                'trade_offs': sections['trade_offs'].strip(),
                'next_steps': sections['next_steps'].strip()
            }
            mongodb_service.save_requirements(idea_id, requirements_data)
            
            # Get updated user data
            updated_user = mongodb_service.get_user_by_id(user['_id'])
            mongodb_service.close()
            
            return JsonResponse({
                'success': True,
                'idea_id': idea_id,
                'refined_requirements': result['refined_requirements'],
                'debate_log': result['debate_log'],
                'user': updated_user
            })
        else:
            # Refund credits if requirement generation failed
            mongodb_service.add_credits(user['_id'], 2, 'Credit refund - requirement generation failed')
            mongodb_service.close()
            
            return JsonResponse({
                'success': False,
                'error': result.get('error', 'Unknown error occurred')
            }, status=500)
            
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
def get_history(request):
    """API endpoint to get past ideas and debates"""
    try:
        mongodb_service = MongoDBService()
        history = mongodb_service.get_idea_history(limit=10)
        mongodb_service.close()
        
        # Convert ObjectId to string for JSON serialization
        for item in history:
            item['_id'] = str(item['_id'])
            if 'latest_requirement' in item and item['latest_requirement']:
                item['latest_requirement']['_id'] = str(item['latest_requirement']['_id'])
        
        return JsonResponse({
            'success': True,
            'history': history
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)


@require_http_methods(["GET"])
def get_idea_details(request, idea_id):
    """API endpoint to get detailed information about a specific idea"""
    try:
        mongodb_service = MongoDBService()
        details = mongodb_service.get_idea_details(idea_id)
        mongodb_service.close()
        
        if not details:
            return JsonResponse({
                'success': False,
                'error': 'Idea not found'
            }, status=404)
        
        # Convert ObjectId to string for JSON serialization
        details['idea']['_id'] = str(details['idea']['_id'])
        if details['requirement']:
            details['requirement']['_id'] = str(details['requirement']['_id'])
        
        return JsonResponse({
            'success': True,
            'idea': details['idea'],
            'debate_rounds': details['debate_rounds'],
            'requirement': details['requirement']
        })
        
    except Exception as e:
        return JsonResponse({
            'success': False,
            'error': str(e)
        }, status=500)
