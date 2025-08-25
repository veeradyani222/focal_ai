#!/usr/bin/env python3
"""
Script to get all idea IDs for a specific user and generate clean titles using Gemini.
"""

import os
import sys
import django
from datetime import datetime

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Set up Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'focalai_backend.settings')
django.setup()

from api.services.mongodb_service import MongoDBService
from api.services.multi_agent import MultiAgentSystem
from bson import ObjectId

def get_user_ideas(user_id):
    """Get all idea IDs for a specific user"""
    print(f"🔍 Getting ideas for user: {user_id}")
    print("=" * 50)
    
    try:
        # Validate ObjectId format
        if not ObjectId.is_valid(user_id):
            print(f"❌ Invalid ObjectId format: {user_id}")
            return
        
        mongo_service = MongoDBService()
        
        if mongo_service.db is None:
            print("❌ MongoDB connection failed")
            return
        
        # Get all ideas for this user
        ideas = list(mongo_service.ideas_collection.find(
            {'user_id': user_id},
            {'_id': 1, 'title': 1, 'description': 1, 'created_at': 1}
        ).sort('created_at', -1))
        
        print(f"✅ Found {len(ideas)} ideas for user {user_id}")
        print()
        
        if ideas:
            print("📋 Idea Details:")
            print("-" * 30)
            for i, idea in enumerate(ideas, 1):
                idea_id = str(idea['_id'])
                title = idea.get('title', 'Untitled')
                description = idea.get('description', '')[:50] + '...' if len(idea.get('description', '')) > 50 else idea.get('description', '')
                created_at = idea.get('created_at', '').strftime('%Y-%m-%d %H:%M:%S') if idea.get('created_at') else 'Unknown'
                
                print(f"{i}. ID: {idea_id}")
                print(f"   Title: {title}")
                print(f"   Description: {description}")
                print(f"   Created: {created_at}")
                print()
        else:
            print("📭 No ideas found for this user")
            
        mongo_service.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Main function"""
    user_id = "68aad7fb482c621f56228b82"
    
    print("🧪 User Ideas Check")
    print("=" * 50)
    
    # Get user ideas
    get_user_ideas(user_id)
    
    print("✅ Script completed!")

if __name__ == "__main__":
    main()
