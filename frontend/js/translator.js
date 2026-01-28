// ==========================================
// Translation Module
// Handles multi-language translation for content
// ==========================================

class Translator {
    constructor() {
        // Comprehensive language support - 100+ languages
        this.supportedLanguages = {
            // Major World Languages
            'en': 'English',
            'es': 'Spanish',
            'fr': 'French',
            'de': 'German',
            'it': 'Italian',
            'pt': 'Portuguese',
            'ru': 'Russian',
            'ja': 'Japanese',
            'ko': 'Korean',
            'zh': 'Chinese (Simplified)',
            'zh-TW': 'Chinese (Traditional)',
            'ar': 'Arabic',

            // South Asian Languages
            'hi': 'Hindi',
            'bn': 'Bengali',
            'te': 'Telugu',
            'ta': 'Tamil',
            'mr': 'Marathi',
            'gu': 'Gujarati',
            'kn': 'Kannada',
            'ml': 'Malayalam',
            'pa': 'Punjabi',
            'or': 'Odia',
            'as': 'Assamese',
            'ur': 'Urdu',
            'ne': 'Nepali',
            'si': 'Sinhala',

            // European Languages
            'nl': 'Dutch',
            'pl': 'Polish',
            'tr': 'Turkish',
            'uk': 'Ukrainian',
            'cs': 'Czech',
            'el': 'Greek',
            'hu': 'Hungarian',
            'ro': 'Romanian',
            'sv': 'Swedish',
            'da': 'Danish',
            'fi': 'Finnish',
            'no': 'Norwegian',
            'sk': 'Slovak',
            'bg': 'Bulgarian',
            'hr': 'Croatian',
            'sr': 'Serbian',
            'sl': 'Slovenian',
            'et': 'Estonian',
            'lv': 'Latvian',
            'lt': 'Lithuanian',
            'ga': 'Irish',
            'cy': 'Welsh',
            'is': 'Icelandic',
            'mk': 'Macedonian',
            'sq': 'Albanian',
            'bs': 'Bosnian',
            'mt': 'Maltese',
            'lb': 'Luxembourgish',
            'ca': 'Catalan',
            'gl': 'Galician',
            'eu': 'Basque',
            'be': 'Belarusian',

            // Southeast Asian Languages
            'vi': 'Vietnamese',
            'th': 'Thai',
            'id': 'Indonesian',
            'ms': 'Malay',
            'tl': 'Filipino (Tagalog)',
            'my': 'Myanmar (Burmese)',
            'km': 'Khmer',
            'lo': 'Lao',
            'jw': 'Javanese',
            'su': 'Sundanese',

            // Middle Eastern & African Languages
            'fa': 'Persian (Farsi)',
            'he': 'Hebrew',
            'sw': 'Swahili',
            'am': 'Amharic',
            'ha': 'Hausa',
            'yo': 'Yoruba',
            'ig': 'Igbo',
            'zu': 'Zulu',
            'xh': 'Xhosa',
            'af': 'Afrikaans',
            'so': 'Somali',
            'rw': 'Kinyarwanda',
            'sn': 'Shona',
            'st': 'Sesotho',
            'mg': 'Malagasy',
            'ny': 'Chichewa',

            // Central Asian Languages
            'kk': 'Kazakh',
            'uz': 'Uzbek',
            'ky': 'Kyrgyz',
            'tg': 'Tajik',
            'tk': 'Turkmen',
            'az': 'Azerbaijani',
            'ka': 'Georgian',
            'hy': 'Armenian',
            'mn': 'Mongolian',

            // Other Languages
            'eo': 'Esperanto',
            'la': 'Latin',
            'haw': 'Hawaiian',
            'mi': 'Maori',
            'sm': 'Samoan',
            'ceb': 'Cebuano',
            'hmn': 'Hmong',
            'ht': 'Haitian Creole',
            'yi': 'Yiddish',
            'ku': 'Kurdish',
            'ps': 'Pashto',
            'sd': 'Sindhi',
            'co': 'Corsican',
            'fy': 'Frisian',
            'gd': 'Scots Gaelic'
        };

        this.translationCache = new Map();
        this.apiEndpoint = 'https://translate.googleapis.com/translate_a/single';
    }

    /**
     * Translate text to target language
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code
     * @param {string} sourceLang - Source language code (default: 'auto')
     * @returns {Promise<Object>} Translation result
     */
    async translate(text, targetLang, sourceLang = 'auto') {
        if (!text || !text.trim()) {
            return { success: false, error: 'No text to translate' };
        }

        if (!this.supportedLanguages[targetLang]) {
            return { success: false, error: 'Unsupported target language' };
        }

        // Check cache
        const cacheKey = `${text}_${sourceLang}_${targetLang}`;
        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey);
        }

        try {
            // Use Google Translate API (free tier)
            const params = new URLSearchParams({
                client: 'gtx',
                sl: sourceLang,
                tl: targetLang,
                dt: 't',
                q: text
            });

            const response = await fetch(`${this.apiEndpoint}?${params}`);

            if (!response.ok) {
                throw new Error('Translation API request failed');
            }

            const data = await response.json();

            // Extract translated text
            let translatedText = '';
            if (data && data[0]) {
                translatedText = data[0].map(item => item[0]).join('');
            }

            const result = {
                success: true,
                originalText: text,
                translatedText: translatedText,
                sourceLang: data[2] || sourceLang,
                targetLang: targetLang,
                targetLangName: this.supportedLanguages[targetLang]
            };

            // Cache the result
            this.translationCache.set(cacheKey, result);

            return result;
        } catch (error) {
            console.error('Translation failed:', error);

            // Fallback to client-side simple translation
            return this.clientSideTranslate(text, targetLang);
        }
    }

    /**
     * Client-side fallback translation (basic word replacement)
     * @param {string} text - Text to translate
     * @param {string} targetLang - Target language code
     * @returns {Object} Translation result
     */
    clientSideTranslate(text, targetLang) {
        // Simple dictionary-based translation for common phrases
        const commonPhrases = {
            'es': {
                'Summary': 'Resumen',
                'Key Points': 'Puntos Clave',
                'Explanation': 'Explicación',
                'Question': 'Pregunta',
                'Answer': 'Respuesta',
                'Hello': 'Hola',
                'Thank you': 'Gracias'
            },
            'fr': {
                'Summary': 'Résumé',
                'Key Points': 'Points Clés',
                'Explanation': 'Explication',
                'Question': 'Question',
                'Answer': 'Réponse',
                'Hello': 'Bonjour',
                'Thank you': 'Merci'
            },
            'hi': {
                'Summary': 'सारांश',
                'Key Points': 'मुख्य बिंदु',
                'Explanation': 'व्याख्या',
                'Question': 'प्रश्न',
                'Answer': 'उत्तर',
                'Hello': 'नमस्ते',
                'Thank you': 'धन्यवाद'
            }
        };

        let translatedText = text;
        const dictionary = commonPhrases[targetLang];

        if (dictionary) {
            Object.keys(dictionary).forEach(key => {
                const regex = new RegExp(key, 'gi');
                translatedText = translatedText.replace(regex, dictionary[key]);
            });
        }

        return {
            success: true,
            originalText: text,
            translatedText: translatedText,
            sourceLang: 'en',
            targetLang: targetLang,
            targetLangName: this.supportedLanguages[targetLang],
            fallback: true,
            note: 'Using basic translation. For better results, check your internet connection.'
        };
    }

    /**
     * Detect language of text
     * @param {string} text - Text to detect language
     * @returns {Promise<string>} Detected language code
     */
    async detectLanguage(text) {
        try {
            const params = new URLSearchParams({
                client: 'gtx',
                sl: 'auto',
                tl: 'en',
                dt: 't',
                q: text.substring(0, 500) // Use first 500 chars for detection
            });

            const response = await fetch(`${this.apiEndpoint}?${params}`);
            const data = await response.json();

            return data[2] || 'en';
        } catch (error) {
            console.error('Language detection failed:', error);
            return 'en';
        }
    }

    /**
     * Get list of supported languages
     * @returns {Object} Supported languages
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }

    /**
     * Clear translation cache
     */
    clearCache() {
        this.translationCache.clear();
    }
}

// Create singleton instance
const translator = new Translator();

// Export for use in other modules
window.translator = translator;
