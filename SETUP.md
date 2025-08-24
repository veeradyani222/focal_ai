# Focal AI - Production Setup Guide

This guide will help you move from the mock database to real MongoDB with Google OAuth authentication.

## Prerequisites

- MongoDB Atlas account (or local MongoDB instance)
- Google Cloud Console project with OAuth 2.0 credentials
- Python 3.8+ and Node.js 18+

## Step 1: MongoDB Setup

### Option A: MongoDB Atlas (Recommended for Production)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (M0 Free tier is sufficient for development)
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Add your IP address to the IP Access List

### Option B: Local MongoDB

1. Install MongoDB Community Edition
2. Start MongoDB service
3. Create a database named `focalai`

## Step 2: Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)
7. Note down your Client ID and Client Secret

## Step 3: Environment Configuration

### Backend (.env file)

Create a `.env` file in the `backend/` directory:

```bash
# Django Settings
SECRET_KEY=your-django-secret-key-here
DEBUG=True

# MongoDB Configuration
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/
MONGODB_DB_NAME=focalai

# Gemini API Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### Frontend (.env.local file)

Create a `.env.local` file in the `frontend/` directory:

```bash
# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_SECRET=your-google-client-secret-here

# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Step 4: Install Dependencies

### Backend
```bash
cd backend
pip install -r requirements.txt
```

### Frontend
```bash
cd frontend
npm install
```

## Step 5: Database Migration

The application will automatically create the necessary collections and indexes when it first connects to MongoDB.

## Step 6: Start the Application

### Backend
```bash
cd backend
python manage.py runserver
```

### Frontend
```bash
cd frontend
npm run dev
```

## Step 7: Test Authentication

1. Open http://localhost:3000
2. Click "Sign in with Google"
3. Complete the OAuth flow
4. You should be redirected to the dashboard
5. Check that your user profile shows the correct information

## Troubleshooting

### MongoDB Connection Issues

- Verify your connection string format
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure your database user has the correct permissions
- Check the backend logs for connection errors

### Google OAuth Issues

- Verify your Client ID and Secret are correct
- Check that your redirect URIs match exactly
- Ensure the Google+ API is enabled
- Check the browser console for OAuth errors

### Authentication Issues

- Verify your NEXTAUTH_SECRET is set
- Check that the backend can verify Google tokens
- Ensure the frontend is sending the Authorization header
- Check the backend logs for authentication errors

## Security Notes

- Never commit your `.env` files to version control
- Use strong, unique secrets for production
- Consider using environment-specific configurations
- Regularly rotate your API keys and secrets
- Use HTTPS in production

## Production Deployment

For production deployment:

1. Set `DEBUG=False` in Django settings
2. Use a proper WSGI server (Gunicorn, uWSGI)
3. Set up a reverse proxy (Nginx)
4. Use environment variables for all secrets
5. Enable HTTPS
6. Set up proper logging and monitoring
7. Consider using a managed MongoDB service
8. Implement rate limiting and other security measures

## Support

If you encounter issues:

1. Check the application logs
2. Verify your configuration
3. Test with the provided example environment files
4. Check the troubleshooting section above
5. Review the code for any syntax errors
