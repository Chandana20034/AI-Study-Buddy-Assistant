// ==========================================
// AI Chatbot Widget
// Floating chatbot that appears on all pages
// ==========================================

class AIChatbot {
    constructor() {
        this.isOpen = false;
        this.messages = [];
        this.init();
    }

    init() {
        this.createChatWidget();
        this.loadChatHistory();
        this.attachEventListeners();
    }

    createChatWidget() {
        const chatHTML = `
            <!-- Chatbot Toggle Button -->
            <div id="chatbot-toggle" class="chatbot-toggle">
                <i class="fas fa-comments"></i>
                <span class="chat-badge" id="chatBadge">AI</span>
            </div>

            <!-- Chatbot Window -->
            <div id="chatbot-window" class="chatbot-window hidden">
                <div class="chatbot-header">
                    <div class="chatbot-title">
                        <i class="fas fa-robot"></i>
                        <span>AI Study Assistant</span>
                    </div>
                    <div class="chatbot-actions">
                        <button id="clearChat" class="chat-action-btn" title="Clear chat">
                            <i class="fas fa-trash"></i>
                        </button>
                        <button id="minimizeChat" class="chat-action-btn" title="Minimize">
                            <i class="fas fa-minus"></i>
                        </button>
                    </div>
                </div>

                <div class="chatbot-messages" id="chatMessages">
                    <div class="chat-message bot-message">
                        <div class="message-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="message-content">
                            <p>Hi! I'm your AI Study Assistant. How can I help you today?</p>
                            <div class="quick-actions">
                                <button class="quick-action" data-action="explain">Explain a topic</button>
                                <button class="quick-action" data-action="summarize">Summarize text</button>
                                <button class="quick-action" data-action="quiz">Create a quiz</button>
                                <button class="quick-action" data-action="help">Get help</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="chatbot-input">
                    <textarea 
                        id="chatInput" 
                        placeholder="Ask me anything about your studies..."
                        rows="1"
                    ></textarea>
                    <button id="sendMessage" class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        const toggleBtn = document.getElementById('chatbot-toggle');
        const minimizeBtn = document.getElementById('minimizeChat');
        const clearBtn = document.getElementById('clearChat');
        const sendBtn = document.getElementById('sendMessage');
        const chatInput = document.getElementById('chatInput');

        toggleBtn?.addEventListener('click', () => this.toggleChat());
        minimizeBtn?.addEventListener('click', () => this.toggleChat());
        clearBtn?.addEventListener('click', () => this.clearChat());
        sendBtn?.addEventListener('click', () => this.sendMessage());

        chatInput?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        chatInput?.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

        // Quick actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action')) {
                this.handleQuickAction(e.target.dataset.action);
            }
        });
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        const chatWindow = document.getElementById('chatbot-window');
        const toggleBtn = document.getElementById('chatbot-toggle');

        if (this.isOpen) {
            chatWindow.classList.remove('hidden');
            toggleBtn.classList.add('active');
            setTimeout(() => {
                document.getElementById('chatInput')?.focus();
            }, 300);
        } else {
            chatWindow.classList.add('hidden');
            toggleBtn.classList.remove('active');
        }
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();

        if (!message) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        input.value = '';
        input.style.height = 'auto';

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Use client-side AI service
            const response = await window.clientAI.chatResponse(message, this.messages.slice(-10));

            this.hideTypingIndicator();
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Chat error:', error);
            this.hideTypingIndicator();
            this.addMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }

        this.saveChatHistory();
    }

    addMessage(text, sender) {
        const messagesContainer = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}-message fade-in`;

        if (sender === 'bot') {
            messageDiv.innerHTML = `
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                    <p>${this.formatMessage(text)}</p>
                    <span class="message-time">${this.getTime()}</span>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="message-content">
                    <p>${this.escapeHtml(text)}</p>
                    <span class="message-time">${this.getTime()}</span>
                </div>
                <div class="message-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }

        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        this.messages.push({ text, sender, timestamp: new Date().toISOString() });
    }

    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    handleQuickAction(action) {
        const actions = {
            'explain': 'Can you explain a concept to me?',
            'summarize': 'I need help summarizing some text',
            'quiz': 'Can you create a quiz for me?',
            'help': 'What can you help me with?'
        };

        const message = actions[action];
        if (message) {
            document.getElementById('chatInput').value = message;
            this.sendMessage();
        }
    }

    clearChat() {
        if (confirm('Are you sure you want to clear the chat history?')) {
            this.messages = [];
            const messagesContainer = document.getElementById('chatMessages');
            messagesContainer.innerHTML = `
                <div class="chat-message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Chat cleared! How can I help you?</p>
                    </div>
                </div>
            `;
            this.saveChatHistory();
        }
    }

    formatMessage(text) {
        // Convert markdown-style formatting
        text = this.escapeHtml(text);
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/\n/g, '<br>');
        return text;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    getTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }

    saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.messages));
    }

    loadChatHistory() {
        const history = localStorage.getItem('chatHistory');
        if (history) {
            this.messages = JSON.parse(history);
            // Optionally restore messages to UI
        }
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.chatbot = new AIChatbot();
});
