/**
 * MEF YAPI & İNŞAAT
 * Animation Controller
 * Scroll-triggered animations and parallax effects
 */

(function () {
    'use strict';

    // Configuration
    const config = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    /**
     * Intersection Observer for scroll animations
     */
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('[data-animate]');

        if (!animatedElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Get delay if specified
                    const delay = entry.target.dataset.animateDelay || 0;

                    setTimeout(() => {
                        entry.target.classList.add('is-visible');
                    }, delay);

                    // Unobserve after animation
                    observer.unobserve(entry.target);
                }
            });
        }, config);

        animatedElements.forEach(el => observer.observe(el));
    }

    /**
     * Parallax Effect for background elements
     */
    function initParallax() {
        const parallaxElements = document.querySelectorAll('.parallax');

        if (!parallaxElements.length) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.scrollY;

            parallaxElements.forEach(el => {
                const speed = el.dataset.speed || 0.5;
                const offset = scrollY * speed;
                el.style.transform = `translateY(${offset}px)`;
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    /**
     * Smooth reveal for text elements
     */
    function initTextReveal() {
        const textRevealElements = document.querySelectorAll('.text-reveal');

        if (!textRevealElements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        textRevealElements.forEach(el => observer.observe(el));
    }

    /**
     * Counter animation for statistics
     */
    function initCounters() {
        const counters = document.querySelectorAll('[data-counter]');

        if (!counters.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.dataset.counter);
                    const duration = 2000;
                    const start = 0;
                    const startTime = performance.now();

                    function updateCounter(currentTime) {
                        const elapsed = currentTime - startTime;
                        const progress = Math.min(elapsed / duration, 1);

                        // Easing function
                        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
                        const current = Math.floor(easeOutQuart * target);

                        entry.target.textContent = current;

                        if (progress < 1) {
                            requestAnimationFrame(updateCounter);
                        } else {
                            entry.target.textContent = target;
                        }
                    }

                    requestAnimationFrame(updateCounter);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(el => observer.observe(el));
    }

    /**
     * Stagger animation for grid items
     */
    function initStaggerAnimation() {
        const grids = document.querySelectorAll('[data-stagger]');

        if (!grids.length) return;

        grids.forEach(grid => {
            const items = grid.children;
            const delay = parseInt(grid.dataset.stagger) || 100;

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        Array.from(items).forEach((item, index) => {
                            setTimeout(() => {
                                item.classList.add('is-visible');
                            }, index * delay);
                        });
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.2 });

            observer.observe(grid);
        });
    }

    /**
     * Initialize all animations
     */
    function init() {
        initScrollAnimations();
        initParallax();
        initTextReveal();
        initCounters();
        initStaggerAnimation();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
