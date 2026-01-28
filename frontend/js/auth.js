// ==========================================
// Enhanced Authentication JavaScript
// Handles login, registration, password reset with security
// ==========================================

const API_BASE_URL = 'http://localhost:5000/api'; // Flask backend

// DOM Elements
const loginCard = document.getElementById('loginCard');
const registerCard = document.getElementById('registerCard');
const forgotPasswordCard = document.getElementById('forgotPasswordCard');
const resetPasswordCard = document.getElementById('resetPasswordCard');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const showLoginLink2 = document.getElementById('showLogin2');
const showForgotPasswordLink = document.getElementById('showForgotPassword');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');

// Toggle between forms
showRegisterLink?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllCards();
    registerCard.classList.remove('hidden');
    registerCard.style.animation = 'fadeInUp 0.6s ease';
});

showLoginLink?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllCards();
    loginCard.classList.remove('hidden');
    loginCard.style.animation = 'fadeInUp 0.6s ease';
});

showLoginLink2?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllCards();
    loginCard.classList.remove('hidden');
    loginCard.style.animation = 'fadeInUp 0.6s ease';
});

showForgotPasswordLink?.addEventListener('click', (e) => {
    e.preventDefault();
    hideAllCards();
    forgotPasswordCard.classList.remove('hidden');
    forgotPasswordCard.style.animation = 'fadeInUp 0.6s ease';
});

function hideAllCards() {
    loginCard.classList.add('hidden');
    registerCard.classList.add('hidden');
    forgotPasswordCard?.classList.add('hidden');
    resetPasswordCard?.classList.add('hidden');
}

// ==================== LOGIN ====================

loginForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    // Validate email
    const emailValidation = securityManager.validateEmail(email);
    if (!emailValidation.valid) {
        showNotification(emailValidation.error, 'error');
        emailInput.focus();
        return;
    }

    // Check if account is locked
    const lockStatus = securityManager.checkLoginAttempts(emailValidation.sanitized);
    if (lockStatus.locked) {
        showNotification(`Account locked due to too many failed attempts. Try again in ${lockStatus.remainingTime} minutes.`, 'error');
        return;
    }

    // Validate password
    if (!password) {
        showNotification('Password is required', 'error');
        passwordInput.focus();
        return;
    }

    // Disable submit button
    const submitBtn = loginForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';

    try {
        // Try backend authentication first
        const response = await fetch(`${API_BASE_URL}/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailValidation.sanitized,
                password
            })
        });

        if (response.ok) {
            const data = await response.json();
            handleSuccessfulLogin(data.user, data.token);
        } else {
            throw new Error('Backend login failed');
        }
    } catch (error) {
        // Fallback to client-side authentication
        console.log('Using client-side authentication');

        // Check if user exists in registered users
        const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
        const user = registeredUsers.find(u => u.email === emailValidation.sanitized);

        if (user && user.password === password) {
            // Successful login
            const token = securityManager.generateSessionToken();
            handleSuccessfulLogin({
                name: user.name,
                email: user.email,
                role: user.role || 'student'
            }, token);
        } else {
            // Failed login
            const attemptResult = securityManager.recordFailedAttempt(emailValidation.sanitized);

            if (attemptResult.locked) {
                showNotification('Too many failed attempts. Account locked for 15 minutes.', 'error');
            } else {
                showNotification(
                    `Invalid email or password. ${attemptResult.remainingAttempts} attempts remaining.`,
                    'error'
                );
            }

            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Sign In';
        }
    }
});

function handleSuccessfulLogin(user, token) {
    // Sanitize user data
    const sanitizedUser = {
        name: securityManager.sanitizeUsername(user.name),
        email: user.email,
        role: user.role || 'student'
    };

    // Clear login attempts
    securityManager.clearLoginAttempts(user.email);

    // Store user data and token
    localStorage.setItem('user', JSON.stringify(sanitizedUser));
    localStorage.setItem('token', token);
    localStorage.setItem('loginTime', Date.now().toString());

    showNotification('Login successful! Redirecting...', 'success');

    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1500);
}

// ==================== REGISTRATION ====================

registerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('registerName');
    const emailInput = document.getElementById('registerEmail');
    const passwordInput = document.getElementById('registerPassword');
    const roleSelect = document.getElementById('registerRole');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const role = roleSelect.value;

    // Validate name
    const sanitizedName = securityManager.sanitizeUsername(name);
    if (!sanitizedName || sanitizedName.length < 2) {
        showNotification('Please enter a valid name (at least 2 characters)', 'error');
        nameInput.focus();
        return;
    }

    // Validate email
    const emailValidation = securityManager.validateEmail(email);
    if (!emailValidation.valid) {
        showNotification(emailValidation.error, 'error');
        emailInput.focus();
        return;
    }

    // Validate password
    const passwordValidation = securityManager.validatePassword(password);
    if (!passwordValidation.valid) {
        showNotification(passwordValidation.error, 'error');
        passwordInput.focus();
        return;
    }

    // Show password strength
    if (passwordValidation.strength === 'weak') {
        showNotification('Password is weak. Consider using uppercase, numbers, and special characters.', 'warning');
    }

    // Check if email already exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    if (registeredUsers.some(u => u.email === emailValidation.sanitized)) {
        showNotification('Email already registered. Please login instead.', 'error');
        return;
    }

    // Disable submit button
    const submitBtn = registerForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering...';

    try {
        // Try backend registration
        const response = await fetch(`${API_BASE_URL}/register/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: sanitizedName,
                email: emailValidation.sanitized,
                password,
                role: role || 'student'
            })
        });

        if (response.ok) {
            handleSuccessfulRegistration(emailValidation.sanitized);
        } else {
            throw new Error('Backend registration failed');
        }
    } catch (error) {
        // Fallback to client-side registration
        console.log('Using client-side registration');

        registeredUsers.push({
            name: sanitizedName,
            email: emailValidation.sanitized,
            password: password, // In production, this should be hashed
            role: role || 'student'
        });
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        handleSuccessfulRegistration(emailValidation.sanitized);
    }
});

function handleSuccessfulRegistration(email) {
    showNotification('Registration successful! Please login.', 'success');

    setTimeout(() => {
        hideAllCards();
        loginCard.classList.remove('hidden');
        loginCard.style.animation = 'fadeInUp 0.6s ease';
        document.getElementById('loginEmail').value = email;

        // Reset form
        registerForm.reset();
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Register';
    }, 1500);
}

// ==================== FORGOT PASSWORD ====================

forgotPasswordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailInput = document.getElementById('forgotEmail');
    const email = emailInput.value.trim();

    // Validate email
    const emailValidation = securityManager.validateEmail(email);
    if (!emailValidation.valid) {
        showNotification(emailValidation.error, 'error');
        emailInput.focus();
        return;
    }

    // Check if user exists
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userExists = registeredUsers.some(u => u.email === emailValidation.sanitized);

    // Always show success message for security (don't reveal if email exists)
    const resetToken = securityManager.generateResetToken(emailValidation.sanitized);

    showNotification('If an account exists with this email, a password reset link has been sent.', 'info');

    // For demo purposes, show the reset link in console
    if (userExists) {
        console.log('Password Reset Link (Demo):', `reset-password.html?token=${resetToken}&email=${emailValidation.sanitized}`);

        // Simulate email sent - in production, this would be sent via email
        setTimeout(() => {
            showNotification('For demo: Check console for reset link', 'info');
        }, 2000);
    }

    // Reset form
    setTimeout(() => {
        forgotPasswordForm.reset();
        hideAllCards();
        loginCard.classList.remove('hidden');
    }, 3000);
});

// ==================== RESET PASSWORD ====================

resetPasswordForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Get token and email from URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const email = urlParams.get('email');

    if (!token || !email) {
        showNotification('Invalid reset link', 'error');
        return;
    }

    // Validate token
    if (!securityManager.validateResetToken(email, token)) {
        showNotification('Reset link expired or invalid. Please request a new one.', 'error');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
        return;
    }

    // Validate new password
    const passwordValidation = securityManager.validatePassword(newPassword);
    if (!passwordValidation.valid) {
        showNotification(passwordValidation.error, 'error');
        newPasswordInput.focus();
        return;
    }

    // Check if passwords match
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match', 'error');
        confirmPasswordInput.focus();
        return;
    }

    // Update password
    const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
    const userIndex = registeredUsers.findIndex(u => u.email === email);

    if (userIndex !== -1) {
        registeredUsers[userIndex].password = newPassword;
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));

        // Clear reset token
        securityManager.clearResetToken(email);

        showNotification('Password reset successful! Please login.', 'success');

        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } else {
        showNotification('User not found', 'error');
    }
});

// ==================== NOTIFICATION FUNCTION ====================

function showNotification(message, type = 'info') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

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

    setTimeout(() => {
        notification.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; transform: translateX(0); }
        to { opacity: 0; transform: translateX(20px); }
    }
`;
document.head.appendChild(style);

// Password visibility toggle
document.querySelectorAll('.input-wrapper i.fa-lock').forEach(icon => {
    icon.style.cursor = 'pointer';
    icon.addEventListener('click', function () {
        const input = this.parentElement.querySelector('input');
        if (input.type === 'password') {
            input.type = 'text';
            this.classList.remove('fa-lock');
            this.classList.add('fa-eye');
        } else {
            input.type = 'password';
            this.classList.remove('fa-eye');
            this.classList.add('fa-lock');
        }
    });
});
