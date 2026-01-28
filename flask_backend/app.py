# ==========================================
# Flask Backend - AI Services
# Main application file with API endpoints
# ==========================================

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from ai_service import AIService

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Initialize AI service
ai_service = AIService()

# ==========================================
# API Endpoints
# ==========================================

@app.route('/api/explain', methods=['POST'])
def explain_concept():
    """
    Endpoint to explain a concept in simple language
    Request body: { "topic": str, "details": str (optional) }
    """
    try:
        data = request.get_json()
        topic = data.get('topic', '').strip()
        details = data.get('details', '').strip()
        
        if not topic:
            return jsonify({'error': 'Topic is required'}), 400
        
        # Generate explanation using AI service
        explanation = ai_service.explain_concept(topic, details)
        
        return jsonify({
            'success': True,
            'explanation': explanation
        }), 200
        
    except Exception as e:
        print(f"Error in explain_concept: {str(e)}")
        return jsonify({'error': 'Failed to generate explanation'}), 500


@app.route('/api/summarize', methods=['POST'])
def summarize_text():
    """
    Endpoint to summarize text and extract key points
    Request body: { "text": str }
    """
    try:
        data = request.get_json()
        text = data.get('text', '').strip()
        
        if not text:
            return jsonify({'error': 'Text is required'}), 400
        
        # Generate summary using AI service
        summary, key_points = ai_service.summarize_text(text)
        
        return jsonify({
            'success': True,
            'summary': summary,
            'key_points': key_points
        }), 200
        
    except Exception as e:
        print(f"Error in summarize_text: {str(e)}")
        return jsonify({'error': 'Failed to generate summary'}), 500


@app.route('/api/generate-quiz', methods=['POST'])
def generate_quiz():
    """
    Endpoint to generate multiple-choice quiz
    Request body: { "topic": str, "content": str (optional), "num_questions": int }
    """
    try:
        data = request.get_json()
        topic = data.get('topic', '').strip()
        content = data.get('content', '').strip()
        num_questions = data.get('num_questions', 10)
        
        if not topic:
            return jsonify({'error': 'Topic is required'}), 400
        
        # Generate quiz using AI service
        quiz = ai_service.generate_quiz(topic, content, num_questions)
        
        return jsonify({
            'success': True,
            'quiz': quiz
        }), 200
        
    except Exception as e:
        print(f"Error in generate_quiz: {str(e)}")
        return jsonify({'error': 'Failed to generate quiz'}), 500


@app.route('/api/generate-flashcards', methods=['POST'])
def generate_flashcards():
    """
    Endpoint to generate flashcards
    Request body: { "topic": str, "content": str (optional), "num_cards": int }
    """
    try:
        data = request.get_json()
        topic = data.get('topic', '').strip()
        content = data.get('content', '').strip()
        num_cards = data.get('num_cards', 10)
        
        if not topic:
            return jsonify({'error': 'Topic is required'}), 400
        
        # Generate flashcards using AI service
        flashcards = ai_service.generate_flashcards(topic, content, num_cards)
        
        return jsonify({
            'success': True,
            'flashcards': flashcards
        }), 200
        
    except Exception as e:
        print(f"Error in generate_flashcards: {str(e)}")
        return jsonify({'error': 'Failed to generate flashcards'}), 500


@app.route('/api/extract-pdf', methods=['POST'])
def extract_pdf():
    """
    Endpoint to extract text from PDF file
    Request body: multipart/form-data with 'file' field
    """
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not file.filename.endswith('.pdf'):
            return jsonify({'error': 'Only PDF files are supported'}), 400
        
        # Extract text from PDF
        text = ai_service.extract_pdf_text(file)
        
        return jsonify({
            'success': True,
            'text': text
        }), 200
        
    except Exception as e:
        print(f"Error in extract_pdf: {str(e)}")
        return jsonify({'error': 'Failed to extract PDF text'}), 500


@app.route('/api/chat', methods=['POST'])
def chat():
    """
    AI Chatbot endpoint
    Request body: { "message": str, "history": list (optional) }
    """
    try:
        data = request.get_json()
        message = data.get('message', '').strip()
        history = data.get('history', [])
        
        if not message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Generate chatbot response
        response = ai_service.chat_response(message, history)
        
        return jsonify({
            'success': True,
            'response': response
        }), 200
        
    except Exception as e:
        print(f"Error in chat: {str(e)}")
        return jsonify({'error': 'Failed to generate response'}), 500


@app.route('/api/tutor', methods=['POST'])
def tutor():
    """
    AI Tutor endpoint for step-by-step help
    Request body: { "problem": str, "subject": str }
    """
    try:
        data = request.get_json()
        problem = data.get('problem', '').strip()
        subject = data.get('subject', 'General')
        
        if not problem:
            return jsonify({'error': 'Problem is required'}), 400
        
        # Generate tutoring help
        solution = ai_service.tutor_problem(problem, subject)
        
        return jsonify({
            'success': True,
            'solution': solution
        }), 200
        
    except Exception as e:
        print(f"Error in tutor: {str(e)}")
        return jsonify({'error': 'Failed to generate solution'}), 500


@app.route('/api/grade-essay', methods=['POST'])
def grade_essay():
    """
    Essay grading endpoint
    Request body: { "essay": str, "topic": str (optional) }
    """
    try:
        data = request.get_json()
        essay = data.get('essay', '').strip()
        topic = data.get('topic', '')
        
        if not essay:
            return jsonify({'error': 'Essay text is required'}), 400
        
        # Grade essay
        grading = ai_service.grade_essay(essay, topic)
        
        return jsonify({
            'success': True,
            'grading': grading
        }), 200
        
    except Exception as e:
        print(f"Error in grade_essay: {str(e)}")
        return jsonify({'error': 'Failed to grade essay'}), 500


@app.route('/api/fetch-url', methods=['POST'])
def fetch_url_content():
    """
    Endpoint to fetch content from a URL and generate AI summary
    Request body: { "url": str }
    """
    try:
        import requests
        from bs4 import BeautifulSoup
        
        data = request.get_json()
        url = data.get('url', '').strip()
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Fetch the URL content
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        # Parse HTML and extract text
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style", "nav", "header", "footer"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        # Limit to first 3000 characters for summary
        content_for_summary = text[:3000]
        
        # Generate AI summary of the content
        try:
            summary_text, key_points = ai_service.summarize_text(content_for_summary)
            # Combine summary and key points
            summary = f"{summary_text}\n\nKey Points:\n" + "\n".join([f"• {point}" for point in key_points])
        except Exception as e:
            print(f"AI summary error: {str(e)}")
            # If AI summary fails, provide basic summary
            summary = f"Content from {url}. The page discusses various topics and contains approximately {len(text.split())} words."
        
        return jsonify({
            'success': True,
            'content': text[:5000],  # Return more content for frontend analysis
            'summary': summary,
            'title': soup.title.string if soup.title else '',
            'url': url
        }), 200
        
    except requests.exceptions.Timeout:
        return jsonify({'error': 'Request timeout - URL took too long to respond'}), 408
    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {str(e)}")
        return jsonify({'error': f'Failed to fetch URL: {str(e)}'}), 500
    except Exception as e:
        print(f"Error in fetch_url_content: {str(e)}")
        return jsonify({'error': 'Failed to process URL content'}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'service': 'AI Study Assistant - Flask Backend'
    }), 200


# ==========================================
# Run Application
# ==========================================

if __name__ == '__main__':
    print("=" * 50)
    print("AI Study Assistant - Flask Backend")
    print("Server running on http://localhost:5000")
    print("=" * 50)
    app.run(debug=True, host='0.0.0.0', port=5000)
