// PowerPoint Presentation Navigation System

class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 18;
        this.slides = document.querySelectorAll('.slide');
        this.slideCounter = document.getElementById('slideCounter');
        this.nextBtn = document.getElementById('nextBtn');
        this.prevBtn = document.getElementById('prevBtn');
        
        this.init();
    }

    init() {
        this.updateSlideCounter();
        this.updateNavigationButtons();
        this.bindEvents();
        this.preloadSlides();
        
        // Set initial slide
        this.showSlide(this.currentSlide);
    }

    bindEvents() {
        // Button navigation
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        this.prevBtn.addEventListener('click', () => this.prevSlide());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));

        // Touch/swipe navigation for mobile
        this.bindTouchEvents();

        // Prevent default behaviors that might interfere
        document.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    bindTouchEvents() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].clientX;
            endY = e.changedTouches[0].clientY;
            this.handleSwipe(startX, startY, endX, endY);
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const minSwipeDistance = 50;
        const maxVerticalDistance = 100;
        
        const horizontalDistance = endX - startX;
        const verticalDistance = Math.abs(endY - startY);
        
        // Only process horizontal swipes
        if (verticalDistance < maxVerticalDistance && Math.abs(horizontalDistance) > minSwipeDistance) {
            if (horizontalDistance > 0) {
                // Swipe right - previous slide
                this.prevSlide();
            } else {
                // Swipe left - next slide
                this.nextSlide();
            }
        }
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
            case 'PageDown':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'Escape':
                e.preventDefault();
                this.goToSlide(1);
                break;
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    prevSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides && slideNumber !== this.currentSlide) {
            const previousSlide = this.currentSlide;
            this.currentSlide = slideNumber;
            
            this.animateSlideTransition(previousSlide, slideNumber);
            this.updateSlideCounter();
            this.updateNavigationButtons();
            
            // Add analytics or tracking here if needed
            this.trackSlideView(slideNumber);
        }
    }

    animateSlideTransition(fromSlide, toSlide) {
        const currentSlideElement = this.slides[fromSlide - 1];
        const nextSlideElement = this.slides[toSlide - 1];
        
        // Remove active class from current slide
        currentSlideElement.classList.remove('active');
        
        // Determine transition direction
        const isForward = toSlide > fromSlide;
        
        if (isForward) {
            // Moving forward
            currentSlideElement.classList.add('prev');
            nextSlideElement.style.transform = 'translateX(100%)';
        } else {
            // Moving backward
            currentSlideElement.style.transform = 'translateX(100%)';
            nextSlideElement.classList.add('prev');
        }
        
        // Force reflow
        nextSlideElement.offsetHeight;
        
        // Start transition
        setTimeout(() => {
            nextSlideElement.classList.add('active');
            nextSlideElement.style.transform = 'translateX(0)';
            nextSlideElement.classList.remove('prev');
            
            // Clean up previous slide
            setTimeout(() => {
                currentSlideElement.classList.remove('prev');
                currentSlideElement.style.transform = '';
            }, 500);
        }, 50);
    }

    showSlide(slideNumber) {
        // Hide all slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index + 1 === slideNumber) {
                slide.classList.add('active');
            }
        });
    }

    updateSlideCounter() {
        this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    }

    updateNavigationButtons() {
        this.prevBtn.disabled = this.currentSlide === 1;
        this.nextBtn.disabled = this.currentSlide === this.totalSlides;
        
        // Update button appearances
        if (this.currentSlide === 1) {
            this.prevBtn.style.opacity = '0.5';
        } else {
            this.prevBtn.style.opacity = '1';
        }
        
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.style.opacity = '0.5';
        } else {
            this.nextBtn.style.opacity = '1';
        }
    }

    preloadSlides() {
        // Preload slide content for better performance
        this.slides.forEach((slide, index) => {
            // Add slide number for debugging
            slide.setAttribute('data-slide-number', index + 1);
            
            // Initialize any dynamic content
            this.initializeSlideContent(slide, index + 1);
        });
    }

    initializeSlideContent(slide, slideNumber) {
        // Initialize charts and animations for specific slides
        switch(slideNumber) {
            case 8:
                this.initializeLicensePlateChart(slide);
                break;
            case 11:
                this.initializePerformanceCharts(slide);
                break;
            default:
                break;
        }
    }

    initializeLicensePlateChart(slide) {
        // Animate the comparison bars when slide becomes active
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bars = slide.querySelectorAll('.bar-fill');
                    bars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.transition = 'height 1s ease-in-out';
                        }, index * 200);
                    });
                }
            });
        });
        
        observer.observe(slide);
    }

    initializePerformanceCharts(slide) {
        // Animate the performance metrics when slide becomes active
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const metricBars = slide.querySelectorAll('.metric-bar .bar-fill');
                    metricBars.forEach((bar, index) => {
                        setTimeout(() => {
                            bar.style.transition = 'width 1.5s ease-in-out';
                        }, index * 300);
                    });
                }
            });
        });
        
        observer.observe(slide);
    }

    trackSlideView(slideNumber) {
        // Track slide views for analytics (placeholder)
        console.log(`Viewing slide ${slideNumber}: ${this.getSlideTitle(slideNumber)}`);
    }

    getSlideTitle(slideNumber) {
        const slideTitles = {
            1: "Title Slide",
            2: "Team Introduction", 
            3: "Problem Statement",
            4: "Solution Overview",
            5: "Innovation Highlights",
            6: "Technology Stack",
            7: "Gunny Bag Counter",
            8: "License Plate Detection",
            9: "Contextual Intelligence", 
            10: "Facial Recognition",
            11: "Performance Comparisons",
            12: "Market Analysis",
            13: "Implementation Roadmap",
            14: "Impact & Benefits",
            15: "Technical Architecture",
            16: "Future Scope",
            17: "Conclusion",
            18: "Q&A"
        };
        
        return slideTitles[slideNumber] || `Slide ${slideNumber}`;
    }

    // Public API methods
    getCurrentSlide() {
        return this.currentSlide;
    }

    getTotalSlides() {
        return this.totalSlides;
    }

    // Method to jump to specific slides (useful for debugging)
    jumpToSlide(slideNumber) {
        this.goToSlide(slideNumber);
    }
}

// Utility functions for enhanced presentation features
class PresentationEnhancements {
    constructor(controller) {
        this.controller = controller;
        this.init();
    }

    init() {
        this.addProgressIndicator();
        this.addSlidePreloader();
        this.addAccessibilityFeatures();
        this.addPresentationMode();
    }

    addProgressIndicator() {
        // Create a subtle progress bar
        const progressBar = document.createElement('div');
        progressBar.className = 'presentation-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: rgb(0, 0, 0);
            z-index: 1001;
        `;

        const progressFill = document.createElement('div');
        progressFill.className = 'progress-fill';
        progressFill.style.cssText = `
            height: 100%;
            background: var(--color-primary);
            transition: width 0.3s ease;
            width: ${(this.controller.getCurrentSlide() / this.controller.getTotalSlides()) * 100}%;
        `;

        progressBar.appendChild(progressFill);
        document.body.appendChild(progressBar);

        // Update progress on slide change
        document.addEventListener('keydown', () => {
            setTimeout(() => {
                progressFill.style.width = `${(this.controller.getCurrentSlide() / this.controller.getTotalSlides()) * 100}%`;
            }, 100);
        });
    }

    addSlidePreloader() {
        // Preload content for smoother transitions
        const slides = document.querySelectorAll('.slide');
        slides.forEach(slide => {
            const images = slide.querySelectorAll('img');
            images.forEach(img => {
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                }
            });
        });
    }

    addAccessibilityFeatures() {
        // Add ARIA labels and focus management
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, index) => {
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-label', `Slide ${index + 1} of ${slides.length}`);
        });

        // Add screen reader announcements
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', 'polite');
        announcer.setAttribute('aria-atomic', 'true');
        announcer.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(announcer);

        // Update announcer on slide changes
        document.addEventListener('keydown', () => {
            setTimeout(() => {
                const currentSlide = this.controller.getCurrentSlide();
                const slideTitle = this.controller.getSlideTitle(currentSlide);
                announcer.textContent = `Now viewing ${slideTitle}, slide ${currentSlide} of ${this.controller.getTotalSlides()}`;
            }, 100);
        });
    }

    addPresentationMode() {
        // Add fullscreen support
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F11' || (e.key === 'f' && e.ctrlKey)) {
                e.preventDefault();
                this.toggleFullscreen();
            }
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen().catch(err => {
                console.log(`Error attempting to exit fullscreen: ${err.message}`);
            });
        }
    }
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new PresentationController();
    const enhancements = new PresentationEnhancements(presentation);
    
    // Make controller globally available for debugging
    window.presentationController = presentation;
    
    // Add loading complete indicator
    document.body.classList.add('presentation-loaded');
    
    console.log('Real-Time AI Governance System Presentation Loaded');
    console.log('Navigation: Arrow keys, Space, Page Up/Down');
    console.log('Quick access: Home (first slide), End (last slide), Esc (first slide)');
    console.log('Mobile: Swipe left/right to navigate');
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
    // Recalculate any dynamic sizing if needed
    const currentSlide = document.querySelector('.slide.active');
    if (currentSlide) {
        // Trigger any responsive adjustments
        currentSlide.style.visibility = 'hidden';
        setTimeout(() => {
            currentSlide.style.visibility = 'visible';
        }, 10);
    }
});

// Handle visibility change (tab switching)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause any animations when tab is not visible
        document.body.classList.add('presentation-paused');
    } else {
        // Resume animations when tab becomes visible
        document.body.classList.remove('presentation-paused');
    }
});