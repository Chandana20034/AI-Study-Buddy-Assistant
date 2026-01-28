// Progress Tracker JavaScript
// Manages progress tracking, charts, and achievements

// Initialize progress data from localStorage
const progressData = {
    studyStreak: 0,
    totalTime: 0,
    completedSessions: 0,
    quizScores: [],
    sessions: [],
    achievements: [],
    weeklyActivity: [0, 0, 0, 0, 0, 0, 0], // Last 7 days
    featureUsage: {
        chat: 0,
        tutor: 0,
        explainer: 0,
        summarizer: 0,
        quiz: 0,
        flashcards: 0,
        essay: 0
    }
};

// Load data from localStorage
function loadProgressData() {
    const saved = localStorage.getItem('progressData');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(progressData, data);
    }
    updateUI();
}

// Save data to localStorage
function saveProgressData() {
    localStorage.setItem('progressData', JSON.stringify(progressData));
}

// Update UI with current data
function updateUI() {
    // Update stats
    document.getElementById('studyStreak').textContent = progressData.studyStreak;
    document.getElementById('totalTime').textContent = formatTime(progressData.totalTime);
    document.getElementById('completedSessions').textContent = progressData.completedSessions;

    const avgScore = progressData.quizScores.length > 0
        ? Math.round(progressData.quizScores.reduce((a, b) => a + b, 0) / progressData.quizScores.length)
        : 0;
    document.getElementById('averageScore').textContent = avgScore + '%';

    // Update charts
    createWeeklyActivityChart();
    createFeatureUsageChart();
    createQuizPerformanceChart();

    // Update recent sessions
    displayRecentSessions();

    // Update achievements
    displayAchievements();
}

// Format time in hours
function formatTime(minutes) {
    if (minutes < 60) return minutes + 'm';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

// Create Weekly Activity Chart
function createWeeklyActivityChart() {
    const ctx = document.getElementById('weeklyActivityChart');
    if (!ctx) return;

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date().getDay();
    const labels = [];
    for (let i = 6; i >= 0; i--) {
        labels.push(days[(today - i + 7) % 7]);
    }

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Study Time (minutes)',
                data: progressData.weeklyActivity,
                backgroundColor: 'rgba(59, 130, 246, 0.6)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#cbd5e1' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Create Feature Usage Chart
function createFeatureUsageChart() {
    const ctx = document.getElementById('featureUsageChart');
    if (!ctx) return;

    const data = Object.values(progressData.featureUsage);
    const total = data.reduce((a, b) => a + b, 0);

    if (total === 0) {
        // Show placeholder if no data
        ctx.getContext('2d').fillStyle = '#cbd5e1';
        ctx.getContext('2d').font = '16px Inter';
        ctx.getContext('2d').textAlign = 'center';
        ctx.getContext('2d').fillText('No data yet', ctx.width / 2, ctx.height / 2);
        return;
    }

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Chat', 'Tutor', 'Explainer', 'Summarizer', 'Quiz', 'Flashcards', 'Essay'],
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(236, 72, 153, 0.8)',
                    'rgba(139, 92, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(99, 102, 241, 0.8)'
                ],
                borderWidth: 2,
                borderColor: '#1e293b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#cbd5e1', padding: 15 }
                }
            }
        }
    });
}

// Create Quiz Performance Chart
function createQuizPerformanceChart() {
    const ctx = document.getElementById('quizPerformanceChart');
    if (!ctx) return;

    const scores = progressData.quizScores.slice(-10); // Last 10 quizzes
    const labels = scores.map((_, i) => `Quiz ${i + 1}`);

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Score (%)',
                data: scores,
                borderColor: 'rgba(236, 72, 153, 1)',
                backgroundColor: 'rgba(236, 72, 153, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: 'rgba(236, 72, 153, 1)',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#cbd5e1' }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                },
                x: {
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(255, 255, 255, 0.1)' }
                }
            }
        }
    });
}

// Display Recent Sessions
function displayRecentSessions() {
    const container = document.getElementById('recentSessions');
    if (!container) return;

    if (progressData.sessions.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-inbox" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>No sessions yet. Start studying to see your activity here!</p>
            </div>
        `;
        return;
    }

    const recentSessions = progressData.sessions.slice(-5).reverse();
    container.innerHTML = recentSessions.map(session => `
        <div class="session-item">
            <div class="session-icon">
                <i class="fas ${getFeatureIcon(session.feature)}"></i>
            </div>
            <div class="session-details">
                <h4>${session.feature}</h4>
                <p>${session.description}</p>
                <span class="session-time">${formatDate(session.timestamp)}</span>
            </div>
            <div class="session-duration">
                ${session.duration ? formatTime(session.duration) : ''}
            </div>
        </div>
    `).join('');
}

// Display Achievements
function displayAchievements() {
    const container = document.getElementById('achievementsList');
    if (!container) return;

    const allAchievements = [
        { id: 'first_session', icon: 'fa-star', title: 'First Steps', description: 'Complete your first study session', unlocked: progressData.completedSessions >= 1 },
        { id: 'streak_3', icon: 'fa-fire', title: '3-Day Streak', description: 'Study for 3 days in a row', unlocked: progressData.studyStreak >= 3 },
        { id: 'streak_7', icon: 'fa-fire-alt', title: 'Week Warrior', description: 'Study for 7 days in a row', unlocked: progressData.studyStreak >= 7 },
        { id: 'quiz_master', icon: 'fa-graduation-cap', title: 'Quiz Master', description: 'Score 90% or higher on a quiz', unlocked: progressData.quizScores.some(s => s >= 90) },
        { id: 'time_10h', icon: 'fa-clock', title: 'Dedicated Learner', description: 'Study for 10 hours total', unlocked: progressData.totalTime >= 600 },
        { id: 'all_features', icon: 'fa-trophy', title: 'Explorer', description: 'Try all features', unlocked: Object.values(progressData.featureUsage).every(v => v > 0) }
    ];

    container.innerHTML = allAchievements.map(achievement => `
        <div class="achievement-badge ${achievement.unlocked ? 'unlocked' : 'locked'}">
            <div class="achievement-icon">
                <i class="fas ${achievement.icon}"></i>
            </div>
            <h4>${achievement.title}</h4>
            <p>${achievement.description}</p>
            ${achievement.unlocked ? '<span class="unlocked-label">✓ Unlocked</span>' : ''}
        </div>
    `).join('');
}

// Helper Functions
function getFeatureIcon(feature) {
    const icons = {
        'Chat': 'fa-comments',
        'Tutor': 'fa-chalkboard-teacher',
        'Explainer': 'fa-lightbulb',
        'Summarizer': 'fa-file-alt',
        'Quiz': 'fa-question-circle',
        'Flashcards': 'fa-layer-group',
        'Essay': 'fa-pen-fancy'
    };
    return icons[feature] || 'fa-book';
}

function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
}

// Public API for other pages to log activity
window.logStudyActivity = function (feature, description, duration = 0, score = null) {
    progressData.sessions.push({
        feature,
        description,
        timestamp: Date.now(),
        duration
    });

    progressData.completedSessions++;
    progressData.totalTime += duration;

    // Update feature usage
    const featureKey = feature.toLowerCase();
    if (progressData.featureUsage.hasOwnProperty(featureKey)) {
        progressData.featureUsage[featureKey]++;
    }

    // Update weekly activity (today)
    progressData.weeklyActivity[6] += duration;

    // Add quiz score if provided
    if (score !== null) {
        progressData.quizScores.push(score);
    }

    // Update streak (simplified - would need more complex logic for real streak tracking)
    updateStreak();

    saveProgressData();
};

function updateStreak() {
    const today = new Date().toDateString();
    const lastSession = progressData.sessions[progressData.sessions.length - 1];
    const lastDate = new Date(lastSession.timestamp).toDateString();

    if (lastDate === today) {
        // Session today, maintain or increase streak
        const previousSession = progressData.sessions[progressData.sessions.length - 2];
        if (previousSession) {
            const prevDate = new Date(previousSession.timestamp);
            const dayDiff = Math.floor((lastSession.timestamp - prevDate.getTime()) / (1000 * 60 * 60 * 24));
            if (dayDiff === 1) {
                progressData.studyStreak++;
            } else if (dayDiff === 0) {
                // Same day, no change
            } else {
                progressData.studyStreak = 1;
            }
        } else {
            progressData.studyStreak = 1;
        }
    }
}

// Add sample data for demonstration
function addSampleData() {
    if (progressData.sessions.length === 0) {
        const features = ['Chat', 'Tutor', 'Explainer', 'Summarizer', 'Quiz', 'Flashcards'];
        const now = Date.now();

        for (let i = 0; i < 10; i++) {
            const feature = features[Math.floor(Math.random() * features.length)];
            const duration = Math.floor(Math.random() * 45) + 15;
            const daysAgo = Math.floor(Math.random() * 7);

            progressData.sessions.push({
                feature,
                description: `Studied ${feature.toLowerCase()}`,
                timestamp: now - (daysAgo * 24 * 60 * 60 * 1000),
                duration
            });

            progressData.completedSessions++;
            progressData.totalTime += duration;

            const featureKey = feature.toLowerCase();
            if (progressData.featureUsage.hasOwnProperty(featureKey)) {
                progressData.featureUsage[featureKey]++;
            }

            progressData.weeklyActivity[6 - daysAgo] += duration;

            if (feature === 'Quiz') {
                progressData.quizScores.push(Math.floor(Math.random() * 30) + 70);
            }
        }

        progressData.studyStreak = 5;
        saveProgressData();
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProgressData();

    // Add sample data button (for testing)
    if (progressData.sessions.length === 0) {
        addSampleData();
        updateUI();
    }
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
    }
}
