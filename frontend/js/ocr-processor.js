// ==========================================
// OCR Processor Module
// Handles image text extraction using Tesseract.js
// ==========================================

class OCRProcessor {
    constructor() {
        this.isInitialized = false;
        this.worker = null;
        this.supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    }

    /**
     * Initialize Tesseract worker
     */
    async initialize() {
        if (this.isInitialized) return;

        try {
            // Load Tesseract.js from CDN
            if (typeof Tesseract === 'undefined') {
                await this.loadTesseract();
            }

            this.worker = await Tesseract.createWorker({
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        this.onProgress?.(Math.round(m.progress * 100));
                    }
                }
            });

            await this.worker.loadLanguage('eng');
            await this.worker.initialize('eng');
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize OCR:', error);
            throw new Error('OCR initialization failed');
        }
    }

    /**
     * Load Tesseract.js library dynamically
     */
    async loadTesseract() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@4/dist/tesseract.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Extract text from image
     * @param {File|string} image - Image file or URL
     * @param {Function} progressCallback - Progress callback function
     * @returns {Promise<Object>} Extracted text and confidence
     */
    async extractText(image, progressCallback = null) {
        this.onProgress = progressCallback;

        try {
            // Initialize if not already done
            if (!this.isInitialized) {
                await this.initialize();
            }

            // Validate image
            if (image instanceof File) {
                if (!this.supportedFormats.includes(image.type)) {
                    throw new Error('Unsupported image format. Please use JPG, PNG, or WEBP.');
                }
            }

            // Perform OCR
            const result = await this.worker.recognize(image);

            return {
                text: result.data.text.trim(),
                confidence: result.data.confidence,
                words: result.data.words.length,
                success: true
            };
        } catch (error) {
            console.error('OCR extraction failed:', error);
            return {
                text: '',
                confidence: 0,
                words: 0,
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Process image and preprocess for better OCR
     * @param {File} imageFile - Image file
     * @returns {Promise<string>} Base64 image data
     */
    async preprocessImage(imageFile) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');

                    // Resize if too large
                    let width = img.width;
                    let height = img.height;
                    const maxSize = 2000;

                    if (width > maxSize || height > maxSize) {
                        if (width > height) {
                            height = (height / width) * maxSize;
                            width = maxSize;
                        } else {
                            width = (width / height) * maxSize;
                            height = maxSize;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    // Draw and enhance
                    ctx.drawImage(img, 0, 0, width, height);

                    // Convert to grayscale for better OCR
                    const imageData = ctx.getImageData(0, 0, width, height);
                    const data = imageData.data;

                    for (let i = 0; i < data.length; i += 4) {
                        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
                        data[i] = data[i + 1] = data[i + 2] = gray;
                    }

                    ctx.putImageData(imageData, 0, 0);
                    resolve(canvas.toDataURL());
                };
                img.onerror = reject;
                img.src = e.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(imageFile);
        });
    }

    /**
     * Cleanup worker
     */
    async terminate() {
        if (this.worker) {
            await this.worker.terminate();
            this.worker = null;
            this.isInitialized = false;
        }
    }
}

// Create singleton instance
const ocrProcessor = new OCRProcessor();

// Export for use in other modules
window.ocrProcessor = ocrProcessor;
