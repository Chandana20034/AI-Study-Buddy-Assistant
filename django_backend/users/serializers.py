# ==========================================
# Django REST Framework Serializers
# For data validation and serialization
# ==========================================

from rest_framework import serializers
from .models import User, Note, Quiz, Flashcard, UserProgress


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'student')
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class NoteSerializer(serializers.ModelSerializer):
    """Serializer for Note model"""
    
    class Meta:
        model = Note
        fields = ['id', 'title', 'content', 'file_path', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class QuizSerializer(serializers.ModelSerializer):
    """Serializer for Quiz model"""
    
    class Meta:
        model = Quiz
        fields = ['id', 'topic', 'questions_json', 'score', 'created_at']
        read_only_fields = ['id', 'created_at']


class FlashcardSerializer(serializers.ModelSerializer):
    """Serializer for Flashcard model"""
    
    class Meta:
        model = Flashcard
        fields = ['id', 'topic', 'cards_json', 'created_at']
        read_only_fields = ['id', 'created_at']


class UserProgressSerializer(serializers.ModelSerializer):
    """Serializer for UserProgress model"""
    
    class Meta:
        model = UserProgress
        fields = ['id', 'activity_type', 'activity_data', 'timestamp']
        read_only_fields = ['id', 'timestamp']
