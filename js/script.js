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
            
            // Close mobile menu if open (Bootstrap)
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse?.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: false});
                bsCollapse.hide();
            }
        }
    });
});

// Header text animation with typing/deleting effect
const headerTextAnimation = () => {
    const headerSubtitle = document.querySelector('#header h2');
    if (!headerSubtitle) return;

    headerSubtitle.textContent = '';

    const messages = [
        "A Full Stack Web Developer",
        "Welcome to My Portfolio"
    ];
    
    let currentIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 150;
    
    const type = () => {
        const currentText = messages[currentIndex];
        
        if (isDeleting) {
            headerSubtitle.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                currentIndex = (currentIndex + 1) % messages.length;
                setTimeout(type, 500);
            } else {
                setTimeout(type, typingSpeed / 2);
            }
        } else {
            headerSubtitle.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentText.length) {
                isDeleting = true;
                setTimeout(type, 2000);
            } else {
                setTimeout(type, typingSpeed);
            }
        }
    };
    
    setTimeout(type, 1000);
};

window.addEventListener('load', headerTextAnimation);

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.classList.toggle('navbar-scrolled', window.scrollY > 100);
});

// Project card hover effect (relies on CSS for transitions)
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.03)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});

// Animate elements on scroll with throttling
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.section-title, .details-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight / 1.2;
        
        if (elementPosition < screenPosition) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        } else {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
        }
    });
};

// Set initial state for scroll animations
window.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.section-title, .details-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    animateOnScroll();
});

// Throttled scroll event listener for performance
let isScrolling;
window.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(animateOnScroll, 60);
}, false);

// View more functionality
document.querySelectorAll('.view-more-btn').forEach(button => {
    button.addEventListener('click', () => {
        const desc = button.previousElementSibling;
        desc.classList.toggle('expanded');
        button.textContent = desc.classList.contains('expanded') ? 'View Less' : 'View More';
    });
});

window.addEventListener('load', function() {
    // Simulate loading delay (e.g., 2 seconds)
    setTimeout(function() {
        // Hide loader
        document.getElementById('loader').style.display = 'none';
        // Show content
        document.getElementById('content').classList.add('show');
    }, 2000); // Adjust the delay as needed
});