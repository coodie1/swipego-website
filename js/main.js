// Manchester Cleaning Company - Interactive JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Navigation scroll effect
    const nav = document.querySelector('.nav');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu a');

    // Create mobile menu overlay if it doesn't exist
    let mobileMenuOverlay = document.querySelector('.mobile-menu-overlay');
    if (!mobileMenuOverlay) {
        mobileMenuOverlay = document.createElement('div');
        mobileMenuOverlay.className = 'mobile-menu-overlay';
        document.body.appendChild(mobileMenuOverlay);
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        if (navToggle) {
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
        document.body.style.overflow = '';
    }

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger
            const spans = navToggle.querySelectorAll('span');
            if (navToggle.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                // Disable body scroll when menu is open
                document.body.style.overflow = 'hidden';
            } else {
                closeMobileMenu();
            }
        });
    }

    // Close mobile menu when clicking links
    if (mobileLinks) {
        mobileLinks.forEach((link, index) => {
            if (link.parentElement) {
                link.parentElement.style.setProperty('--i', index);
            }
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // Close menu when clicking overlay
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);

    // No tab functionality needed anymore

    // Enhanced FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    let activeQuestion = null;

    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const content = answer.querySelector('.faq-answer-content');

            // If we're clicking the already active question, close it
            if (activeQuestion === this) {
                // Close active item
                this.classList.remove('active');
                faqItem.classList.remove('active');
                answer.style.maxHeight = '0px';
                answer.classList.remove('active');
                activeQuestion = null;
                return;
            }

            // Close the currently active question if there is one
            if (activeQuestion) {
                const activeItem = activeQuestion.parentElement;
                const activeAnswer = activeItem.querySelector('.faq-answer');
                activeQuestion.classList.remove('active');
                activeItem.classList.remove('active');
                activeAnswer.style.maxHeight = '0px';
                activeAnswer.classList.remove('active');
            }

            // Open the clicked question
            this.classList.add('active');
            faqItem.classList.add('active');
            answer.classList.add('active');
            answer.style.maxHeight = `${content.offsetHeight}px`;
            activeQuestion = this;

            // Scroll into view if needed
            const itemRect = faqItem.getBoundingClientRect();
            const isVisible = (itemRect.top >= 0) && (itemRect.bottom <= window.innerHeight);
            
            if (!isVisible) {
                const offset = 100; // Adjust scroll position to account for fixed header
                const targetY = window.scrollY + itemRect.top - offset;
                window.scrollTo({
                    top: targetY,
                    behavior: 'smooth'
                });
            }
        });
    });    // Enhanced smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            
            if (target) {
                const navHeight = document.querySelector('.nav').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY;
                const offsetPosition = targetPosition - navHeight - 20;
                
                // Create easing function
                const easeInOutQuad = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                
                // Animated scroll
                const startPosition = window.scrollY;
                const distance = offsetPosition - startPosition;
                const duration = 1000; // ms
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const progress = Math.min(timeElapsed / duration, 1);
                    
                    window.scrollTo(0, startPosition + (distance * easeInOutQuad(progress)));
                    
                    if (timeElapsed < duration) {
                        requestAnimationFrame(animation);
                    }
                }
                
                requestAnimationFrame(animation);
                
                // Update URL without jumping
                if (history.pushState) {
                    history.pushState(null, null, href);
                }
            }
        });
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        // Check if we're on the contact page
        const isContactPage = window.location.pathname.includes('contact.html');
        const isHomePage = !isContactPage;
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });

        if (isContactPage) {
            // If on contact page, highlight the contact link
            document.querySelectorAll('.nav-link').forEach(link => {
                if (link.getAttribute('href').includes('contact.html')) {
                    link.classList.add('active');
                }
            });
        } else if (isHomePage) {
            // For homepage, highlight based on scroll position
            const scrollPos = window.scrollY + 100;
            let currentSection = null;
            let currentSectionScore = 0;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100; // Offset for nav height
                const sectionBottom = sectionTop + section.offsetHeight;
                const visibleHeight = Math.min(sectionBottom, window.innerHeight + window.scrollY) - 
                                    Math.max(sectionTop, window.scrollY);
                
                if (visibleHeight > currentSectionScore && visibleHeight > 0) {
                    currentSectionScore = visibleHeight;
                    currentSection = section.getAttribute('id');
                }
            });
            
            // Add active class to current section link
            if (currentSection) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${currentSection}` || href === `index.html#${currentSection}`) {
                        link.classList.add('active');
                    }
                });
            } else {
                // If no section is currently visible (e.g., at the very top), highlight Home
                document.querySelectorAll('.nav-link').forEach(link => {
                    if (link.textContent.trim() === 'Home') {
                        link.classList.add('active');
                    }
                });
            }
        }
    }
    
    // Run highlight check on page load and scroll
    highlightNavigation();
    window.addEventListener('scroll', highlightNavigation);

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-on-scroll');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.card, .service-card, .feature-card, .trust-badges');
    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Form validation and submission
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--error-500)';
                    input.style.boxShadow = '0 0 0 2px var(--error-500)';
                } else {
                    input.style.borderColor = 'var(--neutral-200)';
                    input.style.boxShadow = 'none';
                }
            });
            
            // Email validation
            const emailInputs = form.querySelectorAll('input[type="email"]');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            emailInputs.forEach(input => {
                if (input.value && !emailRegex.test(input.value)) {
                    isValid = false;
                    input.style.borderColor = 'var(--error-500)';
                    input.style.boxShadow = '0 0 0 2px var(--error-500)';
                }
            });
            
            if (isValid) {
                // Show success message
                showNotification('Thank you! We\'ll contact you within 24 hours.', 'success');
                form.reset();
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    });

    // Notification system
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success-500)' : 'var(--error-500)'};
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: var(--shadow-modal);
            z-index: 10000;
            font-weight: 600;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }

    // Add CSS for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Add hover effects to cards
    const cards = document.querySelectorAll('.card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Button click effects
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.classList.contains('loading')) {
                const ripple = document.createElement('span');
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                `;
                
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
                ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            }
        });
    });

    // Add ripple effect CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);

    // Initialize page
    highlightNavigation();
});

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}