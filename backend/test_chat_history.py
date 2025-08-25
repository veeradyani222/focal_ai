#!/usr/bin/env python3
"""
Test script to verify chat history functionality.
This tests:
1. User-specific idea history retrieval
2. Title transformation logic
3. API endpoints for chat history
"""

import requests
import json
import time

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def test_user_history_endpoint():
    """Test the user history endpoint"""
    print("🔍 Testing User History Endpoint")
    print("=" * 40)
    
    try:
        # Test the endpoint (without auth for now)
        response = requests.get(f"{BASE_URL}/user-history/")
        
        if response.status_code == 401:
            print("✅ Endpoint requires authentication (expected)")
        else:
            print(f"⚠️  Unexpected status code: {response.status_code}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Cannot connect to backend server")
    except Exception as e:
        print(f"❌ Error: {e}")

def test_title_transformation():
    """Test the title transformation logic"""
    print("\n🎯 Testing Title Transformation")
    print("=" * 40)
    
    test_cases = [
        "i want an app for school courses",
        "create a mobile app for hospital patient monitoring",
        "build a fintech payment processing platform",
        "develop an educational learning management system",
        "make a tool for project management",
        "i want to build a website for e-commerce"
    ]
    
    for i, description in enumerate(test_cases, 1):
        print(f"{i}. Input: {description}")
        
        # Simulate the transformation logic
        clean_title = description
        import re
        
        # Remove common prefixes
        clean_title = re.sub(r'^(i want|create|build|develop|make)\s+(an?\s+)?', '', clean_title, flags=re.IGNORECASE)
        clean_title = re.sub(r'^(app|application|platform|system|tool|website|webapp)\s+(for|to|that)\s+', '', clean_title, flags=re.IGNORECASE)
        clean_title = re.sub(r'^(that|which|to)\s+', '', clean_title, flags=re.IGNORECASE)
        clean_title = clean_title.strip()
        
        # Capitalize first letter of each word
        clean_title = ' '.join(word.capitalize() for word in clean_title.split())
        
        # Add "App" suffix if it doesn't already have one
        if not any(word in clean_title.lower() for word in ['app', 'platform', 'system', 'tool']):
            clean_title += ' App'
        
        # Limit length
        if len(clean_title) > 40:
            clean_title = clean_title[:37] + '...'
        
        print(f"   Output: {clean_title}")
        print()

def test_mongodb_service():
    """Test MongoDB service methods"""
    print("🗄️  Testing MongoDB Service")
    print("=" * 40)
    
    try:
        import os
        import sys
        import django
        
        # Add the backend directory to the Python path
        sys.path.append(os.path.dirname(os.path.abspath(__file__)))
        
        # Set up Django
        os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'focalai_backend.settings')
        django.setup()
        
        from api.services.mongodb_service import MongoDBService
        
        # Test MongoDB connection
        mongo_service = MongoDBService()
        
        if mongo_service.db is not None:
            print("✅ MongoDB connection successful")
            
            # Test getting idea history
            try:
                history = mongo_service.get_idea_history(limit=5)
                print(f"✅ Retrieved {len(history)} ideas from history")
                
                for i, idea in enumerate(history, 1):
                    print(f"   {i}. {idea.get('title', 'Untitled')} - {idea.get('description', '')[:50]}...")
                    
            except Exception as e:
                print(f"❌ Error getting history: {e}")
        else:
            print("⚠️  MongoDB connection failed, using fallback mode")
            
    except Exception as e:
        print(f"❌ Error testing MongoDB service: {e}")

def main():
    """Run all tests"""
    print("🧪 Chat History Functionality Tests")
    print("=" * 50)
    
    # Test MongoDB service
    test_mongodb_service()
    
    # Test title transformation
    test_title_transformation()
    
    # Test API endpoint
    test_user_history_endpoint()
    
    print("\n✅ All tests completed!")

if __name__ == "__main__":
    main()
