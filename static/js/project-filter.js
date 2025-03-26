document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    /**
     * Project filtering functionality
     */
    const ProjectFilter = {
        init: function() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            const projectItems = document.querySelectorAll('.project-item');
            
            if (!filterBtns.length || !projectItems.length) return;
            
            // Add click event to filter buttons
            filterBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Remove active class from all buttons
                    filterBtns.forEach(b => b.classList.remove('active'));
                    
                    // Add active class to clicked button
                    btn.classList.add('active');
                    
                    const filter = btn.getAttribute('data-filter');
                    
                    // Filter projects
                    this.filterProjects(filter, projectItems);
                });
            });
        },
        
        /**
         * Filter projects based on category
         * @param {string} filter - Category to filter by
         * @param {NodeList} projects - List of project elements
         */
        filterProjects: function(filter, projects) {
            projects.forEach(project => {
                if (filter === 'all') {
                    // Show all projects with a fade-in effect
                    project.style.display = 'block';
                    setTimeout(() => {
                        project.style.opacity = '1';
                        project.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    const category = project.getAttribute('data-category');
                    
                    if (category === filter) {
                        // Show matching projects with a fade-in effect
                        project.style.display = 'block';
                        setTimeout(() => {
                            project.style.opacity = '1';
                            project.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        // Hide non-matching projects with a fade-out effect
                        project.style.opacity = '0';
                        project.style.transform = 'scale(0.8)';
                        setTimeout(() => {
                            project.style.display = 'none';
                        }, 300);
                    }
                }
            });
        }
    };
    
    // Initialize project filtering
    ProjectFilter.init();
});
