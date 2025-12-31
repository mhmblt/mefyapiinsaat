/**
 * MEF YAPI & İNŞAAT
 * Main JavaScript
 * Core functionality and utilities
 */

(function () {
    'use strict';

    /**
     * Lazy Load Images
     */
    function initLazyLoad() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('loading' in HTMLImageElement.prototype) {
            // Native lazy loading supported
            return;
        }

        // Fallback for older browsers
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    /**
     * Contact Form Handler with Formspree AJAX
     */
    function initContactForm() {
        const form = document.getElementById('contactForm');

        if (!form) return;

        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn?.querySelector('.btn-text');
        const btnLoading = submitBtn?.querySelector('.btn-loading');
        const successMessage = document.getElementById('formSuccess');
        const errorMessage = document.getElementById('formError');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Reset messages
            if (successMessage) successMessage.style.display = 'none';
            if (errorMessage) errorMessage.style.display = 'none';

            // Loading state
            if (submitBtn) submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoading) btnLoading.style.display = 'inline';

            try {
                const formData = new FormData(form);

                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // Success
                    form.style.display = 'none';
                    if (successMessage) {
                        successMessage.style.display = 'block';
                        successMessage.style.textAlign = 'center';
                        successMessage.style.padding = '3rem 2rem';
                    }
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }

            } catch (error) {
                console.error('Form error:', error);

                // Show error message
                if (errorMessage) {
                    errorMessage.style.display = 'block';
                    errorMessage.style.textAlign = 'center';
                    errorMessage.style.padding = '2rem';
                    errorMessage.style.marginTop = '1rem';
                }

                // Reset button
                if (submitBtn) submitBtn.disabled = false;
                if (btnText) btnText.style.display = 'inline';
                if (btnLoading) btnLoading.style.display = 'none';
            }
        });
    }

    /**
     * Smooth Scroll for Anchor Links
     */
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const target = document.querySelector(targetId);

                if (target) {
                    e.preventDefault();
                    const headerOffset = 80;
                    const elementPosition = target.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.scrollY - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Video Background Handler
     */
    function initVideoBackground() {
        const video = document.querySelector('.hero__video');

        if (!video) return;

        // Reduce quality on mobile for performance
        if (window.innerWidth < 768) {
            video.setAttribute('playsinline', '');
        }

        // Pause video when not in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    video.play().catch(() => { });
                } else {
                    video.pause();
                }
            });
        }, { threshold: 0.25 });

        observer.observe(video);
    }

    /**
     * Lightbox for Vision Gallery
     */
    function initLightbox() {
        const galleryItems = document.querySelectorAll('.vision-card');

        if (!galleryItems.length) return;

        // Create lightbox element
        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <button class="lightbox__close" aria-label="Kapat">&times;</button>
            <img class="lightbox__image" src="" alt="">
        `;
        document.body.appendChild(lightbox);

        const lightboxImage = lightbox.querySelector('.lightbox__image');
        const closeBtn = lightbox.querySelector('.lightbox__close');

        // Open lightbox
        galleryItems.forEach(item => {
            item.addEventListener('click', () => {
                const img = item.querySelector('img');
                if (img) {
                    lightboxImage.src = img.src;
                    lightboxImage.alt = img.alt;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        // Close lightbox
        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        closeBtn.addEventListener('click', closeLightbox);
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    /**
     * Current Year for Copyright
     */
    function initCopyrightYear() {
        const yearElements = document.querySelectorAll('[data-year]');
        const year = new Date().getFullYear();

        yearElements.forEach(el => {
            el.textContent = year;
        });
    }

    /**
     * Performance: Reduce motion for users who prefer it
     */
    function initReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        if (prefersReducedMotion.matches) {
            document.documentElement.style.scrollBehavior = 'auto';
        }
    }

    /**
     * Initialize all modules
     */
    function init() {
        initLazyLoad();
        initContactForm();
        initSmoothScroll();
        initVideoBackground();
        initLightbox();
        initCopyrightYear();
        initReducedMotion();

        // Log initialization
        console.log('MEF Yapı | Site initialized');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
