// ==========================================
// Concept Explainer JavaScript
// Handles AI-powered concept explanation
// ==========================================

const explainerForm = document.getElementById('explainerForm');
const topicInput = document.getElementById('topicInput');
const detailsInput = document.getElementById('detailsInput');
const explanationOutput = document.getElementById('explanationOutput');
const saveButton = document.getElementById('saveExplanation');

// Handle form submission
explainerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const topic = topicInput.value.trim();

    if (!topic) {
        showNotification('Please enter a topic to explain', 'error');
        return;
    }

    // Show loading state
    explanationOutput.innerHTML = '<div class="loading-spinner"></div>';
    explanationOutput.classList.add('loading');

    try {
        // Use client-side AI service
        const explanation = await window.clientAI.explainConcept(
            topic,
            detailsInput.value.trim()
        );

        displayExplanation(explanation);
        saveButton.classList.remove('hidden');

        // Save to activity
        saveActivity('explain', `Explained: ${topic}`);
        showNotification('Explanation generated successfully!', 'success');
    } catch (error) {
        console.error('Explanation error:', error);
        explanationOutput.classList.remove('loading');
        explanationOutput.innerHTML = `
            <p style="color: var(--text-muted); text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 1rem; display: block;"></i>
                Unable to generate explanation. Please try again.
            </p>
        `;
        showNotification('Failed to generate explanation', 'error');
    }
});

// Display explanation
function displayExplanation(explanation) {
    explanationOutput.classList.remove('loading');

    // Format the explanation with better styling
    const formattedExplanation = explanation
        .split('\n\n')
        .map(para => `<p style="margin-bottom: 1rem; line-height: 1.8;">${para.replace(/\n/g, '<br>')}</p>`)
        .join('');

    explanationOutput.innerHTML = `
        <div style="color: var(--text-primary);">
            ${formattedExplanation}
        </div>
    `;
}

// Save explanation
saveButton?.addEventListener('click', () => {
    const topic = topicInput.value.trim();
    const explanation = explanationOutput.innerText;

    // Save to localStorage
    const savedExplanations = JSON.parse(localStorage.getItem('explanations') || '[]');
    savedExplanations.push({
        topic: topic,
        explanation: explanation,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('explanations', JSON.stringify(savedExplanations));

    showNotification('Explanation saved successfully!', 'success');
});
