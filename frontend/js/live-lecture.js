// ==========================================
// Live Lecture JavaScript
// Handles audio recording, transcription, and note-taking
// ==========================================

const FLASK_API_URL = 'http://localhost:5000/api';

let mediaRecorder = null;
let audioChunks = [];
let recordingStartTime = null;
let timerInterval = null;
let audioContext = null;
let analyser = null;
let animationId = null;
let isRecording = false;
let isPaused = false;

// DOM Elements - Cached for performance
const elements = {
    startBtn: null,
    pauseBtn: null,
    stopBtn: null,
    statusIcon: null,
    statusText: null,
    timer: null,
    transcription: null,
    notes: null,
    visualizer: null,
    savedRecordings: null
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    attachEventListeners();
    loadSavedRecordings();
    checkMicrophonePermission();
});

function cacheElements() {
    elements.startBtn = document.getElementById('startRecording');
    elements.pauseBtn = document.getElementById('pauseRecording');
    elements.stopBtn = document.getElementById('stopRecording');
    elements.statusIcon = document.getElementById('statusIcon');
    elements.statusText = document.getElementById('statusText');
    elements.timer = document.getElementById('recordingTimer');
    elements.transcription = document.getElementById('transcriptionOutput');
    elements.notes = document.getElementById('notesOutput');
    elements.visualizer = document.getElementById('audioVisualizer');
    elements.savedRecordings = document.getElementById('savedRecordings');
}

function attachEventListeners() {
    elements.startBtn?.addEventListener('click', startRecording);
    elements.pauseBtn?.addEventListener('click', pauseRecording);
    elements.stopBtn?.addEventListener('click', stopRecording);

    document.getElementById('clearTranscript')?.addEventListener('click', clearTranscription);
    document.getElementById('generateNotes')?.addEventListener('click', generateNotes);
    document.getElementById('saveNotes')?.addEventListener('click', saveNotes);
}

async function checkMicrophonePermission() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop());
        updateStatus('Ready to Record', '#10b981');
    } catch (error) {
        console.error('Microphone permission denied:', error);
        updateStatus('Microphone Access Denied', '#ef4444');
        showNotification('Please allow microphone access to use this feature', 'error');
    }
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Create MediaRecorder
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };

        mediaRecorder.onstop = handleRecordingStop;

        mediaRecorder.start(1000); // Collect data every second
        isRecording = true;
        isPaused = false;

        // Start timer
        recordingStartTime = Date.now();
        startTimer();

        // Setup audio visualization
        setupAudioVisualization(stream);

        // Update UI
        updateStatus('Recording...', '#ef4444');
        elements.startBtn.style.display = 'none';
        elements.pauseBtn.style.display = 'inline-flex';
        elements.stopBtn.style.display = 'inline-flex';
        elements.timer.style.display = 'block';

        // Start simulated transcription
        startTranscription();

        showNotification('Recording started', 'success');
    } catch (error) {
        console.error('Error starting recording:', error);
        showNotification('Failed to start recording. Please check microphone permissions.', 'error');
    }
}

function pauseRecording() {
    if (isPaused) {
        mediaRecorder.resume();
        isPaused = false;
        updateStatus('Recording...', '#ef4444');
        elements.pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
        startTimer();
    } else {
        mediaRecorder.pause();
        isPaused = true;
        updateStatus('Paused', '#f59e0b');
        elements.pauseBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
        stopTimer();
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }

    isRecording = false;
    isPaused = false;
    stopTimer();
    stopVisualization();

    // Update UI
    updateStatus('Processing...', '#3b82f6');
    elements.startBtn.style.display = 'inline-flex';
    elements.pauseBtn.style.display = 'none';
    elements.stopBtn.style.display = 'none';

    showNotification('Recording stopped. Processing...', 'info');
}

function handleRecordingStop() {
    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });

    // Save recording
    saveRecording(audioBlob);

    // Update status
    updateStatus('Ready to Record', '#10b981');
    elements.timer.style.display = 'none';
    elements.timer.textContent = '00:00:00';

    showNotification('Recording saved successfully!', 'success');
    document.getElementById('saveNotes').style.display = 'inline-flex';
}

function startTimer() {
    timerInterval = setInterval(() => {
        const elapsed = Date.now() - recordingStartTime;
        const hours = Math.floor(elapsed / 3600000);
        const minutes = Math.floor((elapsed % 3600000) / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);

        elements.timer.textContent =
            `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function setupAudioVisualization(stream) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);
    analyser.fftSize = 256;

    visualize();
}

function visualize() {
    const canvas = elements.visualizer;
    const canvasCtx = canvas.getContext('2d');
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function draw() {
        if (!isRecording) return;

        animationId = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        canvasCtx.fillStyle = 'rgba(15, 23, 42, 0.5)';
        canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

        const barWidth = (canvas.width / bufferLength) * 2.5;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
            barHeight = (dataArray[i] / 255) * canvas.height;

            const gradient = canvasCtx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, '#3b82f6');
            gradient.addColorStop(1, '#ec4899');

            canvasCtx.fillStyle = gradient;
            canvasCtx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

            x += barWidth + 1;
        }
    }

    draw();
}

function stopVisualization() {
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
}

function startTranscription() {
    // Simulated real-time transcription
    // In production, this would connect to a speech-to-text API
    const sampleTexts = [
        "Welcome to today's lecture on artificial intelligence.",
        "We'll be covering machine learning fundamentals.",
        "Neural networks are inspired by biological neurons.",
        "Deep learning has revolutionized computer vision.",
        "Natural language processing enables human-computer interaction."
    ];

    let index = 0;
    const transcriptionInterval = setInterval(() => {
        if (!isRecording || isPaused) {
            clearInterval(transcriptionInterval);
            return;
        }

        if (index < sampleTexts.length) {
            addTranscriptionText(sampleTexts[index]);
            index++;
        }
    }, 5000);
}

function addTranscriptionText(text) {
    if (elements.transcription.querySelector('.fa-info-circle')) {
        elements.transcription.innerHTML = '';
    }

    const p = document.createElement('p');
    p.textContent = text;
    p.style.marginBottom = '0.5rem';
    p.style.animation = 'fadeIn 0.3s ease';
    elements.transcription.appendChild(p);
    elements.transcription.scrollTop = elements.transcription.scrollHeight;
}

function clearTranscription() {
    if (confirm('Clear all transcription text?')) {
        elements.transcription.innerHTML = `
            <p style="color: var(--text-muted); text-align: center;">
                <i class="fas fa-info-circle"></i> Transcription will appear here as you speak...
            </p>
        `;
    }
}

async function generateNotes() {
    const transcriptionText = elements.transcription.innerText;

    if (!transcriptionText || transcriptionText.includes('Transcription will appear')) {
        showNotification('No transcription available to generate notes', 'error');
        return;
    }

    elements.notes.innerHTML = '<div class="loading-spinner"></div>';

    try {
        const response = await fetch(`${FLASK_API_URL}/summarize`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: transcriptionText })
        });

        const data = await response.json();

        if (response.ok) {
            displayNotes(data.summary, data.key_points);
            document.getElementById('saveNotes').style.display = 'inline-flex';
        } else {
            throw new Error('Failed to generate notes');
        }
    } catch (error) {
        console.error('Error generating notes:', error);
        // Fallback to simple formatting
        displayNotes(transcriptionText, ['Key point 1', 'Key point 2', 'Key point 3']);
    }
}

function displayNotes(summary, keyPoints) {
    const keyPointsHTML = keyPoints.map(point =>
        `<li style="margin-bottom: 0.5rem; padding-left: 0.5rem; border-left: 3px solid var(--secondary-blue);">${point}</li>`
    ).join('');

    elements.notes.innerHTML = `
        <div style="color: var(--text-primary);">
            <h3 style="color: var(--secondary-blue); margin-bottom: 1rem;">
                <i class="fas fa-file-alt"></i> Summary
            </h3>
            <p style="margin-bottom: 1.5rem; line-height: 1.8;">${summary}</p>
            
            <h3 style="color: var(--secondary-pink); margin-bottom: 1rem;">
                <i class="fas fa-star"></i> Key Points
            </h3>
            <ul style="list-style: none; padding: 0;">
                ${keyPointsHTML}
            </ul>
        </div>
    `;
}

function saveNotes() {
    const notesContent = elements.notes.innerText;
    const transcription = elements.transcription.innerText;

    const lectureData = {
        date: new Date().toISOString(),
        transcription: transcription,
        notes: notesContent,
        duration: elements.timer.textContent
    };

    const savedLectures = utils.storage.get('savedLectures', []);
    savedLectures.push(lectureData);
    utils.storage.set('savedLectures', savedLectures);

    showNotification('Notes saved successfully!', 'success');
    loadSavedRecordings();
}

function saveRecording(audioBlob) {
    const url = URL.createObjectURL(audioBlob);
    const recording = {
        id: Date.now(),
        date: new Date().toISOString(),
        duration: elements.timer.textContent,
        url: url
    };

    const recordings = utils.storage.get('recordings', []);
    recordings.push(recording);
    utils.storage.set('recordings', recordings);

    loadSavedRecordings();
}

function loadSavedRecordings() {
    const recordings = utils.storage.get('recordings', []);
    const lectures = utils.storage.get('savedLectures', []);

    if (recordings.length === 0 && lectures.length === 0) {
        elements.savedRecordings.innerHTML = `
            <p style="text-align: center; color: var(--text-muted); padding: 2rem;">
                <i class="fas fa-folder-open" style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem; display: block;"></i>
                No saved recordings yet
            </p>
        `;
        return;
    }

    const items = [...lectures].reverse().slice(0, 10).map((lecture, index) => `
        <div style="background: rgba(15, 23, 42, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 0.5rem; padding: 1rem; margin-bottom: 0.75rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h4 style="color: var(--text-primary); margin-bottom: 0.5rem;">
                        <i class="fas fa-microphone"></i> Lecture ${lectures.length - index}
                    </h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">
                        <i class="fas fa-calendar"></i> ${new Date(lecture.date).toLocaleString()}
                        <span style="margin-left: 1rem;"><i class="fas fa-clock"></i> ${lecture.duration}</span>
                    </p>
                </div>
                <button onclick="deleteLecture(${lectures.length - index - 1})" class="btn-danger btn-sm">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    elements.savedRecordings.innerHTML = items;
}

function deleteLecture(index) {
    if (confirm('Delete this lecture?')) {
        const lectures = utils.storage.get('savedLectures', []);
        lectures.splice(index, 1);
        utils.storage.set('savedLectures', lectures);
        loadSavedRecordings();
        showNotification('Lecture deleted', 'success');
    }
}

function updateStatus(text, color) {
    elements.statusText.textContent = text;
    elements.statusIcon.style.color = color;
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = 'login.html';
    }
}

// Add fadeIn animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
