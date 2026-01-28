# 🎓 AI-Powered Smart Study Assistant

<p align="center">
  <img src="https://img.shields.io/badge/Status-Complete-success" alt="Status">
  <img src="https://img.shields.io/badge/Frontend-HTML%2FCSS%2FJS-blue" alt="Frontend">
  <img src="https://img.shields.io/badge/Backend-Flask%2BDjango-green" alt="Backend">
  <img src="https://img.shields.io/badge/Database-MySQL-orange" alt="Database">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

<p align="center">
  <b>A comprehensive AI-powered web application designed to help students study smarter, not harder!</b>
</p>

<p align="center">
  <a href="https://github.com/Chandana20034/AI-Study-Assistant">📂 GitHub Repository</a> •
  <a href="#-features">Features</a> •
  <a href="#-installation--setup">Installation</a> •
  <a href="#-api-endpoints">API</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [API Endpoints](#-api-endpoints)
- [Usage](#-usage)
- [Configuration](#-configuration)
- [Customization](#-customization)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgments](#-acknowledgments)

---

## 📖 About

The **AI Study Assistant** is a modern, feature-rich web application that leverages artificial intelligence to enhance the learning experience for students. Whether you need complex concepts explained in simple terms, want to generate quizzes to test your knowledge, or need to create flashcards for quick revision, this application has you covered.

### 🌟 Key Highlights

- **AI-Powered Learning**: Get intelligent explanations, summaries, and study materials
- **Interactive Quizzes**: Test your knowledge with auto-generated multiple-choice questions
- **Smart Flashcards**: Create and study with interactive flashcards
- **Modern UI/UX**: Beautiful glassmorphic design with smooth animations
- **Full-Stack Solution**: Complete frontend and backend implementation
- **Database Integration**: Persistent storage for all your study materials

---

## ✨ Features

### 🎓 For Students
- **Concept Explainer**: Get complex topics explained in simple, beginner-friendly language
- **Notes Summarizer**: Upload notes (PDF/TXT) or paste text to get concise summaries with key points
- **Quiz Generator**: Generate multiple-choice quizzes from any topic to test your knowledge
- **Flashcards**: Create interactive flashcards for quick revision and better retention
- **Progress Tracking**: View your learning history and activity

### 🎨 Design
- Modern glassmorphic UI with blue and pink gradient color scheme
- Responsive design that works on all devices
- Smooth animations and transitions
- Beautiful animated background with floating particles

## 🛠️ Technology Stack

### Frontend
- **HTML5**: Semantic structure
- **CSS3**: Custom styling with gradients, glassmorphism, and animations
- **JavaScript**: Interactive functionality and API integration
- **Font Awesome**: Icons

### Backend
- **Flask**: AI service endpoints (port 5000)
- **Django**: User management and database operations (port 8000)
- **Django REST Framework**: RESTful API

### Database
- **MySQL**: Relational database for user data, notes, quizzes, and flashcards

## 📁 Project Structure

```
project/
├── frontend/
│   ├── css/
│   │   └── style.css                 # Main stylesheet with blue/pink theme
│   ├── js/
│   │   ├── auth.js                   # Authentication logic
│   │   ├── dashboard.js              # Dashboard functionality
│   │   ├── explainer.js              # Concept explainer
│   │   ├── summarizer.js             # Notes summarizer
│   │   ├── quiz.js                   # Quiz generator
│   │   └── flashcards.js             # Flashcards
│   ├── login.html                    # Login/Register page
│   ├── dashboard.html                # Main dashboard
│   ├── explainer.html                # Concept explainer page
│   ├── summarizer.html               # Summarizer page
│   ├── quiz.html                     # Quiz generator page
│   └── flashcards.html               # Flashcards page
│
├── flask_backend/
│   ├── app.py                        # Flask application with API endpoints
│   ├── ai_service.py                 # AI logic (mock implementation)
│   └── requirements.txt              # Flask dependencies
│
├── django_backend/
│   ├── study_assistant/
│   │   ├── settings.py               # Django settings
│   │   ├── urls.py                   # Main URL configuration
│   │   ├── wsgi.py                   # WSGI configuration
│   │   └── __init__.py
│   ├── users/
│   │   ├── models.py                 # Database models
│   │   ├── views.py                  # API views
│   │   ├── serializers.py            # DRF serializers
│   │   ├── urls.py                   # App URL configuration
│   │   ├── admin.py                  # Admin configuration
│   │   ├── apps.py                   # App configuration
│   │   └── __init__.py
│   ├── manage.py                     # Django management script
│   └── requirements.txt              # Django dependencies
│
└── database/
    └── database_schema.sql           # MySQL database schema
```

## 🚀 Installation & Setup

### Prerequisites
- Python 3.8 or higher
- MySQL Server 5.7 or higher
- pip (Python package manager)

### Step 1: Clone or Download the Project
```bash
cd J:/project
```

### Step 2: Set Up MySQL Database

1. Start MySQL server
2. Open MySQL command line or MySQL Workbench
3. Run the database schema:
```bash
mysql -u root -p < database/database_schema.sql
```

Or manually create the database:
```sql
CREATE DATABASE study_assistant_db;
```

4. Update database credentials in `django_backend/study_assistant/settings.py`:
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'study_assistant_db',
        'USER': 'your_mysql_username',
        'PASSWORD': 'your_mysql_password',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### Step 3: Set Up Flask Backend (AI Services)

1. Navigate to Flask backend:
```bash
cd flask_backend
```

2. Create virtual environment (optional but recommended):
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run Flask server:
```bash
python app.py
```

Flask server will run on **http://localhost:5000**

### Step 4: Set Up Django Backend (User Management)

1. Open a new terminal and navigate to Django backend:
```bash
cd django_backend
```

2. Create virtual environment (optional but recommended):
```bash
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On macOS/Linux
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

5. Create superuser (optional, for admin panel):
```bash
python manage.py createsuperuser
```

6. Run Django server:
```bash
python manage.py runserver 8000
```

Django server will run on **http://localhost:8000**

### Step 5: Open the Frontend

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Open `login.html` in your browser:
   - Double-click the file, or
   - Use Live Server extension in VS Code, or
   - Use Python's HTTP server:
   ```bash
   python -m http.server 5500
   ```
   Then open **http://localhost:5500/login.html**

## 📡 API Endpoints

### Flask Backend (AI Services) - Port 5000

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/explain` | POST | Explain a concept in simple language |
| `/api/summarize` | POST | Summarize text and extract key points |
| `/api/generate-quiz` | POST | Generate MCQ quiz |
| `/api/generate-flashcards` | POST | Generate flashcards |
| `/api/extract-pdf` | POST | Extract text from PDF |
| `/api/health` | GET | Health check |

### Django Backend (User Management) - Port 8000

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/register/` | POST | Register new user |
| `/api/login/` | POST | User login |
| `/api/notes/save/` | POST | Save notes |
| `/api/quiz/save/` | POST | Save quiz results |
| `/api/flashcards/save/` | POST | Save flashcards |
| `/api/history/<user_id>/` | GET | Get user history |
| `/api/health/` | GET | Health check |

## 🎯 Usage

1. **Register/Login**: Start by creating an account or logging in
2. **Dashboard**: Access all features from the main dashboard
3. **Concept Explainer**: Enter a topic to get simple explanations
4. **Summarizer**: Upload notes or paste text to get summaries
5. **Quiz**: Generate quizzes to test your knowledge
6. **Flashcards**: Create flashcards for quick revision

## 🔧 Configuration

### Changing AI Service
The current implementation uses mock AI responses. To integrate with a real AI service (like OpenAI):

1. Open `flask_backend/ai_service.py`
2. Replace mock functions with actual AI API calls
3. Add API keys to environment variables
4. Install additional dependencies (e.g., `openai`)

### Database Configuration
Update MySQL credentials in `django_backend/study_assistant/settings.py`

## 🎨 Customization

### Colors
Edit CSS variables in `frontend/css/style.css`:
```css
:root {
    --primary-blue: #1e3a8a;
    --secondary-blue: #3b82f6;
    --primary-pink: #ec4899;
    --secondary-pink: #f472b6;
}
```

## 🐛 Troubleshooting

### MySQL Connection Error
- Ensure MySQL server is running
- Check database credentials in `settings.py`
- Verify database exists: `SHOW DATABASES;`

### CORS Error
- Ensure both Flask and Django servers are running
- Check CORS settings in both backends

### Port Already in Use
- Change Flask port in `flask_backend/app.py`: `app.run(port=5001)`
- Change Django port: `python manage.py runserver 8001`

## 📝 Notes

- **Security**: This is a development setup. For production:
  - Change `SECRET_KEY` in Django settings
  - Set `DEBUG = False`
  - Use environment variables for sensitive data
  - Implement proper authentication (JWT tokens)
  - Add HTTPS
  
- **AI Service**: Current implementation uses mock AI. Replace with actual AI API for production use.

## 👨‍💻 Development

### Adding New Features
1. Frontend: Add HTML page in `frontend/` and corresponding JS file
2. Flask: Add endpoint in `flask_backend/app.py` and logic in `ai_service.py`
3. Django: Add model, serializer, view, and URL route

### Database Changes
After modifying models in `django_backend/users/models.py`:
```bash
python manage.py makemigrations
python manage.py migrate
```

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork the repository**
   ```bash
   git clone https://github.com/Chandana20034/AI-Study-Assistant.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```

4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Open a Pull Request**

### 💡 Ideas for Contributions

- Add real AI integration (OpenAI, Google AI, etc.)
- Implement more study features (Pomodoro timer, spaced repetition)
- Add support for more file formats
- Improve accessibility
- Add internationalization support
- Write tests

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License - Copyright (c) 2026 Chandana
```

This means you are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Use privately

---

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Flask and Django communities

---

**Made with ❤️ for students who want to study smarter, not harder!**
