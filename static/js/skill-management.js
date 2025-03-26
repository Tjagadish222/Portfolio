document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    /**
     * Skill Management
     * This module handles the addition and deletion of skills
     */
    const SkillManagement = {
        /**
         * Initialize skill management
         */
        init: function() {
            this.bindAddSkillButtons();
            this.bindDeleteSkillButtons();
        },
        
        /**
         * Bind events to the add skill buttons
         */
        bindAddSkillButtons: function() {
            const addTechnicalBtn = document.getElementById('add-technical-skill');
            const addSoftBtn = document.getElementById('add-soft-skill');
            const addToolsBtn = document.getElementById('add-tools-skill');
            
            if (addTechnicalBtn) {
                addTechnicalBtn.addEventListener('click', () => this.showAddSkillModal('technical'));
            }
            
            if (addSoftBtn) {
                addSoftBtn.addEventListener('click', () => this.showAddSkillModal('soft'));
            }
            
            if (addToolsBtn) {
                addToolsBtn.addEventListener('click', () => this.showAddSkillModal('tools'));
            }
        },
        
        /**
         * Bind events to delete skill buttons
         */
        bindDeleteSkillButtons: function() {
            document.addEventListener('click', (e) => {
                if (e.target && e.target.closest('.delete-skill-btn')) {
                    const button = e.target.closest('.delete-skill-btn');
                    const skillId = button.dataset.skillId;
                    
                    if (confirm('Are you sure you want to delete this skill?')) {
                        this.deleteSkill(skillId);
                    }
                }
            });
        },
        
        /**
         * Show modal to add a new skill
         * @param {string} category - Category of skill (technical, soft, tools)
         */
        showAddSkillModal: function(category) {
            // Create modal HTML
            const modalHtml = `
                <div class="modal-overlay" id="add-skill-modal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>Add New ${category.charAt(0).toUpperCase() + category.slice(1)} Skill</h3>
                            <button class="close-modal">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form id="add-skill-form">
                                <div class="form-group">
                                    <label for="skill-name">Skill Name:</label>
                                    <input type="text" id="skill-name" name="name" required>
                                </div>
                                <div class="form-group">
                                    <label for="skill-icon">Icon Class (e.g., fas fa-code):</label>
                                    <input type="text" id="skill-icon" name="icon" required>
                                    <small>Find icons at <a href="https://fontawesome.com/icons" target="_blank">Font Awesome</a></small>
                                </div>
                                ${category === 'technical' ? `
                                <div class="form-group">
                                    <label for="skill-proficiency">Proficiency (0-100):</label>
                                    <input type="range" id="skill-proficiency" name="proficiency" min="0" max="100" value="80">
                                    <output id="proficiency-value">80%</output>
                                </div>` : ''}
                                <input type="hidden" name="category" value="${category}">
                                <button type="submit" class="btn btn-primary">Add Skill</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            
            // Add modal to DOM
            const modalContainer = document.createElement('div');
            modalContainer.innerHTML = modalHtml;
            document.body.appendChild(modalContainer.firstElementChild);
            
            // Add event listeners for modal
            const modal = document.getElementById('add-skill-modal');
            const closeBtn = modal.querySelector('.close-modal');
            const form = modal.querySelector('#add-skill-form');
            
            // Slider value display for technical skills
            const proficiencySlider = modal.querySelector('#skill-proficiency');
            const proficiencyValue = modal.querySelector('#proficiency-value');
            
            if (proficiencySlider && proficiencyValue) {
                proficiencySlider.addEventListener('input', function() {
                    proficiencyValue.textContent = this.value + '%';
                });
            }
            
            // Close modal on click
            closeBtn.addEventListener('click', () => {
                document.body.removeChild(modal);
            });
            
            // Close on outside click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    document.body.removeChild(modal);
                }
            });
            
            // Handle form submission
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const formData = new FormData(form);
                const skillData = {
                    name: formData.get('name'),
                    icon: formData.get('icon'),
                    category: formData.get('category'),
                    proficiency: formData.get('proficiency') || 0
                };
                
                this.addSkill(skillData, modal);
            });
        },
        
        /**
         * Add a new skill
         * @param {Object} skillData - Data for the new skill
         * @param {HTMLElement} modal - The modal to close after adding
         */
        addSkill: function(skillData, modal) {
            fetch('/skill/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(skillData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove modal
                    document.body.removeChild(modal);
                    
                    // Add skill to the DOM
                    this.addSkillToDOM(data.skill);
                    
                    // Show success message
                    this.showNotification('Skill added successfully', 'success');
                } else {
                    this.showNotification(data.message || 'Error adding skill', 'error');
                }
            })
            .catch(error => {
                console.error('Error adding skill:', error);
                this.showNotification('Error adding skill', 'error');
            });
        },
        
        /**
         * Delete a skill
         * @param {number} skillId - ID of the skill to delete
         */
        deleteSkill: function(skillId) {
            fetch(`/skill/delete/${skillId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove skill from DOM
                    const skillItem = document.querySelector(`.skill-item[data-skill-id="${skillId}"]`);
                    if (skillItem) {
                        skillItem.remove();
                    }
                    
                    // Show success message
                    this.showNotification('Skill deleted successfully', 'success');
                } else {
                    this.showNotification(data.message || 'Error deleting skill', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting skill:', error);
                this.showNotification('Error deleting skill', 'error');
            });
        },
        
        /**
         * Add skill to the DOM
         * @param {Object} skill - The skill data to add
         */
        addSkillToDOM: function(skill) {
            const skillsGrid = document.querySelector(`#${skill.category} .skills-grid`);
            
            if (!skillsGrid) {
                console.error(`Skills grid for category ${skill.category} not found`);
                return;
            }
            
            const skillHtml = `
                <div class="skill-item" data-skill-id="${skill.id}">
                    <div class="skill-icon">
                        <i class="${skill.icon}"></i>
                    </div>
                    <h3>${skill.name}</h3>
                    ${parseInt(skill.proficiency) > 0 ? `
                    <div class="skill-progress">
                        <div class="progress-bar" style="width: ${skill.proficiency}%;"></div>
                        <span>${skill.proficiency}%</span>
                    </div>
                    ` : ''}
                    <button class="delete-skill-btn" data-skill-id="${skill.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = skillHtml;
            skillsGrid.appendChild(tempDiv.firstElementChild);
        },
        
        /**
         * Show notification to the user
         * @param {string} message - The message to show
         * @param {string} type - Type of notification (success, error, etc.)
         */
        showNotification: function(message, type) {
            const notification = document.createElement('div');
            notification.className = `flash-message ${type}`;
            notification.innerHTML = `
                <div class="flash-content">
                    <span class="flash-icon">
                        <i class="${type === 'success' ? 'fas fa-check' : 'fas fa-exclamation-circle'}"></i>
                    </span>
                    <span class="flash-text">${message}</span>
                    <button class="close-flash">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Add event listener to close button
            const closeBtn = notification.querySelector('.close-flash');
            closeBtn.addEventListener('click', function() {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100px)';
                
                setTimeout(() => {
                    notification.remove();
                }, 300);
            });
            
            // Auto remove after 5 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.opacity = '0';
                    notification.style.transform = 'translateX(100px)';
                    
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, 5000);
        }
    };
    
    // Initialize skill management
    SkillManagement.init();
});