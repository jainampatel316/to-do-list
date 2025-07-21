const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// In-memory data storage (array)
let todos = [
    { id: 1, text: 'Learn Node.js', priority: 'high', completed: false },
    { id: 2, text: 'Build Todo App', priority: 'medium', completed: false },
    { id: 3, text: 'Practice EJS', priority: 'low', completed: true }
];

let nextId = 4;

// Routes

// GET - Display all todos with optional priority filter
app.get('/', (req, res) => {
    const { priority } = req.query;
    let filteredTodos = todos;
    
    console.log(`Current todos in memory: ${JSON.stringify(todos, null, 2)}`);
    
    if (priority && priority !== 'all') {
        filteredTodos = todos.filter(todo => todo.priority === priority);
    }
    
    res.render('index', { 
        todos: filteredTodos, 
        filter: priority || 'all',
        priorities: ['low', 'medium', 'high']
    });
});

// Validation functions
function validateTodoInput(text, priority) {
    const errors = [];
    
    // Validate text
    if (!text || typeof text !== 'string') {
        errors.push('Task text is required');
    } else {
        const trimmedText = text.trim();
        if (trimmedText.length === 0) {
            errors.push('Task text cannot be empty');
        } else if (trimmedText.length > 200) {
            errors.push('Task text must be 200 characters or less');
        } else if (!/^(?!\s*$).+/.test(trimmedText)) {
            errors.push('Task text cannot contain only whitespace');
        }
    }
    
    // Validate priority
    const validPriorities = ['low', 'medium', 'high'];
    if (!priority || !validPriorities.includes(priority)) {
        errors.push('Please select a valid priority level');
    }
    
    return {
        isValid: errors.length === 0,
        errors,
        sanitizedText: text ? text.trim() : '',
        validatedPriority: validPriorities.includes(priority) ? priority : 'medium'
    };
}

// POST - Add a new todo
app.post('/add', (req, res) => {
    const { text, priority } = req.body;
    
    const validation = validateTodoInput(text, priority);
    
    if (validation.isValid) {
        const newTodo = {
            id: nextId++,
            text: validation.sanitizedText,
            priority: validation.validatedPriority,
            completed: false
        };
        todos.push(newTodo);
        console.log(`New todo added: ${JSON.stringify(newTodo)}`);
    } else {
        console.log(`Validation failed: ${validation.errors.join(', ')}`);
        // In a real app, you might want to return errors to the client
        // For now, we'll just redirect back
    }
    
    res.redirect('/');
});

// POST - Edit a todo
app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { text, priority } = req.body;
    
    const validation = validateTodoInput(text, priority);
    
    if (validation.isValid) {
        const todoIndex = todos.findIndex(todo => todo.id === id);
        if (todoIndex !== -1) {
            todos[todoIndex].text = validation.sanitizedText;
            todos[todoIndex].priority = validation.validatedPriority;
            console.log(`Todo ${id} updated: ${JSON.stringify(todos[todoIndex])}`);
        } else {
            console.log(`Todo with ID ${id} not found`);
        }
    } else {
        console.log(`Edit validation failed for todo ${id}: ${validation.errors.join(', ')}`);
    }
    
    res.redirect('/');
});

// POST - Toggle todo completion
app.post('/toggle/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(todo => todo.id === id);
    
    if (todoIndex !== -1) {
        todos[todoIndex].completed = !todos[todoIndex].completed;
    }
    
    res.redirect('/');
});

// POST - Delete a todo
app.post('/delete/:id', (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`Delete request received for todo ID: ${id}`);
    console.log(`Before deletion - todos count: ${todos.length}`);
    
    const originalLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    
    console.log(`After deletion - todos count: ${todos.length}`);
    console.log(`Deletion ${originalLength !== todos.length ? 'successful' : 'failed'}`);
    
    res.redirect('/');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Visit: http://localhost:${PORT}`);
});
