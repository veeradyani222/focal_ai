# 🧠 Multi-Agent AI Requirement Refinement (MVP)

## 🎯 Goal
Build an MVP that:
1. Takes *user input* (rough product idea).  
2. Runs a *multi-agent debate* (Business, Engineer, Designer, Customer, Product Manager) via LangChain + Gemini.  
3. Aggregates into *refined requirements + actionable outputs*.  
4. Displays results in a *simple UI*.  

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+
- MongoDB Atlas account
- Google Gemini API key

### 1. Clone and Setup
```bash
git clone <repository-url>
cd FocalAI
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

### 3. Environment Configuration
Create `.env` file in `backend/` directory:
```env
SECRET_KEY=your_django_secret_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=focalai
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Database Setup
```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Frontend Setup
```bash
cd ../frontend
npm install
```

### 6. Run the Application
```bash
# Terminal 1 - Backend (from backend directory)
python manage.py runserver

# Terminal 2 - Frontend (from frontend directory)
npm run dev
```

Visit `http://localhost:3000` to use the application!

---

## 🛠 Phase 1: Environment & Setup ✅
*Objective:* Get the project skeleton ready.  

- *Backend:* ✅
  - Django project with API endpoints
  - MongoDB integration with PyMongo
  - LangChain + Gemini integration
  - CORS configuration for frontend

- *Frontend:* ✅
  - Next.js 15 with TypeScript
  - Tailwind CSS for styling
  - Modern UI with input form + results display

- *Database:* ✅
  - MongoDB Atlas connection
  - Collections: Ideas, Debates, Requirements

---

## 🧠 Phase 2: AI Core (Multi-Agent Setup) ✅
*Objective:* Build the *LangChain + Gemini multi-agent system*.  

1. *Agent Personas:* ✅
   - Business Manager → profit, scalability
   - Engineer → technical feasibility
   - Designer → usability, aesthetics
   - Customer → needs, pain points
   - Product Manager → balance trade-offs

2. *Debate Logic:* ✅
   - 2 rounds of conversation
   - Each agent comments on input
   - Agents respond to each other

3. *Aggregator:* ✅
   - Summarizes debate
   - Produces refined requirements, trade-offs, next steps

---

## 🔗 Phase 3: API Layer ✅
*Objective:* Wrap AI core into usable APIs.  

- Endpoints: ✅
  - POST /api/refine → Input: product idea, Output: requirements doc
  - GET /api/history → Past ideas + debates
  - GET /api/idea/<id>/ → Detailed idea information

- MongoDB storage for all data ✅

---

## 🎨 Phase 4: Frontend (Basic UI) ✅
*Objective:* Allow user interaction.  

- Modern UI with: ✅
  - Text input for idea
  - Button to call /api/refine
  - Results section showing refined requirements, trade-offs, next steps
  - History panel with past ideas
  - Loading states and error handling

---

## 📊 Phase 5: Visualization (Stretch Goal) ✅
*Objective:* Make it visually appealing for judges.  

- Enhanced UI features: ✅
  - Tabbed interface for requirements vs debate
  - Agent badges and round indicators
  - Responsive design
  - Professional styling

---

## 🚀 Phase 6: Polish for Demo ✅
*Objective:* Make it hackathon-ready.  

- System features: ✅
  - Works in <2 minutes end-to-end
  - Error handling for API failures
  - Professional UI copy
  - Complete setup instructions

---

## 🔥 Demo Script (for Judges)

### 1. Problem Statement
"Requirement gathering is slow and subjective. Traditional stakeholder meetings take hours and often result in conflicting priorities."

### 2. Solution
"Multi-Agent AI simulating stakeholders. Our system uses 5 AI agents representing different perspectives to analyze product ideas in minutes."

### 3. Live Demo
1. Enter idea: "A food delivery app with real-time tracking"
2. Click "Refine Requirements with AI Stakeholders"
3. Watch as 5 agents debate the idea
4. View refined requirements, trade-offs, and next steps

### 4. Real World Impact
- Saves hours of meetings
- Fast consensus building
- Scalable revenue model validation
- Reduces time-to-market

---

## 🏗 Architecture

### Backend (Django + MongoDB)
```
backend/
├── focalai_backend/     # Django project settings
├── api/                 # Main app
│   ├── services/        # AI and database services
│   │   ├── multi_agent.py    # LangChain + Gemini agents
│   │   └── mongodb_service.py # MongoDB operations
│   ├── views.py         # API endpoints
│   └── urls.py          # URL routing
└── requirements.txt     # Python dependencies
```

### Frontend (Next.js + TypeScript)
```
frontend/
├── src/
│   ├── app/             # Next.js app router
│   │   └── page.tsx     # Main application page
│   └── components/      # React components
│       ├── IdeaInput.tsx
│       ├── ResultsDisplay.tsx
│       ├── HistoryPanel.tsx
│       └── LoadingSpinner.tsx
└── package.json         # Node.js dependencies
```

---

## 🔧 Configuration

### Environment Variables
- `SECRET_KEY`: Django secret key
- `MONGODB_URI`: MongoDB Atlas connection string
- `MONGODB_DB_NAME`: Database name (default: focalai)
- `GEMINI_API_KEY`: Google Gemini API key

### API Endpoints
- `POST /api/refine/`: Submit product idea for refinement
- `GET /api/history/`: Get recent ideas and their results
- `GET /api/idea/<id>/`: Get detailed information about a specific idea

---

## 🎯 Usage Example

1. **Start the application** (see Quick Start above)

2. **Enter a product idea**:
   ```
   "A mobile app that helps people find and book local fitness classes, 
   with real-time availability, instructor ratings, and personalized 
   recommendations based on user preferences and location."
   ```

3. **Click "Refine Requirements with AI Stakeholders"**

4. **View results**:
   - **Refined Requirements**: 5-8 actionable requirements
   - **Trade-offs**: Key decisions and their implications
   - **Next Steps**: Concrete action items with timelines
   - **AI Debate**: Full conversation between stakeholders

---

## 🚀 Deployment

### Backend (Django)
```bash
# Production settings
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com']
# Configure production database
# Set up static files
python manage.py collectstatic
```

### Frontend (Next.js)
```bash
npm run build
npm start
# Or deploy to Vercel/Netlify
```

---

## 🔍 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Ensure your connection string is correct and network access is configured
2. **Gemini API**: Verify your API key is valid and has sufficient quota
3. **CORS Errors**: Check that backend CORS settings allow frontend domain
4. **Port Conflicts**: Ensure ports 8000 (Django) and 3000 (Next.js) are available

### Debug Mode
```bash
# Backend
python manage.py runserver --verbosity=2

# Frontend
npm run dev -- --debug
```

---

## 📈 Future Enhancements

- [ ] Real-time debate streaming
- [ ] Export requirements to PDF/Word
- [ ] Integration with project management tools
- [ ] Advanced visualization (mind maps, flowcharts)
- [ ] Multi-language support
- [ ] Custom agent personas
- [ ] A/B testing for different debate strategies

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ using Django, Next.js, LangChain, and Gemini AI**#   f o c a l _ a i  
 