// ==========================================
// Security Utility Module
// Provides input sanitization, validation, and security functions
// ==========================================

class SecurityManager {
    constructor() {
        this.maxLoginAttempts = 5;
        this.lockoutDuration = 15 * 60 * 1000; // 15 minutes
        this.sessionTimeout = 24 * 60 * 60 * 1000; // 24 hours
    }

    // ==================== INPUT SANITIZATION ====================

    /**
     * Sanitize username - remove special characters and scripts
     * @param {string} username - Raw username input
     * @returns {string} Sanitized username
     */
    sanitizeUsername(username) {
        if (!username) return '';

        // Remove HTML tags and scripts
        let sanitized = username.replace(/<[^>]*>/g, '');

        // Remove special characters except letters, numbers, spaces, and basic punctuation
        sanitized = sanitized.replace(/[^\w\s.-]/g, '');

        // Trim and limit length
        sanitized = sanitized.trim().substring(0, 50);

        return sanitized;
    }

    /**
     * Validate and sanitize email
     * @param {string} email - Email address
     * @returns {Object} {valid: boolean, sanitized: string, error: string}
     */
    validateEmail(email) {
        if (!email) {
            return { valid: false, sanitized: '', error: 'Email is required' };
        }

        // Remove whitespace and convert to lowercase
        const sanitized = email.trim().toLowerCase();

        // Email regex pattern
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailPattern.test(sanitized)) {
            return { valid: false, sanitized, error: 'Invalid email format' };
        }

        // Check for suspicious patterns
        if (sanitized.includes('..') || sanitized.startsWith('.') || sanitized.endsWith('.')) {
            return { valid: false, sanitized, error: 'Invalid email format' };
        }

        return { valid: true, sanitized, error: null };
    }

    /**
     * Validate password strength
     * @param {string} password - Password to validate
     * @returns {Object} {valid: boolean, strength: string, error: string}
     */
    validatePassword(password) {
        if (!password) {
            return { valid: false, strength: 'none', error: 'Password is required' };
        }

        if (password.length < 6) {
            return { valid: false, strength: 'weak', error: 'Password must be at least 6 characters' };
        }

        let strength = 'weak';
        let score = 0;

        // Check length
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Check for lowercase
        if (/[a-z]/.test(password)) score++;

        // Check for uppercase
        if (/[A-Z]/.test(password)) score++;

        // Check for numbers
        if (/[0-9]/.test(password)) score++;

        // Check for special characters
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        if (score >= 5) strength = 'strong';
        else if (score >= 3) strength = 'medium';

        return { valid: true, strength, error: null };
    }

    // ==================== XSS PREVENTION ====================

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    escapeHtml(text) {
        if (!text) return '';

        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Strip all HTML tags from text
     * @param {string} html - HTML string
     * @returns {string} Plain text
     */
    stripHtml(html) {
        if (!html) return '';

        const div = document.createElement('div');
        div.innerHTML = html;
        return div.textContent || div.innerText || '';
    }

    // ==================== LOGIN ATTEMPT TRACKING ====================

    /**
     * Check if account is locked due to too many failed attempts
     * @param {string} email - User email
     * @returns {Object} {locked: boolean, remainingTime: number}
     */
    checkLoginAttempts(email) {
        const key = `login_attempts_${email}`;
        const data = JSON.parse(localStorage.getItem(key) || '{"attempts": 0, "lockUntil": null}');

        // Check if currently locked
        if (data.lockUntil && new Date(data.lockUntil) > new Date()) {
            const remainingTime = Math.ceil((new Date(data.lockUntil) - new Date()) / 1000 / 60);
            return { locked: true, remainingTime };
        }

        // Reset if lock expired
        if (data.lockUntil && new Date(data.lockUntil) <= new Date()) {
            localStorage.removeItem(key);
            return { locked: false, remainingTime: 0 };
        }

        return { locked: false, remainingTime: 0 };
    }

    /**
     * Record failed login attempt
     * @param {string} email - User email
     * @returns {Object} {locked: boolean, attempts: number, remainingAttempts: number}
     */
    recordFailedAttempt(email) {
        const key = `login_attempts_${email}`;
        const data = JSON.parse(localStorage.getItem(key) || '{"attempts": 0, "lockUntil": null}');

        data.attempts++;

        if (data.attempts >= this.maxLoginAttempts) {
            data.lockUntil = new Date(Date.now() + this.lockoutDuration).toISOString();
            localStorage.setItem(key, JSON.stringify(data));
            return { locked: true, attempts: data.attempts, remainingAttempts: 0 };
        }

        localStorage.setItem(key, JSON.stringify(data));
        return {
            locked: false,
            attempts: data.attempts,
            remainingAttempts: this.maxLoginAttempts - data.attempts
        };
    }

    /**
     * Clear login attempts on successful login
     * @param {string} email - User email
     */
    clearLoginAttempts(email) {
        const key = `login_attempts_${email}`;
        localStorage.removeItem(key);
    }

    // ==================== SESSION MANAGEMENT ====================

    /**
     * Create secure session token
     * @returns {string} Session token
     */
    generateSessionToken() {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2);
        const token = btoa(`${timestamp}-${random}`);
        return token;
    }

    /**
     * Validate session token
     * @returns {boolean} True if session is valid
     */
    validateSession() {
        const token = localStorage.getItem('token');
        const loginTime = localStorage.getItem('loginTime');

        if (!token || !loginTime) {
            return false;
        }

        // Check if session expired
        const elapsed = Date.now() - parseInt(loginTime);
        if (elapsed > this.sessionTimeout) {
            this.clearSession();
            return false;
        }

        return true;
    }

    /**
     * Clear session data
     */
    clearSession() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('loginTime');
    }

    // ==================== DATA ENCRYPTION ====================

    /**
     * Simple encryption for localStorage (Base64 + XOR)
     * Note: This is basic obfuscation, not cryptographically secure
     * @param {string} data - Data to encrypt
     * @param {string} key - Encryption key
     * @returns {string} Encrypted data
     */
    encryptData(data, key = 'study-assistant-key') {
        let encrypted = '';
        for (let i = 0; i < data.length; i++) {
            encrypted += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        }
        return btoa(encrypted);
    }

    /**
     * Decrypt data
     * @param {string} encryptedData - Encrypted data
     * @param {string} key - Encryption key
     * @returns {string} Decrypted data
     */
    decryptData(encryptedData, key = 'study-assistant-key') {
        try {
            const encrypted = atob(encryptedData);
            let decrypted = '';
            for (let i = 0; i < encrypted.length; i++) {
                decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length));
            }
            return decrypted;
        } catch (error) {
            console.error('Decryption failed:', error);
            return null;
        }
    }

    /**
     * Mask email address for display
     * @param {string} email - Email to mask
     * @returns {string} Masked email
     */
    maskEmail(email) {
        if (!email || !email.includes('@')) return email;

        const [username, domain] = email.split('@');
        if (username.length <= 2) {
            return `${username[0]}***@${domain}`;
        }

        const visibleChars = Math.min(2, Math.floor(username.length / 3));
        const masked = username.substring(0, visibleChars) + '***';
        return `${masked}@${domain}`;
    }

    // ==================== PASSWORD RESET ====================

    /**
     * Generate password reset token
     * @param {string} email - User email
     * @returns {string} Reset token
     */
    generateResetToken(email) {
        const timestamp = Date.now();
        const token = btoa(`${email}-${timestamp}-${Math.random()}`);

        // Store token with expiration (1 hour)
        const resetData = {
            email,
            token,
            expiresAt: timestamp + (60 * 60 * 1000)
        };

        localStorage.setItem(`reset_token_${email}`, JSON.stringify(resetData));
        return token;
    }

    /**
     * Validate reset token
     * @param {string} email - User email
     * @param {string} token - Reset token
     * @returns {boolean} True if valid
     */
    validateResetToken(email, token) {
        const resetData = JSON.parse(localStorage.getItem(`reset_token_${email}`) || 'null');

        if (!resetData) return false;
        if (resetData.token !== token) return false;
        if (Date.now() > resetData.expiresAt) {
            localStorage.removeItem(`reset_token_${email}`);
            return false;
        }

        return true;
    }

    /**
     * Clear reset token
     * @param {string} email - User email
     */
    clearResetToken(email) {
        localStorage.removeItem(`reset_token_${email}`);
    }
}

// Create singleton instance
const securityManager = new SecurityManager();

// Export for use in other modules
window.securityManager = securityManager;
