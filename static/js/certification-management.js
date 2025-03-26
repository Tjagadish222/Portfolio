document.addEventListener('DOMContentLoaded', function() {
    /**
     * Certification Management
     * This module handles the addition and deletion of certifications
     */
    const CertificationManagement = {
        /**
         * Initialize certification management
         */
        init: function() {
            this.bindAddCertificationButton();
            this.bindDeleteCertificationButtons();
        },
        
        /**
         * Bind events to the add certification button
         */
        bindAddCertificationButton: function() {
            const addCertificationBtn = document.getElementById('add-certification');
            if (addCertificationBtn) {
                addCertificationBtn.addEventListener('click', () => {
                    this.showAddCertificationModal();
                });
            }
        },
        
        /**
         * Bind events to delete certification buttons
         */
        bindDeleteCertificationButtons: function() {
            const deleteButtons = document.querySelectorAll('.delete-certification-btn');
            deleteButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const certId = button.getAttribute('data-cert-id');
                    if (confirm('Are you sure you want to delete this certification?')) {
                        this.deleteCertification(certId);
                    }
                });
            });
        },
        
        /**
         * Show modal to add a new certification
         */
        showAddCertificationModal: function() {
            // Create modal container
            const modalContainer = document.createElement('div');
            modalContainer.className = 'modal-container';
            
            // Create modal content
            modalContainer.innerHTML = `
                <div class="modal">
                    <div class="modal-header">
                        <h3>Add New Certification</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="cert-title">Title*</label>
                            <input type="text" id="cert-title" placeholder="Certification Title" required>
                        </div>
                        <div class="form-group">
                            <label for="cert-provider">Provider*</label>
                            <input type="text" id="cert-provider" placeholder="Certification Provider" required>
                        </div>
                        <div class="form-group">
                            <label for="cert-year">Year*</label>
                            <input type="text" id="cert-year" placeholder="e.g., 2023" maxlength="4" required>
                        </div>
                        <div class="form-group">
                            <label for="cert-icon">Icon* (Font Awesome Class)</label>
                            <select id="cert-icon" required>
                                <option value="fas fa-certificate">Certificate</option>
                                <option value="fas fa-award">Award</option>
                                <option value="fas fa-graduation-cap">Graduation Cap</option>
                                <option value="fas fa-medal">Medal</option>
                                <option value="fas fa-trophy">Trophy</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="cert-link">Certificate Link</label>
                            <input type="url" id="cert-link" placeholder="https://example.com/certificate">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button id="add-cert-submit" class="btn btn-primary">Add Certification</button>
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
            
            // Add certification on submit
            const addCertSubmitBtn = modalContainer.querySelector('#add-cert-submit');
            addCertSubmitBtn.addEventListener('click', () => {
                this.addCertification(modalContainer);
            });
        },
        
        /**
         * Add a new certification
         * @param {HTMLElement} modal - The modal element
         */
        addCertification: function(modal) {
            const title = document.getElementById('cert-title').value.trim();
            const provider = document.getElementById('cert-provider').value.trim();
            const year = document.getElementById('cert-year').value.trim();
            const icon = document.getElementById('cert-icon').value;
            const link = document.getElementById('cert-link').value.trim();
            
            // Validate required fields
            if (!title || !provider || !year || !icon) {
                this.showNotification('Please fill in all required fields', 'error');
                return;
            }
            
            // Validate year format
            if (!/^\d{4}$/.test(year)) {
                this.showNotification('Year must be a 4-digit number', 'error');
                return;
            }
            
            // Create certification data
            const certData = {
                title: title,
                provider: provider,
                year: year,
                icon: icon,
                link: link
            };
            
            // Send certification data to server
            fetch('/certification/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(certData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Close modal
                    document.body.removeChild(modal);
                    
                    // Add certification to DOM
                    this.addCertificationToDOM(data.certification);
                    
                    // Show success message
                    this.showNotification(data.message, 'success');
                } else {
                    this.showNotification(data.message || 'Error adding certification', 'error');
                }
            })
            .catch(error => {
                console.error('Error adding certification:', error);
                this.showNotification('An error occurred while adding the certification', 'error');
            });
        },
        
        /**
         * Delete a certification
         * @param {number} certId - ID of the certification to delete
         */
        deleteCertification: function(certId) {
            fetch(`/certification/delete/${certId}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Remove certification from DOM
                    const certElement = document.querySelector(`.certification-item[data-cert-id="${certId}"]`);
                    if (certElement) {
                        certElement.remove();
                    }
                    
                    // Show success message
                    this.showNotification(data.message, 'success');
                } else {
                    this.showNotification(data.message || 'Error deleting certification', 'error');
                }
            })
            .catch(error => {
                console.error('Error deleting certification:', error);
                this.showNotification('An error occurred while deleting the certification', 'error');
            });
        },
        
        /**
         * Add certification to the DOM
         * @param {Object} cert - The certification data to add
         */
        addCertificationToDOM: function(cert) {
            const certificationsGrid = document.querySelector('.certifications-grid');
            
            if (!certificationsGrid) return;
            
            // Create new certification HTML
            const certElement = document.createElement('div');
            certElement.className = 'certification-item';
            certElement.setAttribute('data-cert-id', cert.id);
            
            // Build certification HTML
            certElement.innerHTML = `
                <div class="certification-icon">
                    <i class="${cert.icon}"></i>
                </div>
                <button class="delete-certification-btn" data-cert-id="${cert.id}">
                    <i class="fas fa-trash"></i>
                </button>
                <div class="certification-info">
                    <h3>${cert.title}</h3>
                    <h4>${cert.provider}</h4>
                    <p>${cert.year}</p>
                    ${cert.link ? `<a href="${cert.link}" class="btn-view-certificate" target="_blank">View Certificate</a>` : ''}
                </div>
            `;
            
            // Add to certifications grid
            certificationsGrid.appendChild(certElement);
            
            // Attach delete event listener
            const deleteButton = certElement.querySelector('.delete-certification-btn');
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation();
                const certId = deleteButton.getAttribute('data-cert-id');
                if (confirm('Are you sure you want to delete this certification?')) {
                    this.deleteCertification(certId);
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
    
    // Initialize the certification management module
    CertificationManagement.init();
});