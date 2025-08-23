import os
from pymongo import MongoClient
from django.conf import settings
import json
from datetime import datetime


class MongoDBService:
    """Service for MongoDB operations"""
    
    def __init__(self):
        self.client = MongoClient(settings.MONGODB_URI)
        self.db = self.client[settings.MONGODB_DB_NAME]
        
        # Collections
        self.ideas_collection = self.db.ideas
        self.debates_collection = self.db.debates
        self.requirements_collection = self.db.requirements
    
    def save_idea(self, idea_data):
        """Save idea to MongoDB"""
        idea_data['created_at'] = datetime.utcnow()
        idea_data['updated_at'] = datetime.utcnow()
        result = self.ideas_collection.insert_one(idea_data)
        return str(result.inserted_id)
    
    def save_debates(self, idea_id, debates):
        """Save debate entries to MongoDB"""
        debate_docs = []
        for debate in debates:
            debate_doc = {
                'idea_id': idea_id,
                'round_number': debate['round'],
                'agent_name': debate['agent'],
                'message': debate['response'],
                'timestamp': datetime.utcnow()
            }
            debate_docs.append(debate_doc)
        
        if debate_docs:
            result = self.debates_collection.insert_many(debate_docs)
            return [str(id) for id in result.inserted_ids]
        return []
    
    def save_requirements(self, idea_id, requirements_data):
        """Save refined requirements to MongoDB"""
        requirements_data['idea_id'] = idea_id
        requirements_data['created_at'] = datetime.utcnow()
        result = self.requirements_collection.insert_one(requirements_data)
        return str(result.inserted_id)
    
    def get_idea_history(self, limit=10):
        """Get recent ideas with their requirements"""
        pipeline = [
            {
                '$lookup': {
                    'from': 'requirements',
                    'localField': '_id',
                    'foreignField': 'idea_id',
                    'as': 'requirements'
                }
            },
            {
                '$lookup': {
                    'from': 'debates',
                    'localField': '_id',
                    'foreignField': 'idea_id',
                    'as': 'debates'
                }
            },
            {
                '$addFields': {
                    'debate_count': {'$size': '$debates'},
                    'latest_requirement': {'$arrayElemAt': ['$requirements', -1]}
                }
            },
            {
                '$sort': {'created_at': -1}
            },
            {
                '$limit': limit
            }
        ]
        
        return list(self.ideas_collection.aggregate(pipeline))
    
    def get_idea_details(self, idea_id):
        """Get detailed information about a specific idea"""
        from bson import ObjectId
        
        # Get idea
        idea = self.ideas_collection.find_one({'_id': ObjectId(idea_id)})
        if not idea:
            return None
        
        # Get debates organized by round
        debates = list(self.debates_collection.find({'idea_id': idea_id}).sort([('round_number', 1), ('timestamp', 1)]))
        
        # Get latest requirement
        requirement = self.requirements_collection.find_one({'idea_id': idea_id}, sort=[('created_at', -1)])
        
        # Organize debates by round
        debate_rounds = {}
        for debate in debates:
            round_num = debate['round_number']
            if round_num not in debate_rounds:
                debate_rounds[round_num] = []
            debate_rounds[round_num].append({
                'agent': debate['agent_name'],
                'message': debate['message'],
                'timestamp': debate['timestamp'].isoformat()
            })
        
        return {
            'idea': idea,
            'debate_rounds': debate_rounds,
            'requirement': requirement
        }
    
    def close(self):
        """Close MongoDB connection"""
        self.client.close()
