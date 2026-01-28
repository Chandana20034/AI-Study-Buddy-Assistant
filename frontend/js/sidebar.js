// ==========================================
// Sidebar Navigation - JavaScript
// Mobile toggle and active state management
// ==========================================

// Get elements
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');

// Toggle sidebar on mobile
function toggleSidebar() {
    sidebar.classList.toggle('active');
    sidebarOverlay.classList.toggle('active');
}

// Close sidebar when clicking overlay
function closeSidebar() {
    sidebar.classList.remove('active');
    sidebarOverlay.classList.remove('active');
}

// Event listeners
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleSidebar);
}

if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', closeSidebar);
}

// Set active link based on current page
function setActiveLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Load user profile into sidebar
function loadUserProfile() {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            const userName = user.name || user.email || 'User';
            const userEmail = user.email || '';

            // Update sidebar user avatar (support both ID naming conventions)
            const sidebarAvatar = document.getElementById('sidebarUserAvatar') || document.getElementById('userAvatar');
            if (sidebarAvatar) {
                sidebarAvatar.textContent = userName.charAt(0).toUpperCase();
            }

            // Update sidebar user name (support both ID naming conventions)
            const sidebarName = document.getElementById('sidebarUserName') || document.getElementById('userName');
            if (sidebarName) {
                sidebarName.textContent = userName;
            }

            // Update sidebar user email
            const sidebarEmail = document.getElementById('sidebarUserEmail');
            if (sidebarEmail) {
                sidebarEmail.textContent = userEmail;
            }
        } catch (e) {
            console.error('Error loading user profile:', e);
        }
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    setActiveLink();
    loadUserProfile();
});

// Close sidebar on window resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        closeSidebar();
    }
});
