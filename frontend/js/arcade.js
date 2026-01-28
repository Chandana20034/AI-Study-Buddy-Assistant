// ==========================================
// Learning Arcade JavaScript
// Handles educational games
// ==========================================

// Game state
const gameState = {
    currentGame: null,
    totalScore: 0,
    stats: {
        memory: { played: 0, best: 0 },
        speedquiz: { played: 0, best: 0 },
        scramble: { played: 0, best: 0 }
    }
};

// Memory Match game state
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;

// Speed Quiz game state
let quizQuestions = [];
let currentQuestionIndex = 0;
let quizScore = 0;
let quizTimeLeft = 30;
let quizTimer = null;

// Word Scramble game state
let scrambleWords = [];
let currentWordIndex = 0;
let scrambleScore = 0;
let scrambleLevel = 1;

// Study terms for games
const studyTerms = [
    { term: 'Algorithm', definition: 'Step-by-step procedure for solving a problem' },
    { term: 'Variable', definition: 'Named storage location in memory' },
    { term: 'Function', definition: 'Reusable block of code' },
    { term: 'Loop', definition: 'Repeating structure in programming' },
    { term: 'Array', definition: 'Collection of elements' },
    { term: 'Object', definition: 'Data structure with properties' },
    { term: 'Class', definition: 'Blueprint for creating objects' },
    { term: 'Method', definition: 'Function associated with an object' }
];

// Quiz questions
const quizData = [
    { question: 'What is HTML?', options: ['Hypertext Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], correct: 0 },
    { question: 'What does CSS stand for?', options: ['Computer Style Sheets', 'Cascading Style Sheets', 'Creative Style Sheets', 'Colorful Style Sheets'], correct: 1 },
    { question: 'Which language is used for web apps?', options: ['PHP', 'Python', 'JavaScript', 'All of the above'], correct: 3 },
    { question: 'What is a variable?', options: ['A function', 'A storage location', 'A loop', 'An operator'], correct: 1 },
    { question: 'What is an array?', options: ['A single value', 'A collection of values', 'A function', 'A loop'], correct: 1 },
    { question: 'What does API stand for?', options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Interface', 'Advanced Process Interface'], correct: 0 },
    { question: 'What is a loop?', options: ['A variable', 'A function', 'A repeating structure', 'An object'], correct: 2 },
    { question: 'What is debugging?', options: ['Writing code', 'Finding and fixing errors', 'Running code', 'Deleting code'], correct: 1 }
];

// Words for scramble game
const scrambleData = [
    { word: 'ALGORITHM', hint: 'Step-by-step procedure' },
    { word: 'FUNCTION', hint: 'Reusable code block' },
    { word: 'VARIABLE', hint: 'Storage location' },
    { word: 'DATABASE', hint: 'Organized data collection' },
    { word: 'NETWORK', hint: 'Connected computers' },
    { word: 'PROTOCOL', hint: 'Communication rules' },
    { word: 'COMPILER', hint: 'Code translator' },
    { word: 'DEBUGGING', hint: 'Finding errors' }
];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadGameStats();
    updateStatsDisplay();
    loadLeaderboard();
});

function loadGameStats() {
    const saved = utils.storage.get('arcadeStats', null);
    if (saved) {
        Object.assign(gameState, saved);
    }
}

function saveGameStats() {
    utils.storage.set('arcadeStats', gameState);
    updateStatsDisplay();
}

function updateStatsDisplay() {
    document.getElementById('totalScore').textContent = gameState.totalScore;
    document.getElementById('memoryPlayed').textContent = gameState.stats.memory.played;
    document.getElementById('memoryBest').textContent = gameState.stats.memory.best;
    document.getElementById('quizPlayed').textContent = gameState.stats.speedquiz.played;
    document.getElementById('quizBest').textContent = gameState.stats.speedquiz.best;
    document.getElementById('scramblePlayed').textContent = gameState.stats.scramble.played;
    document.getElementById('scrambleBest').textContent = gameState.stats.scramble.best;
}

function startGame(gameType) {
    gameState.currentGame = gameType;

    // Hide game selection
    document.getElementById('gameSelection').style.display = 'none';

    // Show selected game
    switch (gameType) {
        case 'memory':
            document.getElementById('memoryGame').style.display = 'block';
            initMemoryGame();
            break;
        case 'speedquiz':
            document.getElementById('speedQuizGame').style.display = 'block';
            initSpeedQuiz();
            break;
        case 'scramble':
            document.getElementById('scrambleGame').style.display = 'block';
            initScrambleGame();
            break;
    }
}

function backToGames() {
    // Hide all games
    document.getElementById('memoryGame').style.display = 'none';
    document.getElementById('speedQuizGame').style.display = 'none';
    document.getElementById('scrambleGame').style.display = 'none';

    // Show game selection
    document.getElementById('gameSelection').style.display = 'block';

    // Clear any timers
    if (quizTimer) {
        clearInterval(quizTimer);
        quizTimer = null;
    }
}

// ==================== MEMORY MATCH GAME ====================

function initMemoryGame() {
    matchedPairs = 0;
    moves = 0;
    flippedCards = [];

    document.getElementById('moves').textContent = '0';
    document.getElementById('matches').textContent = '0/8';

    // Create card pairs
    memoryCards = [];
    studyTerms.forEach((item, index) => {
        memoryCards.push({ id: index * 2, content: item.term, pairId: index });
        memoryCards.push({ id: index * 2 + 1, content: item.definition, pairId: index });
    });

    // Shuffle cards
    memoryCards = memoryCards.sort(() => Math.random() - 0.5);

    // Render board
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';

    memoryCards.forEach((card, index) => {
        const cardEl = document.createElement('div');
        cardEl.className = 'memory-card';
        cardEl.dataset.id = card.id;
        cardEl.dataset.pairId = card.pairId;
        cardEl.textContent = '?';
        cardEl.addEventListener('click', () => flipCard(index, cardEl));
        board.appendChild(cardEl);
    });
}

function flipCard(index, cardEl) {
    if (flippedCards.length === 2 || cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) {
        return;
    }

    cardEl.classList.add('flipped');
    cardEl.textContent = memoryCards[index].content;
    flippedCards.push({ index, cardEl, pairId: memoryCards[index].pairId });

    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;

        setTimeout(() => checkMatch(), 1000);
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;

    if (card1.pairId === card2.pairId) {
        // Match found
        card1.cardEl.classList.add('matched');
        card2.cardEl.classList.add('matched');
        matchedPairs++;
        document.getElementById('matches').textContent = `${matchedPairs}/8`;

        if (matchedPairs === 8) {
            endMemoryGame();
        }
    } else {
        // No match
        card1.cardEl.classList.remove('flipped');
        card2.cardEl.classList.remove('flipped');
        card1.cardEl.textContent = '?';
        card2.cardEl.textContent = '?';
    }

    flippedCards = [];
}

function endMemoryGame() {
    const score = Math.max(100 - moves * 5, 10);
    gameState.totalScore += score;
    gameState.stats.memory.played++;

    if (score > gameState.stats.memory.best) {
        gameState.stats.memory.best = score;
    }

    saveGameStats();
    saveToLeaderboard('Memory Match', score);

    showNotification(`Congratulations! You completed the game in ${moves} moves. Score: ${score}`, 'success');

    setTimeout(() => backToGames(), 2000);
}

// ==================== SPEED QUIZ GAME ====================

function initSpeedQuiz() {
    quizScore = 0;
    quizTimeLeft = 30;
    currentQuestionIndex = 0;

    document.getElementById('quizScore').textContent = '0';
    document.getElementById('quizTimer').textContent = '30';

    // Shuffle questions
    quizQuestions = [...quizData].sort(() => Math.random() - 0.5);

    // Start timer
    quizTimer = setInterval(() => {
        quizTimeLeft--;
        document.getElementById('quizTimer').textContent = quizTimeLeft;

        if (quizTimeLeft <= 0) {
            endSpeedQuiz();
        }
    }, 1000);

    showQuizQuestion();
}

function showQuizQuestion() {
    if (currentQuestionIndex >= quizQuestions.length) {
        currentQuestionIndex = 0;
        quizQuestions = quizQuestions.sort(() => Math.random() - 0.5);
    }

    const question = quizQuestions[currentQuestionIndex];
    document.getElementById('questionText').textContent = question.question;

    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const optionEl = document.createElement('div');
        optionEl.className = 'quiz-option';
        optionEl.textContent = option;
        optionEl.addEventListener('click', () => checkQuizAnswer(index, optionEl));
        optionsContainer.appendChild(optionEl);
    });
}

function checkQuizAnswer(selectedIndex, optionEl) {
    const question = quizQuestions[currentQuestionIndex];
    const options = document.querySelectorAll('.quiz-option');

    // Disable all options
    options.forEach(opt => opt.style.pointerEvents = 'none');

    if (selectedIndex === question.correct) {
        optionEl.classList.add('correct');
        quizScore += 10;
        document.getElementById('quizScore').textContent = quizScore;
    } else {
        optionEl.classList.add('incorrect');
        options[question.correct].classList.add('correct');
    }

    setTimeout(() => {
        currentQuestionIndex++;
        showQuizQuestion();
    }, 1000);
}

function endSpeedQuiz() {
    clearInterval(quizTimer);
    quizTimer = null;

    gameState.totalScore += quizScore;
    gameState.stats.speedquiz.played++;

    if (quizScore > gameState.stats.speedquiz.best) {
        gameState.stats.speedquiz.best = quizScore;
    }

    saveGameStats();
    saveToLeaderboard('Speed Quiz', quizScore);

    showNotification(`Time's up! Final Score: ${quizScore}`, 'success');

    setTimeout(() => backToGames(), 2000);
}

// ==================== WORD SCRAMBLE GAME ====================

function initScrambleGame() {
    scrambleScore = 0;
    scrambleLevel = 1;
    currentWordIndex = 0;

    document.getElementById('scrambleScore').textContent = '0';
    document.getElementById('scrambleLevel').textContent = '1';

    scrambleWords = [...scrambleData].sort(() => Math.random() - 0.5);

    showScrambleWord();
}

function showScrambleWord() {
    if (currentWordIndex >= scrambleWords.length) {
        endScrambleGame();
        return;
    }

    const wordData = scrambleWords[currentWordIndex];
    const scrambled = scrambleWord(wordData.word);

    document.getElementById('scrambledWord').textContent = scrambled;
    document.getElementById('scrambleHint').textContent = `Hint: ${wordData.hint}`;
    document.getElementById('scrambleInput').value = '';
    document.getElementById('scrambleInput').focus();
}

function scrambleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function checkScramble() {
    const input = document.getElementById('scrambleInput').value.toUpperCase().trim();
    const correctWord = scrambleWords[currentWordIndex].word;

    if (input === correctWord) {
        const points = scrambleLevel * 10;
        scrambleScore += points;
        document.getElementById('scrambleScore').textContent = scrambleScore;

        showNotification(`Correct! +${points} points`, 'success');

        currentWordIndex++;
        scrambleLevel++;
        document.getElementById('scrambleLevel').textContent = scrambleLevel;

        setTimeout(() => showScrambleWord(), 1000);
    } else {
        showNotification('Incorrect! Try again', 'error');
    }
}

function endScrambleGame() {
    gameState.totalScore += scrambleScore;
    gameState.stats.scramble.played++;

    if (scrambleScore > gameState.stats.scramble.best) {
        gameState.stats.scramble.best = scrambleScore;
    }

    saveGameStats();
    saveToLeaderboard('Word Scramble', scrambleScore);

    showNotification(`Game Complete! Final Score: ${scrambleScore}`, 'success');

    setTimeout(() => backToGames(), 2000);
}

// Add Enter key support for scramble
document.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && gameState.currentGame === 'scramble') {
        checkScramble();
    }
});

// ==================== LEADERBOARD ====================

function saveToLeaderboard(game, score) {
    const entry = {
        game,
        score,
        date: new Date().toISOString()
    };

    const leaderboard = utils.storage.get('arcadeLeaderboard', []);
    leaderboard.push(entry);

    // Keep only top 10
    leaderboard.sort((a, b) => b.score - a.score);
    const top10 = leaderboard.slice(0, 10);

    utils.storage.set('arcadeLeaderboard', top10);
    loadLeaderboard();
}

function loadLeaderboard() {
    const leaderboard = utils.storage.get('arcadeLeaderboard', []);
    const container = document.getElementById('leaderboard');

    if (leaderboard.length === 0) {
        container.innerHTML = `
            <p style="text-align: center; color: var(--text-muted); padding: 2rem;">
                <i class="fas fa-trophy" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                No scores yet. Play games to appear on the leaderboard!
            </p>
        `;
        return;
    }

    const items = leaderboard.map((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
        return `
            <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem; display: flex; justify-content: space-between; align-items: center;">
                <div style="display: flex; align-items: center; gap: 1rem;">
                    <span style="font-size: 1.5rem; min-width: 40px;">${medal}</span>
                    <div>
                        <h4 style="color: var(--text-primary); margin-bottom: 0.25rem;">${entry.game}</h4>
                        <p style="color: var(--text-muted); font-size: 0.85rem;">${new Date(entry.date).toLocaleDateString()}</p>
                    </div>
                </div>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--secondary-blue);">
                    ${entry.score}
                </div>
            </div>
        `;
    }).join('');

    container.innerHTML = items;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}
