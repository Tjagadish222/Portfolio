document.addEventListener('DOMContentLoaded', function() {
    /**
     * Project Management
     * This module handles the addition and deletion of projects
     */
    const ProjectManagement = {
        /**
         * Initialize project management
         */
        init: function() {
            this.bindAddProjectButton();
            this.bindDeleteProjectButtons();
        },
        
        /**
         * Bind events to the add project button
         */
        bindAddProjectButton: function() {
            const addProjectBtn = document.getElementById('add-project');
            if (addProjectBtn) {
                addProjectBtn.addEventListener('click', () => {
                    this.showAddProjectModal();
                });
            }
        },
        
        /**
         * Bind events to delete project buttons
         */
        bindDeleteProjectButtons: function() {
            const deleteButtons = document.querySelectorAll('.delete-project-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const projectId = button.getAttribute('data-project-id');
                    if (confirm('Are you sure you want to delete this project?')) {
                        this.deleteProject(projectId);
                    }
                });
            });
        },
        
        /**
         * Show modal to add a new project
         */
        showAddProjectModal: function() {
            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container';
            
            // Create modal content
            modalContainer.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h3>Add New Project</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="project-title">Title*</label>
                            <input type="text" id="project-title" placeholder="Project Title" required>
                        </div>
                        <div class="form-group">
                            <label for="project-description">Description*</label>
                            <textarea id="project-description" placeholder="Project Description" rows="3" required></textarea>
                        </div>
                        <div class="form-group">
                            <label for="project-icon">Icon* (Font Awesome Class)</label>
                            <input type="text" id="project-icon" placeholder="e.g., fas fa-code" value="fas fa-code" required>
                        </div>
                        <div class="form-group">
                            <label for="project-category">Category*</label>
                            <select id="project-category" required>
                                <option value="">Select Category</option>
                                <option value="web">Web Development</option>
                                <option value="app">App Development</option>
                                <option value="design">UI/UX Design</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="project-live-link">Live Demo Link</label>
                            <input type="url" id="project-live-link" placeholder="https://example.com">
                        </div>
                        <div class="form-group">
                            <label for="project-code-link">Code Repository Link</label>
                            <input type="url" id="project-code-link" placeholder="https://github.com/yourname/project">
                        </div>
                        <div class="form-group">
                            <label for="project-tags">Tags (comma-separated)</label>
                            <input type="text" id="project-tags" placeholder="HTML, CSS, JavaScript">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="add-project-submit" class="btn btn-primary">Add Project</button>
                    </div>
                </div>
            `;
            
            // Add modal to DOM
            document.body.appendChild(modalContainer);
            
            // Add event listeners
            const closeBtn = modalContainer.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(modalContainer);
            });
            
            // Close modal when clicking outside
            modalContainer.addEventListener('click', (e) => {
                if (e.target === modalContainer) {
                    document.body.removeChild(modalContainer);
                }
            });
            
            // Add project on submit
            const addProjectSubmitBtn = modalContainer.querySelector('#add-project-submit');
            addProjectSubmitBtn.addEventListener('click', () => {
                this.addProject(modalContainer);
            });
        },
        
        /**
         * Add a new project
         * @param {HTMLElement} modal - The modal element
         */
        addProject: function(modal) {
            const title = document.getElementById('project-title').value.trim();
            const description = document.getElementById('project-description').value.trim();
            const icon = document.getElementById('project-icon').value.trim();
            const category = document.getElementById('project-category').value;
            const liveLink = document.getElementById('project-live-link').value.trim();
            const codeLink = document.getElementById('project-code-link').value.trim();
            const tags = document.getElementById('project-tags').value.trim();
            
            // Validate required fields
            if (!title || !description || !icon || !category) {
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Create project data
            const projectData = {
                title: title,
                description: description,
                icon: icon,
                category: category,
                live_link: liveLink,
                code_link: codeLink,
                tags: tags ? tags.split(',').map(tag => tag.trim()) : []
            };
            
            // Send project data to server
            fetch('/project/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(projectData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Close modal
                    document.body.removeChild(modal);
                    
                    // Add project to DOM
                    this.addProjectToDOM(data.project);
                    
                    // Show success message
                    this.showNotification(data.message, 'success');
                } else {
                    this.showNotification(data.message || 'Error adding project', 'error');
                }
            })
            .catch(error => {
                console.error('Error adding project:', error);
                this.showNotification('An error occurred while adding the project', 'error');
            });
        },
        
        /**
         * Delete a project
         * @param {number} projectId - ID of the project to delete
         */
        deleteProject: function(projectId) {
            fetch(`/project/delete/${projectId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove project from DOM
                    const projectElement = document.querySelector(`.project-item[data-project-id="${projectId}"]`);
                    if (projectElement) {
                        projectElement.remove();
                    }
                    
                    // Show success message
                    this.showNotification(data.message, 'success');
                } else {
                    this.showNotification(data.message || 'Error deleting project', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting project:', error);
                this.showNotification('An error occurred while deleting the project', 'error');
            });
        },
        
        /**
         * Add project to the DOM
         * @param {Object} project - The project data to add
         */
        addProjectToDOM: function(project) {
            const projectsGrid = document.querySelector('.projects-grid');
            
            if (!projectsGrid) return;
            
            // Create new project HTML
            const projectElement = document.createElement('div');
            projectElement.className = 'project-item';
            projectElement.setAttribute('data-category', project.category);
            projectElement.setAttribute('data-project-id', project.id);
            
            // Convert tags array to HTML
            const tagsHTML = project.tags.map(tag => `<span>${tag}</span>`).join('');
            
            // Build project HTML
            projectElement.innerHTML = `
                <div class="project-img">
                    <div class="placeholder-project">
                        <i class="${project.icon}"></i>
                    </div>
                    <button class="delete-project-btn" data-project-id="${project.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                <div class="project-info">
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${tagsHTML}
                    </div>
                    <div class="project-links">
                        ${project.live_link ? `<a href="${project.live_link}" class="project-link" target="_blank" aria-label="View Live"><i class="fas fa-external-link-alt"></i></a>` : ''}
                        ${project.code_link ? `<a href="${project.code_link}" class="project-link" target="_blank" aria-label="View Code"><i class="fab fa-github"></i></a>` : ''}
                    </div>
                </div>
            `;
            
            // Add to projects grid
            projectsGrid.appendChild(projectElement);
            
            // Attach delete event listener
            const deleteButton = projectElement.querySelector('.delete-project-btn');
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const projectId = deleteButton.getAttribute('data-project-id');
                if (confirm('Are you sure you want to delete this project?')) {
                    this.deleteProject(projectId);
                }
            });
        },
        
        /**
         * Show notification to the user
         * @param {string} message - The message to show
         * @param {string} type - Type of notification (success, error, etc.)
         */
        showNotification: function(message, type) {
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.innerHTML = `
                <span>${message}</span>
                <button class="close-notification">&times;</button>
            `;
            
            document.body.appendChild(notification);
            
            // Close notification on button click
            const closeBtn = notification.querySelector('.close-notification');
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(notification);
            });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 5000);
        }
    };
    
    // Initialize the project management module
    ProjectManagement.init();
});