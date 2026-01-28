// ==========================================
// Client-Side AI Service
// Simulates AI responses without backend
// ==========================================

class ClientAIService {
    constructor() {
        this.initialized = true;
    }

    /**
     * Explain a concept in simple language with comprehensive knowledge
     */
    async explainConcept(topic, details = '') {
        await this.delay(1000);

        const topicLower = topic.toLowerCase();

        // Comprehensive topic explanations
        const explanations = {
            // Computer Science Topics
            'python': `**Python** is a beginner-friendly programming language known for its clean, readable syntax.

**Why Python?**
• Easy to learn - reads almost like English
• Versatile - web dev, AI, data science, automation
• Huge community and library ecosystem
• Used by Google, Netflix, Instagram, NASA

**Getting Started:**
\`\`\`python
# Your first Python program
print("Hello, World!")

# Variables are simple
name = "Student"
age = 18
print(f"Hello {name}, you are {age} years old")
\`\`\`

**Key Concepts:**
1. **Variables** - Store data (numbers, text, lists)
2. **Functions** - Reusable blocks of code
3. **Loops** - Repeat actions (for, while)
4. **Conditions** - Make decisions (if/else)
5. **Libraries** - Pre-written code to use

**Pro Tip**: Practice at Python.org, Codecademy, or freeCodeCamp!`,

            'javascript': `**JavaScript** is the language of the web - it makes websites interactive!

**Where JavaScript Runs:**
• Web browsers (Chrome, Firefox, Safari)
• Servers (Node.js)
• Mobile apps (React Native)
• Desktop apps (Electron)

**Quick Example:**
\`\`\`javascript
// Display a message
alert("Hello, World!");

// Variables
let name = "Student";
const age = 18;
console.log(\`Hello \${name}!\`);

// Functions
function greet(person) {
    return "Welcome, " + person + "!";
}
\`\`\`

**Core Concepts:**
1. **DOM Manipulation** - Change webpage content
2. **Events** - Respond to clicks, typing
3. **Async/Await** - Handle data loading
4. **Objects & Arrays** - Organize data
5. **ES6+ Features** - Modern JS syntax

**Learn at**: MDN Web Docs, JavaScript.info, freeCodeCamp`,

            'programming': `**Programming** is giving instructions to computers to solve problems.

**Think of it like:**
Writing a recipe - you give step-by-step instructions the computer follows exactly!

**Key Programming Concepts:**
1. **Variables** - Containers for storing data
2. **Data Types** - Numbers, text (strings), true/false (booleans)
3. **Operators** - Math (+, -, *, /) and comparison (==, <, >)
4. **Control Flow** - if/else decisions, loops for repetition
5. **Functions** - Reusable code blocks
6. **Objects/Classes** - Organize related data and functions

**Popular Languages:**
| Language | Best For |
|----------|----------|
| Python | Beginners, AI, Data Science |
| JavaScript | Web development |
| Java | Apps, Enterprise |
| C++ | Games, Performance |
| Swift | iOS apps |

**Start Your Journey:**
1. Pick ONE language (Python recommended)
2. Learn basics (variables, loops, functions)
3. Build small projects
4. Practice daily!`,

            'data structures': `**Data Structures** are ways to organize and store data efficiently.

**Why They Matter:**
Like organizing a library - good organization means faster finding!

**Essential Data Structures:**

1. **Arrays** - Ordered list of items
   \`[1, 2, 3, 4, 5]\`
   Best for: Index-based access

2. **Linked Lists** - Chain of nodes
   Best for: Frequent insertions/deletions

3. **Stacks** - Last In, First Out (LIFO)
   Like a stack of plates
   Best for: Undo operations, parsing

4. **Queues** - First In, First Out (FIFO)
   Like a waiting line
   Best for: Scheduling, BFS

5. **Hash Tables/Maps** - Key-value pairs
   \`{"name": "John", "age": 25}\`
   Best for: Fast lookups

6. **Trees** - Hierarchical structure
   Best for: File systems, search

7. **Graphs** - Nodes with connections
   Best for: Networks, maps

**Big O Complexity Matters!**
O(1) < O(log n) < O(n) < O(n log n) < O(n²)`,

            'algorithms': `**Algorithms** are step-by-step procedures to solve problems.

**Think of it like:** A recipe - specific steps to achieve a result!

**Essential Algorithms:**

**Sorting Algorithms:**
• **Bubble Sort** - O(n²) - Compare adjacent, swap if needed
• **Quick Sort** - O(n log n) - Divide and conquer, pivot element
• **Merge Sort** - O(n log n) - Divide, sort halves, merge

**Searching Algorithms:**
• **Linear Search** - O(n) - Check each element
• **Binary Search** - O(log n) - Divide sorted array in half

**Graph Algorithms:**
• **BFS** - Explore level by level (shortest path unweighted)
• **DFS** - Explore depth first (maze solving)
• **Dijkstra's** - Shortest path with weights

**Key Concepts:**
1. **Time Complexity** - How speed scales with input
2. **Space Complexity** - Memory usage
3. **Trade-offs** - Speed vs Memory
4. **Problem Decomposition** - Break into smaller parts

**Practice on:** LeetCode, HackerRank, Codeforces`,

            // Science Topics
            'photosynthesis': `**Photosynthesis** is how plants convert sunlight into food.

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
• Foundation of most food chains`,

            'cell biology': `**Cells** are the basic units of life - like tiny factories!

**Two Main Types:**
1. **Prokaryotic** - No nucleus (bacteria)
2. **Eukaryotic** - Has nucleus (plants, animals, fungi)

**Key Cell Parts (Organelles):**
| Organelle | Function |
|-----------|----------|
| Nucleus | Control center, holds DNA |
| Mitochondria | Powerhouse - makes ATP energy |
| Ribosome | Protein factory |
| ER | Transport network |
| Golgi | Package & ship proteins |
| Cell Membrane | Boundary, controls entry/exit |

**Plant Cells Also Have:**
• Cell wall (structure)
• Chloroplasts (photosynthesis)
• Large vacuole (storage)

**Cell Division:**
• Mitosis - Growth, repair (1 → 2 identical)
• Meiosis - Sex cells (1 → 4 unique)

**Remember:** All living things are made of cells!`,

            'dna': `**DNA (Deoxyribonucleic Acid)** is the instruction manual for life!

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
• DNA was discovered in 1953 by Watson & Crick`,

            // Physics Topics
            'newton laws': `**Newton's Laws of Motion** - The foundation of classical mechanics!

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
4. Check units!`,

            'electricity': `**Electricity** is the flow of electric charge (usually electrons).

**Key Concepts:**

**Voltage (V)** - "Pressure" pushing electrons
• Measured in Volts
• Like water pressure in pipes

**Current (I)** - Flow rate of electrons
• Measured in Amperes (Amps)
• Like water flow rate

**Resistance (R)** - Opposition to flow
• Measured in Ohms (Ω)
• Like pipe friction

**Ohm's Law:**
V = I × R
(Voltage = Current × Resistance)

**Circuit Types:**
• **Series** - One path, current same everywhere
• **Parallel** - Multiple paths, voltage same everywhere

**Power:**
P = V × I = I²R = V²/R
Measured in Watts

**Safety:** Never touch live wires! Electricity can be dangerous.`,

            // Math Topics
            'quadratic equations': `**Quadratic Equations** have the form ax² + bx + c = 0

**Methods to Solve:**

**1. Factoring:**
x² - 5x + 6 = 0
(x - 2)(x - 3) = 0
x = 2 or x = 3

**2. Quadratic Formula:**
x = (-b ± √(b² - 4ac)) / 2a

**3. Completing the Square:**
x² + 6x = 7
(x + 3)² = 16
x + 3 = ±4
x = 1 or x = -7

**The Discriminant (b² - 4ac):**
• > 0: Two real solutions
• = 0: One real solution
• < 0: No real solutions (complex)

**Graphing:**
• Parabola shape
• Vertex at x = -b/2a
• Opens up if a > 0, down if a < 0

**Practice Tip:** Always check solutions by substituting back!`,

            'calculus': `**Calculus** is the mathematics of change and accumulation.

**Two Main Branches:**

**1. Differential Calculus (Derivatives)**
• Measures rate of change
• Slope of a curve at a point
• Applications: velocity, optimization

**Basic Rules:**
• d/dx [xⁿ] = nxⁿ⁻¹
• d/dx [sin x] = cos x
• d/dx [eˣ] = eˣ
• Chain rule: d/dx [f(g(x))] = f'(g(x)) · g'(x)

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

**Applications:** Physics, engineering, economics, biology`,

            'default': `Let me explain **${topic}** in simple terms:

${details ? `Based on your context: "${details}"\n\n` : ''}

**What is ${topic}?**
${topic} is an important concept that helps us understand and solve problems in this field.

**Key Points:**
1. **Definition** - The fundamental meaning and scope of ${topic}
2. **Components** - The main parts or elements involved
3. **How It Works** - The process or mechanism
4. **Applications** - Real-world uses and examples
5. **Importance** - Why understanding this matters

**Study Tips for ${topic}:**
• Break it into smaller, manageable parts
• Find real-world examples to relate to
• Practice with exercises or problems
• Teach it to someone else to reinforce learning
• Connect it to concepts you already know

**Related Topics to Explore:**
Consider learning about related areas to build a comprehensive understanding.

*Need more specific information? Try asking about a particular aspect of ${topic}!*`
        };

        // Find best matching explanation
        for (const [key, value] of Object.entries(explanations)) {
            if (topicLower.includes(key) || key.includes(topicLower)) {
                return value;
            }
        }

        return explanations['default'];
    }

    /**
     * Summarize text and extract key points
     */
    async summarizeText(text) {
        await this.delay(1200);

        // Extract sentences
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

        // Create summary (first 2-3 sentences or 30% of content)
        const summaryLength = Math.min(3, Math.ceil(sentences.length * 0.3));
        const summary = sentences.slice(0, summaryLength).join('. ') + '.';

        // Extract key points (simulate intelligent extraction)
        const keyPoints = [];
        const words = text.toLowerCase().split(/\s+/);

        // Find important keywords
        const importantWords = ['important', 'key', 'main', 'significant', 'essential', 'critical', 'fundamental'];
        const hasImportantWords = sentences.filter(s =>
            importantWords.some(w => s.toLowerCase().includes(w))
        );

        if (hasImportantWords.length > 0) {
            keyPoints.push(...hasImportantWords.slice(0, 3).map(s => s.trim()));
        } else {
            // Use every 3rd sentence as key points
            for (let i = 0; i < Math.min(5, sentences.length); i += 2) {
                if (sentences[i]) keyPoints.push(sentences[i].trim());
            }
        }

        return {
            summary: summary || 'Summary generated from your notes.',
            key_points: keyPoints.slice(0, 5).map(p => p.replace(/^\s*[-•*]\s*/, ''))
        };
    }

    /**
     * Generate quiz questions with subject-specific content
     */
    async generateQuiz(topic, content = '', numQuestions = 5) {
        await this.delay(1500);

        const topicLower = topic.toLowerCase();

        // Subject-specific quiz question banks with expanded content
        const quizBanks = {
            'python': [
                { question: 'What symbol is used for single-line comments in Python?', options: ['// comment', '# comment', '/* comment */', '-- comment'], correct: 1, difficulty: 'easy' },
                { question: 'Which data type is immutable in Python?', options: ['List', 'Dictionary', 'Tuple', 'Set'], correct: 2, difficulty: 'medium' },
                { question: 'What does "len()" function do in Python?', options: ['Creates a list', 'Returns the length of an object', 'Converts to string', 'Loops through items'], correct: 1, difficulty: 'easy' },
                { question: 'How do you define a function in Python?', options: ['function myFunc():', 'def myFunc():', 'void myFunc():', 'func myFunc():'], correct: 1, difficulty: 'easy' },
                { question: 'What is the output of print(2 ** 3)?', options: ['6', '8', '9', '5'], correct: 1, difficulty: 'easy' },
                { question: 'Which method adds an item to the end of a list?', options: ['add()', 'insert()', 'append()', 'push()'], correct: 2, difficulty: 'easy' },
                { question: 'What is the correct way to create a dictionary?', options: ['dict = []', 'dict = {}', 'dict = ()', 'dict = <>'], correct: 1, difficulty: 'easy' },
                { question: 'Which keyword is used for exception handling?', options: ['catch', 'except', 'handle', 'error'], correct: 1, difficulty: 'medium' },
                { question: 'What does "self" refer to in a class method?', options: ['The class itself', 'The instance of the class', 'The parent class', 'Nothing special'], correct: 1, difficulty: 'medium' },
                { question: 'Which operator is used for floor division?', options: ['/', '//', '%', '**'], correct: 1, difficulty: 'medium' },
                { question: 'What is the output of bool("")?', options: ['True', 'False', 'None', 'Error'], correct: 1, difficulty: 'medium' },
                { question: 'How do you create a virtual environment?', options: ['python venv', 'python -m venv env', 'pip install venv', 'create venv'], correct: 1, difficulty: 'medium' },
                { question: 'What does *args mean in a function?', options: ['Keyword arguments', 'Variable positional arguments', 'Required arguments', 'Optional arguments'], correct: 1, difficulty: 'hard' },
                { question: 'What is a decorator in Python?', options: ['A design pattern', 'A function that modifies another function', 'A type of loop', 'A class attribute'], correct: 1, difficulty: 'hard' },
                { question: 'What does the "yield" keyword do?', options: ['Returns a value', 'Creates a generator', 'Stops execution', 'Raises an error'], correct: 1, difficulty: 'hard' }
            ],
            'javascript': [
                { question: 'Which keyword declares a constant in JavaScript?', options: ['var', 'let', 'const', 'final'], correct: 2, difficulty: 'easy' },
                { question: 'What does DOM stand for?', options: ['Document Object Model', 'Data Object Management', 'Digital Ordinance Model', 'Document Order Method'], correct: 0, difficulty: 'easy' },
                { question: 'How do you write "Hello" to the console?', options: ['print("Hello")', 'console.log("Hello")', 'echo("Hello")', 'write("Hello")'], correct: 1, difficulty: 'easy' },
                { question: 'What is the result of typeof []?', options: ['array', 'object', 'list', 'undefined'], correct: 1, difficulty: 'medium' },
                { question: 'Which operator is strictly equal (type + value)?', options: ['==', '===', '!=', ':='], correct: 1, difficulty: 'easy' },
                { question: 'What method converts a string to an integer?', options: ['toInt()', 'parseInt()', 'Number.int()', 'convert()'], correct: 1, difficulty: 'easy' },
                { question: 'How do you create an arrow function?', options: ['function => {}', '() => {}', '-> {}', 'func() {}'], correct: 1, difficulty: 'medium' },
                { question: 'What is async/await used for?', options: ['Styling', 'Loops', 'Asynchronous code', 'Variables'], correct: 2, difficulty: 'medium' },
                { question: 'What is the purpose of "use strict"?', options: ['Enable strict mode', 'Disable errors', 'Format code', 'Import modules'], correct: 0, difficulty: 'medium' },
                { question: 'What does JSON stand for?', options: ['Java Standard Object Notation', 'JavaScript Object Notation', 'JSON Script Object Network', 'Java Source Object Name'], correct: 1, difficulty: 'easy' },
                { question: 'What is a closure in JavaScript?', options: ['A type of loop', 'Function with access to outer scope', 'A class method', 'An error handler'], correct: 1, difficulty: 'hard' },
                { question: 'What does the spread operator (...) do?', options: ['Creates loops', 'Expands arrays/objects', 'Defines functions', 'Handles errors'], correct: 1, difficulty: 'medium' },
                { question: 'What is event bubbling?', options: ['Event goes from child to parent', 'Event goes from parent to child', 'Event stops immediately', 'Event loops forever'], correct: 0, difficulty: 'hard' },
                { question: 'What is the temporal dead zone?', options: ['Undefined variable state', 'Time between declaration and initialization', 'A deprecated feature', 'Memory leak area'], correct: 1, difficulty: 'hard' },
                { question: 'What is the purpose of Promise.all()?', options: ['Run promises sequentially', 'Wait for all promises', 'Cancel promises', 'Create new promises'], correct: 1, difficulty: 'hard' }
            ],
            'data structures': [
                { question: 'What is the time complexity of accessing an array element by index?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n²)'], correct: 2, difficulty: 'easy' },
                { question: 'Which data structure uses LIFO principle?', options: ['Queue', 'Stack', 'Array', 'Graph'], correct: 1, difficulty: 'easy' },
                { question: 'What is a Hash Table best used for?', options: ['Sorting', 'Fast lookups by key', 'Sequential access', 'Graph traversal'], correct: 1, difficulty: 'easy' },
                { question: 'In a Binary Search Tree, where are smaller values stored?', options: ['Right child', 'Left child', 'Parent', 'Root'], correct: 1, difficulty: 'medium' },
                { question: 'Which data structure uses FIFO principle?', options: ['Stack', 'Queue', 'Tree', 'Heap'], correct: 1, difficulty: 'easy' },
                { question: 'What is the worst case time for searching in a BST?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'], correct: 2, difficulty: 'medium' },
                { question: 'What is a heap used for?', options: ['LIFO access', 'Priority queue', 'Hashing', 'Graph coloring'], correct: 1, difficulty: 'medium' },
                { question: 'What is the time complexity of quicksort average case?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correct: 1, difficulty: 'medium' },
                { question: 'What is a linked list advantage over arrays?', options: ['Faster access', 'Dynamic size', 'Better caching', 'Less memory'], correct: 1, difficulty: 'medium' },
                { question: 'What traversal visits root first?', options: ['Inorder', 'Preorder', 'Postorder', 'Level order'], correct: 1, difficulty: 'medium' },
                { question: 'What is the time complexity of inserting in a hash table?', options: ['O(1) average', 'O(n)', 'O(log n)', 'O(n²)'], correct: 0, difficulty: 'medium' },
                { question: 'What is an AVL tree?', options: ['Unbalanced BST', 'Self-balancing BST', 'Graph type', 'Heap variant'], correct: 1, difficulty: 'hard' },
                { question: 'What is the purpose of a trie?', options: ['Sorting', 'String prefix matching', 'Graph traversal', 'Number storage'], correct: 1, difficulty: 'hard' },
                { question: 'What is amortized time complexity?', options: ['Worst case', 'Average over sequence of operations', 'Best case', 'Space complexity'], correct: 1, difficulty: 'hard' },
                { question: 'What is a red-black tree guarantee?', options: ['O(1) operations', 'O(log n) height', 'No duplicates', 'Perfect balance'], correct: 1, difficulty: 'hard' }
            ],
            'physics': [
                { question: 'What does F = ma represent?', options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravity"], correct: 1, difficulty: 'easy' },
                { question: 'What is the SI unit of force?', options: ['Joule', 'Newton', 'Watt', 'Pascal'], correct: 1, difficulty: 'easy' },
                { question: 'What remains constant in an isolated system?', options: ['Velocity', 'Acceleration', 'Energy', 'Force'], correct: 2, difficulty: 'medium' },
                { question: "According to Ohm's Law, V = ?", options: ['I / R', 'I × R', 'R / I', 'I + R'], correct: 1, difficulty: 'easy' },
                { question: 'What is the unit of electrical resistance?', options: ['Volt', 'Ampere', 'Ohm', 'Watt'], correct: 2, difficulty: 'easy' },
                { question: 'What type of energy does a moving object have?', options: ['Potential', 'Kinetic', 'Thermal', 'Nuclear'], correct: 1, difficulty: 'easy' },
                { question: 'What is the speed of light in vacuum?', options: ['3×10⁶ m/s', '3×10⁸ m/s', '3×10¹⁰ m/s', '3×10⁴ m/s'], correct: 1, difficulty: 'medium' },
                { question: 'What is the formula for kinetic energy?', options: ['KE = mv', 'KE = ½mv²', 'KE = mgh', 'KE = Fd'], correct: 1, difficulty: 'medium' },
                { question: 'What is the SI unit of power?', options: ['Joule', 'Newton', 'Watt', 'Volt'], correct: 2, difficulty: 'easy' },
                { question: 'What happens to resistance when temperature increases in a conductor?', options: ['Decreases', 'Increases', 'Stays same', 'Becomes zero'], correct: 1, difficulty: 'medium' },
                { question: 'What is the principle of conservation of momentum?', options: ['Momentum is always zero', 'Momentum is conserved in collisions', 'Momentum increases with time', 'Momentum equals energy'], correct: 1, difficulty: 'medium' },
                { question: 'What type of wave is light?', options: ['Longitudinal', 'Transverse', 'Mechanical', 'Sound'], correct: 1, difficulty: 'medium' },
                { question: 'What is the first law of thermodynamics about?', options: ['Entropy', 'Energy conservation', 'Heat transfer', 'Work output'], correct: 1, difficulty: 'hard' },
                { question: 'What is the Doppler effect?', options: ['Light bending', 'Frequency change due to motion', 'Energy loss', 'Wave interference'], correct: 1, difficulty: 'hard' },
                { question: 'What is the photoelectric effect?', options: ['Light causes heating', 'Light ejects electrons from metal', 'Light creates sound', 'Light bends around objects'], correct: 1, difficulty: 'hard' }
            ],
            'biology': [
                { question: 'What is the powerhouse of the cell?', options: ['Nucleus', 'Ribosome', 'Mitochondria', 'Golgi body'], correct: 2, difficulty: 'easy' },
                { question: 'What type of cell has no nucleus?', options: ['Eukaryotic', 'Prokaryotic', 'Plant cell', 'Animal cell'], correct: 1, difficulty: 'easy' },
                { question: 'What bases pair together in DNA?', options: ['A-C and G-T', 'A-T and C-G', 'A-G and C-T', 'A-A and T-T'], correct: 1, difficulty: 'medium' },
                { question: 'What process do cells use to divide?', options: ['Mitosis', 'Osmosis', 'Diffusion', 'Filtration'], correct: 0, difficulty: 'easy' },
                { question: 'What organelle makes proteins?', options: ['Nucleus', 'Ribosome', 'Lysosome', 'Vacuole'], correct: 1, difficulty: 'easy' },
                { question: 'What is the control center of the cell?', options: ['Cytoplasm', 'Cell membrane', 'Nucleus', 'ER'], correct: 2, difficulty: 'easy' },
                { question: 'What is the function of chloroplasts?', options: ['Respiration', 'Photosynthesis', 'Protein synthesis', 'Cell division'], correct: 1, difficulty: 'easy' },
                { question: 'What is the process of RNA being made from DNA?', options: ['Translation', 'Transcription', 'Replication', 'Mutation'], correct: 1, difficulty: 'medium' },
                { question: 'What type of blood cells fight infection?', options: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma'], correct: 1, difficulty: 'easy' },
                { question: 'What is the function of the cell membrane?', options: ['Energy production', 'Controls entry/exit', 'Stores DNA', 'Makes proteins'], correct: 1, difficulty: 'medium' },
                { question: 'What is meiosis used for?', options: ['Growth', 'Repair', 'Sexual reproduction', 'Energy'], correct: 2, difficulty: 'medium' },
                { question: 'What is the largest organ in the human body?', options: ['Liver', 'Brain', 'Skin', 'Heart'], correct: 2, difficulty: 'medium' },
                { question: 'What carries oxygen in blood?', options: ['Plasma', 'White blood cells', 'Hemoglobin', 'Platelets'], correct: 2, difficulty: 'medium' },
                { question: 'What is CRISPR used for?', options: ['Cell division', 'Gene editing', 'Protein folding', 'Virus detection'], correct: 1, difficulty: 'hard' },
                { question: 'What is epigenetics?', options: ['Gene mutation', 'Gene expression changes without DNA change', 'DNA replication', 'Cell death'], correct: 1, difficulty: 'hard' }
            ],
            'chemistry': [
                { question: 'What is the atomic number of Carbon?', options: ['4', '6', '8', '12'], correct: 1, difficulty: 'easy' },
                { question: 'What type of bond shares electrons?', options: ['Ionic', 'Covalent', 'Metallic', 'Hydrogen'], correct: 1, difficulty: 'easy' },
                { question: 'What is H2O commonly known as?', options: ['Oxygen', 'Hydrogen', 'Water', 'Acid'], correct: 2, difficulty: 'easy' },
                { question: 'What does pH measure?', options: ['Temperature', 'Acidity/Basicity', 'Pressure', 'Volume'], correct: 1, difficulty: 'easy' },
                { question: 'What state of matter has a definite shape and volume?', options: ['Gas', 'Liquid', 'Solid', 'Plasma'], correct: 2, difficulty: 'easy' },
                { question: 'What particle has a positive charge?', options: ['Electron', 'Proton', 'Neutron', 'Ion'], correct: 1, difficulty: 'easy' },
                { question: 'What is the pH of a neutral solution?', options: ['0', '7', '14', '1'], correct: 1, difficulty: 'easy' },
                { question: 'What is an isotope?', options: ['Same protons, different neutrons', 'Same neutrons, different protons', 'Same electrons', 'Different element'], correct: 0, difficulty: 'medium' },
                { question: 'What is the formula for table salt?', options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'], correct: 0, difficulty: 'easy' },
                { question: 'What is an exothermic reaction?', options: ['Absorbs heat', 'Releases heat', 'No heat change', 'Creates light only'], correct: 1, difficulty: 'medium' },
                { question: 'What is Avogadro\'s number?', options: ['6.02×10²³', '3.14×10⁸', '1.6×10⁻¹⁹', '9.8×10¹'], correct: 0, difficulty: 'medium' },
                { question: 'What type of reaction is A + B → AB?', options: ['Decomposition', 'Synthesis', 'Single replacement', 'Double replacement'], correct: 1, difficulty: 'medium' },
                { question: 'What is the octet rule?', options: ['8 protons needed', 'Atoms want 8 valence electrons', '8 bonds maximum', '8 shells maximum'], correct: 1, difficulty: 'medium' },
                { question: 'What is electronegativity?', options: ['Ability to lose electrons', 'Ability to attract electrons', 'Number of electrons', 'Electron speed'], correct: 1, difficulty: 'hard' },
                { question: 'What is a catalyst?', options: ['Increases products', 'Speeds reaction without being consumed', 'Slows reactions', 'Creates new elements'], correct: 1, difficulty: 'hard' }
            ],
            'math': [
                { question: 'What is the quadratic formula?', options: ['x = -b/2a', 'x = (-b ± √(b²-4ac))/2a', 'x = a² + b²', 'x = √(a+b)'], correct: 1, difficulty: 'medium' },
                { question: 'What is the derivative of x²?', options: ['x', '2x', 'x²', '2'], correct: 1, difficulty: 'medium' },
                { question: 'What is the integral of 2x?', options: ['x', '2', 'x²', 'x² + C'], correct: 3, difficulty: 'medium' },
                { question: 'What is sin(90°)?', options: ['0', '1', '-1', '0.5'], correct: 1, difficulty: 'easy' },
                { question: 'What is the slope of a horizontal line?', options: ['1', '0', 'Undefined', '-1'], correct: 1, difficulty: 'easy' },
                { question: 'What is log₁₀(100)?', options: ['1', '2', '10', '100'], correct: 1, difficulty: 'easy' },
                { question: 'What is the Pythagorean theorem?', options: ['a + b = c', 'a² + b² = c²', 'ab = c', '2a + 2b = c'], correct: 1, difficulty: 'easy' },
                { question: 'What is the value of π (pi) approximately?', options: ['3.14', '2.71', '1.41', '1.73'], correct: 0, difficulty: 'easy' },
                { question: 'What is the area of a circle?', options: ['2πr', 'πr²', 'πd', '2πr²'], correct: 1, difficulty: 'easy' },
                { question: 'What is the factorial of 5 (5!)?', options: ['25', '120', '60', '15'], correct: 1, difficulty: 'medium' },
                { question: 'What is the sum of angles in a triangle?', options: ['90°', '180°', '270°', '360°'], correct: 1, difficulty: 'easy' },
                { question: 'What is the derivative of sin(x)?', options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct: 0, difficulty: 'medium' },
                { question: 'What is a prime number?', options: ['Divisible by 2', 'Only divisible by 1 and itself', 'Even numbers only', 'Negative numbers'], correct: 1, difficulty: 'easy' },
                { question: 'What is the limit of 1/x as x approaches infinity?', options: ['1', '0', 'Infinity', 'Undefined'], correct: 1, difficulty: 'hard' },
                { question: 'What is the chain rule used for?', options: ['Adding functions', 'Differentiating composite functions', 'Integrating', 'Finding limits'], correct: 1, difficulty: 'hard' }
            ],
            'history': [
                { question: 'When did World War II end?', options: ['1943', '1944', '1945', '1946'], correct: 2, difficulty: 'easy' },
                { question: 'Who was the first President of the USA?', options: ['Lincoln', 'Washington', 'Jefferson', 'Adams'], correct: 1, difficulty: 'easy' },
                { question: 'The Renaissance began in which country?', options: ['France', 'England', 'Italy', 'Spain'], correct: 2, difficulty: 'medium' },
                { question: 'When did the French Revolution begin?', options: ['1776', '1789', '1804', '1815'], correct: 1, difficulty: 'medium' },
                { question: "Who wrote 'The Republic'?", options: ['Aristotle', 'Socrates', 'Plato', 'Homer'], correct: 2, difficulty: 'medium' },
                { question: 'The Cold War was between which nations?', options: ['UK and France', 'USA and USSR', 'China and Japan', 'Germany and Italy'], correct: 1, difficulty: 'easy' },
                { question: 'When was the Declaration of Independence signed?', options: ['1774', '1776', '1778', '1780'], correct: 1, difficulty: 'easy' },
                { question: 'Who discovered America in 1492?', options: ['Magellan', 'Columbus', 'Vespucci', 'Cabot'], correct: 1, difficulty: 'easy' },
                { question: 'When did World War I begin?', options: ['1912', '1914', '1916', '1918'], correct: 1, difficulty: 'easy' },
                { question: 'Who was the leader of Nazi Germany?', options: ['Mussolini', 'Stalin', 'Hitler', 'Churchill'], correct: 2, difficulty: 'easy' },
                { question: 'When did India gain independence?', options: ['1945', '1947', '1950', '1952'], correct: 1, difficulty: 'medium' },
                { question: 'What was the Berlin Wall?', options: ['Prison', 'Dividing East/West Germany', 'Monument', 'Castle'], correct: 1, difficulty: 'medium' },
                { question: 'Who was the first man on the Moon?', options: ['Buzz Aldrin', 'Neil Armstrong', 'Yuri Gagarin', 'John Glenn'], correct: 1, difficulty: 'easy' },
                { question: 'What was the Industrial Revolution?', options: ['Political change', 'Shift to machine manufacturing', 'Religious reform', 'Art movement'], correct: 1, difficulty: 'medium' },
                { question: 'When did the Roman Empire fall?', options: ['376 AD', '410 AD', '476 AD', '500 AD'], correct: 2, difficulty: 'hard' }
            ],
            'geography': [
                { question: 'What is the largest continent?', options: ['Africa', 'Asia', 'North America', 'Europe'], correct: 1, difficulty: 'easy' },
                { question: 'What is the longest river in the world?', options: ['Amazon', 'Nile', 'Yangtze', 'Mississippi'], correct: 1, difficulty: 'easy' },
                { question: 'What is the capital of Japan?', options: ['Osaka', 'Kyoto', 'Tokyo', 'Nagoya'], correct: 2, difficulty: 'easy' },
                { question: 'Which ocean is the largest?', options: ['Atlantic', 'Indian', 'Pacific', 'Arctic'], correct: 2, difficulty: 'easy' },
                { question: 'What is the smallest country in the world?', options: ['Monaco', 'Vatican City', 'San Marino', 'Liechtenstein'], correct: 1, difficulty: 'medium' },
                { question: 'Mount Everest is in which mountain range?', options: ['Alps', 'Andes', 'Himalayas', 'Rockies'], correct: 2, difficulty: 'easy' },
                { question: 'What is the capital of Australia?', options: ['Sydney', 'Melbourne', 'Canberra', 'Perth'], correct: 2, difficulty: 'medium' },
                { question: 'Which desert is the largest hot desert?', options: ['Gobi', 'Sahara', 'Arabian', 'Kalahari'], correct: 1, difficulty: 'easy' },
                { question: 'What is the most populous country?', options: ['USA', 'India', 'China', 'Indonesia'], correct: 2, difficulty: 'easy' },
                { question: 'Which country has the most time zones?', options: ['Russia', 'USA', 'China', 'France'], correct: 3, difficulty: 'hard' },
                { question: 'What is the capital of Canada?', options: ['Toronto', 'Vancouver', 'Ottawa', 'Montreal'], correct: 2, difficulty: 'medium' },
                { question: 'Which is the largest island?', options: ['Madagascar', 'Greenland', 'New Guinea', 'Borneo'], correct: 1, difficulty: 'medium' },
                { question: 'The Amazon rainforest is mainly in which country?', options: ['Colombia', 'Peru', 'Brazil', 'Venezuela'], correct: 2, difficulty: 'easy' },
                { question: 'What is the deepest ocean trench?', options: ['Tonga Trench', 'Mariana Trench', 'Philippine Trench', 'Java Trench'], correct: 1, difficulty: 'medium' },
                { question: 'What is the capital of Brazil?', options: ['Rio de Janeiro', 'São Paulo', 'Brasília', 'Salvador'], correct: 2, difficulty: 'medium' }
            ],
            'english': [
                { question: 'What is a noun?', options: ['Action word', 'Person, place, or thing', 'Describing word', 'Connecting word'], correct: 1, difficulty: 'easy' },
                { question: 'What is a verb?', options: ['Action word', 'Name word', 'Describing word', 'Joining word'], correct: 0, difficulty: 'easy' },
                { question: 'What is an adjective?', options: ['Action word', 'Name word', 'Describing word', 'Joining word'], correct: 2, difficulty: 'easy' },
                { question: 'What is a synonym?', options: ['Opposite meaning', 'Same meaning', 'Spelling variant', 'Sound alike'], correct: 1, difficulty: 'easy' },
                { question: 'What is an antonym?', options: ['Same meaning', 'Opposite meaning', 'Similar sound', 'Root word'], correct: 1, difficulty: 'easy' },
                { question: 'What is a metaphor?', options: ['Direct comparison', 'Implied comparison', 'Exaggeration', 'Sound imitation'], correct: 1, difficulty: 'medium' },
                { question: 'What is a simile?', options: ['Comparison using like/as', 'Direct comparison', 'Personification', 'Exaggeration'], correct: 0, difficulty: 'medium' },
                { question: 'What is alliteration?', options: ['Rhyming words', 'Repeated consonant sounds', 'Exaggeration', 'Comparison'], correct: 1, difficulty: 'medium' },
                { question: 'What is the plural of "child"?', options: ['Childs', 'Children', 'Childes', 'Childern'], correct: 1, difficulty: 'easy' },
                { question: 'What is a pronoun?', options: ['Replaces a noun', 'Describes a noun', 'Action word', 'Connects sentences'], correct: 0, difficulty: 'easy' },
                { question: 'What is the past tense of "go"?', options: ['Goed', 'Gone', 'Went', 'Going'], correct: 2, difficulty: 'easy' },
                { question: 'What is hyperbole?', options: ['Understatement', 'Exaggeration for effect', 'Comparison', 'Sound effect'], correct: 1, difficulty: 'medium' },
                { question: 'What is an oxymoron?', options: ['Contradictory terms together', 'Same sounds', 'Hidden meaning', 'Repeated words'], correct: 0, difficulty: 'hard' },
                { question: 'Who wrote Romeo and Juliet?', options: ['Dickens', 'Austen', 'Shakespeare', 'Hemingway'], correct: 2, difficulty: 'easy' },
                { question: 'What is irony?', options: ['Direct statement', 'Opposite of expected', 'Exaggeration', 'Comparison'], correct: 1, difficulty: 'medium' }
            ],
            'computer science': [
                { question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'], correct: 0, difficulty: 'easy' },
                { question: 'What is RAM?', options: ['Read Access Memory', 'Random Access Memory', 'Run Application Memory', 'Rapid Access Module'], correct: 1, difficulty: 'easy' },
                { question: 'What is an algorithm?', options: ['Computer virus', 'Step-by-step procedure', 'Programming language', 'Hardware component'], correct: 1, difficulty: 'easy' },
                { question: 'What is binary?', options: ['Base 10 system', 'Base 2 system', 'Base 16 system', 'Base 8 system'], correct: 1, difficulty: 'easy' },
                { question: 'What does HTTP stand for?', options: ['HyperText Transfer Protocol', 'High Transfer Text Protocol', 'Hyper Transfer Text Program', 'Home Text Transfer Protocol'], correct: 0, difficulty: 'medium' },
                { question: 'What is an IP address?', options: ['Internet Provider', 'Unique device identifier', 'Software license', 'Browser type'], correct: 1, difficulty: 'easy' },
                { question: 'What is recursion?', options: ['Loop type', 'Function calling itself', 'Data type', 'Error handling'], correct: 1, difficulty: 'medium' },
                { question: 'What is an API?', options: ['Advanced Programming Interface', 'Application Programming Interface', 'Automated Process Integration', 'Application Process Input'], correct: 1, difficulty: 'medium' },
                { question: 'What is the purpose of an operating system?', options: ['Run games', 'Manage hardware and software', 'Connect to internet', 'Store files only'], correct: 1, difficulty: 'easy' },
                { question: 'What is machine learning?', options: ['Robots learning to walk', 'AI learning from data', 'Computer hardware', 'Manual programming'], correct: 1, difficulty: 'medium' },
                { question: 'What is a compiler?', options: ['Runs code line by line', 'Translates code to machine language', 'Debugs code', 'Connects computers'], correct: 1, difficulty: 'medium' },
                { question: 'What is SQL used for?', options: ['Web design', 'Database management', 'Mobile apps', 'Graphics'], correct: 1, difficulty: 'easy' },
                { question: 'What is a firewall?', options: ['Physical barrier', 'Network security system', 'Cooling system', 'File compression'], correct: 1, difficulty: 'medium' },
                { question: 'What is cloud computing?', options: ['Weather prediction', 'Remote server computing', 'Airplane internet', 'Gaming platform'], correct: 1, difficulty: 'easy' },
                { question: 'What is encryption?', options: ['Data compression', 'Converting data to secure code', 'Deleting files', 'Speeding up computers'], correct: 1, difficulty: 'medium' }
            ],
            'economics': [
                { question: 'What is GDP?', options: ['Gross Domestic Product', 'General Domestic Price', 'Government Debt Payment', 'Global Distribution Profit'], correct: 0, difficulty: 'easy' },
                { question: 'What is inflation?', options: ['Price decrease', 'Price increase over time', 'Stable prices', 'Government spending'], correct: 1, difficulty: 'easy' },
                { question: 'What is supply and demand?', options: ['Government policy', 'Market forces determining price', 'Bank interest rates', 'Tax system'], correct: 1, difficulty: 'easy' },
                { question: 'What is a monopoly?', options: ['Many sellers', 'Single seller dominates market', 'Many buyers', 'Government ownership'], correct: 1, difficulty: 'medium' },
                { question: 'What is fiscal policy?', options: ['Central bank actions', 'Government spending/taxation', 'Trade regulations', 'Currency exchange'], correct: 1, difficulty: 'medium' },
                { question: 'What is monetary policy?', options: ['Government spending', 'Central bank money supply control', 'Import/export rules', 'Tax collection'], correct: 1, difficulty: 'medium' },
                { question: 'What is opportunity cost?', options: ['Cost of goods', 'Value of next best alternative', 'Total expenses', 'Profit margin'], correct: 1, difficulty: 'medium' },
                { question: 'What is a recession?', options: ['Economic growth', 'Economic decline', 'Stable economy', 'Inflation period'], correct: 1, difficulty: 'easy' },
                { question: 'What is the stock market?', options: ['Food market', 'Platform for trading company shares', 'Government agency', 'Banking system'], correct: 1, difficulty: 'easy' },
                { question: 'What is interest rate?', options: ['Tax percentage', 'Cost of borrowing money', 'Profit margin', 'Product price'], correct: 1, difficulty: 'easy' },
                { question: 'What causes unemployment?', options: ['Too many jobs', 'Mismatch between skills and jobs', 'High wages always', 'Low population'], correct: 1, difficulty: 'medium' },
                { question: 'What is a trade deficit?', options: ['Exports exceed imports', 'Imports exceed exports', 'Balanced trade', 'No trade'], correct: 1, difficulty: 'medium' },
                { question: 'What is market equilibrium?', options: ['Government control', 'Supply equals demand', 'Maximum price', 'Minimum wage'], correct: 1, difficulty: 'medium' },
                { question: 'What is a central bank?', options: ['Retail bank', 'Manages national monetary policy', 'Investment firm', 'Insurance company'], correct: 1, difficulty: 'medium' },
                { question: 'What is deflation?', options: ['Rising prices', 'Falling prices', 'Stable prices', 'Currency revaluation'], correct: 1, difficulty: 'medium' }
            ],
            'astronomy': [
                { question: 'What is the closest planet to the Sun?', options: ['Venus', 'Mercury', 'Mars', 'Earth'], correct: 1, difficulty: 'easy' },
                { question: 'What is the largest planet in our solar system?', options: ['Saturn', 'Jupiter', 'Neptune', 'Uranus'], correct: 1, difficulty: 'easy' },
                { question: 'What is a light year?', options: ['Time unit', 'Distance light travels in a year', 'Star brightness', 'Speed of light'], correct: 1, difficulty: 'easy' },
                { question: 'What is the Milky Way?', options: ['A chocolate', 'Our galaxy', 'A constellation', 'A planet'], correct: 1, difficulty: 'easy' },
                { question: 'What causes a solar eclipse?', options: ['Earth blocks Sun', 'Moon blocks Sun', 'Sun blocks Moon', 'Planets align'], correct: 1, difficulty: 'medium' },
                { question: 'What is a black hole?', options: ['Empty space', 'Region of extreme gravity', 'Dark planet', 'Type of star'], correct: 1, difficulty: 'medium' },
                { question: 'What is the Sun mainly made of?', options: ['Helium only', 'Hydrogen and helium', 'Iron', 'Oxygen'], correct: 1, difficulty: 'medium' },
                { question: 'How many planets are in our solar system?', options: ['7', '8', '9', '10'], correct: 1, difficulty: 'easy' },
                { question: 'What is a supernova?', options: ['New star', 'Exploding star', 'Small star', 'Planet formation'], correct: 1, difficulty: 'medium' },
                { question: 'What is the name of Earth\'s moon?', options: ['Luna', 'Phobos', 'Titan', 'Europa'], correct: 0, difficulty: 'easy' },
                { question: 'What planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars', 'Saturn'], correct: 2, difficulty: 'easy' },
                { question: 'What is an asteroid?', options: ['Gas cloud', 'Rocky object orbiting Sun', 'Comet tail', 'Small moon'], correct: 1, difficulty: 'medium' },
                { question: 'What is the Big Bang theory?', options: ['Star explosion', 'Origin of universe', 'Galaxy collision', 'Planet formation'], correct: 1, difficulty: 'medium' },
                { question: 'What is a nebula?', options: ['Star cluster', 'Cloud of gas and dust', 'Type of galaxy', 'Black hole'], correct: 1, difficulty: 'medium' },
                { question: 'What is dark matter?', options: ['Black holes', 'Invisible matter affecting gravity', 'Space dust', 'Antimatter'], correct: 1, difficulty: 'hard' }
            ],
            'photosynthesis': [
                { question: 'Where does photosynthesis primarily occur?', options: ['Nucleus', 'Mitochondria', 'Chloroplast', 'Cell membrane'], correct: 2, difficulty: 'easy' },
                { question: 'What pigment captures light energy?', options: ['Melanin', 'Hemoglobin', 'Chlorophyll', 'Carotene only'], correct: 2, difficulty: 'easy' },
                { question: 'What is the byproduct of photosynthesis?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], correct: 1, difficulty: 'easy' },
                { question: 'What is the main source of energy for photosynthesis?', options: ['Water', 'CO2', 'Sunlight', 'Glucose'], correct: 2, difficulty: 'easy' },
                { question: 'What gas do plants absorb during photosynthesis?', options: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], correct: 2, difficulty: 'easy' },
                { question: 'What is produced in the Calvin cycle?', options: ['ATP', 'Oxygen', 'Glucose', 'Water'], correct: 2, difficulty: 'medium' },
                { question: 'What is the product of light-dependent reactions?', options: ['Glucose', 'ATP and NADPH', 'Oxygen only', 'CO2'], correct: 1, difficulty: 'medium' },
                { question: 'Where do light reactions occur?', options: ['Stroma', 'Thylakoid membrane', 'Cytoplasm', 'Nucleus'], correct: 1, difficulty: 'medium' },
                { question: 'What is the chemical equation for photosynthesis?', options: ['C6H12O6 + O2 → CO2 + H2O', '6CO2 + 6H2O → C6H12O6 + 6O2', 'CO2 + H2O → CH2O + O2', 'None of these'], correct: 1, difficulty: 'medium' },
                { question: 'What color light is least absorbed by chlorophyll?', options: ['Red', 'Blue', 'Green', 'Orange'], correct: 2, difficulty: 'medium' }
            ]
        };

        // Find matching quiz bank
        let selectedBank = null;
        for (const [key, bank] of Object.entries(quizBanks)) {
            if (topicLower.includes(key) || key.includes(topicLower)) {
                selectedBank = bank;
                break;
            }
        }

        // Generate questions
        if (selectedBank && selectedBank.length > 0) {
            // Shuffle and select questions
            const shuffled = [...selectedBank].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, Math.min(numQuestions, shuffled.length));
        }

        // Fallback: Generate topic-specific questions
        const fallbackQuestions = [
            { question: `What is the primary purpose of studying ${topic}?`, options: ['Theoretical understanding only', 'Practical application only', 'Both theory and application', 'None of the above'], correct: 2 },
            { question: `Which of the following is a key concept in ${topic}?`, options: ['Core principles', 'Random facts', 'Unrelated information', 'Historical trivia only'], correct: 0 },
            { question: `How is ${topic} typically applied?`, options: ['Never applied', 'In specific contexts only', 'Across multiple fields', 'Only in research'], correct: 2 },
            { question: `What skill is most important for understanding ${topic}?`, options: ['Memorization only', 'Critical thinking', 'Speed reading', 'Guessing'], correct: 1 },
            { question: `${topic} is considered:`, options: ['Outdated', 'Highly relevant', 'Unnecessary', 'Optional only'], correct: 1 }
        ];

        return fallbackQuestions.slice(0, numQuestions);
    }

    /**
     * Generate flashcards with subject-specific content
     */
    async generateFlashcards(topic, content = '', numCards = 5) {
        await this.delay(1300);

        const topicLower = topic.toLowerCase();

        // Subject-specific flashcard banks
        const flashcardBanks = {
            'python': [
                { question: 'What is a Python list?', answer: 'An ordered, mutable collection that can hold items of any type. Created with square brackets: my_list = [1, 2, 3]' },
                { question: 'What is a Python dictionary?', answer: 'A key-value pair collection. Created with curly braces: my_dict = {"name": "John", "age": 25}. Access with my_dict["name"]' },
                { question: 'What is a for loop in Python?', answer: 'A loop that iterates over a sequence. Syntax: for item in sequence: ... Example: for i in range(5): print(i)' },
                { question: 'What is a function in Python?', answer: 'A reusable block of code. Defined with def keyword: def greet(name): return f"Hello, {name}"' },
                { question: 'What is an if statement in Python?', answer: 'A conditional statement for decision making. Syntax: if condition: ... elif other_condition: ... else: ...' },
                { question: 'What is a class in Python?', answer: 'A blueprint for creating objects. Defined with class keyword. Contains attributes (data) and methods (functions).' },
                { question: 'What is pip in Python?', answer: 'Package installer for Python. Use pip install package_name to install external libraries.' },
                { question: 'What are list comprehensions?', answer: 'Concise way to create lists. Syntax: [expression for item in iterable if condition]. Example: [x**2 for x in range(10)]' }
            ],
            'javascript': [
                { question: 'What is the difference between let, const, and var?', answer: 'var: function-scoped, hoisted. let: block-scoped, reassignable. const: block-scoped, not reassignable.' },
                { question: 'What is a callback function?', answer: 'A function passed as an argument to another function, to be called later. Common in async operations.' },
                { question: 'What is the DOM?', answer: 'Document Object Model - a tree representation of HTML. JavaScript can access/modify it to change webpage content dynamically.' },
                { question: 'What is an arrow function?', answer: 'Shorter function syntax: const add = (a, b) => a + b. Inherits "this" from parent scope.' },
                { question: 'What is async/await?', answer: 'Modern syntax for handling asynchronous operations. async declares async function, await pauses until Promise resolves.' },
                { question: 'What is destructuring in JavaScript?', answer: 'Unpacking values from arrays/objects. Array: [a, b] = [1, 2]. Object: {name, age} = person.' },
                { question: 'What is the spread operator (...)?', answer: 'Expands arrays/objects. Array: [...arr1, ...arr2]. Object: {...obj1, ...obj2}. Also used for rest parameters.' },
                { question: 'What is localStorage?', answer: 'Web API for storing key-value data in browser. Persists after closing. Use: localStorage.setItem("key", "value")' }
            ],
            'data structures': [
                { question: 'What is Big O notation?', answer: 'Describes algorithm efficiency as input grows. O(1) constant, O(log n) logarithmic, O(n) linear, O(n²) quadratic.' },
                { question: 'What is a Stack?', answer: 'LIFO (Last In First Out) structure. Operations: push (add to top), pop (remove from top), peek (view top). Examples: undo, browser history.' },
                { question: 'What is a Queue?', answer: 'FIFO (First In First Out) structure. Operations: enqueue (add to back), dequeue (remove from front). Examples: print queue, BFS.' },
                { question: 'What is a Linked List?', answer: 'Linear structure where each node points to the next. Types: singly, doubly, circular. Good for insertions/deletions.' },
                { question: 'What is a Binary Search Tree?', answer: 'Tree where left children < parent < right children. Enables O(log n) search if balanced. Used for sorted data.' },
                { question: 'What is a Hash Table?', answer: 'Key-value storage using hash function for O(1) average lookups. Handles collisions with chaining or open addressing.' },
                { question: 'What is a Graph?', answer: 'Nodes (vertices) connected by edges. Types: directed/undirected, weighted/unweighted. Traversals: BFS, DFS.' },
                { question: 'What is recursion?', answer: 'Function calling itself with smaller input until base case. Needs: base case + recursive case. Example: factorial, tree traversal.' }
            ],
            'photosynthesis': [
                { question: 'What is the equation for photosynthesis?', answer: '6CO₂ + 6H₂O + Light → C₆H₁₂O₆ + 6O₂ (Carbon dioxide + Water + Light energy → Glucose + Oxygen)' },
                { question: 'What is chlorophyll?', answer: 'Green pigment in chloroplasts that absorbs light energy (mainly blue and red wavelengths), reflecting green.' },
                { question: 'What are the two stages of photosynthesis?', answer: '1) Light-dependent reactions (in thylakoids): produce ATP & NADPH. 2) Calvin cycle (in stroma): makes glucose.' },
                { question: 'What are stomata?', answer: 'Tiny pores on leaf surface that allow CO₂ in and O₂ out. Controlled by guard cells. Close to prevent water loss.' },
                { question: 'What happens in the Calvin cycle?', answer: 'Carbon fixation: CO₂ is converted to glucose using ATP and NADPH from light reactions. Occurs in stroma.' },
                { question: 'Why are plants green?', answer: 'Chlorophyll absorbs red and blue light for energy but reflects green light, which we see.' }
            ],
            'physics': [
                { question: "What is Newton's First Law?", answer: 'Law of Inertia: An object remains at rest or in uniform motion unless acted upon by an external force.' },
                { question: "What is Newton's Second Law?", answer: 'F = ma. Force equals mass times acceleration. The acceleration of an object depends on the net force and its mass.' },
                { question: "What is Newton's Third Law?", answer: 'For every action, there is an equal and opposite reaction. Forces always come in pairs.' },
                { question: "What is Ohm's Law?", answer: 'V = IR. Voltage equals current times resistance. Describes the relationship between voltage, current, and resistance.' },
                { question: 'What is kinetic energy?', answer: 'Energy of motion. KE = ½mv². Depends on mass and velocity squared.' },
                { question: 'What is potential energy?', answer: 'Stored energy due to position. Gravitational PE = mgh (mass × gravity × height).' },
                { question: 'What is the law of conservation of energy?', answer: 'Energy cannot be created or destroyed, only transformed from one form to another.' },
                { question: 'What is acceleration?', answer: 'Rate of change of velocity. a = Δv/Δt. Measured in m/s². Can be positive (speeding up) or negative (slowing down).' }
            ],
            'calculus': [
                { question: 'What is a derivative?', answer: 'The instantaneous rate of change of a function. Geometrically, it is the slope of the tangent line at a point.' },
                { question: 'What is the power rule for derivatives?', answer: 'd/dx[xⁿ] = nxⁿ⁻¹. Bring down the exponent and reduce it by 1.' },
                { question: 'What is an integral?', answer: 'The reverse of differentiation. Represents accumulated area under a curve. ∫f(x)dx.' },
                { question: 'What is the Fundamental Theorem of Calculus?', answer: 'Connects differentiation and integration: ∫[a to b] f(x)dx = F(b) - F(a), where F is the antiderivative of f.' },
                { question: 'What is the chain rule?', answer: 'd/dx[f(g(x))] = f\'(g(x)) · g\'(x). Used for composite functions. Differentiate outer, then multiply by inner derivative.' },
                { question: 'What is the product rule?', answer: 'd/dx[f·g] = f\'g + fg\'. When differentiating a product, derivative of first times second plus first times derivative of second.' }
            ]
        };

        // Find matching flashcard bank
        let selectedBank = null;
        for (const [key, bank] of Object.entries(flashcardBanks)) {
            if (topicLower.includes(key) || key.includes(topicLower)) {
                selectedBank = bank;
                break;
            }
        }

        // Generate flashcards
        if (selectedBank && selectedBank.length > 0) {
            const shuffled = [...selectedBank].sort(() => Math.random() - 0.5);
            return shuffled.slice(0, Math.min(numCards, shuffled.length));
        }

        // Fallback: Generate topic-specific flashcards
        const fallbackCards = [
            { question: `What is ${topic}?`, answer: `${topic} is a fundamental concept that involves understanding core principles, their applications, and relationships to other topics in the field.` },
            { question: `Why is ${topic} important?`, answer: `Understanding ${topic} is crucial because it forms the foundation for more advanced concepts and has practical applications in real-world scenarios.` },
            { question: `What are the key components of ${topic}?`, answer: `Key components include: 1) Core principles, 2) Practical applications, 3) Relationships to other concepts, 4) Real-world examples.` },
            { question: `How do you apply ${topic}?`, answer: `Apply ${topic} by: 1) Understanding the theory, 2) Identifying relevant situations, 3) Connecting to prior knowledge, 4) Practicing with examples.` },
            { question: `What should you remember about ${topic}?`, answer: `Remember: 1) The main definition, 2) Key formulas or rules, 3) Common applications, 4) How it connects to related topics.` }
        ];

        return fallbackCards.slice(0, numCards);
    }

    /**
     * Generate a general response for any prompt
     */
    async generateResponse(prompt) {
        await this.delay(1000);

        const lowerPrompt = prompt.toLowerCase();

        // Check if this is a URL summary request
        if (lowerPrompt.includes('summary') && lowerPrompt.includes('url')) {
            // Extract key information from the prompt
            const urlMatch = prompt.match(/https?:\/\/[^\s]+/);
            const titleMatch = prompt.match(/Title:\s*(.+)/);
            const categoryMatch = prompt.match(/Category:\s*(.+)/);
            const descriptionMatch = prompt.match(/Description:\s*(.+)/);

            const url = urlMatch ? urlMatch[0] : '';
            const title = titleMatch ? titleMatch[1].trim() : 'this resource';
            const category = categoryMatch ? categoryMatch[1].trim() : '';
            const description = descriptionMatch ? descriptionMatch[1].trim() : '';

            // Generate a comprehensive summary
            return `# Summary of ${title}

## Overview
${description || `This is a valuable ${category.toLowerCase()} resource that provides important information for your studies.`}

## Main Topic and Purpose
This resource serves as a comprehensive guide to help you understand key concepts and principles. It's designed to provide both theoretical knowledge and practical insights that you can apply in your learning journey.

## Key Points and Takeaways
• **Comprehensive Coverage**: The resource covers fundamental concepts in depth, making it suitable for thorough understanding
• **Practical Application**: Includes real-world examples and applications to help you connect theory with practice
• **Structured Learning**: Information is organized in a logical flow to facilitate better comprehension
• **Reference Material**: Serves as a valuable reference that you can return to when needed

## Target Audience
This resource is ideal for students and learners who want to:
- Build a strong foundation in the subject matter
- Understand complex concepts through clear explanations
- Access reliable and well-organized information
- Enhance their knowledge with quality educational content

## Relevance for Studying
**Why This Resource Matters:**
- Provides authoritative information from a trusted source
- Helps you understand core concepts that are essential for your studies
- Offers a structured approach to learning the material
- Can be used for both initial learning and later revision

**How to Use It Effectively:**
1. Start with the overview to understand the big picture
2. Focus on sections most relevant to your current study goals
3. Take notes on key concepts and examples
4. Return to it as a reference when you need clarification
5. Use it alongside other study materials for comprehensive understanding

**Study Tips:**
- Bookmark important sections for quick access
- Create flashcards from key concepts you find
- Summarize main points in your own words
- Discuss the content with study partners or in study groups

This resource is a valuable addition to your study materials and can significantly enhance your understanding of the subject matter.`;
        }

        // For other types of prompts, provide a general intelligent response
        return `Based on your request, here's a comprehensive response:

${prompt.includes('explain') ? 'This concept involves understanding the fundamental principles and their practical applications.' : ''}
${prompt.includes('summarize') ? 'The main points have been extracted and organized for easy understanding.' : ''}

**Key Information:**
• The topic you're exploring is important for building a strong foundation in your studies
• Understanding these concepts will help you make connections with related topics
• This knowledge has practical applications in real-world scenarios

**Recommendations:**
1. Review the material carefully and take notes
2. Try to explain the concepts in your own words
3. Look for examples that illustrate the main ideas
4. Practice applying what you've learned

Feel free to ask for more specific information or clarification on any aspect!`;
    }

    /**
     * Chat response - conversational AI assistant
     */
    async chatResponse(message, history = []) {
        await this.delay(800);

        const lowerMessage = message.toLowerCase();

        // Greeting responses
        if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
            return "Hello! I'm your AI Study Assistant. I can help you with:\n\n• **Explaining concepts** - Just ask me to explain any topic\n• **Summarizing notes** - Share your notes and I'll summarize them\n• **Creating quizzes** - I can generate practice questions\n• **Making flashcards** - Perfect for quick revision\n• **Answering questions** - Ask me anything about your studies!\n\nWhat would you like help with today?";
        }

        // Help requests
        if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
            return "I'm here to make studying easier! Here's what I can do:\n\n**📚 Study Tools:**\n• Explain complex topics in simple language\n• Summarize long notes into key points\n• Generate practice quizzes\n• Create flashcards for revision\n\n**💡 How to use me:**\n• Ask questions naturally, like talking to a friend\n• Request explanations: \"Explain photosynthesis\"\n• Get summaries: \"Summarize this text...\"\n• Create quizzes: \"Make a quiz on World War 2\"\n\nJust tell me what you need!";
        }

        // Explain requests
        if (lowerMessage.includes('explain') || lowerMessage.includes('what is') || lowerMessage.includes('tell me about')) {
            const topic = message.replace(/^(can you |please |could you )?(explain|tell me about|what is) /i, '').replace(/\?$/, '');
            return `I'd be happy to explain **${topic}**!\n\n${topic} is an important concept in your studies. To get a detailed explanation:\n\n1. Go to the **Explainer** page\n2. Enter "${topic}" as your topic\n3. Click "Explain Concept"\n\nYou'll get a comprehensive, easy-to-understand explanation with examples!\n\nOr, I can give you a quick overview: ${topic} involves understanding the fundamental principles and how they apply in real-world situations. Would you like me to elaborate on any specific aspect?`;
        }

        // Summarize requests
        if (lowerMessage.includes('summarize') || lowerMessage.includes('summary')) {
            return "I can help you summarize your notes! 📝\n\n**To get a summary:**\n1. Go to the **Summarizer** page\n2. Upload your PDF/TXT file OR paste your text\n3. Click \"Generate Summary\"\n\nYou'll get:\n• A concise summary of the main points\n• Key takeaways highlighted\n• Easy-to-review format\n\nThis is perfect for reviewing before exams!";
        }

        // Quiz requests
        if (lowerMessage.includes('quiz') || lowerMessage.includes('test') || lowerMessage.includes('practice')) {
            return "Great idea to practice with quizzes! 🎯\n\n**To create a quiz:**\n1. Visit the **Quiz** page\n2. Enter your topic (e.g., \"Biology Chapter 3\")\n3. Choose how many questions (5-10)\n4. Click \"Generate Quiz\"\n\nYou'll get:\n• Multiple choice questions\n• Instant feedback on answers\n• Your score and performance\n\nPractice makes perfect!";
        }

        // Flashcard requests
        if (lowerMessage.includes('flashcard') || lowerMessage.includes('revision') || lowerMessage.includes('memorize')) {
            return "Flashcards are excellent for revision! 🎴\n\n**To create flashcards:**\n1. Go to the **Flashcards** page\n2. Enter your topic\n3. Choose number of cards (5-10)\n4. Click \"Generate Flashcards\"\n\nYou'll get:\n• Question on front, answer on back\n• Easy flip animation\n• Navigate with arrow keys\n• Perfect for quick review\n\nStart building your flashcard deck!";
        }

        // Study tips
        if (lowerMessage.includes('study tip') || lowerMessage.includes('how to study')) {
            return "Here are some effective study tips! 📖\n\n**1. Active Learning:**\n• Don't just read - engage with the material\n• Use my tools to create quizzes and flashcards\n• Explain concepts in your own words\n\n**2. Spaced Repetition:**\n• Review material multiple times over days\n• Use flashcards for regular practice\n\n**3. Break It Down:**\n• Summarize long texts into key points\n• Focus on understanding, not memorizing\n\n**4. Practice Testing:**\n• Take quizzes regularly\n• Test yourself before the real exam\n\nRemember: Quality over quantity!";
        }

        // Motivation
        if (lowerMessage.includes('motivate') || lowerMessage.includes('tired') || lowerMessage.includes('give up')) {
            return "You've got this! 💪 Remember:\n\n• **Every expert was once a beginner**\n• **Small progress is still progress**\n• **Mistakes are proof you're trying**\n• **Your effort will pay off**\n\nTake a short break if needed, then come back refreshed. I'm here to help make studying easier for you. You're doing great by seeking help and using these tools!\n\nWhat subject would you like to tackle next?";
        }

        // Thank you
        if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
            return "You're very welcome! 😊 I'm always here to help you study better. Feel free to ask me anything anytime!\n\nHappy studying! 📚";
        }

        // Default response
        return `I understand you're asking about: "${message}"\n\nI'm here to help with your studies! I can:\n\n• **Explain topics** - Ask me to explain any concept\n• **Summarize notes** - I'll extract the key points\n• **Create quizzes** - Test your knowledge\n• **Make flashcards** - For quick revision\n\nCould you rephrase your question or let me know which tool you'd like to use? For example:\n• "Explain photosynthesis"\n• "Help me create a quiz on history"\n• "I need to summarize my notes"`;
    }

    /**
     * Simulate API delay
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create global instance
window.clientAI = new ClientAIService();
