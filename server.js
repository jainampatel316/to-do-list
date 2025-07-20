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

// POST - Add a new todo
app.post('/add', (req, res) => {
    const { text, priority } = req.body;
    
    if (text && text.trim() !== '') {
        const newTodo = {
            id: nextId++,
            text: text.trim(),
            priority: priority || 'medium',
            completed: false
        };
        todos.push(newTodo);
    }
    
    res.redirect('/');
});

// POST - Edit a todo
app.post('/edit/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { text, priority } = req.body;
    
    const todoIndex = todos.findIndex(todo => todo.id === id);
    if (todoIndex !== -1 && text && text.trim() !== '') {
        todos[todoIndex].text = text.trim();
        todos[todoIndex].priority = priority || 'medium';
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
