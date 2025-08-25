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
@require_auth
def get_user_history(request):
    """API endpoint to get user-specific idea history"""
    try:
        # Get authenticated user
        user = get_user_from_request(request)
        if not user:
            return JsonResponse({
                'success': False,
                'error': 'User authentication required'
            }, status=401)
        
        mongodb_service = MongoDBService()
        history = mongodb_service.get_idea_history_by_user(user['_id'], limit=50)
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


@require_http_methods(["POST"])
@require_auth
def generate_title(request):
    """API endpoint to generate clean titles using Gemini"""
    try:
        data = json.loads(request.body)
        description = data.get('description', '').strip()
        idea_id = data.get('idea_id', '').strip()
        
        if not description:
            return JsonResponse({
                'success': False,
                'error': 'Description is required'
            }, status=400)
        
        # Get authenticated user
        user = get_user_from_request(request)
        if not user:
            return JsonResponse({
                'success': False,
                'error': 'User authentication required'
            }, status=401)
        
        # Use Gemini to generate a clean title
        from langchain_google_genai import ChatGoogleGenerativeAI
        from django.conf import settings
        
        llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.3
        )
        
        prompt = f"""
        Convert this app idea description into a clean, concise title (max 40 characters):
        
        Description: "{description}"
        
        Rules:
        1. Remove common prefixes like "i want", "create", "build", "develop", "make"
        2. Make it concise and professional
        3. Capitalize properly
        4. Keep it under 40 characters
        5. Make it sound like a real app name
        
        Examples:
        - "i want to build social media for cancer patient" → "Cancer Patient Social Media"
        - "create a mobile app for hospital patient monitoring" → "Hospital Patient Monitor"
        - "build a fintech payment processing platform" → "FinTech Payment Platform"
        
        Return only the clean title, nothing else.
        """
        
        response = llm.invoke(prompt)
        clean_title = response.content.strip()
        
        # Ensure it's not too long
        if len(clean_title) > 40:
            clean_title = clean_title[:37] + '...'
        
        return JsonResponse({
            'success': True,
            'title': clean_title,
            'idea_id': idea_id
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
@require_auth
def get_user_insights(request):
    """API endpoint to get AI-powered user insights"""
    try:
        # Get authenticated user
        user = get_user_from_request(request)
        if not user:
            return JsonResponse({
                'success': False,
                'error': 'User authentication required'
            }, status=401)
        
        mongodb_service = MongoDBService()
        
        # Get user's ideas
        ideas = list(mongodb_service.ideas_collection.find(
            {'user_id': user['_id']},
            {'description': 1, 'created_at': 1}
        ).sort('created_at', -1))
        
        if not ideas:
            # Return default insights for new users
            insight = {
                'total_ideas': 0,
                'most_common_domain': 'Getting Started',
                'average_complexity': 'Beginner',
                'growth_trend': 'Ready to Launch',
                'recommendations': [
                    'Start with a simple, focused idea to get familiar with the process',
                    'Consider problems you face daily as potential product opportunities',
                    'Use the AI agents to explore different perspectives on your idea',
                    'Don\'t worry about perfection - iterate and improve over time'
                ],
                'ai_insight': f"Welcome to Focal AI, {user.get('name', 'there')}! You're about to embark on an exciting journey of product development. Our AI-powered system will help you transform your ideas into detailed, actionable product requirements. Start with your first idea and watch how our multi-agent system provides comprehensive insights from different stakeholder perspectives."
            }
        else:
            # Analyze user's ideas with Gemini
            from langchain_google_genai import ChatGoogleGenerativeAI
            from django.conf import settings
            import re
            from collections import Counter
            
            # Basic analysis
            total_ideas = len(ideas)
            
            # Extract domains from descriptions
            domains = []
            for idea in ideas:
                description = idea.get('description', '').lower()
                if 'health' in description or 'medical' in description or 'patient' in description:
                    domains.append('Healthcare')
                elif 'finance' in description or 'payment' in description or 'banking' in description:
                    domains.append('FinTech')
                elif 'education' in description or 'learning' in description or 'school' in description:
                    domains.append('Education')
                elif 'social' in description or 'community' in description:
                    domains.append('Social Media')
                elif 'e-commerce' in description or 'shopping' in description:
                    domains.append('E-commerce')
                else:
                    domains.append('General')
            
            most_common_domain = Counter(domains).most_common(1)[0][0] if domains else 'General'
            
            # Determine growth trend
            if total_ideas == 1:
                growth_trend = 'Getting Started'
            elif total_ideas <= 3:
                growth_trend = 'Building Momentum'
            elif total_ideas <= 5:
                growth_trend = 'Active Developer'
            else:
                growth_trend = 'Product Visionary'
            
            # Use Gemini for AI insights
            llm = ChatGoogleGenerativeAI(
                model="gemini-pro",
                google_api_key=settings.GOOGLE_API_KEY,
                temperature=0.7
            )
            
            ideas_text = '\n'.join([f"- {idea.get('description', '')}" for idea in ideas[:5]])
            
            prompt = f"""
            Analyze this user's product ideas and provide personalized insights:
            
            User's Ideas:
            {ideas_text}
            
            Total Ideas: {total_ideas}
            Primary Domain: {most_common_domain}
            Growth Trend: {growth_trend}
            
            Provide:
            1. A personalized AI insight (2-3 sentences) about their product development journey
            2. 3-4 specific recommendations for improvement or next steps
            
            Format as JSON:
            {{
                "ai_insight": "personalized insight here",
                "recommendations": ["rec1", "rec2", "rec3", "rec4"]
            }}
            
            Make it encouraging, specific, and actionable.
            """
            
            try:
                response = llm.invoke(prompt)
                ai_analysis = json.loads(response.content.strip())
                ai_insight = ai_analysis.get('ai_insight', '')
                recommendations = ai_analysis.get('recommendations', [])
            except:
                # Fallback if AI fails
                ai_insight = f"Based on your {total_ideas} ideas, you're showing great potential in {most_common_domain.lower()} product development. Keep exploring and refining your concepts!"
                recommendations = [
                    'Consider exploring adjacent domains to expand your product portfolio',
                    'Focus on user pain points that your ideas address',
                    'Use the multi-agent system to get diverse perspectives on each idea',
                    'Document your learnings from each PRD to improve future ideas'
                ]
            
            insight = {
                'total_ideas': total_ideas,
                'most_common_domain': most_common_domain,
                'average_complexity': 'Intermediate' if total_ideas > 2 else 'Beginner',
                'growth_trend': growth_trend,
                'recommendations': recommendations,
                'ai_insight': ai_insight
            }
        
        mongodb_service.close()
        
        return JsonResponse({
            'success': True,
            'insight': insight
        })
        
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
