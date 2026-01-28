# Django Admin Configuration

from django.contrib import admin
from .models import User, Note, Quiz, Flashcard, UserProgress

admin.site.register(User)
admin.site.register(Note)
admin.site.register(Quiz)
admin.site.register(Flashcard)
admin.site.register(UserProgress)
