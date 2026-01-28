// ==========================================
// Audio Recap JavaScript
// Handles text-to-speech conversion and audio playback
// ==========================================

let speechSynthesis = window.speechSynthesis;
let currentUtterance = null;
let isPlaying = false;
let availableVoices = [];

// DOM Elements - Cached for performance
const elements = {
    form: null,
    titleInput: null,
    contentInput: null,
    voiceSelect: null,
    speedSelect: null,
    playerCard: null,
    playPauseBtn: null,
    stopBtn: null,
    progressBar: null,
    currentTime: null,
    duration: null,
    currentTitle: null,
    savedRecaps: null,
    waveform: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    loadVoices();
    attachEventListeners();
    loadSavedRecaps();
});

function cacheElements() {
    elements.form = document.getElementById('audioRecapForm');
    elements.titleInput = document.getElementById('recapTitle');
    elements.contentInput = document.getElementById('recapContent');
    elements.voiceSelect = document.getElementById('voiceSelect');
    elements.speedSelect = document.getElementById('speedSelect');
    elements.playerCard = document.getElementById('audioPlayerCard');
    elements.playPauseBtn = document.getElementById('playPauseBtn');
    elements.stopBtn = document.getElementById('stopBtn');
    elements.progressBar = document.getElementById('progressBar');
    elements.currentTime = document.getElementById('currentTime');
    elements.duration = document.getElementById('duration');
    elements.currentTitle = document.getElementById('currentRecapTitle');
    elements.savedRecaps = document.getElementById('savedRecaps');
    elements.waveform = document.getElementById('waveform');
}

function loadVoices() {
    availableVoices = speechSynthesis.getVoices();

    if (availableVoices.length === 0) {
        speechSynthesis.addEventListener('voiceschanged', () => {
            availableVoices = speechSynthesis.getVoices();
            populateVoiceSelect();
        });
    } else {
        populateVoiceSelect();
    }
}

function populateVoiceSelect() {
    elements.voiceSelect.innerHTML = '<option value="default">Default Voice</option>';

    availableVoices.forEach((voice, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${voice.name} (${voice.lang})`;
        if (voice.default) {
            option.selected = true;
        }
        elements.voiceSelect.appendChild(option);
    });
}

function attachEventListeners() {
    elements.form?.addEventListener('submit', handleFormSubmit);
    elements.playPauseBtn?.addEventListener('click', togglePlayPause);
    elements.stopBtn?.addEventListener('click', stopAudio);
    elements.progressBar?.addEventListener('input', seekAudio);

    // Speed buttons
    document.querySelectorAll('.speed-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const speed = parseFloat(this.dataset.speed);
            setPlaybackSpeed(speed);

            // Update active state
            document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.getElementById('downloadAudio')?.addEventListener('click', downloadAudio);
}

function handleFormSubmit(e) {
    e.preventDefault();

    const title = elements.titleInput.value.trim();
    const content = elements.contentInput.value.trim();
    const voiceIndex = elements.voiceSelect.value;
    const speed = parseFloat(elements.speedSelect.value);

    if (!title || !content) {
        showNotification('Please fill in all fields', 'error');
        return;
    }

    // Create audio recap
    createAudioRecap(title, content, voiceIndex, speed);
}

function createAudioRecap(title, content, voiceIndex, speed) {
    // Stop any current playback
    if (currentUtterance) {
        speechSynthesis.cancel();
    }

    // Create new utterance
    currentUtterance = new SpeechSynthesisUtterance(content);

    // Set voice
    if (voiceIndex !== 'default' && availableVoices[voiceIndex]) {
        currentUtterance.voice = availableVoices[voiceIndex];
    }

    // Set speed
    currentUtterance.rate = speed;

    // Event handlers
    currentUtterance.onstart = () => {
        isPlaying = true;
        updatePlayPauseButton(true);
        startWaveformAnimation();
        estimateDuration(content, speed);
    };

    currentUtterance.onend = () => {
        isPlaying = false;
        updatePlayPauseButton(false);
        stopWaveformAnimation();
        elements.progressBar.value = 0;
        elements.currentTime.textContent = '0:00';
    };

    currentUtterance.onerror = (error) => {
        console.error('Speech synthesis error:', error);
        showNotification('Error generating audio', 'error');
    };

    // Show player
    elements.playerCard.style.display = 'block';
    elements.currentTitle.textContent = title;

    // Save recap
    saveRecap(title, content, voiceIndex, speed);

    // Start playback
    speechSynthesis.speak(currentUtterance);

    showNotification('Audio recap generated!', 'success');

    // Scroll to player
    elements.playerCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function togglePlayPause() {
    if (!currentUtterance) {
        showNotification('Please generate an audio recap first', 'info');
        return;
    }

    if (isPlaying) {
        speechSynthesis.pause();
        isPlaying = false;
        updatePlayPauseButton(false);
        stopWaveformAnimation();
    } else {
        if (speechSynthesis.paused) {
            speechSynthesis.resume();
        } else {
            speechSynthesis.speak(currentUtterance);
        }
        isPlaying = true;
        updatePlayPauseButton(true);
        startWaveformAnimation();
    }
}

function stopAudio() {
    speechSynthesis.cancel();
    isPlaying = false;
    updatePlayPauseButton(false);
    stopWaveformAnimation();
    elements.progressBar.value = 0;
    elements.currentTime.textContent = '0:00';
}

function seekAudio() {
    // Note: Web Speech API doesn't support seeking
    // This is a limitation of the browser API
    showNotification('Seeking not supported in browser speech synthesis', 'info');
}

function setPlaybackSpeed(speed) {
    if (currentUtterance) {
        currentUtterance.rate = speed;

        // Restart playback with new speed if currently playing
        if (isPlaying) {
            const wasPlaying = isPlaying;
            speechSynthesis.cancel();
            if (wasPlaying) {
                speechSynthesis.speak(currentUtterance);
            }
        }
    }
}

function updatePlayPauseButton(playing) {
    const icon = elements.playPauseBtn.querySelector('i');
    if (playing) {
        icon.className = 'fas fa-pause';
    } else {
        icon.className = 'fas fa-play';
    }
}

function estimateDuration(text, speed) {
    // Rough estimation: ~150 words per minute at normal speed
    const words = text.split(/\s+/).length;
    const minutes = (words / 150) / speed;
    const totalSeconds = Math.ceil(minutes * 60);

    elements.duration.textContent = formatTime(totalSeconds);

    // Simulate progress
    let elapsed = 0;
    const progressInterval = setInterval(() => {
        if (!isPlaying) {
            clearInterval(progressInterval);
            return;
        }

        elapsed++;
        const progress = (elapsed / totalSeconds) * 100;
        elements.progressBar.value = Math.min(progress, 100);
        elements.currentTime.textContent = formatTime(elapsed);

        if (elapsed >= totalSeconds) {
            clearInterval(progressInterval);
        }
    }, 1000);
}

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
}

let waveformAnimationId = null;

function startWaveformAnimation() {
    const canvas = elements.waveform;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    function animate() {
        ctx.fillStyle = 'rgba(15, 23, 42, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);

        for (let x = 0; x < canvas.width; x++) {
            const y = canvas.height / 2 + Math.sin((x + phase) * 0.02) * 20 * Math.random();
            ctx.lineTo(x, y);
        }

        const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop(0, '#3b82f6');
        gradient.addColorStop(1, '#ec4899');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.stroke();

        phase += 2;
        waveformAnimationId = requestAnimationFrame(animate);
    }

    animate();
}

function stopWaveformAnimation() {
    if (waveformAnimationId) {
        cancelAnimationFrame(waveformAnimationId);
        waveformAnimationId = null;
    }
}

function saveRecap(title, content, voiceIndex, speed) {
    const recap = {
        id: Date.now(),
        title,
        content,
        voiceIndex,
        speed,
        date: new Date().toISOString()
    };

    const recaps = utils.storage.get('audioRecaps', []);
    recaps.push(recap);
    utils.storage.set('audioRecaps', recaps);

    loadSavedRecaps();
}

function loadSavedRecaps() {
    const recaps = utils.storage.get('audioRecaps', []);

    if (recaps.length === 0) {
        elements.savedRecaps.innerHTML = `
            <p style="text-align: center; color: var(--text-muted); padding: 2rem;">
                <i class="fas fa-folder-open" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                No saved audio recaps yet
            </p>
        `;
        return;
    }

    const items = recaps.reverse().slice(0, 10).map(recap => `
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div style="flex: 1;">
                    <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">
                        <i class="fas fa-headphones"></i> ${recap.title}
                    </h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 0.5rem;">
                        <i class="fas fa-calendar"></i> ${new Date(recap.date).toLocaleString()}
                    </p>
                    <p style="color: var(--text-secondary); font-size: 0.85rem; line-height: 1.6;">
                        ${recap.content.substring(0, 100)}${recap.content.length > 100 ? '...' : ''}
                    </p>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="playRecap(${recap.id})" class="btn-primary btn-sm">
                        <i class="fas fa-play"></i>
                    </button>
                    <button onclick="deleteRecap(${recap.id})" class="btn-danger btn-sm">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    elements.savedRecaps.innerHTML = items;
}

function playRecap(id) {
    const recaps = utils.storage.get('audioRecaps', []);
    const recap = recaps.find(r => r.id === id);

    if (recap) {
        elements.titleInput.value = recap.title;
        elements.contentInput.value = recap.content;
        createAudioRecap(recap.title, recap.content, recap.voiceIndex, recap.speed);
    }
}

function deleteRecap(id) {
    if (confirm('Delete this audio recap?')) {
        const recaps = utils.storage.get('audioRecaps', []);
        const filtered = recaps.filter(r => r.id !== id);
        utils.storage.set('audioRecaps', filtered);
        loadSavedRecaps();
        showNotification('Audio recap deleted', 'success');
    }
}

function downloadAudio() {
    showNotification('Download feature requires server-side audio generation', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}
