#!/usr/bin/env python3
"""
Script to test the user insights endpoint.
"""

import os
import sys
import django
import requests
import json

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'focalai_backend.settings')
django.setup()

def test_user_insights():
    """Test the user insights endpoint"""
    print("🧪 Testing User Insights Endpoint")
    print("=" * 50)
    
    # Test URL
    url = "http://localhost:8000/api/user-insights/"
    
    # You'll need to get a valid token from your frontend
    # For now, we'll test without authentication
    headers = {
        'Content-Type': 'application/json',
        # 'Authorization': 'Bearer YOUR_TOKEN_HERE'
    }
    
    try:
        print(f"📡 Making request to: {url}")
        response = requests.get(url, headers=headers)
        
        print(f"📊 Status Code: {response.status_code}")
        print(f"📋 Response Headers: {dict(response.headers)}")
        
        if response.status_code == 200:
            data = response.json()
            print("✅ Success Response:")
            print(json.dumps(data, indent=2))
        else:
            print("❌ Error Response:")
            print(response.text)
            
    except requests.exceptions.ConnectionError:
        print("❌ Connection Error: Make sure the Django server is running on localhost:8000")
    except Exception as e:
        print(f"❌ Unexpected Error: {e}")

def test_with_mock_token():
    """Test with a mock token (for development)"""
    print("\n🔑 Testing with Mock Token")
    print("=" * 30)
    
    url = "http://localhost:8000/api/user-insights/"
    
    # Mock token (you'll need to replace this with a real one)
    headers = {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer mock_token_for_testing'
    }
    
    try:
        response = requests.get(url, headers=headers)
        print(f"📊 Status Code: {response.status_code}")
        
        if response.status_code == 401:
            print("✅ Expected: Authentication required")
        else:
            print(f"📋 Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Main function"""
    print("🚀 User Insights API Test")
    print("=" * 50)
    
    # Test without authentication
    test_user_insights()
    
    # Test with mock token
    test_with_mock_token()
    
    print("\n✅ Test completed!")
    print("\n💡 To test with real authentication:")
    print("1. Start your Django server: python manage.py runserver")
    print("2. Get a valid token from your frontend")
    print("3. Update the Authorization header in the test script")

if __name__ == "__main__":
    main()
