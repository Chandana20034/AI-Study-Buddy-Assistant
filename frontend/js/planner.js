// Study Planner JavaScript
// Manages goals, calendar, schedule, and reminders

// Initialize planner data
const plannerData = {
    goals: [],
    events: [],
    reminders: []
};

let currentDate = new Date();
let selectedDate = new Date();

// Load data from localStorage
function loadPlannerData() {
    const saved = localStorage.getItem('plannerData');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(plannerData, data);
    }
    updateUI();
}

// Save data to localStorage
function savePlannerData() {
    localStorage.setItem('plannerData', JSON.stringify(plannerData));
}

// Update all UI components
function updateUI() {
    displayGoals();
    renderCalendar();
    displaySchedule();
    displayReminders();
}

// ==================== GOALS ====================

function showAddGoalModal() {
    document.getElementById('goalModal').style.display = 'flex';
    // Set default date to 1 month from now
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + 1);
    document.getElementById('goalDate').value = futureDate.toISOString().split('T')[0];
}

function closeGoalModal() {
    document.getElementById('goalModal').style.display = 'none';
    clearGoalForm();
}

function clearGoalForm() {
    document.getElementById('goalTitle').value = '';
    document.getElementById('goalDescription').value = '';
    document.getElementById('goalDate').value = '';
    document.getElementById('goalCategory').value = 'academic';
}

function addGoal() {
    const title = document.getElementById('goalTitle').value.trim();
    const description = document.getElementById('goalDescription').value.trim();
    const targetDate = document.getElementById('goalDate').value;
    const category = document.getElementById('goalCategory').value;

    if (!title || !targetDate) {
        alert('Please fill in the title and target date');
        return;
    }

    const goal = {
        id: Date.now(),
        title,
        description,
        targetDate,
        category,
        completed: false,
        createdAt: new Date().toISOString()
    };

    plannerData.goals.push(goal);
    savePlannerData();
    displayGoals();
    closeGoalModal();
}

function displayGoals() {
    const container = document.getElementById('goalsList');
    if (!container) return;

    if (plannerData.goals.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-bullseye" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>No goals yet. Click "Add Goal" to set your first learning goal!</p>
            </div>
        `;
        return;
    }

    const sortedGoals = [...plannerData.goals].sort((a, b) =>
        new Date(a.targetDate) - new Date(b.targetDate)
    );

    container.innerHTML = sortedGoals.map(goal => {
        const daysLeft = Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24));
        const isOverdue = daysLeft < 0;
        const categoryColors = {
            academic: '#3b82f6',
            skill: '#ec4899',
            exam: '#8b5cf6',
            personal: '#10b981'
        };

        return `
            <div class="goal-item ${goal.completed ? 'completed' : ''}">
                <div class="goal-checkbox">
                    <input type="checkbox" ${goal.completed ? 'checked' : ''} 
                           onchange="toggleGoal(${goal.id})" id="goal-${goal.id}">
                    <label for="goal-${goal.id}"></label>
                </div>
                <div class="goal-content">
                    <div class="goal-header">
                        <h4>${goal.title}</h4>
                        <span class="goal-category" style="background: ${categoryColors[goal.category]}20; color: ${categoryColors[goal.category]};">
                            ${goal.category}
                        </span>
                    </div>
                    ${goal.description ? `<p>${goal.description}</p>` : ''}
                    <div class="goal-footer">
                        <span class="goal-date">
                            <i class="fas fa-calendar"></i>
                            ${new Date(goal.targetDate).toLocaleDateString()}
                        </span>
                        <span class="goal-days ${isOverdue ? 'overdue' : ''}">
                            ${isOverdue ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}
                        </span>
                    </div>
                </div>
                <button class="goal-delete" onclick="deleteGoal(${goal.id})" title="Delete goal">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

function toggleGoal(goalId) {
    const goal = plannerData.goals.find(g => g.id === goalId);
    if (goal) {
        goal.completed = !goal.completed;
        savePlannerData();
        displayGoals();
    }
}

function deleteGoal(goalId) {
    if (confirm('Are you sure you want to delete this goal?')) {
        plannerData.goals = plannerData.goals.filter(g => g.id !== goalId);
        savePlannerData();
        displayGoals();
    }
}

// ==================== CALENDAR ====================

function renderCalendar() {
    const container = document.getElementById('calendar');
    if (!container) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Build calendar HTML
    let html = '<div class="calendar-weekdays">';
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    weekdays.forEach(day => {
        html += `<div class="calendar-weekday">${day}</div>`;
    });
    html += '</div><div class="calendar-days">';

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }

    // Days of the month
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = date.toISOString().split('T')[0];
        const isToday = date.toDateString() === today.toDateString();
        const isSelected = date.toDateString() === selectedDate.toDateString();
        const hasEvents = plannerData.events.some(e => e.date === dateStr);

        html += `
            <div class="calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''} ${hasEvents ? 'has-events' : ''}"
                 onclick="selectDate(new Date(${year}, ${month}, ${day}))">
                <span>${day}</span>
                ${hasEvents ? '<div class="event-dot"></div>' : ''}
            </div>
        `;
    }

    html += '</div>';
    container.innerHTML = html;
}

function previousMonth() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
}

function selectDate(date) {
    selectedDate = date;
    renderCalendar();
    displaySchedule();

    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('selectedDate').textContent = date.toLocaleDateString('en-US', options);
}

// ==================== EVENTS/SCHEDULE ====================

function showAddEventModal() {
    document.getElementById('eventModal').style.display = 'flex';
    document.getElementById('eventDate').value = selectedDate.toISOString().split('T')[0];
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
    clearEventForm();
}

function clearEventForm() {
    document.getElementById('eventTitle').value = '';
    document.getElementById('eventDate').value = '';
    document.getElementById('eventTime').value = '';
    document.getElementById('eventDuration').value = '60';
    document.getElementById('eventType').value = 'lecture';
}

function addEvent() {
    const title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const duration = parseInt(document.getElementById('eventDuration').value);
    const type = document.getElementById('eventType').value;

    if (!title || !date || !time) {
        alert('Please fill in all required fields');
        return;
    }

    const event = {
        id: Date.now(),
        title,
        date,
        time,
        duration,
        type,
        createdAt: new Date().toISOString()
    };

    plannerData.events.push(event);
    savePlannerData();
    updateUI();
    closeEventModal();
}

function displaySchedule() {
    const container = document.getElementById('scheduleList');
    if (!container) return;

    const dateStr = selectedDate.toISOString().split('T')[0];
    const dayEvents = plannerData.events
        .filter(e => e.date === dateStr)
        .sort((a, b) => a.time.localeCompare(b.time));

    if (dayEvents.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-calendar-day" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>No events scheduled for this day</p>
            </div>
        `;
        return;
    }

    const typeIcons = {
        lecture: 'fa-chalkboard-teacher',
        study: 'fa-book',
        exam: 'fa-file-alt',
        assignment: 'fa-pen',
        other: 'fa-calendar'
    };

    const typeColors = {
        lecture: '#3b82f6',
        study: '#10b981',
        exam: '#ef4444',
        assignment: '#f59e0b',
        other: '#8b5cf6'
    };

    container.innerHTML = dayEvents.map(event => `
        <div class="schedule-item" style="border-left: 4px solid ${typeColors[event.type]};">
            <div class="schedule-time">
                <i class="fas fa-clock"></i>
                ${event.time}
            </div>
            <div class="schedule-content">
                <div class="schedule-header">
                    <h4>
                        <i class="fas ${typeIcons[event.type]}"></i>
                        ${event.title}
                    </h4>
                    <span class="schedule-type">${event.type}</span>
                </div>
                <p class="schedule-duration">
                    <i class="fas fa-hourglass-half"></i>
                    ${event.duration} minutes
                </p>
            </div>
            <button class="schedule-delete" onclick="deleteEvent(${event.id})" title="Delete event">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
}

function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        plannerData.events = plannerData.events.filter(e => e.id !== eventId);
        savePlannerData();
        updateUI();
    }
}

// ==================== REMINDERS ====================

function showAddReminderModal() {
    document.getElementById('reminderModal').style.display = 'flex';
    // Set default to tomorrow at 9 AM
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);
    document.getElementById('reminderDateTime').value = tomorrow.toISOString().slice(0, 16);
}

function closeReminderModal() {
    document.getElementById('reminderModal').style.display = 'none';
    clearReminderForm();
}

function clearReminderForm() {
    document.getElementById('reminderText').value = '';
    document.getElementById('reminderDateTime').value = '';
    document.getElementById('reminderPriority').value = 'medium';
}

function addReminder() {
    const text = document.getElementById('reminderText').value.trim();
    const dateTime = document.getElementById('reminderDateTime').value;
    const priority = document.getElementById('reminderPriority').value;

    if (!text || !dateTime) {
        alert('Please fill in all fields');
        return;
    }

    const reminder = {
        id: Date.now(),
        text,
        dateTime,
        priority,
        completed: false,
        createdAt: new Date().toISOString()
    };

    plannerData.reminders.push(reminder);
    savePlannerData();
    displayReminders();
    closeReminderModal();
}

function displayReminders() {
    const container = document.getElementById('remindersList');
    if (!container) return;

    const now = new Date();
    const upcomingReminders = plannerData.reminders
        .filter(r => !r.completed && new Date(r.dateTime) > now)
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));

    if (upcomingReminders.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                <i class="fas fa-bell-slash" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;"></i>
                <p>No upcoming reminders</p>
            </div>
        `;
        return;
    }

    const priorityColors = {
        low: '#10b981',
        medium: '#f59e0b',
        high: '#ef4444'
    };

    container.innerHTML = upcomingReminders.map(reminder => {
        const reminderDate = new Date(reminder.dateTime);
        const timeUntil = getTimeUntil(reminderDate);

        return `
            <div class="reminder-item" style="border-left: 4px solid ${priorityColors[reminder.priority]};">
                <div class="reminder-checkbox">
                    <input type="checkbox" onchange="completeReminder(${reminder.id})" id="reminder-${reminder.id}">
                    <label for="reminder-${reminder.id}"></label>
                </div>
                <div class="reminder-content">
                    <h4>${reminder.text}</h4>
                    <div class="reminder-footer">
                        <span class="reminder-time">
                            <i class="fas fa-clock"></i>
                            ${reminderDate.toLocaleString()}
                        </span>
                        <span class="reminder-until">${timeUntil}</span>
                        <span class="reminder-priority" style="background: ${priorityColors[reminder.priority]}20; color: ${priorityColors[reminder.priority]};">
                            ${reminder.priority} priority
                        </span>
                    </div>
                </div>
                <button class="reminder-delete" onclick="deleteReminder(${reminder.id})" title="Delete reminder">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
    }).join('');
}

function completeReminder(reminderId) {
    const reminder = plannerData.reminders.find(r => r.id === reminderId);
    if (reminder) {
        reminder.completed = true;
        savePlannerData();
        displayReminders();
    }
}

function deleteReminder(reminderId) {
    if (confirm('Are you sure you want to delete this reminder?')) {
        plannerData.reminders = plannerData.reminders.filter(r => r.id !== reminderId);
        savePlannerData();
        displayReminders();
    }
}

function getTimeUntil(date) {
    const now = new Date();
    const diff = date - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `in ${days} day${days > 1 ? 's' : ''}`;
    if (hours > 0) return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    if (minutes > 0) return `in ${minutes} minute${minutes > 1 ? 's' : ''}`;
    return 'soon';
}

// ==================== INITIALIZATION ====================

// Close modals when clicking outside
window.onclick = function (event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadPlannerData();
    selectDate(new Date()); // Select today by default
});

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
        window.location.href = 'login.html';
    }
}
