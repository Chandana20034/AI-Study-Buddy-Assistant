// ==========================================
// Notes Summarizer JavaScript
// Enhanced with drag-and-drop and better UX
// ==========================================

// DOM Elements
const fileUploadArea = document.getElementById('fileUploadArea');
const fileUploadContainer = document.getElementById('fileUploadContainer');
const fileInput = document.getElementById('fileInput');
const browseButton = document.getElementById('browseButton');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFileButton = document.getElementById('removeFile');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const statusText = document.getElementById('statusText');
const summarizerForm = document.getElementById('summarizerForm');
const notesInput = document.getElementById('notesInput');
const summaryOutput = document.getElementById('summaryOutput');
const saveButton = document.getElementById('saveSummary');
const generateButton = document.getElementById('generateButton');

let currentFile = null;
let extractedText = '';

// ==========================================
// File Upload Event Handlers
// ==========================================

// Browse button click
browseButton?.addEventListener('click', () => {
    fileInput.click();
});

// Click on upload area
fileUploadArea?.addEventListener('click', (e) => {
    if (e.target === fileUploadArea || e.target.closest('.upload-icon') || e.target.tagName === 'H3' || e.target.tagName === 'P') {
        fileInput.click();
    }
});

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    fileUploadArea?.addEventListener(eventName, preventDefaults, false);
    document.body.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop area when dragging over it
['dragenter', 'dragover'].forEach(eventName => {
    fileUploadArea?.addEventListener(eventName, () => {
        fileUploadArea.classList.add('drag-over');
    }, false);
});

['dragleave', 'drop'].forEach(eventName => {
    fileUploadArea?.addEventListener(eventName, () => {
        fileUploadArea.classList.remove('drag-over');
    }, false);
});

// Handle dropped files
fileUploadArea?.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;

    if (files.length > 0) {
        handleFile(files[0]);
    }
}, false);

// Handle file input change
fileInput?.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFile(e.target.files[0]);
    }
});

// Remove file button
removeFileButton?.addEventListener('click', () => {
    resetFileUpload();
});

// ==========================================
// File Handling Functions
// ==========================================

function handleFile(file) {
    console.log('File selected:', file.name, file.type, file.size);

    // Validate file type - now includes images
    const validTypes = ['application/pdf', 'text/plain', 'image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
        showNotification('Please upload a PDF, TXT, or Image file (JPG, PNG, WEBP)', 'error');
        return;
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showNotification('File size must be less than 10MB', 'error');
        return;
    }

    currentFile = file;

    // Show file info
    showFileInfo(file);

    // Process file based on type
    if (file.type === 'text/plain') {
        processTxtFile(file);
    } else if (file.type === 'application/pdf') {
        processPdfFile(file);
    } else if (file.type.startsWith('image/')) {
        processImageFile(file);
    }
}

function showFileInfo(file) {
    // Hide upload area, show file info
    fileUploadArea.style.display = 'none';
    fileInfo.style.display = 'block';

    // Display file details
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);

    // Reset status
    statusText.textContent = '';
    statusText.className = 'status-text';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function resetFileUpload() {
    currentFile = null;
    extractedText = '';
    fileInput.value = '';

    // Hide file info, show upload area
    fileInfo.style.display = 'none';
    fileUploadArea.style.display = 'block';

    // Clear textarea
    notesInput.value = '';

    // Reset progress
    progressBar.style.display = 'none';
    progressFill.style.width = '0%';
    statusText.textContent = '';
}

// ==========================================
// File Processing Functions
// ==========================================

async function processTxtFile(file) {
    try {
        statusText.textContent = 'Reading text file...';
        statusText.className = 'status-text processing';

        const text = await file.text();
        extractedText = text;
        notesInput.value = text;

        statusText.textContent = '✓ Text file loaded successfully!';
        statusText.className = 'status-text success';

        showNotification('Text file loaded! Click "Generate Summary" to continue.', 'success');

        // Auto-scroll to textarea
        notesInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        console.error('Error reading text file:', error);
        statusText.textContent = '✗ Failed to read file';
        statusText.className = 'status-text error';
        showNotification('Failed to read text file', 'error');
    }
}

async function processPdfFile(file) {
    try {
        // Show progress bar
        progressBar.style.display = 'block';
        progressFill.style.width = '10%';
        statusText.textContent = 'Loading PDF reader...';
        statusText.className = 'status-text processing';

        // Load PDF.js if not already loaded
        if (typeof pdfjsLib === 'undefined') {
            await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }

        progressFill.style.width = '30%';
        statusText.textContent = 'Extracting text from PDF...';

        // Read file as ArrayBuffer
        const arrayBuffer = await file.arrayBuffer();

        // Load PDF document
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        progressFill.style.width = '50%';
        statusText.textContent = `Processing ${pdf.numPages} pages...`;

        let fullText = '';

        // Extract text from each page
        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';

            // Update progress
            const progress = 50 + (pageNum / pdf.numPages) * 40;
            progressFill.style.width = progress + '%';
            statusText.textContent = `Extracted page ${pageNum}/${pdf.numPages}`;
        }

        extractedText = fullText.trim();
        notesInput.value = extractedText;

        progressFill.style.width = '100%';
        statusText.textContent = `✓ Successfully extracted text from ${pdf.numPages} pages!`;
        statusText.className = 'status-text success';

        showNotification('PDF text extracted! Click "Generate Summary" to continue.', 'success');

        // Hide progress bar after a delay
        setTimeout(() => {
            progressBar.style.display = 'none';
        }, 2000);

        // Auto-scroll to textarea
        notesInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        console.error('PDF extraction error:', error);
        progressBar.style.display = 'none';
        statusText.textContent = '✗ Failed to extract PDF text';
        statusText.className = 'status-text error';
        showNotification('Failed to extract PDF text. Please try pasting text instead.', 'error');
    }
}

// Process image file with OCR
async function processImageFile(file) {
    try {
        // Show progress bar
        progressBar.style.display = 'block';
        progressFill.style.width = '10%';
        statusText.textContent = 'Loading OCR engine...';
        statusText.className = 'status-text processing';

        // Check if OCR processor is available
        if (!window.ocrProcessor) {
            throw new Error('OCR processor not loaded');
        }

        progressFill.style.width = '30%';
        statusText.textContent = 'Analyzing image...';

        // Extract text from image
        const result = await window.ocrProcessor.extractText(file, (progress) => {
            const progressValue = 30 + (progress * 0.6);
            progressFill.style.width = progressValue + '%';
            statusText.textContent = `Extracting text... ${progress}%`;
        });

        if (!result.success || !result.text) {
            throw new Error(result.error || 'No text found in image');
        }

        extractedText = result.text;
        notesInput.value = extractedText;

        progressFill.style.width = '100%';
        statusText.textContent = `✓ Successfully extracted ${result.words} words from image!`;
        statusText.className = 'status-text success';

        showNotification(`Text extracted from image! Confidence: ${Math.round(result.confidence)}%`, 'success');

        // Hide progress bar after a delay
        setTimeout(() => {
            progressBar.style.display = 'none';
        }, 2000);

        // Auto-scroll to textarea
        notesInput.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        console.error('Image OCR error:', error);
        progressBar.style.display = 'none';
        statusText.textContent = '✗ Failed to extract text from image';
        statusText.className = 'status-text error';
        showNotification('Failed to extract text from image. Please try a clearer image or paste text instead.', 'error');
    }
}

// ==========================================
// Form Submission & Summarization
// ==========================================

summarizerForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('=== Summarizer Form Submitted ===');

    const text = notesInput.value.trim();

    console.log('Text length:', text.length);

    if (!text) {
        console.error('No text provided');
        showNotification('Please upload a file or paste some text', 'error');
        return;
    }

    // Check if clientAI is available
    if (!window.clientAI) {
        console.error('clientAI not found!');
        showNotification('AI service not loaded. Please refresh the page.', 'error');
        return;
    }

    console.log('clientAI found:', window.clientAI);

    // Disable generate button
    generateButton.disabled = true;
    generateButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';

    // Show loading state
    summaryOutput.innerHTML = '<div class="loading-spinner"></div>';
    summaryOutput.classList.add('loading');

    try {
        console.log('Calling clientAI.summarizeText()...');

        // Use client-side AI service
        const result = await window.clientAI.summarizeText(text);

        console.log('Summarization result:', result);

        displaySummary(result.summary, result.key_points);
        saveButton.classList.remove('hidden');

        // Save to activity
        saveActivity('summarize', 'Summarized notes');
        showNotification('Summary generated successfully!', 'success');

        // Scroll to summary
        summaryOutput.scrollIntoView({ behavior: 'smooth', block: 'start' });

    } catch (error) {
        console.error('Summarization error:', error);
        console.error('Error stack:', error.stack);

        summaryOutput.classList.remove('loading');
        summaryOutput.innerHTML = `
            <p style="color: var(--text-muted); text-align: center;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: #ef4444; margin-bottom: 1rem; display: block;"></i>
                Unable to generate summary. Please try again.
                <br><br>
                <small style="color: #94a3b8;">Error: ${error.message}</small>
            </p>
        `;
        showNotification('Failed to generate summary: ' + error.message, 'error');
    } finally {
        // Re-enable generate button
        generateButton.disabled = false;
        generateButton.innerHTML = '<i class="fas fa-magic"></i> Generate Summary';
    }
});

// ==========================================
// Display Functions
// ==========================================

function displaySummary(summary, keyPoints) {
    summaryOutput.classList.remove('loading');

    const keyPointsHTML = keyPoints.map(point =>
        `<li style="margin-bottom: 0.75rem; padding-left: 0.5rem; border-left: 3px solid var(--secondary-blue);">
            ${point}
        </li>`
    ).join('');

    summaryOutput.innerHTML = `
        <div style="color: var(--text-primary);" id="summaryContent">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
                <h3 style="color: var(--secondary-blue); margin: 0; font-size: 1.1rem;">
                    <i class="fas fa-file-alt"></i> Summary
                </h3>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <select id="targetLanguage" style="padding: 0.5rem; background: rgba(30, 41, 59, 0.8); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: var(--radius-md); color: var(--text-primary); cursor: pointer;">
                        <option value="">Select Language</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="hi">Hindi</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                        <option value="ar">Arabic</option>
                        <option value="pt">Portuguese</option>
                        <option value="ru">Russian</option>
                        <option value="it">Italian</option>
                    </select>
                    <button id="translateBtn" class="btn btn-secondary" style="padding: 0.5rem 1rem; width: auto;">
                        <i class="fas fa-language"></i> Translate
                    </button>
                </div>
            </div>
            <p style="margin-bottom: 1.5rem; line-height: 1.8;" id="summaryText">${summary}</p>
            
            <h3 style="color: var(--secondary-pink); margin-bottom: 1rem; font-size: 1.1rem;">
                <i class="fas fa-star"></i> Key Points
            </h3>
            <ul style="list-style: none; padding: 0;" id="keyPointsList">
                ${keyPointsHTML}
            </ul>
        </div>
    `;

    // Add translation event listener
    const translateBtn = document.getElementById('translateBtn');
    const targetLanguageSelect = document.getElementById('targetLanguage');

    translateBtn?.addEventListener('click', async () => {
        const targetLang = targetLanguageSelect.value;
        if (!targetLang) {
            showNotification('Please select a target language', 'warning');
            return;
        }

        if (!window.translator) {
            showNotification('Translation service not loaded', 'error');
            return;
        }

        translateBtn.disabled = true;
        translateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Translating...';

        try {
            // Translate summary
            const summaryResult = await window.translator.translate(summary, targetLang);

            // Translate key points
            const translatedPoints = [];
            for (const point of keyPoints) {
                const result = await window.translator.translate(point, targetLang);
                translatedPoints.push(result.translatedText);
            }

            // Update display with translated content
            document.getElementById('summaryText').textContent = summaryResult.translatedText;

            const translatedPointsHTML = translatedPoints.map(point =>
                `<li style="margin-bottom: 0.75rem; padding-left: 0.5rem; border-left: 3px solid var(--secondary-blue);">
                    ${point}
                </li>`
            ).join('');
            document.getElementById('keyPointsList').innerHTML = translatedPointsHTML;

            showNotification(`Translated to ${summaryResult.targetLangName}!`, 'success');

        } catch (error) {
            console.error('Translation error:', error);
            showNotification('Translation failed. Please try again.', 'error');
        } finally {
            translateBtn.disabled = false;
            translateBtn.innerHTML = '<i class="fas fa-language"></i> Translate';
        }
    });
}

// Save summary
saveButton?.addEventListener('click', () => {
    const summary = summaryOutput.innerText;

    const savedSummaries = JSON.parse(localStorage.getItem('summaries') || '[]');
    savedSummaries.push({
        summary: summary,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('summaries', JSON.stringify(savedSummaries));

    showNotification('Summary saved successfully!', 'success');
});
