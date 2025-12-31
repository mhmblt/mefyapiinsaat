/**
 * MEF YAPI & İNŞAAT
 * Navigation Controller
 * Hamburger menu and header scroll effects
 */

(function() {
    'use strict';

    // DOM Elements
    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link');

    // State
    let isMenuOpen = false;
    let lastScrollY = 0;

    /**
     * Toggle Mobile Menu
     */
    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        
        hamburger.classList.toggle('active', isMenuOpen);
        mobileMenu.classList.toggle('active', isMenuOpen);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        
        // Update aria attribute
        hamburger.setAttribute('aria-expanded', isMenuOpen);
    }

    /**
     * Close Menu
     */
    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
            hamburger.setAttribute('aria-expanded', 'false');
        }
    }

    /**
     * Handle Header Scroll Effect
     */
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        // Add scrolled class when past 100px
        if (currentScrollY > 100) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
        
        lastScrollY = currentScrollY;
    }

    /**
     * Handle Escape Key
     */
    function handleKeydown(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    }

    /**
     * Handle Window Resize
     */
    function handleResize() {
        // Close menu on desktop resize
        if (window.innerWidth >= 1024 && isMenuOpen) {
            closeMenu();
        }
    }

    /**
     * Initialize Navigation
     */
    function init() {
        // Hamburger click
        if (hamburger) {
            hamburger.addEventListener('click', toggleMenu);
        }

        // Mobile menu links click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Small delay for visual feedback
                setTimeout(closeMenu, 150);
            });
        });

        // Close menu when clicking outside
        if (mobileMenu) {
            mobileMenu.addEventListener('click', (e) => {
                if (e.target === mobileMenu) {
                    closeMenu();
                }
            });
        }

        // Scroll event
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Keyboard events
        document.addEventListener('keydown', handleKeydown);

        // Resize event
        window.addEventListener('resize', handleResize);

        // Initial scroll check
        handleScroll();
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
