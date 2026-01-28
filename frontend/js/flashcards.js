// ==========================================
// Flashcards JavaScript
// Handles flashcard generation and interactive study
// ==========================================

const generateFlashcardsForm = document.getElementById('generateFlashcardsForm');
const flashcardFormSection = document.getElementById('flashcardForm');
const flashcardsStudy = document.getElementById('flashcardsStudy');
const flashcard = document.getElementById('flashcard');
const flashcardQuestion = document.getElementById('flashcardQuestion');
const flashcardAnswer = document.getElementById('flashcardAnswer');
const flashcardSetTitle = document.getElementById('flashcardSetTitle');
const cardProgress = document.getElementById('cardProgress');
const prevCardBtn = document.getElementById('prevCard');
const nextCardBtn = document.getElementById('nextCard');
const flipCardBtn = document.getElementById('flipCard');
const newFlashcardsBtn = document.getElementById('newFlashcards');

let currentFlashcards = [];
let currentCardIndex = 0;

// Generate flashcards
generateFlashcardsForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const topic = document.getElementById('flashcardTopic').value.trim();
    const content = document.getElementById('flashcardContent').value.trim();
    const numCards = parseInt(document.getElementById('numCards').value);

    if (!topic) {
        showNotification('Please enter a topic', 'error');
        return;
    }

    // Show loading
    flashcardQuestion.innerHTML = '<div class="loading-spinner"></div>';
    flashcardsStudy.classList.remove('hidden');

    try {
        // Use client-side AI service
        const flashcards = await window.clientAI.generateFlashcards(topic, content, numCards);

        currentFlashcards = flashcards;
        currentCardIndex = 0;
        flashcardSetTitle.textContent = `Flashcards: ${topic}`;
        displayFlashcard(0);

        // Save to activity
        saveActivity('flashcard', `Created flashcards: ${topic}`);
        showNotification('Flashcards generated successfully!', 'success');
    } catch (error) {
        console.error('Flashcard generation error:', error);
        flashcardQuestion.innerHTML = `
            <p style="color: var(--text-muted); text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 1rem; display: block;"></i>
                Unable to generate flashcards. Please try again.
            </p>
        `;
        showNotification('Failed to connect to AI service', 'error');
    }
});

// Display flashcard
function displayFlashcard(index) {
    if (index < 0 || index >= currentFlashcards.length) return;

    currentCardIndex = index;
    const card = currentFlashcards[index];

    // Reset flip state
    flashcard.classList.remove('flipped');

    // Update content
    flashcardQuestion.textContent = card.question;
    flashcardAnswer.textContent = card.answer;

    // Update progress
    cardProgress.textContent = `Card ${index + 1} of ${currentFlashcards.length}`;

    // Update button states
    prevCardBtn.disabled = index === 0;
    nextCardBtn.disabled = index === currentFlashcards.length - 1;

    prevCardBtn.style.opacity = index === 0 ? '0.5' : '1';
    nextCardBtn.style.opacity = index === currentFlashcards.length - 1 ? '0.5' : '1';
}

// Flip card
flashcard?.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

flipCardBtn?.addEventListener('click', () => {
    flashcard.classList.toggle('flipped');
});

// Navigation
prevCardBtn?.addEventListener('click', () => {
    if (currentCardIndex > 0) {
        displayFlashcard(currentCardIndex - 1);
    }
});

nextCardBtn?.addEventListener('click', () => {
    if (currentCardIndex < currentFlashcards.length - 1) {
        displayFlashcard(currentCardIndex + 1);
    }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (!flashcardsStudy.classList.contains('hidden')) {
        if (e.key === 'ArrowLeft' && currentCardIndex > 0) {
            displayFlashcard(currentCardIndex - 1);
        } else if (e.key === 'ArrowRight' && currentCardIndex < currentFlashcards.length - 1) {
            displayFlashcard(currentCardIndex + 1);
        } else if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            flashcard.classList.toggle('flipped');
        }
    }
});

// New flashcards
newFlashcardsBtn?.addEventListener('click', () => {
    flashcardsStudy.classList.add('hidden');
    generateFlashcardsForm.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
