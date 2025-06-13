// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
            
            // Close mobile menu after clicking (if open)
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                bsCollapse.hide();
            }
        }
    });
});


// Smooth header text animation that works perfectly from first load
const headerTextAnimation = () => {
    const headerSubtitle = document.querySelector('#header h2');
    if (!headerSubtitle) return;

    // Clear any existing text
    headerSubtitle.textContent = '';

    const messages = [
        "A Full Stack Web Developer",
        "Welcome to My Portfolio"
    ];
    
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150;
    
    const type = () => {
        const currentText = messages[currentIndex];
        
        if (isDeleting) {
            // Deleting text
            headerSubtitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                // Switch to next message
                isDeleting = false;
                currentIndex = (currentIndex + 1) % messages.length;
                setTimeout(type, 500); // Pause before next message
            } else {
                setTimeout(type, typingSpeed / 2); // Faster delete
            }
        } else {
            // Typing text
            headerSubtitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                // Pause at full message
                isDeleting = true;
                setTimeout(type, 2000);
            } else {
                setTimeout(type, typingSpeed);
            }
        }
    };
    
    // Start with empty text and begin typing first message
    setTimeout(type, 1000); // Initial delay
};

// Start animation when page loads
window.addEventListener('load', headerTextAnimation);


// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('navbar-scrolled');
    } else {
        navbar.classList.remove('navbar-scrolled');
    }
});


// Project card hover effect - immediate size increase without transition
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.03)';
        this.style.transition = 'none'; // Remove transition for immediate effect
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.transition = 'all 0.3s ease'; // Restore transition for smooth return
    });
});

// Improved animate elements when they come into view (will trigger every time)
const animateOnScroll = function() {
    const elements = document.querySelectorAll('.section-title, .details-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            // Reset animation by removing and re-adding classes
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            // Force reflow to restart animation
            void element.offsetWidth;
            // Apply animation
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        } else {
            // Reset when element goes out of view
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
    });
};

// Set initial state for animation
window.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.section-title, .details-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Initial animation trigger
    animateOnScroll();
});

// Add scroll event listener with throttle for performance
let isScrolling;
window.addEventListener('scroll', function() {
    // Clear our timeout throughout the scroll
    window.clearTimeout(isScrolling);
    
    // Set a timeout to run after scrolling stops
    isScrolling = setTimeout(function() {
        animateOnScroll();
    }, 60);
}, false);



// Add a simple typewriter effect to the header
const typewriterEffect = function() {
    const headerSubtitle = document.querySelector('#header h2');
    if (!headerSubtitle) return;
    
    const originalText = headerSubtitle.textContent;
    headerSubtitle.textContent = '';
    
    let i = 0;
    const typing = setInterval(() => {
        if (i < originalText.length) {
            headerSubtitle.textContent += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 100);
};

// Run typewriter effect when page loads
window.addEventListener('load', typewriterEffect);



// Simple view more functionality
document.querySelectorAll('.view-more-btn').forEach(button => {
    button.addEventListener('click', function () {
        const desc = this.previousElementSibling;
        desc.classList.toggle('expanded');
        this.textContent = desc.classList.contains('expanded') ? 'View Less' : 'View More';
    });
});