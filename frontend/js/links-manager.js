// ==========================================
// Links Manager JavaScript
// Save, organize, and manage study resource URLs
// ==========================================

// Links storage
let allLinks = [];
let filteredLinks = [];

// DOM Elements - Cached for performance
const elements = {
    form: null,
    titleInput: null,
    urlInput: null,
    categorySelect: null,
    tagsInput: null,
    descriptionInput: null,
    filterCategory: null,
    searchInput: null,
    sortSelect: null,
    linksList: null,
    exportBtn: null,
    importBtn: null,
    importFileInput: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    attachEventListeners();
    loadLinks();
    updateStatistics();
});

function cacheElements() {
    elements.form = document.getElementById('addLinkForm');
    elements.titleInput = document.getElementById('linkTitle');
    elements.urlInput = document.getElementById('linkUrl');
    elements.categorySelect = document.getElementById('linkCategory');
    elements.tagsInput = document.getElementById('linkTags');
    elements.descriptionInput = document.getElementById('linkDescription');
    elements.filterCategory = document.getElementById('filterCategory');
    elements.searchInput = document.getElementById('searchLinks');
    elements.sortSelect = document.getElementById('sortLinks');
    elements.linksList = document.getElementById('linksList');
    elements.exportBtn = document.getElementById('exportLinks');
    elements.importBtn = document.getElementById('importLinks');
    elements.importFileInput = document.getElementById('importFileInput');
}

function attachEventListeners() {
    elements.form?.addEventListener('submit', handleAddLink);
    elements.filterCategory?.addEventListener('change', applyFilters);
    elements.searchInput?.addEventListener('input', utils.debounce(applyFilters, 300));
    elements.sortSelect?.addEventListener('change', applyFilters);
    elements.exportBtn?.addEventListener('click', exportLinks);
    elements.importBtn?.addEventListener('click', () => elements.importFileInput.click());
    elements.importFileInput?.addEventListener('change', importLinks);
}

function handleAddLink(e) {
    e.preventDefault();

    const title = elements.titleInput.value.trim();
    const url = elements.urlInput.value.trim();
    const category = elements.categorySelect.value;
    const tags = elements.tagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag);
    const description = elements.descriptionInput.value.trim();

    // Validate URL
    try {
        new URL(url);
    } catch (error) {
        showNotification('Please enter a valid URL', 'error');
        return;
    }

    const link = {
        id: Date.now(),
        title,
        url,
        category,
        tags,
        description,
        dateAdded: new Date().toISOString(),
        clicks: 0
    };

    allLinks.push(link);
    saveLinks();
    loadLinks();
    updateStatistics();

    // Reset form
    elements.form.reset();
    showNotification('Link saved successfully!', 'success');
}

function saveLinks() {
    utils.storage.set('savedLinks', allLinks);
}

function loadLinks() {
    allLinks = utils.storage.get('savedLinks', []);
    applyFilters();
}

function applyFilters() {
    const categoryFilter = elements.filterCategory.value;
    const searchQuery = elements.searchInput.value.toLowerCase().trim();
    const sortBy = elements.sortSelect.value;

    // Filter by category
    filteredLinks = categoryFilter
        ? allLinks.filter(link => link.category === categoryFilter)
        : [...allLinks];

    // Filter by search query
    if (searchQuery) {
        filteredLinks = filteredLinks.filter(link => {
            return link.title.toLowerCase().includes(searchQuery) ||
                link.url.toLowerCase().includes(searchQuery) ||
                link.description.toLowerCase().includes(searchQuery) ||
                link.tags.some(tag => tag.toLowerCase().includes(searchQuery));
        });
    }

    // Sort
    switch (sortBy) {
        case 'newest':
            filteredLinks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
            break;
        case 'oldest':
            filteredLinks.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
            break;
        case 'title':
            filteredLinks.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'category':
            filteredLinks.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }

    displayLinks();
}

function displayLinks() {
    if (filteredLinks.length === 0) {
        elements.linksList.innerHTML = `
            <p style="text-align: center; color: var(--text-muted); padding: 3rem;">
                <i class="fas fa-link" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                ${allLinks.length === 0 ? 'No links saved yet. Add your first link above!' : 'No links match your filters.'}
            </p>
        `;
        return;
    }

    const linksHTML = filteredLinks.map(link => {
        const categoryEmoji = getCategoryEmoji(link.category);
        const tagsHTML = link.tags.map(tag =>
            `<span class="link-tag">#${tag}</span>`
        ).join('');

        return `
            <div class="link-item">
                <div class="link-header">
                    <div style="flex: 1;">
                        <h3 class="link-title">
                            <i class="fas fa-bookmark" style="color: var(--secondary-blue); margin-right: 0.5rem;"></i>
                            ${escapeHtml(link.title)}
                        </h3>
                        <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link-url" onclick="incrementClicks(${link.id})">
                            <i class="fas fa-external-link-alt"></i> ${escapeHtml(link.url)}
                        </a>
                        ${link.description ? `<p style="color: var(--text-secondary); margin-top: 0.5rem; line-height: 1.6;">${escapeHtml(link.description)}</p>` : ''}
                    </div>
                    <div class="link-actions">
                        <button onclick="summarizeLink(${link.id})" class="btn-secondary btn-sm" title="Summarize">
                            <i class="fas fa-file-alt"></i> Summarize
                        </button>
                        <button onclick="copyLink('${escapeHtml(link.url)}')" class="btn-secondary btn-sm" title="Copy URL">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button onclick="editLink(${link.id})" class="btn-secondary btn-sm" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="deleteLink(${link.id})" class="btn-danger btn-sm" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="link-meta">
                    <span class="link-category">${categoryEmoji} ${link.category}</span>
                    ${tagsHTML}
                    <span class="link-date">
                        <i class="fas fa-calendar"></i> ${formatDate(link.dateAdded)}
                    </span>
                    <span class="link-date">
                        <i class="fas fa-mouse-pointer"></i> ${link.clicks} clicks
                    </span>
                </div>
            </div>
        `;
    }).join('');

    elements.linksList.innerHTML = linksHTML;
}

function getCategoryEmoji(category) {
    const emojis = {
        'Documentation': '📚',
        'Tutorial': '🎓',
        'Video': '🎥',
        'Article': '📄',
        'Tool': '🔧',
        'Reference': '📖',
        'Course': '🏫',
        'Other': '📌'
    };
    return emojis[category] || '📌';
}

function incrementClicks(linkId) {
    const link = allLinks.find(l => l.id === linkId);
    if (link) {
        link.clicks++;
        saveLinks();
    }
}

async function summarizeLink(linkId) {
    const link = allLinks.find(l => l.id === linkId);
    if (!link) return;

    // Create and show loading modal
    const modal = createSummaryModal(link);
    document.body.appendChild(modal);

    const summaryContent = modal.querySelector('.summary-content');
    summaryContent.innerHTML = `
        <div style="text-align: center; padding: 2rem;">
            <i class="fas fa-spinner fa-spin" style="font-size: 2rem; color: var(--secondary-blue);"></i>
            <p style="margin-top: 1rem; color: var(--text-secondary);">Fetching and analyzing content...</p>
        </div>
    `;

    try {
        // Fetch content and AI summary from backend
        let aiSummary = '';
        let pageTitle = '';
        let fetchSuccess = false;

        try {
            // Use backend API to fetch URL content and generate AI summary
            const response = await fetch('http://localhost:5000/api/fetch-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ url: link.url })
            });

            if (response.ok) {
                const data = await response.json();
                if (data.success && data.summary) {
                    aiSummary = data.summary;
                    pageTitle = data.title;
                    fetchSuccess = true;
                }
            }
        } catch (fetchError) {
            console.log('Could not fetch URL content from backend:', fetchError);
        }

        let summary;
        if (fetchSuccess && aiSummary) {
            // Format AI-generated summary
            summary = `# 📚 ${link.title}\n\n`;
            summary += `**Source:** ${new URL(link.url).hostname.replace('www.', '')} • **Category:** ${link.category}\n\n`;

            if (pageTitle && pageTitle !== link.title) {
                summary += `**Page Title:** ${pageTitle}\n\n`;
            }

            summary += `## 📖 AI Summary\n\n`;
            summary += `${aiSummary}\n\n`;

            if (link.tags && link.tags.length > 0) {
                summary += `**Tags:** ${link.tags.map(tag => `\`${tag}\``).join(', ')}\n\n`;
            }

            summary += `---\n\n`;
            summary += `📎 [Open Link](${link.url})\n`;
        } else {
            // Fall back to intelligent URL analysis
            summary = generateIntelligentSummary(link);
            summary = `> **Note:** Could not fetch page content. Summary based on URL analysis.\n\n` + summary;
        }

        // Display the summary
        summaryContent.innerHTML = `
            <div style="line-height: 1.8; color: var(--text-secondary);">
                ${formatSummaryText(summary)}
            </div>
            <div style="margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid rgba(255, 255, 255, 0.1); display: flex; gap: 0.5rem; justify-content: flex-end;">
                <button onclick="copySummary(this)" class="btn-secondary btn-sm">
                    <i class="fas fa-copy"></i> Copy Summary
                </button>
                <button onclick="saveSummary(${linkId}, this)" class="btn-primary btn-sm">
                    <i class="fas fa-save"></i> Save to History
                </button>
            </div>
        `;

        // Store the summary in the modal for later use
        modal.dataset.summary = summary;

    } catch (error) {
        console.error('Summarization error:', error);
        summaryContent.innerHTML = `
            <div style="text-align: center; padding: 2rem; color: var(--danger);">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; display: block;"></i>
                <p>Failed to generate summary. Please try again.</p>
            </div>
        `;
    }
}

function generateContentBasedSummary(link, content, pageTitle) {
    // Analyze the actual content
    const words = content.split(/\s+/).filter(word => word.length > 3);
    const wordCount = words.length;

    // Extract key phrases (simple frequency analysis)
    const wordFreq = {};
    words.forEach(word => {
        const lower = word.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (lower.length > 4) {
            wordFreq[lower] = (wordFreq[lower] || 0) + 1;
        }
    });

    // Get top keywords
    const topWords = Object.entries(wordFreq)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8)
        .map(([word]) => word);

    // Extract first meaningful sentences as preview
    const sentences = content.match(/[^.!?]+[.!?]+/g) || [];
    const preview = sentences.slice(0, 2).join(' ').substring(0, 250);

    // Build concise summary
    let summary = `# 📚 ${link.title}\n\n`;

    // Brief overview
    summary += `**${new URL(link.url).hostname.replace('www.', '')}** • ${link.category} • ~${wordCount} words\n\n`;

    // Content preview
    if (preview) {
        summary += `## 📖 Summary\n`;
        summary += `${preview}...\n\n`;
    }

    // Key topics
    summary += `## 🔑 Key Topics\n`;
    summary += topWords.slice(0, 6).map(word => `• ${word.charAt(0).toUpperCase() + word.slice(1)}`).join('\n');
    summary += '\n\n';

    // Quick study tips
    summary += `## 💡 Study Tips\n`;
    summary += `• Read thoroughly and take notes\n`;
    summary += `• Focus on key concepts and examples\n`;
    summary += `• Practice applying what you learn\n\n`;

    // Tags if available
    if (link.tags && link.tags.length > 0) {
        summary += `**Tags:** ${link.tags.map(tag => `\`${tag}\``).join(', ')}\n`;
    }

    return summary;
}

function generateIntelligentSummary(link) {
    // Parse URL to get domain and path info
    let domain = '';
    let urlType = '';
    try {
        const url = new URL(link.url);
        domain = url.hostname.replace('www.', '');
        urlType = analyzeUrlType(url, link.category);
    } catch (e) {
        domain = 'Unknown';
    }

    // Build comprehensive summary
    let summary = `# 📚 Resource Summary: ${link.title}\n\n`;

    // Resource Overview
    summary += `## 🎯 Overview\n`;
    summary += `**Source:** ${domain}\n`;
    summary += `**Category:** ${link.category}\n`;
    summary += `**URL:** ${link.url}\n\n`;

    if (link.description) {
        summary += `**Description:** ${link.description}\n\n`;
    }

    // Main Topic and Purpose
    summary += `## 📖 Main Topic and Purpose\n`;
    summary += urlType.purpose + '\n\n';

    // Key Points
    summary += `## ✨ Key Points and Takeaways\n`;
    urlType.keyPoints.forEach((point, index) => {
        summary += `${index + 1}. **${point.title}:** ${point.description}\n`;
    });
    summary += '\n';

    // Target Audience
    summary += `## 👥 Target Audience\n`;
    summary += urlType.audience + '\n\n';

    // Study Tips
    summary += `## 💡 How to Use This Resource for Studying\n`;
    urlType.studyTips.forEach((tip, index) => {
        summary += `• **${tip.title}:** ${tip.description}\n`;
    });
    summary += '\n';

    // Tags
    if (link.tags && link.tags.length > 0) {
        summary += `## 🏷️ Tags\n`;
        summary += link.tags.map(tag => `\`${tag}\``).join(', ') + '\n\n';
    }

    // Additional Notes
    summary += `## 📝 Additional Notes\n`;
    summary += `• **Added:** ${formatDate(link.dateAdded)}\n`;
    summary += `• **Times Accessed:** ${link.clicks} clicks\n`;
    summary += `• **Best For:** ${urlType.bestFor}\n`;

    return summary;
}

function analyzeUrlType(url, category) {
    const domain = url.hostname.toLowerCase();
    const path = url.pathname.toLowerCase();

    // Analyze based on domain and category
    const analysis = {
        purpose: '',
        keyPoints: [],
        audience: '',
        studyTips: [],
        bestFor: ''
    };

    // Domain-specific analysis
    if (domain.includes('youtube.com') || domain.includes('youtu.be')) {
        analysis.purpose = 'Video-based learning resource providing visual and auditory explanations of concepts.';
        analysis.keyPoints = [
            { title: 'Visual Learning', description: 'Demonstrates concepts through video format' },
            { title: 'Step-by-Step', description: 'Often includes detailed walkthroughs and examples' },
            { title: 'Engaging Content', description: 'Interactive and easy to follow along' }
        ];
        analysis.audience = 'Visual learners, beginners to advanced students who prefer video explanations';
        analysis.studyTips = [
            { title: 'Take Notes', description: 'Pause and write down key concepts as you watch' },
            { title: 'Practice Along', description: 'Try examples yourself while following the video' },
            { title: 'Rewatch', description: 'Review difficult sections multiple times' }
        ];
        analysis.bestFor = 'Understanding complex concepts through visual demonstrations';
    } else if (domain.includes('github.com')) {
        analysis.purpose = 'Code repository and collaborative development platform with practical examples and projects.';
        analysis.keyPoints = [
            { title: 'Source Code', description: 'Access to actual implementation and code examples' },
            { title: 'Documentation', description: 'README files and wiki pages with detailed explanations' },
            { title: 'Community', description: 'Issues, discussions, and contributions from developers' }
        ];
        analysis.audience = 'Developers, programmers, and students learning through code examples';
        analysis.studyTips = [
            { title: 'Clone & Experiment', description: 'Download the code and run it locally' },
            { title: 'Read the Code', description: 'Study the implementation to understand patterns' },
            { title: 'Check Issues', description: 'Learn from problems others have encountered' }
        ];
        analysis.bestFor = 'Hands-on learning through real code examples and projects';
    } else if (domain.includes('stackoverflow.com')) {
        analysis.purpose = 'Q&A platform with solutions to specific programming problems and technical questions.';
        analysis.keyPoints = [
            { title: 'Problem Solutions', description: 'Answers to specific technical questions' },
            { title: 'Multiple Approaches', description: 'Different solutions and perspectives' },
            { title: 'Community Validated', description: 'Upvoted answers indicate quality solutions' }
        ];
        analysis.audience = 'Developers seeking solutions to specific problems or debugging help';
        analysis.studyTips = [
            { title: 'Read All Answers', description: 'Review multiple solutions to understand different approaches' },
            { title: 'Check Comments', description: 'Important caveats and edge cases are often in comments' },
            { title: 'Try the Code', description: 'Test solutions in your own environment' }
        ];
        analysis.bestFor = 'Solving specific problems and understanding different solution approaches';
    } else if (domain.includes('medium.com') || domain.includes('dev.to')) {
        analysis.purpose = 'Technical article or blog post sharing knowledge, tutorials, and insights.';
        analysis.keyPoints = [
            { title: 'In-Depth Explanation', description: 'Detailed writeups of concepts and techniques' },
            { title: 'Real-World Examples', description: 'Practical applications and use cases' },
            { title: 'Personal Insights', description: 'Author\'s experience and recommendations' }
        ];
        analysis.audience = 'Learners seeking comprehensive explanations and practical insights';
        analysis.studyTips = [
            { title: 'Highlight Key Points', description: 'Mark important concepts as you read' },
            { title: 'Follow Along', description: 'Try examples in your own development environment' },
            { title: 'Bookmark', description: 'Save for future reference and review' }
        ];
        analysis.bestFor = 'Deep understanding of topics through detailed explanations';
    } else if (domain.includes('docs.') || domain.includes('documentation')) {
        analysis.purpose = 'Official documentation providing comprehensive reference material and guides.';
        analysis.keyPoints = [
            { title: 'Authoritative Source', description: 'Official and most accurate information' },
            { title: 'Complete Reference', description: 'Comprehensive coverage of all features' },
            { title: 'API Details', description: 'Detailed specifications and usage examples' }
        ];
        analysis.audience = 'All skill levels seeking accurate, official information';
        analysis.studyTips = [
            { title: 'Use Search', description: 'Utilize the documentation search for specific topics' },
            { title: 'Read Examples', description: 'Focus on code examples and use cases' },
            { title: 'Bookmark Sections', description: 'Save frequently referenced pages' }
        ];
        analysis.bestFor = 'Reference material and learning official APIs and features';
    } else {
        // Generic analysis based on category
        switch (category) {
            case 'Documentation':
                analysis.purpose = 'Reference documentation for learning and looking up information.';
                analysis.keyPoints = [
                    { title: 'Comprehensive', description: 'Complete coverage of the topic' },
                    { title: 'Structured', description: 'Organized for easy navigation' },
                    { title: 'Searchable', description: 'Find specific information quickly' }
                ];
                analysis.audience = 'Students and professionals needing reference material';
                analysis.studyTips = [
                    { title: 'Bookmark', description: 'Save for quick reference' },
                    { title: 'Take Notes', description: 'Create your own summary of key points' },
                    { title: 'Practice', description: 'Apply what you learn immediately' }
                ];
                analysis.bestFor = 'Quick reference and comprehensive learning';
                break;
            case 'Tutorial':
                analysis.purpose = 'Step-by-step guide to learn specific skills or concepts.';
                analysis.keyPoints = [
                    { title: 'Guided Learning', description: 'Structured progression through topics' },
                    { title: 'Hands-On', description: 'Practical exercises and examples' },
                    { title: 'Beginner-Friendly', description: 'Designed for learning from scratch' }
                ];
                analysis.audience = 'Beginners and intermediate learners';
                analysis.studyTips = [
                    { title: 'Follow Along', description: 'Complete each step as you go' },
                    { title: 'Practice', description: 'Repeat exercises until comfortable' },
                    { title: 'Build Projects', description: 'Apply concepts to your own projects' }
                ];
                analysis.bestFor = 'Learning new skills through guided practice';
                break;
            case 'Video':
                analysis.purpose = 'Video content for visual and auditory learning.';
                analysis.keyPoints = [
                    { title: 'Visual Demonstrations', description: 'See concepts in action' },
                    { title: 'Engaging Format', description: 'Interactive and easy to follow' },
                    { title: 'Replayable', description: 'Watch multiple times as needed' }
                ];
                analysis.audience = 'Visual learners of all levels';
                analysis.studyTips = [
                    { title: 'Take Notes', description: 'Write down key points while watching' },
                    { title: 'Pause & Practice', description: 'Try examples yourself' },
                    { title: 'Review', description: 'Rewatch difficult sections' }
                ];
                analysis.bestFor = 'Understanding through visual demonstrations';
                break;
            case 'Article':
                analysis.purpose = 'Written content providing information and insights.';
                analysis.keyPoints = [
                    { title: 'Detailed Information', description: 'In-depth coverage of topics' },
                    { title: 'Written Format', description: 'Easy to skim and reference' },
                    { title: 'Shareable', description: 'Easy to share and discuss' }
                ];
                analysis.audience = 'Readers seeking detailed written explanations';
                analysis.studyTips = [
                    { title: 'Highlight', description: 'Mark important passages' },
                    { title: 'Summarize', description: 'Write your own summary' },
                    { title: 'Discuss', description: 'Share insights with study groups' }
                ];
                analysis.bestFor = 'Deep reading and understanding';
                break;
            default:
                analysis.purpose = 'Educational resource for learning and reference.';
                analysis.keyPoints = [
                    { title: 'Learning Resource', description: 'Provides valuable information' },
                    { title: 'Study Material', description: 'Useful for academic purposes' },
                    { title: 'Reference', description: 'Can be consulted as needed' }
                ];
                analysis.audience = 'Students and learners';
                analysis.studyTips = [
                    { title: 'Review Regularly', description: 'Revisit the material periodically' },
                    { title: 'Take Notes', description: 'Document key learnings' },
                    { title: 'Apply Knowledge', description: 'Use what you learn in practice' }
                ];
                analysis.bestFor = 'General learning and reference';
        }
    }

    return analysis;
}

function createSummaryModal(link) {
    const modal = document.createElement('div');
    modal.className = 'summary-modal';
    modal.innerHTML = `
        <div class="summary-modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="summary-modal-content">
            <div class="summary-modal-header">
                <div>
                    <h2 style="margin: 0; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
                        <i class="fas fa-file-alt" style="color: var(--secondary-blue);"></i>
                        Summary
                    </h2>
                    <p style="margin: 0.5rem 0 0 0; color: var(--text-muted); font-size: 0.9rem;">
                        ${escapeHtml(link.title)}
                    </p>
                </div>
                <button onclick="this.closest('.summary-modal').remove()" class="modal-close-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="summary-content"></div>
        </div>
    `;
    return modal;
}

function formatSummaryText(text) {
    // Convert markdown-style formatting to HTML
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/^(.+)$/, '<p>$1</p>');
}

function copySummary(button) {
    const modal = button.closest('.summary-modal');
    const summary = modal.dataset.summary;

    navigator.clipboard.writeText(summary).then(() => {
        showNotification('Summary copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy summary', 'error');
    });
}

function saveSummary(linkId, button) {
    const modal = button.closest('.summary-modal');
    const summary = modal.dataset.summary;
    const link = allLinks.find(l => l.id === linkId);

    if (!link) return;

    // Save to linkSummaries storage for history page
    const linkSummaryItem = {
        linkTitle: link.title,
        url: link.url,
        category: link.category,
        summary: summary,
        timestamp: new Date().toISOString()
    };

    const linkSummaries = utils.storage.get('linkSummaries', []);
    linkSummaries.unshift(linkSummaryItem);
    utils.storage.set('linkSummaries', linkSummaries);

    showNotification('Summary saved to history!', 'success');
    modal.remove();
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        showNotification('URL copied to clipboard!', 'success');
    }).catch(() => {
        showNotification('Failed to copy URL', 'error');
    });
}

function editLink(linkId) {
    const link = allLinks.find(l => l.id === linkId);
    if (!link) return;

    elements.titleInput.value = link.title;
    elements.urlInput.value = link.url;
    elements.categorySelect.value = link.category;
    elements.tagsInput.value = link.tags.join(', ');
    elements.descriptionInput.value = link.description;

    // Delete old link
    deleteLink(linkId, false);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showNotification('Edit the link and save', 'info');
}

function deleteLink(linkId, confirm = true) {
    if (confirm && !window.confirm('Delete this link?')) return;

    allLinks = allLinks.filter(l => l.id !== linkId);
    saveLinks();
    loadLinks();
    updateStatistics();

    if (confirm) {
        showNotification('Link deleted', 'success');
    }
}

function exportLinks() {
    if (allLinks.length === 0) {
        showNotification('No links to export', 'info');
        return;
    }

    const dataStr = JSON.stringify(allLinks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `study-links-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    URL.revokeObjectURL(url);
    showNotification('Links exported successfully!', 'success');
}

function importLinks(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedLinks = JSON.parse(event.target.result);

            if (!Array.isArray(importedLinks)) {
                throw new Error('Invalid file format');
            }

            // Merge with existing links (avoid duplicates by URL)
            const existingUrls = new Set(allLinks.map(l => l.url));
            const newLinks = importedLinks.filter(link => !existingUrls.has(link.url));

            allLinks = [...allLinks, ...newLinks];
            saveLinks();
            loadLinks();
            updateStatistics();

            showNotification(`Imported ${newLinks.length} new links!`, 'success');
        } catch (error) {
            console.error('Import error:', error);
            showNotification('Failed to import links. Invalid file format.', 'error');
        }
    };

    reader.readAsText(file);
    e.target.value = ''; // Reset file input
}

function updateStatistics() {
    // Total links
    document.getElementById('totalLinks').textContent = allLinks.length;

    // Total categories
    const categories = new Set(allLinks.map(l => l.category));
    document.getElementById('totalCategories').textContent = categories.size;

    // Total unique tags
    const tags = new Set(allLinks.flatMap(l => l.tags));
    document.getElementById('totalTags').textContent = tags.size;

    // Links added this week
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const linksThisWeek = allLinks.filter(l => new Date(l.dateAdded) > oneWeekAgo).length;
    document.getElementById('linksThisWeek').textContent = linksThisWeek;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}
