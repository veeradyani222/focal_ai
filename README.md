# 🧠 Focal AI

AI-powered requirement refinement through multi-agent stakeholder simulation. Transform your product ideas into actionable requirements using intelligent debate between AI agents representing different stakeholder perspectives.

## ✨ Features

- **Multi-Agent Debate**: AI agents simulate stakeholder discussions to refine requirements
- **Google OAuth Integration**: Secure authentication with Google accounts
- **Credit System**: Manage usage with a credit-based system
- **Real-time Processing**: Get refined requirements instantly
- **User Management**: Track ideas, requirements, and credit transactions
- **MongoDB Integration**: Scalable data storage with automatic indexing

## 🚀 Quick Start

### Prerequisites

- MongoDB Atlas account or local MongoDB instance
- Google Cloud Console project with OAuth 2.0 credentials
- Python 3.8+ and Node.js 18+

### 1. Clone the Repository

```bash
git clone <repository-url>
cd focal_ai
```

### 2. Environment Setup

Follow the detailed setup guide in [SETUP.md](./SETUP.md) to configure:

- MongoDB connection
- Google OAuth credentials
- Environment variables

### 3. Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

### 4. Start the Application

```bash
# Backend (Terminal 1)
cd backend
python manage.py runserver

# Frontend (Terminal 2)
cd frontend
npm run dev
```

### 5. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## 🏗️ Architecture

### Backend (Django + MongoDB)
- **Authentication**: Google OAuth token verification
- **Database**: MongoDB with automatic indexing
- **AI Integration**: Gemini API for requirement refinement
- **Multi-Agent System**: Simulated stakeholder debates

### Frontend (Next.js + NextAuth)
- **Authentication**: NextAuth.js with Google provider
- **State Management**: React Context for user data
- **UI**: Modern, responsive design with Framer Motion

## 🔐 Authentication Flow

1. User signs in with Google OAuth
2. Frontend receives access token
3. Backend verifies token with Google
4. User is automatically created/authenticated
5. All API calls include the access token
6. Credits are managed per authenticated user

## 💰 Credit System

- **Initial Credits**: 10 credits upon account creation
- **Requirement Generation**: 2 credits per refinement
- **Credit Tracking**: Full transaction history
- **Automatic Deduction**: Credits deducted before processing

## 📊 API Endpoints

### Authentication Required
- `POST /api/refine/` - Generate refined requirements
- `GET /api/users/profile/` - Get user profile
- `POST /api/users/deduct-credits/` - Deduct credits
- `GET /api/users/transactions/` - Get transaction history

### Public
- `GET /api/history/` - Get idea history
- `GET /api/idea/<id>/` - Get idea details

## 🗄️ Database Schema

### Collections
- **users**: User profiles, credits, authentication
- **ideas**: Product ideas with metadata
- **debates**: Multi-agent debate logs
- **requirements**: Refined requirements and sections
- **credit_transactions**: Credit usage history

### Indexes
- Email uniqueness for users
- Timestamp-based sorting
- User-based filtering
- Performance optimization

## 🔧 Configuration

### Environment Variables

#### Backend
- `MONGODB_URI`: MongoDB connection string
- `MONGODB_DB_NAME`: Database name
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GEMINI_API_KEY`: Gemini AI API key

#### Frontend
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_SECRET`: Google OAuth client secret
- `NEXTAUTH_SECRET`: NextAuth.js secret
- `NEXTAUTH_URL`: Application URL

## 🚀 Production Deployment

1. Set up production MongoDB instance
2. Configure production Google OAuth credentials
3. Set `DEBUG=False` in Django
4. Use production WSGI server (Gunicorn)
5. Set up reverse proxy (Nginx)
6. Enable HTTPS
7. Configure proper logging and monitoring

## 🐛 Troubleshooting

Common issues and solutions are documented in [SETUP.md](./SETUP.md). Key areas:

- MongoDB connection problems
- Google OAuth configuration
- Authentication token issues
- Credit system problems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
1. Check the troubleshooting section
2. Review the setup guide
3. Check application logs
4. Open an issue on GitHub

---

**Note**: This application requires proper configuration of MongoDB and Google OAuth before it will function. Follow the setup guide carefully to ensure all components are properly configured.