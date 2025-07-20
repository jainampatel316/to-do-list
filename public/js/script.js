// Client-side JavaScript for Todo List App

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const addTodoForm = document.getElementById('addTodoForm');
    const todoInput = document.getElementById('todoInput');
    const errorAlert = document.getElementById('errorAlert');

    // Form submission validation
    addTodoForm.addEventListener('submit', function(e) {
        const inputValue = todoInput.value.trim();
        
        if (inputValue === '') {
            e.preventDefault(); // Prevent form submission
            showErrorAlert();
            todoInput.focus();
            return false;
        }
        
        hideErrorAlert();
    });

    // Real-time input validation
    todoInput.addEventListener('input', function() {
        if (this.value.trim() !== '') {
            hideErrorAlert();
        }
    });

    // Clear input on focus if it was empty
    todoInput.addEventListener('focus', function() {
        hideErrorAlert();
    });

    // Show error alert
    function showErrorAlert() {
        errorAlert.style.display = 'flex';
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            hideErrorAlert();
        }, 3000);
    }

    // Hide error alert
    function hideErrorAlert() {
        errorAlert.style.display = 'none';
    }

    // Add smooth transitions for todo items
    const todoItems = document.querySelectorAll('.todo-item');
    todoItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.1}s`;
        item.classList.add('fade-in');
    });

    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit form
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (document.activeElement === todoInput) {
                addTodoForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Escape to clear input
        if (e.key === 'Escape') {
            if (document.activeElement === todoInput) {
                todoInput.value = '';
                hideErrorAlert();
            }
        }
    });
});

// Edit Todo Functions
function editTodo(id) {
    const textElement = document.getElementById(`text-${id}`);
    const editForm = document.getElementById(`edit-form-${id}`);
    const todoItem = textElement.closest('.todo-item');
    
    // Hide the text and show the edit form
    textElement.parentElement.style.display = 'none';
    editForm.style.display = 'flex';
    
    // Focus on the input field
    const editInput = editForm.querySelector('input[name="text"]');
    editInput.focus();
    editInput.select();
    
    // Add editing class for styling
    todoItem.classList.add('editing');
}

function cancelEdit(id) {
    const textElement = document.getElementById(`text-${id}`);
    const editForm = document.getElementById(`edit-form-${id}`);
    const todoItem = textElement.closest('.todo-item');
    
    // Show the text and hide the edit form
    textElement.parentElement.style.display = 'block';
    editForm.style.display = 'none';
    
    // Remove editing class
    todoItem.classList.remove('editing');
    
    // Reset form values
    const editInput = editForm.querySelector('input[name="text"]');
    const originalText = textElement.textContent.trim();
    editInput.value = originalText;
}

// Confirm delete function
function confirmDelete() {
    return confirm('Are you sure you want to delete this task? This action cannot be undone.');
}

// Add CSS animation class
const style = document.createElement('style');
style.textContent = `
    .fade-in {
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .todo-item.editing {
        background: #fff3cd;
        border-color: #ffc107;
    }
    
    .todo-item.editing:hover {
        background: #fff3cd;
        border-color: #ffc107;
    }
`;
document.head.appendChild(style);

// Add smooth scrolling for filter changes
if (window.location.search.includes('priority')) {
    setTimeout(() => {
        document.querySelector('.todo-list-container').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }, 100);
}

// Performance optimization: Lazy load animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe todo items for scroll animations
document.querySelectorAll('.todo-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(item);
});

// Add loading states for form submissions
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            submitBtn.disabled = true;
            
            // Re-enable after a short delay (in case submission fails)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });
});

// Add tooltips for better UX
function addTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            // Create tooltip element if it doesn't exist
            if (!this.querySelector('.tooltip')) {
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = this.getAttribute('title');
                this.appendChild(tooltip);
                this.removeAttribute('title');
            }
        });
    });
}

// Initialize tooltips
addTooltips();
