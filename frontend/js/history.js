// ==========================================
// History Management JavaScript
// View, access, and delete study history
// ==========================================

let currentFilter = 'all';
let allActivities = [];

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    setupFilters();
});

// Load all history from localStorage
function loadHistory() {
    // Gather all activities from different sources
    const activities = storage.get('activities', []);
    const explanations = storage.get('explanations', []);
    const summaries = storage.get('summaries', []);
    const linkSummaries = storage.get('linkSummaries', []);

    // Combine all into unified format
    allActivities = [
        ...activities.map(a => ({
            ...a,
            id: generateId(),
            source: 'activity'
        })),
        ...explanations.map(e => ({
            type: 'explain',
            title: `Explained: ${e.topic}`,
            content: e.explanation,
            timestamp: e.timestamp,
            id: generateId(),
            source: 'explanation',
            topic: e.topic
        })),
        ...summaries.map(s => ({
            type: 'summarize',
            title: 'Summarized notes',
            content: s.summary,
            timestamp: s.timestamp,
            id: generateId(),
            source: 'summary'
        })),
        ...linkSummaries.map(ls => ({
            type: 'link-summary',
            title: `Link: ${ls.linkTitle}`,
            content: ls.summary,
            timestamp: ls.timestamp,
            id: generateId(),
            source: 'linkSummary',
            url: ls.url
        }))
    ];

    // Sort by timestamp (newest first)
    allActivities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    renderHistory();
}

// Generate unique ID
function generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
}

// Setup filter buttons
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Apply filter
            currentFilter = btn.dataset.filter;
            renderHistory();
        });
    });
}

// Render history items
function renderHistory() {
    const grid = document.getElementById('historyGrid');
    const emptyState = document.getElementById('emptyState');

    // Filter activities
    let filtered = allActivities;
    if (currentFilter !== 'all') {
        filtered = allActivities.filter(a => a.type === currentFilter);
    }

    // Show empty state if no items
    if (filtered.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    // Render items
    grid.innerHTML = filtered.map(item => createHistoryCard(item)).join('');
}

// Create history card HTML
function createHistoryCard(item) {
    const icon = getTypeIcon(item.type);
    const preview = getPreview(item);
    const date = formatDate(item.timestamp);
    const timeAgo = getTimeAgo(item.timestamp);

    return `
        <div class="history-item" data-id="${item.id}">
            <div class="history-item-header">
                <span class="history-type ${item.type}">
                    <i class="${icon}"></i>
                    ${getTypeName(item.type)}
                </span>
                <div class="history-actions">
                    <button class="history-action-btn" onclick="viewDetails('${item.id}')" title="View details">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="history-action-btn" onclick="reopenActivity('${item.id}')" title="Reopen">
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                    <button class="history-action-btn delete" onclick="deleteItem('${item.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            <div class="history-title">${escapeHtml(item.title)}</div>
            <div class="history-preview">${preview}</div>
            <div class="history-meta">
                <span><i class="fas fa-calendar"></i> ${date}</span>
                <span><i class="fas fa-clock"></i> ${timeAgo}</span>
            </div>
        </div>
    `;
}

// Get type icon
function getTypeIcon(type) {
    const icons = {
        'explain': 'fas fa-lightbulb',
        'summarize': 'fas fa-file-alt',
        'quiz': 'fas fa-question-circle',
        'flashcard': 'fas fa-layer-group',
        'link-summary': 'fas fa-link'
    };
    return icons[type] || 'fas fa-star';
}

// Get type name
function getTypeName(type) {
    const names = {
        'explain': 'Explanation',
        'summarize': 'Summary',
        'quiz': 'Quiz',
        'flashcard': 'Flashcards',
        'link-summary': 'Link Summary'
    };
    return names[type] || 'Activity';
}

// Get preview text
function getPreview(item) {
    if (item.content) {
        const text = typeof item.content === 'string' ? item.content : JSON.stringify(item.content);
        return escapeHtml(text.substring(0, 150)) + (text.length > 150 ? '...' : '');
    }
    return 'No preview available';
}

// Format date
function formatDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
}

// Get time ago
function getTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return formatDate(timestamp);
}

// View details in modal
function viewDetails(id) {
    const item = allActivities.find(a => a.id === id);
    if (!item) return;

    const modal = document.getElementById('detailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.innerHTML = `<i class="${getTypeIcon(item.type)}"></i> ${escapeHtml(item.title)}`;

    let content = '';
    if (item.content) {
        if (typeof item.content === 'string') {
            content = `<p style="white-space: pre-wrap;">${escapeHtml(item.content)}</p>`;
        } else {
            content = `<pre style="background: rgba(0,0,0,0.3); padding: 1rem; border-radius: 0.5rem; overflow-x: auto;">${JSON.stringify(item.content, null, 2)}</pre>`;
        }
    }

    modalBody.innerHTML = `
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.1);">
            <span class="history-type ${item.type}">
                <i class="${getTypeIcon(item.type)}"></i>
                ${getTypeName(item.type)}
            </span>
            <span style="margin-left: 1rem; color: var(--text-muted); font-size: 0.9rem;">
                <i class="fas fa-calendar"></i> ${formatDate(item.timestamp)}
            </span>
        </div>
        ${content}
    `;

    modal.classList.add('active');
}

// Close modal
function closeModal() {
    document.getElementById('detailModal').classList.remove('active');
}

// Close modal on outside click
document.getElementById('detailModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'detailModal') {
        closeModal();
    }
});

// Reopen activity in appropriate page
function reopenActivity(id) {
    const item = allActivities.find(a => a.id === id);
    if (!item) return;

    // For link summaries, open the original URL
    if (item.type === 'link-summary' && item.url) {
        window.open(item.url, '_blank');
        return;
    }

    const pages = {
        'explain': 'explainer.html',
        'summarize': 'summarizer.html',
        'quiz': 'quiz.html',
        'flashcard': 'flashcards.html'
    };

    const page = pages[item.type];
    if (page) {
        // Store item data for the target page to load
        sessionStorage.setItem('reopenData', JSON.stringify(item));
        window.location.href = page;
    }
}

// Delete single item
function deleteItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    const item = allActivities.find(a => a.id === id);
    if (!item) return;

    // Remove from appropriate storage
    if (item.source === 'activity') {
        const activities = storage.get('activities', []);
        const filtered = activities.filter(a =>
            !(a.type === item.type && a.timestamp === item.timestamp)
        );
        storage.set('activities', filtered);
    } else if (item.source === 'explanation') {
        const explanations = storage.get('explanations', []);
        const filtered = explanations.filter(e => e.timestamp !== item.timestamp);
        storage.set('explanations', filtered);
    } else if (item.source === 'summary') {
        const summaries = storage.get('summaries', []);
        const filtered = summaries.filter(s => s.timestamp !== item.timestamp);
        storage.set('summaries', filtered);
    } else if (item.source === 'linkSummary') {
        const linkSummaries = storage.get('linkSummaries', []);
        const filtered = linkSummaries.filter(ls => ls.timestamp !== item.timestamp);
        storage.set('linkSummaries', filtered);
    }

    // Remove from current list
    allActivities = allActivities.filter(a => a.id !== id);

    // Re-render
    renderHistory();
    showNotification('Item deleted successfully', 'success');
}

// Clear all history
function clearAllHistory() {
    if (!confirm('Are you sure you want to clear ALL history? This cannot be undone!')) return;

    // Clear all storage
    storage.set('activities', []);
    storage.set('explanations', []);
    storage.set('summaries', []);
    storage.set('linkSummaries', []);

    // Clear current list
    allActivities = [];

    // Re-render
    renderHistory();
    showNotification('All history cleared', 'success');
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
