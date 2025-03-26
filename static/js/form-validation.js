document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    /**
     * Form validation for contact form
     */
    const FormValidation = {
        init: function() {
            const contactForm = document.getElementById('contactForm');
            if (!contactForm) return;
            
            contactForm.addEventListener('submit', this.validateForm.bind(this));
            
            // Add input event listeners for real-time validation
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    this.validateField(input);
                });
                
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });
            });
        },
        
        /**
         * Validate the entire form on submit
         * @param {Event} e - Form submit event
         */
        validateForm: function(e) {
            const form = e.target;
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const subject = form.querySelector('#subject');
            const message = form.querySelector('#message');
            
            let isValid = true;
            
            // Validate each field
            if (!this.validateField(name)) isValid = false;
            if (!this.validateField(email)) isValid = false;
            if (!this.validateField(subject)) isValid = false;
            if (!this.validateField(message)) isValid = false;
            
            // Prevent form submission if validation fails
            if (!isValid) {
                e.preventDefault();
            }
        },
        
        /**
         * Validate an individual form field
         * @param {HTMLElement} field - Input field to validate
         * @returns {boolean} - Whether the field is valid
         */
        validateField: function(field) {
            const value = field.value.trim();
            const id = field.id;
            const errorElement = document.getElementById(`${id}Error`);
            
            // Reset error message
            if (errorElement) {
                errorElement.textContent = '';
            }
            
            let error = '';
            let isValid = true;
            
            // Validation rules for each field
            switch (id) {
                case 'name':
                    if (value === '') {
                        error = 'Name is required';
                        isValid = false;
                    } else if (value.length < 2) {
                        error = 'Name must be at least 2 characters';
                        isValid = false;
                    }
                    break;
                    
                case 'email':
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (value === '') {
                        error = 'Email is required';
                        isValid = false;
                    } else if (!emailRegex.test(value)) {
                        error = 'Please enter a valid email address';
                        isValid = false;
                    }
                    break;
                    
                case 'subject':
                    if (value === '') {
                        error = 'Subject is required';
                        isValid = false;
                    } else if (value.length < 3) {
                        error = 'Subject must be at least 3 characters';
                        isValid = false;
                    }
                    break;
                    
                case 'message':
                    if (value === '') {
                        error = 'Message is required';
                        isValid = false;
                    } else if (value.length < 10) {
                        error = 'Message must be at least 10 characters';
                        isValid = false;
                    }
                    break;
            }
            
            // Display error message if validation fails
            if (!isValid && errorElement) {
                errorElement.textContent = error;
                field.classList.add('error');
            } else if (field.classList.contains('error')) {
                field.classList.remove('error');
            }
            
            return isValid;
        }
    };
    
    // Initialize form validation
    FormValidation.init();
});
