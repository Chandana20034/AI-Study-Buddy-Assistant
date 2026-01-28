# ==========================================
# Django Views
# API endpoints for user management and data storage
# ==========================================

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth import authenticate
from django.db import IntegrityError
from .models import User, Note, Quiz, Flashcard, UserProgress
from .serializers import (
    UserSerializer, UserRegistrationSerializer, UserLoginSerializer,
    NoteSerializer, QuizSerializer, FlashcardSerializer, UserProgressSerializer
)


@api_view(['POST'])
def register_user(request):
    """
    Register a new user
    POST /api/register/
    Body: { "username": str, "email": str, "password": str, "role": str }
    """
    try:
        serializer = UserRegistrationSerializer(data=request.data)
        
        if serializer.is_valid():
            # Check if email already exists
            if User.objects.filter(email=serializer.validated_data['email']).exists():
                return Response({
                    'success': False,
                    'message': 'Email already registered'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Create user
            user = serializer.save()
            
            return Response({
                'success': True,
                'message': 'Registration successful',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        
        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def login_user(request):
    """
    Login user
    POST /api/login/
    Body: { "email": str, "password": str }
    """
    try:
        serializer = UserLoginSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            
            # Get user by email
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                return Response({
                    'success': False,
                    'message': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
            
            # Check password
            if user.check_password(password):
                return Response({
                    'success': True,
                    'message': 'Login successful',
                    'user': UserSerializer(user).data,
                    'token': f'token_{user.id}'  # Simple token (use JWT in production)
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'success': False,
                    'message': 'Invalid email or password'
                }, status=status.HTTP_401_UNAUTHORIZED)
        
        return Response({
            'success': False,
            'message': 'Invalid data',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)
        
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def save_note(request):
    """
    Save a note
    POST /api/notes/save/
    Body: { "user_id": int, "title": str, "content": str }
    """
    try:
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        
        note = Note.objects.create(
            user=user,
            title=request.data.get('title', 'Untitled'),
            content=request.data.get('content', '')
        )
        
        return Response({
            'success': True,
            'note': NoteSerializer(note).data
        }, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def save_quiz(request):
    """
    Save a quiz
    POST /api/quiz/save/
    Body: { "user_id": int, "topic": str, "questions_json": object, "score": int }
    """
    try:
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        
        quiz = Quiz.objects.create(
            user=user,
            topic=request.data.get('topic', 'Untitled Quiz'),
            questions_json=request.data.get('questions_json', []),
            score=request.data.get('score')
        )
        
        return Response({
            'success': True,
            'quiz': QuizSerializer(quiz).data
        }, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def save_flashcards(request):
    """
    Save flashcards
    POST /api/flashcards/save/
    Body: { "user_id": int, "topic": str, "cards_json": object }
    """
    try:
        user_id = request.data.get('user_id')
        user = User.objects.get(id=user_id)
        
        flashcard = Flashcard.objects.create(
            user=user,
            topic=request.data.get('topic', 'Untitled Flashcards'),
            cards_json=request.data.get('cards_json', [])
        )
        
        return Response({
            'success': True,
            'flashcard': FlashcardSerializer(flashcard).data
        }, status=status.HTTP_201_CREATED)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def get_user_history(request, user_id):
    """
    Get user's activity history
    GET /api/history/<user_id>/
    """
    try:
        user = User.objects.get(id=user_id)
        
        notes = Note.objects.filter(user=user)[:10]
        quizzes = Quiz.objects.filter(user=user)[:10]
        flashcards = Flashcard.objects.filter(user=user)[:10]
        
        return Response({
            'success': True,
            'notes': NoteSerializer(notes, many=True).data,
            'quizzes': QuizSerializer(quizzes, many=True).data,
            'flashcards': FlashcardSerializer(flashcards, many=True).data
        }, status=status.HTTP_200_OK)
        
    except User.DoesNotExist:
        return Response({
            'success': False,
            'message': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'message': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def health_check(request):
    """Health check endpoint"""
    return Response({
        'status': 'healthy',
        'service': 'AI Study Assistant - Django Backend'
    }, status=status.HTTP_200_OK)
