# ==========================================
# Django Models
# User, Note, Quiz, Flashcard, and UserProgress models
# ==========================================

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone


class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser
    """
    email = models.EmailField(unique=True)
    role = models.CharField(max_length=50, default='student')
    created_at = models.DateTimeField(default=timezone.now)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
    def __str__(self):
        return self.email


class Note(models.Model):
    """
    Model for storing user's uploaded or saved notes
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    title = models.CharField(max_length=255)
    content = models.TextField()
    file_path = models.CharField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.user.email}"


class Quiz(models.Model):
    """
    Model for storing generated quizzes
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='quizzes')
    topic = models.CharField(max_length=255)
    questions_json = models.JSONField()  # Store quiz questions as JSON
    score = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'Quizzes'
    
    def __str__(self):
        return f"Quiz: {self.topic} - {self.user.email}"


class Flashcard(models.Model):
    """
    Model for storing generated flashcards
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='flashcards')
    topic = models.CharField(max_length=255)
    cards_json = models.JSONField()  # Store flashcards as JSON
    created_at = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Flashcards: {self.topic} - {self.user.email}"


class UserProgress(models.Model):
    """
    Model for tracking user activity and progress
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress')
    activity_type = models.CharField(max_length=50)  # 'explain', 'summarize', 'quiz', 'flashcard'
    activity_data = models.JSONField()  # Store activity details as JSON
    timestamp = models.DateTimeField(default=timezone.now)
    
    class Meta:
        ordering = ['-timestamp']
        verbose_name_plural = 'User Progress'
    
    def __str__(self):
        return f"{self.user.email} - {self.activity_type} - {self.timestamp}"
