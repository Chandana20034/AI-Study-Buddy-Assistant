// ==========================================
// Quiz Generator JavaScript with Gamification
// Handles quiz generation, interactive quiz taking, timer, scoring, and power-ups
// ==========================================

const generateQuizForm = document.getElementById('generateQuizForm');
const quizFormSection = document.getElementById('quizForm');
const quizContainer = document.getElementById('quizContainer');
const questionsContainer = document.getElementById('questionsContainer');
const quizTitle = document.getElementById('quizTitle');
const quizProgress = document.getElementById('quizProgress');
const progressPercent = document.getElementById('progressPercent');
const progressFillBar = document.getElementById('progressFillBar');
const submitQuizBtn = document.getElementById('submitQuiz');
const newQuizBtn = document.getElementById('newQuiz');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');
const timerDisplay = document.getElementById('timer');
const currentScoreDisplay = document.getElementById('currentScore');
const streakDisplay = document.getElementById('streak');
const highScoresList = document.getElementById('highScoresList');

// Power-up buttons
const fiftyFiftyBtn = document.getElementById('fiftyFifty');
const skipQuestionBtn = document.getElementById('skipQuestion');
const doublePointsBtn = document.getElementById('doublePoints');

let currentQuiz = null;
let userAnswers = {};
let quizStartTime = null;
let timerInterval = null;
let currentScore = 0;
let currentStreak = 0;
let maxStreak = 0;
let powerUps = {
    fiftyFifty: 2,
    skip: 1,
    doublePoints: 1
};
let doublePointsActive = false;
let currentQuestionIndex = 0;

// Generate quiz
generateQuizForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('=== Quiz Form Submitted ===');

    const topic = document.getElementById('quizTopic').value.trim();
    const content = document.getElementById('quizContent').value.trim();
    const numQuestions = parseInt(document.getElementById('numQuestions').value);

    console.log('Topic:', topic);
    console.log('Content length:', content.length);
    console.log('Number of questions:', numQuestions);

    if (!topic) {
        console.error('No topic provided');
        showNotification('Please enter a topic', 'error');
        return;
    }

    // Check if clientAI is available
    if (!window.clientAI) {
        console.error('clientAI not found!');
        showNotification('AI service not loaded. Please refresh the page.', 'error');
        return;
    }

    console.log('clientAI found:', window.clientAI);

    // Show loading
    questionsContainer.innerHTML = '<div class="loading-spinner" style="margin: 2rem auto;"></div>';
    quizContainer.classList.remove('hidden');

    try {
        console.log('Calling clientAI.generateQuiz()...');

        // Use client-side AI service
        const quiz = await window.clientAI.generateQuiz(topic, content, numQuestions);

        console.log('Quiz generated:', quiz);
        console.log('Number of questions received:', quiz.length);

        currentQuiz = quiz;
        userAnswers = {};
        currentScore = 0;
        currentStreak = 0;
        maxStreak = 0;
        currentQuestionIndex = 0;
        doublePointsActive = false;

        // Reset power-ups
        powerUps = {
            fiftyFifty: 2,
            skip: 1,
            doublePoints: 1
        };
        updatePowerUpCounts();

        displayQuiz(currentQuiz, topic);
        resultsSection.classList.add('hidden');

        // Start timer
        startTimer();

        // Save to activity
        saveActivity('quiz', `Generated quiz: ${topic}`);
        showNotification('Quiz generated successfully!', 'success');
    } catch (error) {
        console.error('Quiz generation error:', error);
        console.error('Error stack:', error.stack);
        questionsContainer.innerHTML = `
            <p style="color: var(--text-muted); text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 1rem; display: block;"></i>
                Unable to generate quiz. Please try again.
                <br><br>
                <small style="color: #94a3b8;">Error: ${error.message}</small>
            </p>
        `;
        showNotification('Failed to generate quiz: ' + error.message, 'error');
    }
});

// Timer functions
function startTimer() {
    quizStartTime = Date.now();
    if (timerInterval) clearInterval(timerInterval);

    timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - quizStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function getElapsedTime() {
    return Math.floor((Date.now() - quizStartTime) / 1000);
}

// Display quiz
function displayQuiz(quiz, topic) {
    quizTitle.textContent = `Quiz: ${topic}`;
    updateProgress(0, quiz.length);
    updateScore(0);
    updateStreak(0);

    questionsContainer.innerHTML = quiz.map((q, index) => `
        <div class="question-card" data-question-index="${index}">
            <div class="question-number">Question ${index + 1}</div>
            <div class="question-text">${q.question}</div>
            <ul class="options-list">
                ${q.options.map((option, optIndex) => `
                    <li class="option-item" data-question="${index}" data-option="${optIndex}">
                        <strong>${String.fromCharCode(65 + optIndex)}.</strong> ${option}
                    </li>
                `).join('')}
            </ul>
        </div>
    `).join('');

    // Add click handlers to options
    document.querySelectorAll('.option-item').forEach(option => {
        option.addEventListener('click', function () {
            const questionIndex = parseInt(this.dataset.question);
            const optionIndex = parseInt(this.dataset.option);

            // Remove selected class from siblings
            this.parentElement.querySelectorAll('.option-item').forEach(opt => {
                opt.classList.remove('selected');
            });

            // Add selected class
            this.classList.add('selected');

            // Store answer
            userAnswers[questionIndex] = optionIndex;

            // Update progress
            const answeredCount = Object.keys(userAnswers).length;
            updateProgress(answeredCount, currentQuiz.length);
        });
    });
}

// Update progress
function updateProgress(answered, total) {
    const percent = Math.round((answered / total) * 100);
    quizProgress.textContent = `Question ${answered} of ${total}`;
    progressPercent.textContent = `${percent}%`;
    progressFillBar.style.width = `${percent}%`;
}

// Update score
function updateScore(score) {
    currentScore = score;
    currentScoreDisplay.textContent = score;
}

// Update streak
function updateStreak(streak) {
    currentStreak = streak;
    streakDisplay.textContent = streak;

    if (streak > maxStreak) {
        maxStreak = streak;
    }

    // Add fire animation for streaks
    if (streak >= 3) {
        streakDisplay.parentElement.style.animation = 'pulse 0.5s ease';
        setTimeout(() => {
            streakDisplay.parentElement.style.animation = '';
        }, 500);
    }
}

// Power-up functions
function updatePowerUpCounts() {
    document.querySelector('#fiftyFifty .power-up-count').textContent = powerUps.fiftyFifty;
    document.querySelector('#skipQuestion .power-up-count').textContent = powerUps.skip;
    document.querySelector('#doublePoints .power-up-count').textContent = powerUps.doublePoints;

    fiftyFiftyBtn.disabled = powerUps.fiftyFifty <= 0;
    skipQuestionBtn.disabled = powerUps.skip <= 0;
    doublePointsBtn.disabled = powerUps.doublePoints <= 0 || doublePointsActive;
}

// 50/50 Power-up
fiftyFiftyBtn?.addEventListener('click', () => {
    if (powerUps.fiftyFifty <= 0) return;

    // Find first unanswered question
    const unansweredIndex = currentQuiz.findIndex((q, idx) => userAnswers[idx] === undefined);
    if (unansweredIndex === -1) {
        showNotification('All questions answered!', 'info');
        return;
    }

    const question = currentQuiz[unansweredIndex];
    const correctAnswer = question.correct;
    const options = document.querySelectorAll(`[data-question="${unansweredIndex}"]`);

    let removed = 0;
    options.forEach((option, idx) => {
        if (idx !== correctAnswer && removed < 2) {
            option.style.opacity = '0.3';
            option.style.pointerEvents = 'none';
            option.style.textDecoration = 'line-through';
            removed++;
        }
    });

    powerUps.fiftyFifty--;
    updatePowerUpCounts();
    showNotification('50/50 used! 2 wrong answers removed', 'success');
});

// Skip Question Power-up
skipQuestionBtn?.addEventListener('click', () => {
    if (powerUps.skip <= 0) return;

    const unansweredIndex = currentQuiz.findIndex((q, idx) => userAnswers[idx] === undefined);
    if (unansweredIndex === -1) {
        showNotification('All questions answered!', 'info');
        return;
    }

    // Mark as skipped (use -1)
    userAnswers[unansweredIndex] = -1;

    const answeredCount = Object.keys(userAnswers).length;
    updateProgress(answeredCount, currentQuiz.length);

    powerUps.skip--;
    updatePowerUpCounts();
    showNotification('Question skipped!', 'info');
});

// Double Points Power-up
doublePointsBtn?.addEventListener('click', () => {
    if (powerUps.doublePoints <= 0 || doublePointsActive) return;

    doublePointsActive = true;
    doublePointsBtn.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(236, 72, 153, 0.3))';
    doublePointsBtn.style.borderColor = '#22c55e';

    powerUps.doublePoints--;
    updatePowerUpCounts();
    showNotification('2x Points active for next correct answer!', 'success');
});

// Submit quiz
submitQuizBtn?.addEventListener('click', () => {
    const answeredQuestions = Object.keys(userAnswers).filter(idx => userAnswers[idx] !== -1);

    if (answeredQuestions.length < currentQuiz.length - powerUps.skip) {
        showNotification('Please answer all questions before submitting', 'error');
        return;
    }

    stopTimer();
    const timeElapsed = getElapsedTime();

    // Calculate score with bonuses
    let correct = 0;
    let points = 0;
    let streak = 0;

    currentQuiz.forEach((q, index) => {
        const userAnswer = userAnswers[index];

        if (userAnswer === -1) {
            // Skipped question
            return;
        }

        if (userAnswer === q.correct) {
            correct++;

            // Base points
            let questionPoints = 100;

            // Time bonus (faster = more points)
            const avgTimePerQuestion = timeElapsed / currentQuiz.length;
            if (avgTimePerQuestion < 10) questionPoints += 50;
            else if (avgTimePerQuestion < 20) questionPoints += 25;

            // Streak bonus
            streak++;
            if (streak >= 3) questionPoints += 25 * streak;

            // Double points if active
            if (doublePointsActive && points === 0) {
                questionPoints *= 2;
                doublePointsActive = false;
            }

            points += questionPoints;
        } else {
            streak = 0;
        }
    });

    const percentage = Math.round((correct / currentQuiz.length) * 100);

    // Display results
    displayResults(percentage, correct, currentQuiz.length, points, timeElapsed);

    // Save high score
    saveHighScore(quizTitle.textContent, points, percentage, timeElapsed);

    // Highlight correct/incorrect answers
    document.querySelectorAll('.option-item').forEach(option => {
        const questionIndex = parseInt(option.dataset.question);
        const optionIndex = parseInt(option.dataset.option);

        if (optionIndex === currentQuiz[questionIndex].correct) {
            option.classList.add('correct');
        } else if (optionIndex === userAnswers[questionIndex] && optionIndex !== currentQuiz[questionIndex].correct) {
            option.classList.add('incorrect');
        }

        // Disable clicking
        option.style.cursor = 'default';
        option.onclick = null;
    });

    submitQuizBtn.disabled = true;
    submitQuizBtn.style.opacity = '0.5';
});

// Display results
function displayResults(percentage, correct, total, points, timeElapsed) {
    const minutes = Math.floor(timeElapsed / 60);
    const seconds = timeElapsed % 60;
    const timeString = `${minutes}:${String(seconds).padStart(2, '0')}`;

    const grade = percentage >= 90 ? 'Excellent!' : percentage >= 70 ? 'Good Job!' : percentage >= 50 ? 'Not Bad!' : 'Keep Practicing!';
    const gradeColor = percentage >= 90 ? '#22c55e' : percentage >= 70 ? '#3b82f6' : percentage >= 50 ? '#f59e0b' : '#ef4444';

    resultsContent.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <div style="font-size: 4rem; font-weight: 700; background: linear-gradient(135deg, #3b82f6 0%, #ec4899 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; margin-bottom: 1rem;">
                ${percentage}%
            </div>
            <div style="font-size: 1.5rem; color: ${gradeColor}; font-weight: 600; margin-bottom: 1rem;">
                ${grade}
            </div>
            <div style="color: var(--text-secondary); font-size: 1.1rem; margin-bottom: 2rem;">
                You got ${correct} out of ${total} questions correct
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-top: 2rem;">
                <div style="background: rgba(59, 130, 246, 0.1); padding: 1rem; border-radius: 0.75rem; border: 1px solid rgba(59, 130, 246, 0.3);">
                    <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Total Points</div>
                    <div style="color: var(--secondary-blue); font-size: 1.8rem; font-weight: 700;">${points}</div>
                </div>
                <div style="background: rgba(236, 72, 153, 0.1); padding: 1rem; border-radius: 0.75rem; border: 1px solid rgba(236, 72, 153, 0.3);">
                    <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Time</div>
                    <div style="color: var(--primary-pink); font-size: 1.8rem; font-weight: 700;">${timeString}</div>
                </div>
                <div style="background: rgba(251, 191, 36, 0.1); padding: 1rem; border-radius: 0.75rem; border: 1px solid rgba(251, 191, 36, 0.3);">
                    <div style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 0.25rem;">Max Streak</div>
                    <div style="color: #fbbf24; font-size: 1.8rem; font-weight: 700;">${maxStreak}</div>
                </div>
            </div>
        </div>
    `;

    resultsSection.classList.remove('hidden');
    displayHighScores();
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// High score functions
function saveHighScore(topic, points, percentage, time) {
    const highScores = JSON.parse(localStorage.getItem('quizHighScores') || '[]');

    highScores.push({
        topic,
        points,
        percentage,
        time,
        date: new Date().toISOString()
    });

    // Sort by points and keep top 10
    highScores.sort((a, b) => b.points - a.points);
    highScores.splice(10);

    localStorage.setItem('quizHighScores', JSON.stringify(highScores));
}

function displayHighScores() {
    const highScores = JSON.parse(localStorage.getItem('quizHighScores') || '[]');

    if (highScores.length === 0) {
        highScoresList.innerHTML = '<p style="color: var(--text-muted); text-align: center;">No high scores yet. Be the first!</p>';
        return;
    }

    highScoresList.innerHTML = highScores.map((score, index) => {
        const date = new Date(score.date).toLocaleDateString();
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

        return `
            <div class="high-score-item">
                <div class="high-score-rank">${medal || `#${index + 1}`}</div>
                <div class="high-score-details">
                    <div class="high-score-topic">${score.topic}</div>
                    <div class="high-score-date">${date} • ${score.percentage}%</div>
                </div>
                <div class="high-score-score">${score.points}</div>
            </div>
        `;
    }).join('');
}

// New quiz
newQuizBtn?.addEventListener('click', () => {
    quizContainer.classList.add('hidden');
    resultsSection.classList.add('hidden');
    generateQuizForm.reset();
    submitQuizBtn.disabled = false;
    submitQuizBtn.style.opacity = '1';
    stopTimer();
    timerDisplay.textContent = '00:00';
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
