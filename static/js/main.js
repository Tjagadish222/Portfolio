document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    /**
     * Initialize the portfolio application
     */
    const Portfolio = {
        /**
         * Initialize all components
         */
        init: function() {
            this.initNavigation();
            this.initScrollEvents();
            this.initTabSwitching();
            this.initTypewriter();
            this.initFlashMessages();
            this.initScrollAnimation();
        },
        
        /**
         * Initialize mobile navigation
         */
        initNavigation: function() {
            const menuToggle = document.querySelector('.menu-toggle');
            const navMenu = document.querySelector('.nav-menu');
            const navLinks = document.querySelectorAll('.nav-link');
            
            if (menuToggle) {
                menuToggle.addEventListener('click', function() {
                    navMenu.classList.toggle('active');
                    menuToggle.querySelector('i').classList.toggle('fa-bars');
                    menuToggle.querySelector('i').classList.toggle('fa-times');
                });
            }
            
            // Close menu when clicking a link
            navLinks.forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                    menuToggle.querySelector('i').classList.add('fa-bars');
                    menuToggle.querySelector('i').classList.remove('fa-times');
                });
            });
            
            // Add active class to nav items on scroll
            window.addEventListener('scroll', function() {
                let scrollPosition = window.scrollY;
                
                document.querySelectorAll('section').forEach(section => {
                    const sectionTop = section.offsetTop - 100;
                    const sectionHeight = section.offsetHeight;
                    const sectionId = section.getAttribute('id');
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        navLinks.forEach(link => {
                            link.classList.remove('active');
                            if (link.getAttribute('href') === `#${sectionId}`) {
                                link.classList.add('active');
                            }
                        });
                    }
                });
            });
        },
        
        /**
         * Initialize scroll events
         */
        initScrollEvents: function() {
            const header = document.querySelector('header');
            
            window.addEventListener('scroll', function() {
                if (window.scrollY > 50) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        },
        
        /**
         * Initialize tab switching
         */
        initTabSwitching: function() {
            const initTabs = (tabBtns, tabContents) => {
                if (!tabBtns.length) return;
                
                tabBtns.forEach(btn => {
                    btn.addEventListener('click', function() {
                        const target = this.dataset.target;
                        
                        // Remove active class from all buttons and tabs
                        tabBtns.forEach(b => b.classList.remove('active'));
                        tabContents.forEach(c => c.classList.remove('active'));
                        
                        // Add active class to current button and tab
                        this.classList.add('active');
                        document.getElementById(target).classList.add('active');
                    });
                });
            };
            
            // Skills tabs
            initTabs(
                document.querySelectorAll('.skills-categories .tab-btn'),
                document.querySelectorAll('.skills-tab')
            );
            
            // Resume tabs
            initTabs(
                document.querySelectorAll('.resume-tabs .tab-btn'),
                document.querySelectorAll('.resume-section-content')
            );
        },
        
        /**
         * Initialize typewriter effect
         */
        initTypewriter: function() {
            const typedTextElement = document.querySelector('.typed-text');
            if (!typedTextElement) return;
            
            const careers = ['Web Developer', 'UI/UX Designer', 'Frontend Developer', 'Software Engineer'];
            let currentCareerIndex = 0;
            let currentCharIndex = 0;
            let isDeleting = false;
            let typingDelay = 150;
            let erasingDelay = 100;
            let newTextDelay = 2000; // Delay after typing is complete
            
            function type() {
                const currentCareer = careers[currentCareerIndex];
                
                if (isDeleting) {
                    // Remove characters
                    typedTextElement.textContent = currentCareer.substring(0, currentCharIndex - 1);
                    currentCharIndex--;
                    typingDelay = erasingDelay;
                } else {
                    // Add characters
                    typedTextElement.textContent = currentCareer.substring(0, currentCharIndex + 1);
                    currentCharIndex++;
                    typingDelay = 150;
                }
                
                // If word is complete
                if (!isDeleting && currentCharIndex === currentCareer.length) {
                    isDeleting = true;
                    typingDelay = newTextDelay;
                } else if (isDeleting && currentCharIndex === 0) {
                    isDeleting = false;
                    currentCareerIndex = (currentCareerIndex + 1) % careers.length;
                }
                
                setTimeout(type, typingDelay);
            }
            
            // Start the typing effect
            setTimeout(type, newTextDelay);
        },
        
        /**
         * Initialize flash messages
         */
        initFlashMessages: function() {
            const flashMessages = document.querySelectorAll('.flash-message');
            
            flashMessages.forEach(message => {
                const closeBtn = message.querySelector('.close-flash');
                
                if (closeBtn) {
                    closeBtn.addEventListener('click', function() {
                        message.style.opacity = '0';
                        message.style.transform = 'translateX(100px)';
                        
                        setTimeout(() => {
                            message.remove();
                        }, 300);
                    });
                }
                
                // Auto remove after 5 seconds
                setTimeout(() => {
                    if (message.parentNode) {
                        message.style.opacity = '0';
                        message.style.transform = 'translateX(100px)';
                        
                        setTimeout(() => {
                            if (message.parentNode) {
                                message.remove();
                            }
                        }, 300);
                    }
                }, 5000);
            });
        },
        
        /**
         * Initialize scroll animations
         */
        initScrollAnimation: function() {
            // Animate skill bars when they come into view
            const animateElements = document.querySelectorAll('.skill-progress');
            
            function checkIfInView() {
                animateElements.forEach(element => {
                    const progressBar = element.querySelector('.progress-bar');
                    const rect = element.getBoundingClientRect();
                    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
                    
                    if (rect.top <= windowHeight * 0.75 && rect.bottom >= 0) {
                        // Apply the width defined in the style attribute
                        progressBar.style.width = progressBar.style.width;
                    } else {
                        // Reset width to 0 when out of view
                        progressBar.style.width = '0';
                    }
                });
            }
            
            // Check on scroll
            window.addEventListener('scroll', checkIfInView);
            
            // Check once on page load
            checkIfInView();
        }
    };
    
    // Initialize the application
    Portfolio.init();
});
