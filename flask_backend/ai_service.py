# ==========================================
# AI Service Module
# Contains mock AI logic for all features
# Can be replaced with real AI API (OpenAI, etc.)
# ==========================================

import random
import re
from PyPDF2 import PdfReader
from io import BytesIO


class AIService:
    """
    AI Service class that provides mock implementations
    for concept explanation, summarization, quiz generation, and flashcards
    """
    
    def __init__(self):
        """Initialize AI Service"""
        print("AI Service initialized")
    
    
    def explain_concept(self, topic, details=""):
        """
        Generate a comprehensive explanation for a given concept
        
        Args:
            topic (str): The concept to explain
            details (str): Additional context or specific questions
            
        Returns:
            str: Detailed explanation of the concept
        """
        topic_lower = topic.lower()
        
        # Comprehensive topic explanations
        explanations = {
            'python': """**Python** is a beginner-friendly programming language known for its clean, readable syntax.

**Why Python?**
• Easy to learn - reads almost like English
• Versatile - web dev, AI, data science, automation
• Huge community and library ecosystem
• Used by Google, Netflix, Instagram, NASA

**Getting Started:**
```python
# Your first Python program
print("Hello, World!")

# Variables are simple
name = "Student"
age = 18
print(f"Hello {name}, you are {age} years old")
```

**Key Concepts:**
1. **Variables** - Store data (numbers, text, lists)
2. **Functions** - Reusable blocks of code
3. **Loops** - Repeat actions (for, while)
4. **Conditions** - Make decisions (if/else)
5. **Libraries** - Pre-written code to use

**Pro Tip**: Practice at Python.org, Codecademy, or freeCodeCamp!""",

            'javascript': """**JavaScript** is the language of the web - it makes websites interactive!

**Where JavaScript Runs:**
• Web browsers (Chrome, Firefox, Safari)
• Servers (Node.js)
• Mobile apps (React Native)
• Desktop apps (Electron)

**Quick Example:**
```javascript
// Display a message
alert("Hello, World!");

// Variables
let name = "Student";
const age = 18;
console.log(`Hello ${name}!`);
```

**Core Concepts:**
1. **DOM Manipulation** - Change webpage content
2. **Events** - Respond to clicks, typing
3. **Async/Await** - Handle data loading
4. **Objects & Arrays** - Organize data
5. **ES6+ Features** - Modern JS syntax

**Learn at**: MDN Web Docs, JavaScript.info, freeCodeCamp""",

            'photosynthesis': """**Photosynthesis** is how plants convert sunlight into food.

**The Simple Version:**
Sunlight + Water + CO₂ → Glucose + Oxygen

**Step by Step:**
1. **Light Absorption** - Chlorophyll captures sunlight
2. **Water Splitting** - H₂O breaks into hydrogen and oxygen
3. **Carbon Fixation** - CO₂ combines with hydrogen
4. **Glucose Production** - Sugar is formed for energy
5. **Oxygen Release** - O₂ is released as byproduct

**The Equation:**
6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂

**Where It Happens:**
• Chloroplasts (organelles in plant cells)
• Contains chlorophyll (green pigment)
• Thylakoids = light reactions
• Stroma = Calvin cycle

**Why It Matters:**
• Produces food for plants AND animals
• Creates oxygen we breathe
• Removes CO₂ from atmosphere
• Foundation of most food chains""",

            'dna': """**DNA (Deoxyribonucleic Acid)** is the instruction manual for life!

**Structure:**
• Double helix - twisted ladder shape
• Sugar-phosphate backbone
• Base pairs as "rungs"

**The Four Bases:**
• **A**denine pairs with **T**hymine
• **C**ytosine pairs with **G**uanine
• (Remember: AT-CG)

**From DNA to Protein:**
1. **Replication** - DNA copies itself
2. **Transcription** - DNA → mRNA
3. **Translation** - mRNA → Protein

**Key Terms:**
• Gene - Section of DNA coding for a trait
• Chromosome - Organized DNA + proteins
• Genome - Complete set of DNA
• Mutation - Changes in DNA sequence

**Fun Facts:**
• 99.9% of human DNA is identical!
• Your DNA could stretch to Pluto and back
• DNA was discovered in 1953 by Watson & Crick""",

            'newton': """**Newton's Laws of Motion** - The foundation of classical mechanics!

**First Law (Inertia):**
"An object stays at rest or in motion unless acted upon by a force."
• Example: A ball keeps rolling until friction stops it

**Second Law (F = ma):**
"Force equals mass times acceleration."
• F = ma
• More mass = more force needed
• Example: Pushing a car vs pushing a bike

**Third Law (Action-Reaction):**
"Every action has an equal and opposite reaction."
• Example: Rocket pushes gas down, gas pushes rocket up

**Applications:**
• Car safety (seatbelts use 1st law)
• Sports (kicking a ball - 2nd law)
• Walking (3rd law - push ground, ground pushes you)

**Problem Solving Tips:**
1. Draw free body diagrams
2. Identify all forces
3. Apply F = ma
4. Check units!""",

            'calculus': """**Calculus** is the mathematics of change and accumulation.

**Two Main Branches:**

**1. Differential Calculus (Derivatives)**
• Measures rate of change
• Slope of a curve at a point
• Applications: velocity, optimization

**Basic Rules:**
• d/dx [xⁿ] = nxⁿ⁻¹
• d/dx [sin x] = cos x
• d/dx [eˣ] = eˣ

**2. Integral Calculus (Integrals)**
• Measures accumulated quantities
• Area under a curve
• Reverse of derivatives

**Basic Rules:**
• ∫xⁿ dx = xⁿ⁺¹/(n+1) + C
• ∫cos x dx = sin x + C
• ∫eˣ dx = eˣ + C

**Fundamental Theorem:**
∫ from a to b of f'(x)dx = f(b) - f(a)

**Applications:** Physics, engineering, economics, biology"""
        }
        
        # Find best matching explanation
        for key, value in explanations.items():
            if key in topic_lower or topic_lower in key:
                return value
        
        # Default explanation
        return f"""**{topic}** is an important concept to understand.

**What is it?**
{topic} is a fundamental concept that involves understanding key principles and how they apply in real-world situations.

**Key Points:**
• Understanding the core definition and scope
• Knowing the main components or elements
• Recognizing how it works in practice
• Applying knowledge to solve problems

**Study Tips:**
1. Break it into smaller, manageable parts
2. Find real-world examples to connect with
3. Practice with exercises and problems
4. Teach it to someone else to reinforce

{f'**Your Question:** {details}' if details else ''}

**Pro Tip:** Connect {topic} to things you already know. Making associations with familiar concepts makes learning much more effective!"""
    
    
    def summarize_text(self, text):
        """
        Summarize text and extract key points
        
        Args:
            text (str): The text to summarize
            
        Returns:
            tuple: (summary, key_points list)
        """
        # Mock summarization - in production, replace with actual AI API
        sentences = text.split('.')
        
        # Create summary (first few sentences or condensed version)
        summary = f"This content discusses important concepts and information. "
        summary += f"The main focus is on understanding key principles and their applications. "
        summary += f"It covers fundamental ideas that are essential for building knowledge in this area."
        
        # Extract key points (mock - in production, use NLP)
        key_points = [
            "Understanding the fundamental concepts is crucial for mastery",
            "Practical applications help reinforce theoretical knowledge",
            "Breaking down complex topics into smaller parts aids comprehension",
            "Regular practice and review strengthen retention",
            "Connecting new information to existing knowledge improves learning"
        ]
        
        # If text is short, add specific points
        if len(text) < 500:
            key_points.append("This is a concise overview of the main topic")
        else:
            key_points.append("This comprehensive material covers multiple aspects of the subject")
        
        return summary, key_points[:5]
    
    
    def generate_quiz(self, topic, content="", num_questions=10):
        """
        Generate multiple-choice quiz questions
        
        Args:
            topic (str): The topic for the quiz
            content (str): Additional content to base questions on
            num_questions (int): Number of questions to generate
            
        Returns:
            list: List of quiz questions with options and correct answers
        """
        # Mock quiz generation - in production, replace with actual AI API
        quiz = []
        
        question_templates = [
            f"What is the main purpose of {topic}?",
            f"Which of the following best describes {topic}?",
            f"What is a key characteristic of {topic}?",
            f"How does {topic} relate to other concepts?",
            f"What is an important application of {topic}?",
            f"Which statement about {topic} is correct?",
            f"What should you remember about {topic}?",
            f"Which factor is most important in {topic}?",
            f"What is the primary benefit of understanding {topic}?",
            f"How can {topic} be best explained?"
        ]
        
        for i in range(min(num_questions, len(question_templates))):
            question = {
                "question": question_templates[i],
                "options": [
                    f"It is a fundamental concept with practical applications",
                    f"It is only theoretical with no real-world use",
                    f"It is outdated and no longer relevant",
                    f"It is too complex to understand"
                ],
                "correct": 0  # Index of correct answer
            }
            
            # Randomize options
            correct_answer = question["options"][question["correct"]]
            random.shuffle(question["options"])
            question["correct"] = question["options"].index(correct_answer)
            
            quiz.append(question)
        
        return quiz
    
    
    def generate_flashcards(self, topic, content="", num_cards=10):
        """
        Generate flashcards for studying
        
        Args:
            topic (str): The topic for flashcards
            content (str): Additional content to base flashcards on
            num_cards (int): Number of flashcards to generate
            
        Returns:
            list: List of flashcards with questions and answers
        """
        # Mock flashcard generation - in production, replace with actual AI API
        flashcards = []
        
        card_templates = [
            {
                "question": f"What is {topic}?",
                "answer": f"{topic} is a fundamental concept that involves understanding key principles and their applications in various contexts."
            },
            {
                "question": f"Why is {topic} important?",
                "answer": f"{topic} is important because it forms the foundation for understanding more advanced concepts and has practical real-world applications."
            },
            {
                "question": f"What are the key components of {topic}?",
                "answer": f"The key components include fundamental principles, practical applications, and the relationships between different elements."
            },
            {
                "question": f"How can you apply {topic} in practice?",
                "answer": f"{topic} can be applied by understanding the core concepts and using them to solve real-world problems and scenarios."
            },
            {
                "question": f"What is a common misconception about {topic}?",
                "answer": f"A common misconception is that {topic} is too complex, but breaking it down into smaller parts makes it much easier to understand."
            },
            {
                "question": f"What are the benefits of studying {topic}?",
                "answer": f"Studying {topic} helps build critical thinking skills, provides practical knowledge, and creates a foundation for advanced learning."
            },
            {
                "question": f"How does {topic} relate to other subjects?",
                "answer": f"{topic} connects to other subjects by sharing fundamental principles and providing a framework for understanding related concepts."
            },
            {
                "question": f"What is the best way to learn {topic}?",
                "answer": f"The best way to learn {topic} is through a combination of understanding theory, practicing with examples, and relating it to familiar concepts."
            },
            {
                "question": f"What are the main challenges in understanding {topic}?",
                "answer": f"Main challenges include grasping abstract concepts and seeing connections, which can be overcome through practice and real-world examples."
            },
            {
                "question": f"How can you remember key facts about {topic}?",
                "answer": f"Use mnemonics, create associations with things you know, practice regularly, and teach the concept to others to reinforce your understanding."
            }
        ]
        
        # Return requested number of cards
        return card_templates[:num_cards]
    
    
    def extract_pdf_text(self, pdf_file):
        """
        Extract text from PDF file
        
        Args:
            pdf_file: File object from Flask request
            
        Returns:
            str: Extracted text from PDF
        """
        try:
            # Read PDF file
            pdf_reader = PdfReader(BytesIO(pdf_file.read()))
            
            # Extract text from all pages
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() + "\n"
            
            return text.strip()
            
        except Exception as e:
            print(f"Error extracting PDF text: {str(e)}")
            raise Exception("Failed to extract text from PDF")


    def chat_response(self, message, history=[]):
        """
        Generate chatbot response
        
        Args:
            message (str): User's message
            history (list): Previous conversation history
            
        Returns:
            str: AI chatbot response
        """
        # Mock chatbot - in production, replace with actual AI API
        message_lower = message.lower()
        
        # Context-aware responses
        if 'explain' in message_lower or 'what is' in message_lower:
            return "I'd be happy to explain that! I can break down complex topics into simple, easy-to-understand explanations. Just tell me what topic you'd like me to explain, and I'll do my best to make it clear!"
        
        elif 'summarize' in message_lower or 'summary' in message_lower:
            return "I can help you summarize your study materials! Just paste your text or upload a document, and I'll extract the key points and create a concise summary for you."
        
        elif 'quiz' in message_lower or 'test' in message_lower:
            return "I can create custom quizzes to test your knowledge! Tell me the topic and how many questions you'd like, and I'll generate multiple-choice questions to help you prepare."
        
        elif 'flashcard' in message_lower:
            return "Flashcards are great for quick revision! I can create flashcards on any topic you're studying. Just let me know the subject and I'll generate question-answer pairs."
        
        elif 'help' in message_lower or 'what can you do' in message_lower:
            return """I'm your AI Study Assistant! Here's what I can help you with:

📚 **Explain Concepts** - Get simple explanations of complex topics
📝 **Summarize Notes** - Turn long texts into concise summaries
❓ **Generate Quizzes** - Create practice tests on any subject
🎴 **Make Flashcards** - Build flashcards for quick revision
👨‍🏫 **Tutor You** - Get step-by-step help with problems
✍️ **Grade Essays** - Receive feedback on your writing
🎙️ **Record Lectures** - Transcribe and summarize lectures

Just ask me anything about your studies!"""
        
        elif 'thank' in message_lower:
            return "You're welcome! I'm here to help you study smarter. Feel free to ask me anything else!"
        
        elif 'hi' in message_lower or 'hello' in message_lower:
            return "Hello! I'm your AI Study Assistant. How can I help you with your studies today?"
        
        else:
            return f"I understand you're asking about: '{message}'. I can help you with that! Would you like me to explain this topic, create a quiz about it, or help you in another way?"
    
    
    def tutor_problem(self, problem, subject="General"):
        """
        Provide step-by-step tutoring help with intelligent, subject-specific responses
        
        Args:
            problem (str): The problem or question
            subject (str): Subject area
            
        Returns:
            dict: Step-by-step solution
        """
        problem_lower = problem.lower()
        
        # Subject-specific knowledge bases
        subject_knowledge = {
            "Computer Science": {
                "how to study": {
                    "steps": [
                        {"step": 1, "title": "Start with Fundamentals", "explanation": "Begin with basic concepts: variables, data types, loops, and conditionals. Websites like freeCodeCamp, Codecademy, and Khan Academy offer free courses."},
                        {"step": 2, "title": "Learn a Programming Language", "explanation": "Choose Python for beginners (easy syntax) or JavaScript for web development. Write code daily, even if just 30 minutes."},
                        {"step": 3, "title": "Practice Problem Solving", "explanation": "Use platforms like LeetCode, HackerRank, or Codewars to solve coding challenges. Start with easy problems and progress gradually."},
                        {"step": 4, "title": "Build Projects", "explanation": "Apply your knowledge by building real projects: calculators, to-do apps, games. Projects solidify learning and create a portfolio."},
                        {"step": 5, "title": "Learn Data Structures & Algorithms", "explanation": "Study arrays, linked lists, trees, graphs, sorting, and searching algorithms. These are essential for interviews and problem-solving."}
                    ],
                    "tips": ["Code every day, consistency beats intensity", "Don't just watch tutorials - type the code yourself", "Read other people's code on GitHub", "Join coding communities on Discord or Reddit"],
                    "answer": "Focus on: 1) Fundamentals → 2) One language deeply → 3) Problem solving → 4) Projects → 5) DSA. Dedicate 1-2 hours daily and you'll see progress in weeks!"
                },
                "programming": {
                    "steps": [
                        {"step": 1, "title": "Understand Programming Basics", "explanation": "Programming is giving instructions to computers using specific languages. Start with understanding syntax, variables, and control flow."},
                        {"step": 2, "title": "Choose Your First Language", "explanation": "Python is excellent for beginners due to its readable syntax. Java and JavaScript are also popular choices."},
                        {"step": 3, "title": "Practice Regularly", "explanation": "Writing code regularly is essential. Use online platforms like Replit to practice without setup."},
                        {"step": 4, "title": "Debug and Learn", "explanation": "Errors are learning opportunities. Read error messages carefully and use print statements to debug."}
                    ],
                    "tips": ["Start small, think big", "Break problems into smaller pieces", "Use comments to explain your code", "Version control with Git is essential"],
                    "answer": "Programming is a skill learned by doing. Start with Python, practice daily, and build small projects to apply what you learn."
                }
            },
            "Mathematics": {
                "default": {
                    "steps": [
                        {"step": 1, "title": "Identify the Problem Type", "explanation": "Determine if this is algebra, calculus, geometry, or statistics. Each has specific methods."},
                        {"step": 2, "title": "List Known Values", "explanation": "Write down all given information and what you need to find. This clarifies the problem."},
                        {"step": 3, "title": "Apply Relevant Formulas", "explanation": "Use the appropriate mathematical formulas or theorems for this problem type."},
                        {"step": 4, "title": "Solve Step by Step", "explanation": "Work through the math carefully, showing each calculation clearly."},
                        {"step": 5, "title": "Verify Your Answer", "explanation": "Plug your answer back into the original equation or check if it makes logical sense."}
                    ],
                    "tips": ["Practice with similar problems", "Memorize key formulas", "Draw diagrams when helpful", "Check your arithmetic twice"],
                    "answer": "Follow the systematic approach above. For specific problem help, describe the exact equation or values."
                }
            },
            "Physics": {
                "default": {
                    "steps": [
                        {"step": 1, "title": "Identify Physical Concepts", "explanation": "Determine which physics principles apply: mechanics, thermodynamics, electromagnetism, etc."},
                        {"step": 2, "title": "Draw a Diagram", "explanation": "Sketch the physical situation. Label forces, velocities, or other relevant quantities."},
                        {"step": 3, "title": "Write Equations", "explanation": "List the relevant physics equations (F=ma, E=mc², etc.) for this scenario."},
                        {"step": 4, "title": "Solve and Check Units", "explanation": "Solve equations algebraically first, then plug in numbers. Always verify units are correct."}
                    ],
                    "tips": ["Units are crucial - always include them", "Draw free-body diagrams for force problems", "Conservation laws often simplify problems", "Estimate answers first to catch major errors"],
                    "answer": "Physics problems require understanding concepts, not just memorizing formulas. Identify the principle, visualize the scenario, then solve systematically."
                }
            },
            "Chemistry": {
                "default": {
                    "steps": [
                        {"step": 1, "title": "Identify the Reaction Type", "explanation": "Is this synthesis, decomposition, single/double replacement, or redox? This guides your approach."},
                        {"step": 2, "title": "Balance Equations", "explanation": "Ensure atoms are conserved. Balance metals first, then non-metals, then hydrogen/oxygen."},
                        {"step": 3, "title": "Apply Stoichiometry", "explanation": "Use molar ratios from balanced equations to calculate quantities."},
                        {"step": 4, "title": "Check Your Work", "explanation": "Verify mass is conserved and charges balance in ionic equations."}
                    ],
                    "tips": ["Learn the periodic table trends", "Practice balancing equations regularly", "Understand electron configurations", "Connect macro observations to atomic behavior"],
                    "answer": "Chemistry connects atomic structure to observable properties. Master balancing equations and stoichiometry for solving most problems."
                }
            },
            "Biology": {
                "default": {
                    "steps": [
                        {"step": 1, "title": "Understand the System", "explanation": "Identify which biological system or process is involved: cellular, organ, ecosystem level."},
                        {"step": 2, "title": "Connect Structure to Function", "explanation": "In biology, structure always relates to function. Ask why something is designed that way."},
                        {"step": 3, "title": "Consider Relationships", "explanation": "Consider cause-and-effect relationships and feedback loops in biological systems."},
                        {"step": 4, "title": "Apply to Real Examples", "explanation": "Connect concepts to real-world examples for better understanding."}
                    ],
                    "tips": ["Use diagrams and flowcharts", "Connect topics to each other", "Understand processes, not just facts", "Think about evolutionary advantages"],
                    "answer": "Biology requires understanding systems and their interconnections. Focus on how structure enables function."
                }
            },
            "History": {
                "default": {
                    "steps": [
                        {"step": 1, "title": "Establish Context", "explanation": "When and where did this occur? What was happening in the world at that time?"},
                        {"step": 2, "title": "Identify Key Players", "explanation": "Who were the main figures, groups, or nations involved and what were their motivations?"},
                        {"step": 3, "title": "Analyze Causes and Effects", "explanation": "What led to this event? What were its short-term and long-term consequences?"},
                        {"step": 4, "title": "Consider Multiple Perspectives", "explanation": "How did different groups view this event? Whose voices might be missing from the narrative?"}
                    ],
                    "tips": ["Create timelines to see connections", "Look for patterns across events", "Use primary sources when possible", "Understand bias in historical accounts"],
                    "answer": "History is about understanding cause and effect across time. Focus on context, motivations, and consequences."
                }
            },
            "English": {
                "default": {
                    "steps": [
                        {"step": 1, "title": "Understand the Purpose", "explanation": "Is this for analysis, creative writing, grammar, or comprehension? Each requires different approaches."},
                        {"step": 2, "title": "Identify Key Elements", "explanation": "For literature: themes, characters, symbols. For writing: audience, tone, structure."},
                        {"step": 3, "title": "Support with Evidence", "explanation": "Use quotes and specific examples from texts to support your analysis or arguments."},
                        {"step": 4, "title": "Revise and Polish", "explanation": "Good writing is rewriting. Check clarity, flow, and grammar."}
                    ],
                    "tips": ["Read widely to improve writing", "Outline before writing essays", "Use active voice when possible", "Vary sentence structure for flow"],
                    "answer": "Strong English skills require reading, writing, and critical thinking. Practice regularly and seek feedback."
                }
            }
        }
        
        # Find the best matching response
        subject_data = subject_knowledge.get(subject, subject_knowledge.get("General", {}))
        
        # Check for specific topic matches
        response = None
        if "how to study" in problem_lower or "study" in problem_lower:
            response = subject_data.get("how to study") or subject_data.get("default")
        elif "programming" in problem_lower or "code" in problem_lower:
            response = subject_data.get("programming") or subject_data.get("default")
        else:
            response = subject_data.get("default")
        
        # Default fallback
        if not response:
            response = {
                "steps": [
                    {"step": 1, "title": "Analyze the Question", "explanation": f"Let's break down '{problem}' - identify the key concepts and what's being asked."},
                    {"step": 2, "title": "Gather Relevant Information", "explanation": f"For {subject}, we need to consider the fundamental principles that apply here."},
                    {"step": 3, "title": "Apply Your Knowledge", "explanation": "Connect what you know to this specific question. Look for relationships between concepts."},
                    {"step": 4, "title": "Formulate Your Response", "explanation": "Organize your thoughts clearly and provide a well-reasoned answer."}
                ],
                "tips": ["Break complex problems into smaller parts", "Review your notes on related topics", "Practice with similar questions", "Ask for clarification if needed"],
                "answer": f"To answer this {subject} question, apply the core concepts you've learned and think through it systematically."
            }
        
        return {
            "problem": problem,
            "subject": subject,
            "steps": response["steps"],
            "tips": response["tips"],
            "answer": response["answer"]
        }
    
    
    def grade_essay(self, essay, topic=""):
        """
        Grade an essay and provide feedback
        
        Args:
            essay (str): The essay text
            topic (str): Essay topic (optional)
            
        Returns:
            dict: Grading results with feedback
        """
        # Mock essay grading - in production, replace with actual AI API
        word_count = len(essay.split())
        
        # Simple scoring based on length and structure
        score = min(95, 60 + (word_count // 10))
        
        return {
            "score": score,
            "grade": self._get_letter_grade(score),
            "word_count": word_count,
            "strengths": [
                "Clear introduction that sets up the topic",
                "Good use of examples to support arguments",
                "Logical flow between paragraphs",
                "Strong conclusion that ties ideas together"
            ],
            "areas_for_improvement": [
                "Consider adding more specific evidence",
                "Vary sentence structure for better readability",
                "Expand on counterarguments",
                "Check for minor grammar and punctuation errors"
            ],
            "grammar": {
                "score": 85,
                "issues": "Minor punctuation and comma usage"
            },
            "structure": {
                "score": 90,
                "feedback": "Well-organized with clear paragraphs"
            },
            "content": {
                "score": score,
                "feedback": "Good understanding of the topic with relevant examples"
            },
            "suggestions": [
                "Add a thesis statement in the introduction",
                "Include more transitions between ideas",
                "Cite sources if this is a research essay",
                "Proofread for clarity and conciseness"
            ]
        }
    
    
    def _get_letter_grade(self, score):
        """Convert numeric score to letter grade"""
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"


# ==========================================
# Helper Functions
# ==========================================

def clean_text(text):
    """Remove extra whitespace and clean text"""
    text = re.sub(r'\s+', ' ', text)
    return text.strip()
