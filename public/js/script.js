// Client-side JavaScript for Todo List App

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const addTodoForm = document.getElementById('addTodoForm');
    const todoInput = document.getElementById('todoInput');
    const prioritySelect = addTodoForm.querySelector('select[name="priority"]');
    const errorAlert = document.getElementById('errorAlert');
    const successAlert = document.getElementById('successAlert');

    // Validation configuration
    const validationRules = {
        text: {
            required: true,
            minLength: 1,
            maxLength: 200,
            pattern: /^(?!\s*$).+/, // Not just whitespace
            message: 'Please enter a valid task (1-200 characters)'
        },
        priority: {
            required: true,
            values: ['low', 'medium', 'high'],
            message: 'Please select a priority level'
        }
    };

    // Form submission validation
    addTodoForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm(this)) {
            showLoadingState(this);
            // If validation passes, submit the form
            this.submit();
        }
    });

    // Real-time validation
    todoInput.addEventListener('input', function() {
        validateField(this, 'text');
        hideGlobalAlerts();
    });

    todoInput.addEventListener('blur', function() {
        validateField(this, 'text');
    });

    prioritySelect.addEventListener('change', function() {
        validateField(this, 'priority');
        hideGlobalAlerts();
    });

    // Validate entire form
    function validateForm(form) {
        const formData = new FormData(form);
        let isValid = true;
        let errors = [];

        // Validate text field
        const text = formData.get('text');
        const textValidation = validateField(todoInput, 'text', text);
        if (!textValidation.isValid) {
            isValid = false;
            errors.push(textValidation.message);
        }

        // Validate priority field
        const priority = formData.get('priority');
        const priorityValidation = validateField(prioritySelect, 'priority', priority);
        if (!priorityValidation.isValid) {
            isValid = false;
            errors.push(priorityValidation.message);
        }

        if (!isValid) {
            showErrorAlert(errors.join(' '));
            return false;
        }

        hideGlobalAlerts();
        return true;
    }

    // Validate individual field
    function validateField(field, fieldName, value = null) {
        const rules = validationRules[fieldName];
        const fieldValue = value !== null ? value : field.value;
        const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
        
        let isValid = true;
        let message = '';

        // Required validation
        if (rules.required && (!fieldValue || fieldValue.trim() === '')) {
            isValid = false;
            message = rules.message;
        }
        // Length validation
        else if (rules.minLength && fieldValue.trim().length < rules.minLength) {
            isValid = false;
            message = rules.message;
        }
        else if (rules.maxLength && fieldValue.length > rules.maxLength) {
            isValid = false;
            message = `Text must be ${rules.maxLength} characters or less`;
        }
        // Pattern validation
        else if (rules.pattern && !rules.pattern.test(fieldValue.trim())) {
            isValid = false;
            message = rules.message;
        }
        // Value validation (for select fields)
        else if (rules.values && !rules.values.includes(fieldValue)) {
            isValid = false;
            message = rules.message;
        }

        // Update field appearance and error message
        if (errorElement) {
            if (isValid) {
                errorElement.textContent = '';
                field.classList.remove('invalid');
                field.classList.add('valid');
            } else {
                errorElement.textContent = message;
                field.classList.remove('valid');
                field.classList.add('invalid');
            }
        }

        return { isValid, message };
    }

    // Show error alert
    function showErrorAlert(message = 'Please fix the errors below!') {
        const errorMessage = document.getElementById('errorMessage');
        if (errorMessage) {
            errorMessage.textContent = message;
        }
        errorAlert.style.display = 'flex';
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            hideErrorAlert();
        }, 5000);
    }

    // Show success alert
    function showSuccessAlert(message = 'Task added successfully!') {
        const successMessage = document.getElementById('successMessage');
        if (successMessage) {
            successMessage.textContent = message;
        }
        if (successAlert) {
            successAlert.style.display = 'flex';
            successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Auto-hide after 3 seconds
            setTimeout(() => {
                hideSuccessAlert();
            }, 3000);
        }
    }

    // Hide alerts
    function hideErrorAlert() {
        errorAlert.style.display = 'none';
    }

    function hideSuccessAlert() {
        if (successAlert) {
            successAlert.style.display = 'none';
        }
    }

    function hideGlobalAlerts() {
        hideErrorAlert();
        hideSuccessAlert();
    }

    // Show loading state
    function showLoadingState(form) {
        form.classList.add('form-loading');
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
            submitBtn.disabled = true;
        }
    }

    // Handle edit form validation
    function setupEditFormValidation() {
        const editForms = document.querySelectorAll('.edit-form');
        editForms.forEach(form => {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const textInput = this.querySelector('input[name="text"]');
                const prioritySelect = this.querySelector('select[name="priority"]');
                
                let isValid = true;
                
                // Validate text
                const textValidation = validateEditField(textInput, 'text');
                if (!textValidation.isValid) {
                    isValid = false;
                }
                
                // Validate priority
                const priorityValidation = validateEditField(prioritySelect, 'priority');
                if (!priorityValidation.isValid) {
                    isValid = false;
                }
                
                if (isValid) {
                    showLoadingState(this);
                    this.submit();
                }
            });
            
            // Real-time validation for edit forms
            const textInput = form.querySelector('input[name="text"]');
            const prioritySelect = form.querySelector('select[name="priority"]');
            
            if (textInput) {
                textInput.addEventListener('input', () => validateEditField(textInput, 'text'));
                textInput.addEventListener('blur', () => validateEditField(textInput, 'text'));
            }
            
            if (prioritySelect) {
                prioritySelect.addEventListener('change', () => validateEditField(prioritySelect, 'priority'));
            }
        });
    }

    // Validate edit form fields
    function validateEditField(field, fieldName) {
        const rules = validationRules[fieldName];
        const fieldValue = field.value;
        const errorElement = document.getElementById(field.getAttribute('aria-describedby'));
        
        let isValid = true;
        let message = '';

        // Required validation
        if (rules.required && (!fieldValue || fieldValue.trim() === '')) {
            isValid = false;
            message = rules.message;
        }
        // Length validation
        else if (rules.minLength && fieldValue.trim().length < rules.minLength) {
            isValid = false;
            message = rules.message;
        }
        else if (rules.maxLength && fieldValue.length > rules.maxLength) {
            isValid = false;
            message = `Text must be ${rules.maxLength} characters or less`;
        }
        // Pattern validation
        else if (rules.pattern && !rules.pattern.test(fieldValue.trim())) {
            isValid = false;
            message = rules.message;
        }
        // Value validation
        else if (rules.values && !rules.values.includes(fieldValue)) {
            isValid = false;
            message = rules.message;
        }

        // Update field appearance and error message
        if (errorElement) {
            if (isValid) {
                errorElement.textContent = '';
                field.classList.remove('invalid');
                field.classList.add('valid');
            } else {
                errorElement.textContent = message;
                field.classList.remove('valid');
                field.classList.add('invalid');
            }
        }

        return { isValid, message };
    }

    // Initialize edit form validation
    setupEditFormValidation();

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
        
        // Escape to clear input and hide alerts
        if (e.key === 'Escape') {
            if (document.activeElement === todoInput) {
                todoInput.value = '';
                prioritySelect.selectedIndex = 0;
                hideGlobalAlerts();
                clearFieldErrors();
            }
        }
    });

    // Clear all field errors
    function clearFieldErrors() {
        const errorElements = document.querySelectorAll('.field-error');
        errorElements.forEach(element => {
            element.textContent = '';
        });
        
        const invalidFields = document.querySelectorAll('.invalid');
        invalidFields.forEach(field => {
            field.classList.remove('invalid');
        });
    }

    // Form reset after successful submission
    if (window.location.search === '' && document.referrer.includes(window.location.origin)) {
        // Clear form and show success message if coming from form submission
        setTimeout(() => {
            if (todoInput.value === '' && prioritySelect.value !== '') {
                showSuccessAlert();
            }
        }, 100);
    }
});

// Edit Todo Functions (Global scope for onclick handlers)
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
    
    // Clear any existing validation errors
    const errorElement = editForm.querySelector('.field-error');
    if (errorElement) {
        errorElement.textContent = '';
    }
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
    
    // Reset form values and clear errors
    const editInput = editForm.querySelector('input[name="text"]');
    const originalText = textElement.textContent.trim();
    editInput.value = originalText;
    
    // Clear validation errors
    const errorElements = editForm.querySelectorAll('.field-error');
    errorElements.forEach(element => {
        element.textContent = '';
    });
    
    const invalidFields = editForm.querySelectorAll('.invalid');
    invalidFields.forEach(field => {
        field.classList.remove('invalid');
    });
}

// Confirm delete function
function confirmDelete() {
    return confirm('Are you sure you want to delete this task? This action cannot be undone.');
}

// Add CSS animation classes
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
        box-shadow: 0 0 0 3px rgba(255, 193, 7, 0.25);
    }
    
    .todo-item.editing:hover {
        background: #fff3cd;
        border-color: #ffc107;
    }
    
    /* Tooltip styles */
    .tooltip {
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.8rem;
        white-space: nowrap;
        z-index: 1000;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.3s ease;
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        transform: translateX(-50%);
        border: 5px solid transparent;
        border-top-color: rgba(0, 0, 0, 0.9);
    }
    
    *:hover .tooltip {
        opacity: 1;
    }
    
    /* Enhanced validation styles */
    .invalid {
        animation: shake 0.5s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Add smooth scrolling for filter changes
if (window.location.search.includes('priority')) {
    setTimeout(() => {
        const todoListContainer = document.querySelector('.todo-list-container');
        if (todoListContainer) {
            todoListContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
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

// Enhanced form submission handling
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function() {
        const submitBtn = this.querySelector('button[type="submit"]');
        if (submitBtn && !submitBtn.disabled) {
            const originalText = submitBtn.innerHTML;
            const formType = this.classList.contains('edit-form') ? 'Saving' : 'Adding';
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${formType}...`;
            submitBtn.disabled = true;
            
            // Re-enable after a delay (in case submission fails)
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 5000);
        }
    });
});

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
        const todoListContainer = document.querySelector('.todo-list-container');
        if (todoListContainer) {
            todoListContainer.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
}
