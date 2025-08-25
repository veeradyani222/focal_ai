import os
from pymongo import MongoClient
from django.conf import settings
import json
from datetime import datetime
from bson import ObjectId


class MongoDBService:
    """Service for MongoDB operations"""
    
    def __init__(self):
        # MongoDB connection configuration
        self.mongodb_uri = settings.MONGODB_URI
        self.db_name = settings.MONGODB_DB_NAME
        
        if not self.mongodb_uri:
            raise ValueError("MONGODB_URI is not configured in settings")
        
        try:
            # Connect to MongoDB with proper options
            self.client = MongoClient(
                self.mongodb_uri,
                serverSelectionTimeoutMS=10000,
                connectTimeoutMS=10000,
                socketTimeoutMS=20000,
                maxPoolSize=10,
                retryWrites=True,
                w='majority'
            )
            
            # Test the connection
            self.client.admin.command('ping')
            self.db = self.client[self.db_name]
            
            # Initialize collections
            self.ideas_collection = self.db.ideas
            self.debates_collection = self.db.debates
            self.requirements_collection = self.db.requirements
            self.users_collection = self.db.users
            self.credit_transactions_collection = self.db.credit_transactions
            
            # Create indexes for better performance
            self._create_indexes()
            
            print(f"✅ MongoDB connected successfully to {self.db_name}")
            
        except Exception as e:
            print(f"❌ MongoDB connection failed: {str(e)}")
            raise Exception(f"Failed to connect to MongoDB: {str(e)}")
    
    def _create_indexes(self):
        """Create database indexes for better performance"""
        try:
            # User indexes
            self.users_collection.create_index("email", unique=True)
            self.users_collection.create_index("created_at")
            
            # Idea indexes
            self.ideas_collection.create_index("created_at")
            self.ideas_collection.create_index("user_id")
            
            # Debate indexes
            self.debates_collection.create_index("idea_id")
            self.debates_collection.create_index("round_number")
            
            # Requirements indexes
            self.requirements_collection.create_index("idea_id")
            self.requirements_collection.create_index("created_at")
            
            # Transaction indexes
            self.credit_transactions_collection.create_index("user_id")
            self.credit_transactions_collection.create_index("created_at")
            
            print("✅ Database indexes created successfully")
            
        except Exception as e:
            print(f"⚠️ Warning: Failed to create some indexes: {str(e)}")
    
    def save_idea(self, idea_data):
        """Save idea to MongoDB"""
        idea_data['created_at'] = datetime.utcnow()
        idea_data['updated_at'] = datetime.utcnow()
        # Ensure user_id is included
        if 'user_id' not in idea_data:
            raise ValueError("user_id is required for idea creation")
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

    def get_idea_history_by_user(self, user_id, limit=50):
        """Get user-specific idea history with requirements"""
        pipeline = [
            {
                '$match': {'user_id': user_id}
            },
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
                    'latest_requirement': {'$arrayElemAt': ['$requirements', -1]},
                    'title': {
                        '$cond': {
                            'if': {'$ne': ['$title', '']},
                            'then': '$title',
                            'else': {
                                '$substr': ['$description', 0, 50]
                            }
                        }
                    }
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
    
    # User Management Methods
    def create_user(self, user_data):
        """Create a new user with initial 10 credits"""
        try:
            user_doc = {
                'email': user_data['email'],
                'name': user_data.get('name', ''),
                'avatar': user_data.get('picture', ''),  # Google OAuth provides 'picture' field
                'credits': 10,  # Initial credits
                'created_at': datetime.utcnow(),
                'last_login': datetime.utcnow(),
                'is_active': True
            }
            
            print(f"🔧 Creating user: {user_data['email']}")
            result = self.users_collection.insert_one(user_doc)
            user_id = str(result.inserted_id)
            
            # Log initial credit transaction
            self.log_credit_transaction(
                user_id=user_id,
                transaction_type='initial',
                amount=10,
                description='Initial credits upon account creation'
            )
            
            print(f"✅ User created successfully with ID: {user_id}")
            return user_id
            
        except Exception as e:
            print(f"❌ Error creating user: {str(e)}")
            raise e
    
    def get_user_by_email(self, email):
        """Get user by email"""
        try:
            user = self.users_collection.find_one({'email': email})
            if user:
                user['_id'] = str(user['_id'])
                print(f"✅ User found: {email}")
            else:
                print(f"ℹ️ User not found: {email}")
            return user
        except Exception as e:
            print(f"❌ Error getting user by email: {str(e)}")
            return None
    
    def get_user_by_id(self, user_id):
        """Get user by ID"""
        try:
            user = self.users_collection.find_one({'_id': ObjectId(user_id)})
            if user:
                user['_id'] = str(user['_id'])
            return user
        except:
            return None
    
    def update_user_login(self, user_id):
        """Update user's last login time"""
        try:
            self.users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'last_login': datetime.utcnow()}}
            )
            return True
        except:
            return False
    
    def update_user_profile(self, user_id, profile_data):
        """Update user profile information"""
        try:
            update_data = {}
            if 'name' in profile_data:
                update_data['name'] = profile_data['name']
            if 'avatar' in profile_data:
                update_data['avatar'] = profile_data['avatar']
            
            if update_data:
                self.users_collection.update_one(
                    {'_id': ObjectId(user_id)},
                    {'$set': update_data}
                )
            return True
        except:
            return False
    
    # Credit Management Methods
    def get_user_credits(self, user_id):
        """Get user's current credit balance"""
        try:
            user = self.users_collection.find_one({'_id': ObjectId(user_id)})
            return user.get('credits', 0) if user else 0
        except:
            return 0
    
    def deduct_credits(self, user_id, amount=2, description='Requirement generation'):
        """Deduct credits from user account"""
        try:
            # Check if user has sufficient credits
            current_credits = self.get_user_credits(user_id)
            if current_credits < amount:
                return False, f"Insufficient credits. Required: {amount}, Available: {current_credits}"
            
            # Deduct credits
            result = self.users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$inc': {'credits': -amount}}
            )
            
            if result.modified_count > 0:
                # Log the transaction
                self.log_credit_transaction(
                    user_id=user_id,
                    transaction_type='deduction',
                    amount=-amount,
                    description=description
                )
                return True, f"Successfully deducted {amount} credits"
            else:
                return False, "Failed to deduct credits"
                
        except Exception as e:
            return False, f"Error deducting credits: {str(e)}"
    
    def add_credits(self, user_id, amount, description='Credit purchase'):
        """Add credits to user account"""
        try:
            result = self.users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$inc': {'credits': amount}}
            )
            
            if result.modified_count > 0:
                # Log the transaction
                self.log_credit_transaction(
                    user_id=user_id,
                    transaction_type='addition',
                    amount=amount,
                    description=description
                )
                return True, f"Successfully added {amount} credits"
            else:
                return False, "Failed to add credits"
                
        except Exception as e:
            return False, f"Error adding credits: {str(e)}"
    
    def log_credit_transaction(self, user_id, transaction_type, amount, description):
        """Log a credit transaction for audit trail"""
        try:
            transaction_doc = {
                'user_id': user_id,
                'transaction_type': transaction_type,  # 'initial', 'deduction', 'addition'
                'amount': amount,
                'description': description,
                'created_at': datetime.utcnow()
            }
            
            self.credit_transactions_collection.insert_one(transaction_doc)
            print(f"✅ Credit transaction logged: {transaction_type} {amount} credits for user {user_id}")
            
        except Exception as e:
            print(f"❌ Error logging credit transaction: {str(e)}")
    
    def get_user_transactions(self, user_id, limit=20):
        """Get user's credit transaction history"""
        try:
            transactions = list(self.credit_transactions_collection.find(
                {'user_id': user_id}
            ).sort('created_at', -1).limit(limit))
            
            # Convert ObjectId to string
            for transaction in transactions:
                transaction['_id'] = str(transaction['_id'])
            
            return transactions
        except:
            return []
    
    def close(self):
        """Close MongoDB connection"""
        try:
            self.client.close()
            print("🔌 MongoDB connection closed")
        except:
            pass
