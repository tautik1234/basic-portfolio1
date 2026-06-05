document.addEventListener('DOMContentLoaded', () => {
    // 1. Calculate Age Dynamically (Birth Year: 2005)
    const birthYear = 2005;
    const currentYear = new Date().getFullYear();
    let age = currentYear - birthYear;
    
    // Set age text
    const ageElement = document.getElementById('current-age');
    if (ageElement) {
        ageElement.textContent = `${age} years old`;
    }

    // Set footer year
    const footerYearElement = document.getElementById('current-year');
    if (footerYearElement) {
        footerYearElement.textContent = currentYear;
    }

    // 2. Mobile Navigation Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('navigation-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when links are clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // 3. Navbar Scrolled Styling
    const navbar = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. Scroll Reveal Animations (using Intersection Observer)
    const revealElements = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 5. Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Determine which section is currently viewed
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 6. Interactive Parallax Ambient Glows (Mouse Movement)
    const glow1 = document.getElementById('glow-1');
    const glow2 = document.getElementById('glow-2');

    if (glow1 && glow2) {
        window.addEventListener('mousemove', (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate relative offset based on window dimensions
            const moveX1 = (mouseX - window.innerWidth / 2) * -0.02;
            const moveY1 = (mouseY - window.innerHeight / 2) * -0.02;
            
            const moveX2 = (mouseX - window.innerWidth / 2) * 0.015;
            const moveY2 = (mouseY - window.innerHeight / 2) * 0.015;

            // Apply translation shifts smoothly
            glow1.style.transform = `translate(${moveX1}px, ${moveY1}px)`;
            glow2.style.transform = `translate(${moveX2}px, ${moveY2}px)`;
        });
    }
});
