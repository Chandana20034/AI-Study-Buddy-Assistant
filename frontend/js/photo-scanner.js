// ==========================================
// Photo Scanner JavaScript
// Handles image upload, webcam, OCR, translation, and summarization
// ==========================================

let currentImage = null;
let extractedText = '';
let webcamStream = null;

// ==========================================
// File Upload Handlers
// ==========================================

// Drag and drop handlers
const uploadSection = document.getElementById('uploadSection');

uploadSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadSection.classList.add('dragover');
});

uploadSection.addEventListener('dragleave', () => {
    uploadSection.classList.remove('dragover');
});

uploadSection.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadSection.classList.remove('dragover');

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleFile(files[0]);
    }
});

// File input handler
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        handleFile(file);
    }
}

function handleFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        showPreview(currentImage);
    };
    reader.readAsDataURL(file);
}

function showPreview(imageData) {
    document.getElementById('uploadSection').style.display = 'none';
    document.getElementById('previewSection').classList.add('active');
    document.getElementById('imagePreview').src = imageData;
}

// ==========================================
// Webcam Handlers
// ==========================================

async function startWebcam() {
    try {
        webcamStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' }
        });

        const video = document.getElementById('webcamVideo');
        video.srcObject = webcamStream;

        document.getElementById('uploadSection').style.display = 'none';
        document.getElementById('webcamSection').classList.add('active');
    } catch (error) {
        console.error('Error accessing webcam:', error);
        alert('Unable to access webcam. Please check permissions.');
    }
}

function capturePhoto() {
    const video = document.getElementById('webcamVideo');
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);

    currentImage = canvas.toDataURL('image/png');
    stopWebcam();
    showPreview(currentImage);
}

function stopWebcam() {
    if (webcamStream) {
        webcamStream.getTracks().forEach(track => track.stop());
        webcamStream = null;
    }
    document.getElementById('webcamSection').classList.remove('active');
    document.getElementById('uploadSection').style.display = 'block';
}

// ==========================================
// OCR Processing
// ==========================================

async function processImage() {
    if (!currentImage) return;

    showProcessing(true, 'Extracting text from image...');

    try {
        // Perform OCR using Tesseract.js
        const result = await Tesseract.recognize(
            currentImage,
            'eng',
            {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        const progress = Math.round(m.progress * 100);
                        updateProcessingStatus(`Extracting text... ${progress}%`);
                    }
                }
            }
        );

        extractedText = result.data.text;

        // Display extracted text
        document.getElementById('extractedText').textContent = extractedText || 'No text detected in image.';

        // Generate AI summary
        updateProcessingStatus('Generating AI summary...');
        await generateSummary(extractedText);

        showProcessing(false);

        // Show results
        document.getElementById('resultsSection').classList.add('active');

        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });

    } catch (error) {
        console.error('OCR Error:', error);
        showProcessing(false);
        alert('Error processing image. Please try again.');
    }
}

// ==========================================
// Translation
// ==========================================

async function translateText() {
    if (!extractedText) {
        alert('No text to translate. Please process an image first.');
        return;
    }

    const targetLang = document.getElementById('targetLanguage').value;
    const translatedTextDiv = document.getElementById('translatedText');

    translatedTextDiv.textContent = 'Translating...';

    try {
        // Use MyMemory Translation API (free, no API key required)
        const translation = await realTranslateAPI(extractedText, targetLang);
        translatedTextDiv.textContent = translation;

    } catch (error) {
        console.error('Translation Error:', error);
        translatedTextDiv.textContent = 'Translation failed. Please try again or check your internet connection.';
    }
}

// Real translation function using MyMemory Translation API
async function realTranslateAPI(text, targetLang) {
    try {
        // Split text into chunks if it's too long (API limit is ~500 chars per request)
        const maxChunkSize = 500;
        const chunks = [];

        if (text.length <= maxChunkSize) {
            chunks.push(text);
        } else {
            // Split by sentences or newlines
            const sentences = text.split(/[.!?\n]+/);
            let currentChunk = '';

            for (const sentence of sentences) {
                if ((currentChunk + sentence).length <= maxChunkSize) {
                    currentChunk += sentence + '. ';
                } else {
                    if (currentChunk) chunks.push(currentChunk.trim());
                    currentChunk = sentence + '. ';
                }
            }
            if (currentChunk) chunks.push(currentChunk.trim());
        }

        // Translate each chunk
        const translatedChunks = [];

        for (const chunk of chunks) {
            const encodedText = encodeURIComponent(chunk);
            const url = `https://api.mymemory.translated.net/get?q=${encodedText}&langpair=en|${targetLang}`;

            const response = await fetch(url);
            const data = await response.json();

            if (data.responseStatus === 200 && data.responseData) {
                translatedChunks.push(data.responseData.translatedText);
            } else {
                throw new Error('Translation API error');
            }

            // Small delay between requests to avoid rate limiting
            if (chunks.length > 1) {
                await new Promise(resolve => setTimeout(resolve, 300));
            }
        }

        return translatedChunks.join(' ');

    } catch (error) {
        console.error('Translation API Error:', error);
        throw error;
    }
}

// ==========================================
// AI Summary Generation
// ==========================================

async function generateSummary(text) {
    const summaryDiv = document.getElementById('aiSummary');

    if (!text || text.trim().length < 10) {
        summaryDiv.textContent = 'Not enough text to generate a summary.';
        return;
    }

    try {
        // Mock AI summary - in production, use actual AI API
        const summary = await mockSummaryAPI(text);
        summaryDiv.textContent = summary;

    } catch (error) {
        console.error('Summary Error:', error);
        summaryDiv.textContent = 'Failed to generate summary.';
    }
}

// Mock summary function - replace with actual AI API in production
async function mockSummaryAPI(text) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const wordCount = text.split(/\s+/).length;

    return `📝 Summary:\n\nThis text contains approximately ${wordCount} words. The content appears to discuss various topics and concepts.\n\n🔑 Key Points:\n• Main ideas and concepts are presented\n• Information is organized in a structured manner\n• Content provides valuable insights\n\n💡 Analysis:\nThe extracted text provides information that can be useful for study and reference purposes. Consider reviewing the full text for complete understanding.\n\n(In production, this would be an AI-generated summary using GPT or similar models)`;
}

// ==========================================
// Utility Functions
// ==========================================

function showProcessing(show, status = 'Processing...') {
    const overlay = document.getElementById('processingOverlay');
    if (show) {
        overlay.classList.add('active');
        updateProcessingStatus(status);
    } else {
        overlay.classList.remove('active');
    }
}

function updateProcessingStatus(status) {
    document.getElementById('processingStatus').textContent = status;
}

function resetScanner() {
    currentImage = null;
    extractedText = '';

    document.getElementById('previewSection').classList.remove('active');
    document.getElementById('resultsSection').classList.remove('active');
    document.getElementById('uploadSection').style.display = 'block';
    document.getElementById('fileInput').value = '';

    // Reset result displays
    document.getElementById('extractedText').textContent = 'Processing...';
    document.getElementById('translatedText').textContent = 'Click translate to see translation...';
    document.getElementById('aiSummary').textContent = 'Generating summary...';
}

function copyToClipboard(elementId) {
    const text = document.getElementById(elementId).textContent;
    navigator.clipboard.writeText(text).then(() => {
        // Show success feedback
        const btn = event.target.closest('button');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy:', err);
        alert('Failed to copy to clipboard');
    });
}

function saveToHistory() {
    if (!extractedText) {
        alert('No content to save.');
        return;
    }

    // Get existing history
    const history = JSON.parse(localStorage.getItem('studyHistory') || '[]');

    // Create new history item
    const historyItem = {
        id: Date.now(),
        type: 'photo-scan',
        title: 'Photo Scan: ' + new Date().toLocaleDateString(),
        content: extractedText,
        summary: document.getElementById('aiSummary').textContent,
        translation: document.getElementById('translatedText').textContent,
        timestamp: new Date().toISOString(),
        date: new Date().toLocaleDateString()
    };

    // Add to history
    history.unshift(historyItem);

    // Save to localStorage
    localStorage.setItem('studyHistory', JSON.stringify(history));

    // Show success message
    alert('✅ Saved to history successfully!');
}

// ==========================================
// Initialize
// ==========================================

console.log('Photo Scanner initialized');
