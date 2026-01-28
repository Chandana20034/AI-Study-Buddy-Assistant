// Search functionality for navbar
class NavbarSearch {
    constructor() {
        this.searchInput = null;
        this.searchResults = null;
        this.features = [
            { name: 'AI Chat', icon: 'fa-comments', url: 'chat.html', description: 'Chat with AI assistant' },
            { name: 'Tutor Me', icon: 'fa-chalkboard-teacher', url: 'tutor.html', description: 'Get step-by-step help' },
            { name: 'Concept Explainer', icon: 'fa-lightbulb', url: 'explainer.html', description: 'Explain complex topics' },
            { name: 'Notes Summarizer', icon: 'fa-file-alt', url: 'summarizer.html', description: 'Summarize your notes' },
            { name: 'Quiz Generator', icon: 'fa-question-circle', url: 'quiz.html', description: 'Generate practice quizzes' },
            { name: 'Flashcards', icon: 'fa-layer-group', url: 'flashcards.html', description: 'Create flashcards' },
            { name: 'Essay Grading', icon: 'fa-pen-fancy', url: 'essay-grading.html', description: 'Grade your essays' },
            { name: 'Live Lecture', icon: 'fa-microphone', url: 'live-lecture.html', description: 'Record lectures with transcription' },
            { name: 'Audio Recap', icon: 'fa-headphones', url: 'audio-recap.html', description: 'Convert notes to audio' },
            { name: 'Arcade', icon: 'fa-gamepad', url: 'arcade.html', description: 'Learn through fun games' },
            { name: 'Links Manager', icon: 'fa-link', url: 'links-manager.html', description: 'Save and organize study URLs' },
            { name: 'Progress Tracker', icon: 'fa-chart-line', url: 'progress.html', description: 'Track your progress' },
            { name: 'Study Planner', icon: 'fa-calendar-alt', url: 'planner.html', description: 'Plan your study schedule' },
            { name: 'Dashboard', icon: 'fa-home', url: 'dashboard.html', description: 'Main dashboard' }
        ];
    }

    init() {
        this.searchInput = document.getElementById('navbarSearch');
        this.searchResults = document.getElementById('searchResults');

        if (!this.searchInput || !this.searchResults) return;

        // Add event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('focus', () => {
            if (this.searchInput.value.trim()) {
                this.searchResults.classList.add('active');
            }
        });

        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-search')) {
                this.searchResults.classList.remove('active');
            }
        });

        // Handle keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.searchResults.classList.remove('active');
                this.searchInput.blur();
            }
        });
    }

    handleSearch(query) {
        query = query.trim().toLowerCase();

        if (!query) {
            this.searchResults.classList.remove('active');
            return;
        }

        const results = this.features.filter(feature =>
            feature.name.toLowerCase().includes(query) ||
            feature.description.toLowerCase().includes(query)
        );

        this.displayResults(results, query);
    }

    displayResults(results, query) {
        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="search-result-item">
                    <p style="text-align: center; color: var(--text-muted);">
                        No results found for "${query}"
                    </p>
                </div>
            `;
            this.searchResults.classList.add('active');
            return;
        }

        this.searchResults.innerHTML = results.map(feature => `
            <div class="search-result-item" onclick="window.location.href='${feature.url}'">
                <span class="search-result-icon">
                    <i class="fas ${feature.icon}" style="color: white;"></i>
                </span>
                <div style="display: inline-block; vertical-align: middle;">
                    <h4>${this.highlightMatch(feature.name, query)}</h4>
                    <p>${feature.description}</p>
                </div>
            </div>
        `).join('');

        this.searchResults.classList.add('active');
    }

    highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span style="color: var(--secondary-blue); font-weight: 600;">$1</span>');
    }
}

// Mobile Menu Toggle functionality
class MobileMenuToggle {
    constructor() {
        this.menuToggle = null;
        this.navbarMenu = null;
        this.menuOverlay = null;
    }

    init() {
        this.menuToggle = document.getElementById('mobileMenuToggle');
        this.navbarMenu = document.querySelector('.navbar-menu');
        this.menuOverlay = document.getElementById('mobileMenuOverlay');

        if (!this.menuToggle || !this.navbarMenu || !this.menuOverlay) return;

        // Toggle menu on button click
        this.menuToggle.addEventListener('click', () => this.toggleMenu());

        // Close menu when clicking overlay
        this.menuOverlay.addEventListener('click', () => this.closeMenu());

        // Close menu when clicking a nav link
        const navLinks = this.navbarMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => this.closeMenu());
        });

        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navbarMenu.classList.contains('active')) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        this.navbarMenu.classList.toggle('active');
        this.menuOverlay.classList.toggle('active');

        // Prevent body scroll when menu is open
        if (this.navbarMenu.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    closeMenu() {
        this.navbarMenu.classList.remove('active');
        this.menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Active Navigation State Management
class ActiveNavState {
    constructor() {
        this.currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
    }

    init() {
        const navLinks = document.querySelectorAll('.navbar-menu a');

        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href');

            // Check if this link matches the current page
            if (linkPage === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// Initialize all navbar functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const navbarSearch = new NavbarSearch();
    navbarSearch.init();

    const mobileMenu = new MobileMenuToggle();
    mobileMenu.init();

    const activeNav = new ActiveNavState();
    activeNav.init();
});
