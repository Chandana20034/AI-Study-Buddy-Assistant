// ==========================================
// Dashboard Redesign - JavaScript
// Interactive functionality for theme, notifications, and profile
// ==========================================

// ==========================================
// Theme Toggle System
// ==========================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');
const html = document.documentElement;

// Load saved theme or default to dark
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Update theme icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

// Event listener for theme toggle
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Initialize theme on page load
loadTheme();

// ==========================================
// Dropdown Management System
// ==========================================
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

// Toggle dropdown visibility
function toggleDropdown(dropdown, button) {
    const isActive = dropdown.classList.contains('active');

    // Close all dropdowns first
    closeAllDropdowns();

    // Toggle the clicked dropdown
    if (!isActive) {
        dropdown.classList.add('active');
    }
}

// Close all dropdowns
function closeAllDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown-panel');
    dropdowns.forEach(dropdown => {
        dropdown.classList.remove('active');
    });
}

// Event listeners for dropdown toggles
if (notificationBtn) {
    notificationBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(notificationDropdown, notificationBtn);
    });
}

if (profileBtn) {
    profileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleDropdown(profileDropdown, profileBtn);
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-panel') &&
        !e.target.closest('.notification-bell') &&
        !e.target.closest('.user-avatar-btn')) {
        closeAllDropdowns();
    }
});

// Prevent dropdown from closing when clicking inside
document.querySelectorAll('.dropdown-panel').forEach(dropdown => {
    dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
    });
});

// ==========================================
// Notifications System
// ==========================================
const markAllReadBtn = document.getElementById('markAllRead');
const notificationBadge = document.getElementById('notificationBadge');

// Mark all notifications as read
function markAllNotificationsRead() {
    const unreadNotifications = document.querySelectorAll('.notification-item.unread');
    unreadNotifications.forEach(notification => {
        notification.classList.remove('unread');
    });

    // Update badge
    updateNotificationBadge(0);
}

// Update notification badge count
function updateNotificationBadge(count) {
    if (count > 0) {
        notificationBadge.textContent = count;
        notificationBadge.style.display = 'flex';
    } else {
        notificationBadge.style.display = 'none';
    }
}

// Event listener for mark all read
if (markAllReadBtn) {
    markAllReadBtn.addEventListener('click', () => {
        markAllNotificationsRead();
    });
}

// Count unread notifications on page load
function countUnreadNotifications() {
    const unreadCount = document.querySelectorAll('.notification-item.unread').length;
    updateNotificationBadge(unreadCount);
}

countUnreadNotifications();

// ==========================================
// Mobile Sidebar Toggle
// ==========================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');

if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });
}

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!e.target.closest('.sidebar') && !e.target.closest('.mobile-menu-toggle')) {
            sidebar.classList.remove('active');
        }
    }
});

// ==========================================
// Sidebar Navigation Features
// ==========================================

// My Sets Toggle
const mySetsToggle = document.getElementById('mySetsToggle');
if (mySetsToggle) {
    mySetsToggle.addEventListener('click', () => {
        mySetsToggle.classList.toggle('active');
        // You can add submenu functionality here
        console.log('My Sets toggled');
    });
}

// Upload Button
const uploadBtn = document.querySelector('.upload-btn');
if (uploadBtn) {
    uploadBtn.addEventListener('click', () => {
        // Create file input dynamically
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.pdf,.doc,.docx,.txt,.ppt,.pptx';
        fileInput.multiple = true;

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0) {
                console.log('Files selected:', files);
                // You can add file upload logic here
                alert(`${files.length} file(s) selected for upload`);
            }
        });

        fileInput.click();
    });
}

// Add Note Button
const addNoteBtn = document.querySelector('.add-note-btn');
if (addNoteBtn) {
    addNoteBtn.addEventListener('click', () => {
        console.log('Add note clicked');
        // You can add note creation logic here
        alert('Create new note - Coming soon!');
    });
}

// Tutorials Button
const tutorialsBtn = document.querySelector('.tutorials-btn');
if (tutorialsBtn) {
    tutorialsBtn.addEventListener('click', () => {
        console.log('Tutorials clicked');
        // You can navigate to tutorials page or open modal
        alert('Tutorials - Coming soon!');
    });
}


// ==========================================
// User Profile Data
// ==========================================
function loadUserProfile() {
    // Get user data from localStorage or use defaults
    const userData = {
        name: localStorage.getItem('userName') || 'Jaichan',
        email: localStorage.getItem('userEmail') || 'jaichanaditya143@gmail.com',
        assignedIssues: localStorage.getItem('assignedIssues') || '0'
    };

    return userData;
}

// Update user profile display
function updateUserProfileDisplay() {
    const userData = loadUserProfile();

    // Update all instances of user name
    document.querySelectorAll('.user-name').forEach(el => {
        el.textContent = userData.name;
    });

    // Update profile details
    const profileDetails = document.querySelector('.profile-details h4');
    if (profileDetails) {
        profileDetails.textContent = userData.name;
    }

    const profileEmail = document.querySelector('.profile-details p');
    if (profileEmail) {
        profileEmail.textContent = userData.email;
    }

    // Update avatar initials
    const initial = userData.name.charAt(0).toUpperCase();
    document.querySelectorAll('.user-avatar-circle, .profile-avatar-large').forEach(el => {
        el.textContent = initial;
    });
}

// Initialize user profile on page load
updateUserProfileDisplay();

// ==========================================
// Quick Action Buttons
// ==========================================
const actionButtons = document.querySelectorAll('.action-btn');

actionButtons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonText = button.textContent.trim();

        // Show alert for now (can be replaced with actual functionality)
        if (buttonText.includes('Create New Board')) {
            alert('Create New Board functionality - Coming soon!');
        } else if (buttonText.includes('Create New Issue')) {
            alert('Create New Issue functionality - Coming soon!');
        } else if (buttonText.includes('Start New Sprint')) {
            alert('Start New Sprint functionality - Coming soon!');
        }
    });
});

// ==========================================
// Logout Functionality
// ==========================================
const logoutBtn = document.querySelector('.logout-btn');

if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();

        if (confirm('Are you sure you want to logout?')) {
            // Clear user session data
            localStorage.removeItem('userName');
            localStorage.removeItem('userEmail');

            // Redirect to login page (adjust path as needed)
            window.location.href = 'login.html';
        }
    });
}

// ==========================================
// Notification Click Handlers
// ==========================================
const notificationItems = document.querySelectorAll('.notification-item');

notificationItems.forEach(item => {
    item.addEventListener('click', () => {
        // Mark as read when clicked
        if (item.classList.contains('unread')) {
            item.classList.remove('unread');

            // Update badge count
            const unreadCount = document.querySelectorAll('.notification-item.unread').length;
            updateNotificationBadge(unreadCount);
        }

        // You can add navigation or modal display here
        console.log('Notification clicked');
    });
});

// ==========================================
// Smooth Scroll for Internal Links
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==========================================
// Window Resize Handler
// ==========================================
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Close sidebar on desktop view
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }

        // Close dropdowns on resize
        closeAllDropdowns();
    }, 250);
});

// ==========================================
// Initialize Dashboard
// ==========================================
function initDashboard() {
    console.log('Dashboard initialized');
    console.log('Current theme:', html.getAttribute('data-theme'));
    console.log('User:', loadUserProfile().name);
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
