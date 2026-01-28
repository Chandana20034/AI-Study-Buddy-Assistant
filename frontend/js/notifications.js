// ==========================================
// Notification Manager
// Handles notifications with localStorage persistence
// ==========================================

class NotificationManager {
    constructor() {
        this.notifications = [];
        this.loadNotifications();
        this.init();
    }

    init() {
        // Load notifications from localStorage
        this.loadNotifications();

        // Auto-generate welcome notification if first time
        if (this.notifications.length === 0) {
            this.addNotification({
                type: 'info',
                title: 'Welcome to AI Study Assistant!',
                message: 'Start using our features to enhance your learning experience.',
                icon: 'fa-hand-wave'
            });
        }
    }

    /**
     * Add a new notification
     * @param {Object} notification - Notification object
     */
    addNotification({ type, title, message, icon }) {
        const notification = {
            id: Date.now(),
            type: type || 'info',
            title: title,
            message: message,
            icon: icon || this.getDefaultIcon(type),
            timestamp: new Date().toISOString(),
            read: false
        };

        this.notifications.unshift(notification);

        // Keep only last 50 notifications
        if (this.notifications.length > 50) {
            this.notifications = this.notifications.slice(0, 50);
        }

        this.saveNotifications();
        this.updateUI();

        return notification;
    }

    /**
     * Mark notification as read
     * @param {number} id - Notification ID
     */
    markAsRead(id) {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
            notification.read = true;
            this.saveNotifications();
            this.updateUI();
        }
    }

    /**
     * Mark all notifications as read
     */
    markAllAsRead() {
        this.notifications.forEach(n => n.read = true);
        this.saveNotifications();
        this.updateUI();
    }

    /**
     * Delete a notification
     * @param {number} id - Notification ID
     */
    deleteNotification(id) {
        this.notifications = this.notifications.filter(n => n.id !== id);
        this.saveNotifications();
        this.updateUI();
    }

    /**
     * Clear all notifications
     */
    clearAll() {
        if (confirm('Are you sure you want to clear all notifications?')) {
            this.notifications = [];
            this.saveNotifications();
            this.updateUI();
        }
    }

    /**
     * Get unread count
     */
    getUnreadCount() {
        return this.notifications.filter(n => !n.read).length;
    }

    /**
     * Get default icon for notification type
     */
    getDefaultIcon(type) {
        const icons = {
            'success': 'fa-check-circle',
            'info': 'fa-info-circle',
            'warning': 'fa-exclamation-triangle',
            'achievement': 'fa-trophy'
        };
        return icons[type] || 'fa-bell';
    }

    /**
     * Format timestamp for display
     */
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;

        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return date.toLocaleDateString();
    }

    /**
     * Save notifications to localStorage
     */
    saveNotifications() {
        try {
            localStorage.setItem('notifications', JSON.stringify(this.notifications));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }

    /**
     * Load notifications from localStorage
     */
    loadNotifications() {
        try {
            const stored = localStorage.getItem('notifications');
            if (stored) {
                this.notifications = JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading notifications:', error);
            this.notifications = [];
        }
    }

    /**
     * Update UI elements
     */
    updateUI() {
        this.updateBadge();
        this.updateDropdown();
    }

    /**
     * Update notification badge count
     */
    updateBadge() {
        const badge = document.getElementById('notificationBadge');
        const unreadCount = this.getUnreadCount();

        if (badge) {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        }
    }

    /**
     * Update notification dropdown
     */
    updateDropdown() {
        const list = document.getElementById('notificationList');
        if (!list) return;

        if (this.notifications.length === 0) {
            list.innerHTML = `
                <div class="notification-empty">
                    <i class="fas fa-bell-slash"></i>
                    <p>No notifications yet</p>
                </div>
            `;
            return;
        }

        list.innerHTML = this.notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 onclick="notificationManager.markAsRead(${notification.id})"
                 data-id="${notification.id}">
                <div class="notification-icon ${notification.type}">
                    <i class="fas ${notification.icon}"></i>
                </div>
                <div class="notification-content">
                    <div class="notification-title">${this.escapeHtml(notification.title)}</div>
                    <div class="notification-message">${this.escapeHtml(notification.message)}</div>
                    <div class="notification-time">
                        <i class="fas fa-clock"></i>
                        ${this.formatTime(notification.timestamp)}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Toggle notification dropdown
     */
    toggleDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        const bell = document.getElementById('notificationBell');

        if (dropdown && bell) {
            const isShown = dropdown.classList.contains('show');

            if (isShown) {
                dropdown.classList.remove('show');
                bell.classList.remove('active');
            } else {
                // Close profile dropdown if open
                this.closeProfileDropdown();

                dropdown.classList.add('show');
                bell.classList.add('active');
                this.updateDropdown();
            }
        }
    }

    /**
     * Close notification dropdown
     */
    closeDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        const bell = document.getElementById('notificationBell');

        if (dropdown) dropdown.classList.remove('show');
        if (bell) bell.classList.remove('active');
    }

    /**
     * Toggle profile dropdown
     */
    toggleProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        const button = document.getElementById('profileButton');

        if (dropdown && button) {
            const isShown = dropdown.classList.contains('show');

            if (isShown) {
                dropdown.classList.remove('show');
                button.classList.remove('active');
            } else {
                // Close notification dropdown if open
                this.closeDropdown();

                dropdown.classList.add('show');
                button.classList.add('active');
            }
        }
    }

    /**
     * Close profile dropdown
     */
    closeProfileDropdown() {
        const dropdown = document.getElementById('profileDropdown');
        const button = document.getElementById('profileButton');

        if (dropdown) dropdown.classList.remove('show');
        if (button) button.classList.remove('active');
    }
}

// Create global instance
window.notificationManager = new NotificationManager();

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    const notificationBell = document.getElementById('notificationBell');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const profileButton = document.getElementById('profileButton');
    const profileDropdown = document.getElementById('profileDropdown');

    // Close notification dropdown if clicking outside
    if (notificationBell && notificationDropdown) {
        if (!notificationBell.contains(e.target) && !notificationDropdown.contains(e.target)) {
            notificationManager.closeDropdown();
        }
    }

    // Close profile dropdown if clicking outside
    if (profileButton && profileDropdown) {
        if (!profileButton.contains(e.target) && !profileDropdown.contains(e.target)) {
            notificationManager.closeProfileDropdown();
        }
    }
});

// Helper function to add study activity notifications
function addStudyNotification(type, title, message) {
    notificationManager.addNotification({
        type: type || 'success',
        title: title,
        message: message,
        icon: type === 'achievement' ? 'fa-trophy' : 'fa-check-circle'
    });
}

// Override saveActivity to also create notifications
const originalSaveActivity = window.saveActivity || function () { };
window.saveActivity = function (type, title) {
    // Call original function
    if (typeof originalSaveActivity === 'function') {
        originalSaveActivity(type, title);
    }

    // Add notification
    const messages = {
        'explain': 'Concept explained successfully!',
        'summarize': 'Notes summarized successfully!',
        'quiz': 'Quiz completed!',
        'flashcard': 'Flashcards created!'
    };

    if (window.notificationManager) {
        window.notificationManager.addNotification({
            type: 'success',
            title: title,
            message: messages[type] || 'Activity completed!',
            icon: 'fa-check-circle'
        });
    }
};
