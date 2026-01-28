# ==========================================
# Django URL Configuration - Users App
# ==========================================

from django.urls import path
from . import views

urlpatterns = [
    # Authentication endpoints
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    
    # Data management endpoints
    path('notes/save/', views.save_note, name='save_note'),
    path('quiz/save/', views.save_quiz, name='save_quiz'),
    path('flashcards/save/', views.save_flashcards, name='save_flashcards'),
    path('history/<int:user_id>/', views.get_user_history, name='user_history'),
    
    # Health check
    path('health/', views.health_check, name='health'),
]
