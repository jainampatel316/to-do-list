# Todo List Web Application

A dynamic and responsive Todo List web application built with Node.js, Express, and EJS templating engine.

## Features

### ✨ Core Functionality
- **Add Tasks**: Create new todos with priority levels (Low, Medium, High)
- **Edit Tasks**: Modify existing todos inline with full editing capabilities
- **Delete Tasks**: Remove completed or unwanted tasks with confirmation
- **Toggle Completion**: Mark tasks as complete/incomplete
- **Priority Filter**: Filter tasks by priority level (All, Low, Medium, High)
- **Real-time Validation**: Client-side validation with instant feedback

### 🎨 User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, gradient-based design with smooth animations
- **Interactive Elements**: Hover effects, smooth transitions, and loading states
- **Accessibility**: Proper ARIA labels and keyboard navigation support
- **Empty State**: Helpful messages when no tasks are found

### ⚡ Technical Features
- **EJS Templating**: Dynamic server-side rendering
- **RESTful Routes**: Proper HTTP methods for different operations
- **In-Memory Storage**: Array-based data storage for simplicity
- **Form Validation**: Both client-side and server-side validation
- **Error Handling**: Graceful error handling and user feedback

## Project Structure

```
to-do-1/
├── views/
│   ├── partials/
│   │   ├── header.ejs      # Header template with navigation
│   │   └── footer.ejs      # Footer template
│   └── index.ejs           # Main page template
├── public/
│   ├── css/
│   │   └── style.css       # Responsive CSS styles
│   └── js/
│       └── script.js       # Client-side JavaScript
├── server.js               # Main server file
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)

### Steps

1. **Clone or Download** this project to your local machine

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Application**
   ```bash
   npm start
   ```
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

4. **Access the Application**
   Open your browser and navigate to: `http://localhost:3000`

## Usage Guide

### Adding Tasks
1. Enter your task in the input field
2. Select a priority level (Low, Medium, High)
3. Click "Add Task" or press Ctrl+Enter
4. Empty tasks will show an error message

### Managing Tasks
- **Complete/Uncomplete**: Click the circle icon next to any task
- **Edit**: Click the edit icon (pencil) to modify a task
- **Delete**: Click the delete icon (trash) with confirmation prompt
- **Filter**: Use the priority filter buttons to view specific priority tasks

### Keyboard Shortcuts
- `Ctrl+Enter`: Submit the add task form
- `Escape`: Clear the input field and hide alerts

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Display all todos (with optional priority filter) |
| POST | `/add` | Add a new todo |
| POST | `/edit/:id` | Edit an existing todo |
| POST | `/toggle/:id` | Toggle todo completion status |
| POST | `/delete/:id` | Delete a todo |

### Query Parameters
- `priority`: Filter todos by priority (`low`, `medium`, `high`, or `all`)

## Data Structure

Each todo item contains:
```javascript
{
    id: number,           // Unique identifier
    text: string,         // Task description
    priority: string,     // 'low', 'medium', or 'high'
    completed: boolean    // Completion status
}
```

## Customization

### Styling
- Modify `public/css/style.css` to change colors, fonts, or layout
- The CSS uses CSS Grid and Flexbox for responsive design
- CSS custom properties (variables) can be added for easier theming

### Functionality
- Add new priority levels in `server.js`
- Implement due dates or categories
- Add user authentication
- Integrate with a database (MongoDB, PostgreSQL, etc.)

### Responsive Breakpoints
- Desktop: > 768px
- Tablet: 768px - 480px
- Mobile: < 480px

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Opera

## Dependencies

- **express**: Web framework for Node.js
- **ejs**: Embedded JavaScript templating
- **body-parser**: Parse incoming request bodies

## Development

For development, you can install nodemon for auto-restart:
```bash
npm install -g nodemon
npm run dev
```

## Future Enhancements

- [ ] User authentication and multiple user support
- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] Due dates and reminders
- [ ] Task categories and tags
- [ ] Search functionality
- [ ] Export/Import tasks
- [ ] Dark mode theme
- [ ] PWA (Progressive Web App) features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

---

**Built with ❤️ using Node.js, Express, and EJS**
