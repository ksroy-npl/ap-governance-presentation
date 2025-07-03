// Real-Time AI Governance System Presentation App
class PresentationApp {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 17;
        this.slides = document.querySelectorAll('.slide');
        this.slideCounter = document.getElementById('slideCounter');
        this.slidesContainer = document.getElementById('slidesContainer');
        this.isFullscreen = false;
        this.performanceChart = null;
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateSlideCounter();
        this.initPerformanceChart();
        this.setupTouchNavigation();
        this.preloadSlides();
    }

    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prevSlide').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextSlide').addEventListener('click', () => this.nextSlide());
        
        // Fullscreen button
        document.getElementById('fullscreenBtn').addEventListener('click', () => this.toggleFullscreen());
        
        // Help button
        document.getElementById('helpBtn').addEventListener('click', () => this.showHelp());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Fullscreen change events
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('webkitfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('mozfullscreenchange', () => this.handleFullscreenChange());
        document.addEventListener('MSFullscreenChange', () => this.handleFullscreenChange());
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // CTA buttons
        const ctaButtons = document.querySelectorAll('.cta-actions .btn');
        ctaButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleCTAClick(e));
        });
    }

    handleKeyPress(e) {
        // Prevent default for presentation navigation keys
        const presentationKeys = ['ArrowLeft', 'ArrowRight', 'Space', 'Home', 'End', 'F11'];
        if (presentationKeys.includes(e.code)) {
            e.preventDefault();
        }

        switch(e.code) {
            case 'ArrowLeft':
                this.previousSlide();
                break;
            case 'ArrowRight':
            case 'Space':
                this.nextSlide();
                break;
            case 'Home':
                this.goToSlide(1);
                break;
            case 'End':
                this.goToSlide(this.totalSlides);
                break;
            case 'F11':
                this.toggleFullscreen();
                break;
            case 'Escape':
                this.closeHelp();
                break;
            case 'KeyH':
                if (e.ctrlKey || e.metaKey) {
                    e.preventDefault();
                    this.showHelp();
                }
                break;
        }
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.goToSlide(this.currentSlide + 1);
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.goToSlide(this.currentSlide - 1);
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber < 1 || slideNumber > this.totalSlides) return;

        // Remove active class from current slide
        this.slides.forEach(slide => {
            slide.classList.remove('active', 'prev');
        });

        // Add classes based on slide direction
        if (slideNumber > this.currentSlide) {
            this.slides[this.currentSlide - 1].classList.add('prev');
        }

        // Update current slide
        this.currentSlide = slideNumber;
        this.slides[this.currentSlide - 1].classList.add('active');

        // Update counter
        this.updateSlideCounter();

        // Update navigation buttons
        this.updateNavigationButtons();

        // Scroll to top of slide
        this.slides[this.currentSlide - 1].scrollTop = 0;

        // Handle special slide actions
        this.handleSlideSpecialActions(slideNumber);
    }

    handleSlideSpecialActions(slideNumber) {
        // Initialize performance chart when reaching slide 9
        if (slideNumber === 9 && !this.performanceChart) {
            setTimeout(() => this.initPerformanceChart(), 300);
        }

        // Add entrance animations for specific slides
        if (slideNumber === 1) {
            this.animateTitleSlide();
        }
    }

    animateTitleSlide() {
        const titleSlide = document.querySelector('.title-slide');
        titleSlide.style.opacity = '0';
        titleSlide.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            titleSlide.style.transition = 'all 0.6s ease-out';
            titleSlide.style.opacity = '1';
            titleSlide.style.transform = 'translateY(0)';
        }, 100);
    }

    updateSlideCounter() {
        this.slideCounter.textContent = `${this.currentSlide} / ${this.totalSlides}`;
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevSlide');
        const nextBtn = document.getElementById('nextSlide');

        prevBtn.disabled = this.currentSlide === 1;
        nextBtn.disabled = this.currentSlide === this.totalSlides;

        // Update button text for last slide
        if (this.currentSlide === this.totalSlides) {
            nextBtn.textContent = 'End';
        } else {
            nextBtn.textContent = 'Next →';
        }
    }

    toggleFullscreen() {
        if (!this.isFullscreen) {
            this.enterFullscreen();
        } else {
            this.exitFullscreen();
        }
    }

    enterFullscreen() {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
            elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    }

    exitFullscreen() {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }

    handleFullscreenChange() {
        this.isFullscreen = !!(document.fullscreenElement || 
                               document.webkitFullscreenElement || 
                               document.mozFullScreenElement || 
                               document.msFullscreenElement);
        
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        fullscreenBtn.textContent = this.isFullscreen ? '⛶ Exit Fullscreen' : '⛶ Fullscreen';
    }

    showHelp() {
        const helpModal = document.getElementById('helpModal');
        helpModal.classList.add('active');
        
        // Focus trap
        const focusableElements = helpModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        firstElement.focus();
        
        const trapFocus = (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        };
        
        helpModal.addEventListener('keydown', trapFocus);
        
        // Remove event listener when modal closes
        helpModal.addEventListener('transitionend', () => {
            if (!helpModal.classList.contains('active')) {
                helpModal.removeEventListener('keydown', trapFocus);
            }
        });
    }

    closeHelp() {
        const helpModal = document.getElementById('helpModal');
        helpModal.classList.remove('active');
    }

    initPerformanceChart() {
        const ctx = document.getElementById('performanceChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.performanceChart) {
            this.performanceChart.destroy();
        }

        const data = {
            labels: ['Gunny Bag Counter', 'License Plate Detection', 'Contextual Intelligence', 'Facial Recognition'],
            datasets: [{
                label: 'Accuracy (%)',
                data: [92.8, 87.5, 88.0, 98.5],
                backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
                borderColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F'],
                borderWidth: 2
            }]
        };

        const options = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: 'AI Tool Performance Comparison',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        };

        this.performanceChart = new Chart(ctx, {
            type: 'bar',
            data: data,
            options: options
        });
    }

    setupTouchNavigation() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;

        this.slidesContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            touchStartY = e.touches[0].clientY;
        });

        this.slidesContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            touchEndY = e.changedTouches[0].clientY;
            this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
        });
    }

    handleSwipe(startX, startY, endX, endY) {
        const minSwipeDistance = 50;
        const maxVerticalDistance = 100;
        
        const deltaX = endX - startX;
        const deltaY = Math.abs(endY - startY);
        
        // Only process horizontal swipes
        if (Math.abs(deltaX) > minSwipeDistance && deltaY < maxVerticalDistance) {
            if (deltaX > 0) {
                // Swipe right - previous slide
                this.previousSlide();
            } else {
                // Swipe left - next slide
                this.nextSlide();
            }
        }
    }

    handleResize() {
        // Reinitialize chart on resize
        if (this.performanceChart && this.currentSlide === 9) {
            setTimeout(() => {
                this.performanceChart.resize();
            }, 100);
        }
    }

    preloadSlides() {
        // Add smooth scrolling to all slides
        this.slides.forEach(slide => {
            slide.style.scrollBehavior = 'smooth';
        });
    }

    handleCTAClick(e) {
        const buttonText = e.target.textContent;
        
        if (buttonText === 'Schedule Demo') {
            this.showNotification('Demo scheduling feature would be integrated with calendar system');
        } else if (buttonText === 'Request Proposal') {
            this.showNotification('Proposal request feature would integrate with CRM system');
        }
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Utility functions
function closeHelp() {
    const helpModal = document.getElementById('helpModal');
    helpModal.classList.remove('active');
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PresentationApp();
    
    // Make app globally accessible for debugging
    window.presentationApp = app;
    
    // Add loading animation
    const loadingOverlay = document.createElement('div');
    loadingOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--color-background);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        transition: opacity 0.5s ease;
    `;
    
    const loadingText = document.createElement('div');
    loadingText.textContent = 'Loading Presentation...';
    loadingText.style.cssText = `
        font-size: 18px;
        color: var(--color-text);
        font-weight: 500;
    `;
    
    loadingOverlay.appendChild(loadingText);
    document.body.appendChild(loadingOverlay);
    
    // Remove loading overlay after initialization
    setTimeout(() => {
        loadingOverlay.style.opacity = '0';
        setTimeout(() => {
            if (loadingOverlay.parentNode) {
                loadingOverlay.parentNode.removeChild(loadingOverlay);
            }
        }, 500);
    }, 1000);
});

// Service Worker registration for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Note: In a real implementation, you would register a service worker here
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PresentationApp;
}

// Performance monitoring
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            slideTransitions: [],
            chartRenders: [],
            userInteractions: []
        };
    }

    recordSlideTransition(from, to, duration) {
        this.metrics.slideTransitions.push({
            from,
            to,
            duration,
            timestamp: Date.now()
        });
    }

    recordChartRender(chartType, duration) {
        this.metrics.chartRenders.push({
            chartType,
            duration,
            timestamp: Date.now()
        });
    }

    recordUserInteraction(action, target) {
        this.metrics.userInteractions.push({
            action,
            target,
            timestamp: Date.now()
        });
    }

    getMetrics() {
        return this.metrics;
    }
}

// Initialize performance monitoring
const performanceMonitor = new PerformanceMonitor();
window.performanceMonitor = performanceMonitor;

// Analytics helper functions
function trackSlideView(slideNumber) {
    // In a real implementation, this would send analytics data
    console.log(`Slide ${slideNumber} viewed at ${new Date().toISOString()}`);
}

function trackUserAction(action, details) {
    // In a real implementation, this would send user action data
    console.log(`User action: ${action}`, details);
    performanceMonitor.recordUserInteraction(action, details);
}

// Accessibility enhancements
function announceSlideChange(slideNumber, totalSlides) {
    const announcement = `Slide ${slideNumber} of ${totalSlides}`;
    
    // Create or update live region for screen readers
    let liveRegion = document.getElementById('slide-announcer');
    if (!liveRegion) {
        liveRegion = document.createElement('div');
        liveRegion.id = 'slide-announcer';
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.style.cssText = `
            position: absolute;
            left: -10000px;
            width: 1px;
            height: 1px;
            overflow: hidden;
        `;
        document.body.appendChild(liveRegion);
    }
    
    liveRegion.textContent = announcement;
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('Presentation error:', e.error);
    
    // Show user-friendly error message
    const errorNotification = document.createElement('div');
    errorNotification.textContent = 'An error occurred. Please refresh the page.';
    errorNotification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-error);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
    `;
    
    document.body.appendChild(errorNotification);
    
    setTimeout(() => {
        if (errorNotification.parentNode) {
            errorNotification.parentNode.removeChild(errorNotification);
        }
    }, 5000);
});

// Keyboard shortcuts helper
const keyboardShortcuts = {
    'ArrowLeft': 'Previous slide',
    'ArrowRight': 'Next slide',
    'Space': 'Next slide',
    'Home': 'First slide',
    'End': 'Last slide',
    'F11': 'Toggle fullscreen',
    'Escape': 'Close modal/Exit fullscreen',
    'Ctrl+H': 'Show help'
};

// Print support
window.addEventListener('beforeprint', () => {
    // Show all slides for printing
    document.querySelectorAll('.slide').forEach(slide => {
        slide.style.position = 'static';
        slide.style.opacity = '1';
        slide.style.transform = 'none';
    });
});

window.addEventListener('afterprint', () => {
    // Restore slide visibility
    document.querySelectorAll('.slide').forEach((slide, index) => {
        if (index + 1 !== window.presentationApp.currentSlide) {
            slide.style.position = 'absolute';
            slide.style.opacity = '0';
            slide.style.transform = 'translateX(100%)';
        }
    });
});