// ==========================================
// Dashboard JavaScript
// Handles user session, navigation, and activity display
// ==========================================

// Check if user is logged in
function checkAuth() {
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!user || !token) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return null;
    }

    // Validate session if security manager is available
    if (window.securityManager && !window.securityManager.validateSession()) {
        // Session expired
        localStorage.clear();
        window.location.href = 'login.html';
        return null;
    }

    return JSON.parse(user);
}

// Initialize dashboard
function initDashboard() {
    const user = checkAuth();

    if (user) {
        // Sanitize user data if security manager is available
        const displayName = window.securityManager
            ? window.securityManager.sanitizeUsername(user.name || user.email)
            : (user.name || user.email);

        // Update user display
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');

        if (userName) {
            userName.textContent = displayName;
        }

        if (userAvatar && displayName) {
            userAvatar.textContent = displayName.charAt(0).toUpperCase();
        }

        // Load recent activity
        loadRecentActivity();
    }
}

// Load recent activity from localStorage
function loadRecentActivity() {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');
    const activityContainer = document.getElementById('recentActivity');

    if (activities.length === 0) {
        activityContainer.innerHTML = `
            <p style="color: var(--text-secondary); text-align: center; padding: 2rem;">
                No recent activity yet. Start using the features above to see your learning history!
            </p>
        `;
        return;
    }

    // Display recent activities (last 5)
    const recentActivities = activities.slice(-5).reverse();

    // Create horizontal navigation bar layout
    activityContainer.innerHTML = `
        <div style="
            display: flex;
            gap: 1rem;
            overflow-x: auto;
            padding-bottom: 0.5rem;
            scrollbar-width: thin;
            scrollbar-color: var(--secondary-blue) rgba(255,255,255,0.1);
        ">
            ${recentActivities.map((activity, index) => {
        const actualIndex = activities.length - 1 - index;
        return `
                <div class="activity-nav-item" style="
                    min-width: 280px;
                    max-width: 280px;
                    background: rgba(15, 23, 42, 0.5);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: var(--radius-md);
                    padding: 1rem;
                    cursor: pointer;
                    transition: all var(--transition-normal);
                    position: relative;
                    flex-shrink: 0;
                " 
                onmouseover="this.style.transform='translateY(-4px)'; this.style.borderColor='var(--secondary-blue)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.4)';"
                onmouseout="this.style.transform='translateY(0)'; this.style.borderColor='rgba(255,255,255,0.1)'; this.style.boxShadow='none';"
                onclick="viewActivityDetails(${actualIndex})">
                    <div style="display: flex; align-items: center; gap: 0.75rem; margin-bottom: 0.75rem;">
                        <div style="
                            width: 36px;
                            height: 36px;
                            border-radius: 50%;
                            background: var(--gradient-secondary);
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            flex-shrink: 0;
                        ">
                            <i class="${getActivityIcon(activity.type)}" style="color: white; font-size: 0.9rem;"></i>
                        </div>
                        <div style="flex: 1; min-width: 0;">
                            <div style="
                                color: var(--text-primary); 
                                font-weight: 600; 
                                font-size: 0.9rem;
                                white-space: nowrap;
                                overflow: hidden;
                                text-overflow: ellipsis;
                            ">${escapeHtml(activity.title)}</div>
                        </div>
                        <button class="activity-delete-btn" onclick="event.stopPropagation(); deleteActivity(${actualIndex});" 
                            style="
                                width: 28px;
                                height: 28px;
                                border-radius: 50%;
                                border: 1px solid rgba(255, 255, 255, 0.2);
                                background: rgba(30, 41, 59, 0.6);
                                color: var(--text-secondary);
                                cursor: pointer;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all var(--transition-normal);
                                flex-shrink: 0;
                                font-size: 0.75rem;
                            "
                            onmouseover="this.style.background='#ef4444'; this.style.color='white'; this.style.transform='scale(1.15)';"
                            onmouseout="this.style.background='rgba(30, 41, 59, 0.6)'; this.style.color='var(--text-secondary)'; this.style.transform='scale(1)';"
                            title="Delete this activity">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div style="
                        display: inline-flex;
                        align-items: center;
                        gap: 0.5rem;
                        padding: 0.25rem 0.6rem;
                        background: var(--gradient-secondary);
                        border-radius: var(--radius-sm);
                        font-size: 0.75rem;
                        font-weight: 600;
                        margin-bottom: 0.5rem;
                    ">
                        <i class="${getActivityIcon(activity.type)}" style="font-size: 0.7rem;"></i>
                        ${getActivityTypeName(activity.type)}
                    </div>
                    <div style="
                        color: var(--text-muted); 
                        font-size: 0.8rem;
                        display: flex;
                        align-items: center;
                        gap: 0.5rem;
                    ">
                        <i class="fas fa-clock" style="font-size: 0.7rem;"></i>
                        ${formatDate(activity.timestamp)}
                    </div>
                </div>
            `;
    }).join('')}
        </div>
        <style>
            /* Custom scrollbar for webkit browsers */
            #recentActivity > div::-webkit-scrollbar {
                height: 8px;
            }
            #recentActivity > div::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }
            #recentActivity > div::-webkit-scrollbar-thumb {
                background: var(--secondary-blue);
                border-radius: 4px;
            }
            #recentActivity > div::-webkit-scrollbar-thumb:hover {
                background: #3b82f6;
            }
        </style>
    `;
}

// Get icon for activity type
function getActivityIcon(type) {
    const icons = {
        'explain': 'fas fa-lightbulb',
        'summarize': 'fas fa-file-alt',
        'quiz': 'fas fa-question-circle',
        'flashcard': 'fas fa-layer-group'
    };
    return icons[type] || 'fas fa-circle';
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;

    return date.toLocaleDateString();
}

// Delete individual activity
function deleteActivity(index) {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    const activities = JSON.parse(localStorage.getItem('activities') || '[]');

    if (index >= 0 && index < activities.length) {
        activities.splice(index, 1);
        localStorage.setItem('activities', JSON.stringify(activities));

        // Reload the activity list
        loadRecentActivity();

        // Show success notification
        showNotification('Activity deleted successfully', 'success');
    }
}

// View activity details in modal
function viewActivityDetails(index) {
    const activities = JSON.parse(localStorage.getItem('activities') || '[]');

    if (index < 0 || index >= activities.length) return;

    const activity = activities[index];
    const modal = document.getElementById('activityModal');
    const modalTitle = document.getElementById('activityModalTitle');
    const modalBody = document.getElementById('activityModalBody');

    // Set modal title
    modalTitle.innerHTML = `<i class="${getActivityIcon(activity.type)}"></i> ${escapeHtml(activity.title)}`;

    // Build modal content
    let content = '';
    if (activity.content) {
        if (typeof activity.content === 'string') {
            content = `<p style="white-space: pre-wrap;">${escapeHtml(activity.content)}</p>`;
        } else {
            content = `<pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">${JSON.stringify(activity.content, null, 2)}</pre>`;
        }
    }

    modalBody.innerHTML = `
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span style="display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.25rem 0.75rem; background: var(--gradient-secondary); border-radius: var(--radius-sm); font-size: 0.85rem; font-weight: 600;">
                <i class="${getActivityIcon(activity.type)}"></i>
                ${getActivityTypeName(activity.type)}
            </span>
            <span style="margin-left: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                <i class="fas fa-calendar"></i> ${new Date(activity.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
        </div>
        ${content}
    `;

    // Show modal
    modal.style.display = 'flex';
}

// Close activity modal
function closeActivityModal() {
    const modal = document.getElementById('activityModal');
    modal.style.display = 'none';
}

// Get activity type name
function getActivityTypeName(type) {
    const names = {
        'explain': 'Explanation',
        'summarize': 'Summary',
        'quiz': 'Quiz',
        'flashcard': 'Flashcards'
    };
    return names[type] || 'Activity';
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('activityModal');
    if (e.target === modal) {
        closeActivityModal();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
