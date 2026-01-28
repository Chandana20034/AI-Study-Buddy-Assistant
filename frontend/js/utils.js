// ==========================================
// Utility Functions for Performance Optimization
// Shared utilities across all pages
// ==========================================

// ==================== DEBOUNCE & THROTTLE ====================

/**
 * Debounce function - delays execution until after wait time has elapsed
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function - limits execution to once per wait period
 * @param {Function} func - Function to throttle
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Throttled function
 */
function throttle(func, wait = 100) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, wait);
        }
    };
}

// ==================== LOCALSTORAGE MANAGER ====================

class LocalStorageManager {
    constructor() {
        this.cache = new Map();
    }

    /**
     * Get item from localStorage with caching
     * @param {string} key - Storage key
     * @param {*} defaultValue - Default value if key doesn't exist
     * @returns {*} Parsed value or default
     */
    get(key, defaultValue = null) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }

        try {
            const item = localStorage.getItem(key);
            if (item === null) return defaultValue;

            const parsed = JSON.parse(item);
            this.cache.set(key, parsed);
            return parsed;
        } catch (error) {
            console.error(`Error reading from localStorage: ${key}`, error);
            return defaultValue;
        }
    }

    /**
     * Set item in localStorage with caching
     * @param {string} key - Storage key
     * @param {*} value - Value to store
     */
    set(key, value) {
        try {
            const serialized = JSON.stringify(value);
            localStorage.setItem(key, serialized);
            this.cache.set(key, value);
        } catch (error) {
            console.error(`Error writing to localStorage: ${key}`, error);
        }
    }

    /**
     * Remove item from localStorage and cache
     * @param {string} key - Storage key
     */
    remove(key) {
        localStorage.removeItem(key);
        this.cache.delete(key);
    }

    /**
     * Clear cache (useful when localStorage is modified externally)
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Batch update multiple items
     * @param {Object} items - Object with key-value pairs
     */
    batchSet(items) {
        Object.entries(items).forEach(([key, value]) => {
            this.set(key, value);
        });
    }
}

// Create singleton instance
const storage = new LocalStorageManager();

// ==================== NOTIFICATION MANAGER ====================

class NotificationManager {
    constructor() {
        this.currentNotification = null;
        this.queue = [];
        this.isShowing = false;
    }

    /**
     * Show notification with automatic cleanup
     * @param {string} message - Notification message
     * @param {string} type - Type: 'success', 'error', 'info', 'warning'
     * @param {number} duration - Duration in milliseconds
     */
    show(message, type = 'info', duration = 3000) {
        // Queue notification if one is already showing
        if (this.isShowing) {
            this.queue.push({ message, type, duration });
            return;
        }

        this.isShowing = true;

        // Remove existing notification if any
        if (this.currentNotification) {
            this.currentNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;

        const colors = {
            success: 'rgba(34, 197, 94, 0.9)',
            error: 'rgba(239, 68, 68, 0.9)',
            info: 'rgba(59, 130, 246, 0.9)',
            warning: 'rgba(245, 158, 11, 0.9)'
        };

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${colors[type] || colors.info};
            color: white;
            border-radius: 0.5rem;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            font-weight: 500;
            backdrop-filter: blur(10px);
            max-width: 400px;
            word-wrap: break-word;
        `;

        document.body.appendChild(notification);
        this.currentNotification = notification;

        // Auto remove after duration
        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => {
                notification.remove();
                this.currentNotification = null;
                this.isShowing = false;

                // Show next notification in queue
                if (this.queue.length > 0) {
                    const next = this.queue.shift();
                    this.show(next.message, next.type, next.duration);
                }
            }, 300);
        }, duration);
    }

    /**
     * Clear current notification and queue
     */
    clear() {
        if (this.currentNotification) {
            this.currentNotification.remove();
            this.currentNotification = null;
        }
        this.queue = [];
        this.isShowing = false;
    }
}

// Create singleton instance
const notificationManager = new NotificationManager();

// Backward compatibility - global function
function showNotification(message, type = 'info') {
    notificationManager.show(message, type);
}

// ==================== DOM UTILITIES ====================

/**
 * Create element from HTML string
 * @param {string} html - HTML string
 * @returns {Element} Created element
 */
function createElementFromHTML(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content.firstChild;
}

/**
 * Batch DOM updates using DocumentFragment
 * @param {Array} items - Array of HTML strings or elements
 * @param {Element} container - Container element
 */
function batchAppend(items, container) {
    const fragment = document.createDocumentFragment();
    items.forEach(item => {
        if (typeof item === 'string') {
            fragment.appendChild(createElementFromHTML(item));
        } else {
            fragment.appendChild(item);
        }
    });
    container.appendChild(fragment);
}

/**
 * Memoize expensive function results
 * @param {Function} fn - Function to memoize
 * @returns {Function} Memoized function
 */
function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key);
        }
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

/**
 * Request animation frame wrapper for smooth updates
 * @param {Function} callback - Callback function
 */
function smoothUpdate(callback) {
    requestAnimationFrame(() => {
        callback();
    });
}

/**
 * Lazy load script
 * @param {string} src - Script source URL
 * @returns {Promise} Promise that resolves when script is loaded
 */
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// ==================== API UTILITIES ====================

/**
 * Create cancellable fetch request
 * @param {string} url - Request URL
 * @param {Object} options - Fetch options
 * @returns {Object} Object with promise and cancel function
 */
function cancellableFetch(url, options = {}) {
    const controller = new AbortController();
    const signal = controller.signal;

    const promise = fetch(url, { ...options, signal });

    return {
        promise,
        cancel: () => controller.abort()
    };
}

/**
 * Retry failed requests with exponential backoff
 * @param {Function} fn - Async function to retry
 * @param {number} maxRetries - Maximum retry attempts
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise} Promise that resolves with result or rejects after max retries
 */
async function retryWithBackoff(fn, maxRetries = 3, delay = 1000) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
        }
    }
}

// ==================== PERFORMANCE MONITORING ====================

/**
 * Measure function execution time
 * @param {Function} fn - Function to measure
 * @param {string} label - Label for console output
 * @returns {Function} Wrapped function
 */
function measurePerformance(fn, label) {
    return function (...args) {
        const start = performance.now();
        const result = fn.apply(this, args);
        const end = performance.now();
        console.log(`${label} took ${(end - start).toFixed(2)}ms`);
        return result;
    };
}

// ==================== GLOBAL FUNCTIONS ====================

/**
 * Logout function - clears user data and redirects to login
 */
function logout() {
    // Clear user data
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    // Show notification
    showNotification('Logged out successfully', 'info');

    // Redirect to login after short delay
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 500);
}

/**
 * Save activity to history
 * @param {string} type - Activity type (explain, summarize, quiz, flashcard)
 * @param {string} title - Activity title/description
 */
function saveActivity(type, title) {
    const activities = storage.get('activities', []);
    activities.unshift({
        type: type,
        title: title,
        timestamp: new Date().toISOString()
    });

    // Keep only last 50 activities
    if (activities.length > 50) {
        activities.length = 50;
    }

    storage.set('activities', activities);
}

// ==================== EXPORT ====================

// Make utilities available globally
window.utils = {
    debounce,
    throttle,
    storage,
    notificationManager,
    showNotification,
    createElementFromHTML,
    batchAppend,
    memoize,
    smoothUpdate,
    loadScript,
    cancellableFetch,
    retryWithBackoff,
    measurePerformance,
    logout,
    saveActivity
};

// Add CSS animations if not already present
if (!document.getElementById('utils-animations')) {
    const style = document.createElement('style');
    style.id = 'utils-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(20px);
            }
        }
    `;
    document.head.appendChild(style);
}
