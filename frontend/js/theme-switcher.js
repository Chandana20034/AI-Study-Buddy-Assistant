// Theme Switcher Functionality
class ThemeSwitcher {
    constructor() {
        this.currentTheme = localStorage.getItem('theme') || 'dark';
        this.themeToggle = null;
    }

    init() {
        // Apply saved theme on load
        this.applyTheme(this.currentTheme);

        // Create theme toggle button if it doesn't exist
        if (!document.getElementById('themeToggle')) {
            this.createToggleButton();
        } else {
            this.themeToggle = document.getElementById('themeToggle');
            this.attachEventListener();
        }

        // Update toggle button text
        this.updateToggleButton();
    }

    createToggleButton() {
        const toggleButton = document.createElement('div');
        toggleButton.id = 'themeToggle';
        toggleButton.className = 'theme-toggle';
        toggleButton.innerHTML = `
            <i class="fas fa-moon"></i>
            <span>Dark</span>
        `;
        document.body.appendChild(toggleButton);
        this.themeToggle = toggleButton;
        this.attachEventListener();
    }

    attachEventListener() {
        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        this.currentTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(this.currentTheme);
        this.updateToggleButton();
        localStorage.setItem('theme', this.currentTheme);
    }

    applyTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-theme');
        } else {
            document.body.classList.remove('light-theme');
        }
    }

    updateToggleButton() {
        if (!this.themeToggle) return;

        const icon = this.themeToggle.querySelector('i');
        const text = this.themeToggle.querySelector('span');

        if (this.currentTheme === 'light') {
            icon.className = 'fas fa-sun';
            text.textContent = 'Light';
        } else {
            icon.className = 'fas fa-moon';
            text.textContent = 'Dark';
        }
    }
}

// Initialize theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = new ThemeSwitcher();
    themeSwitcher.init();
});
