// ========================================
// GLOBAL VARIABLES
// ========================================
let scene, camera, renderer, particles, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// ========================================
// DOM CONTENT LOADED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initThreeJS();
    initTypingAnimation();
    initSmoothScrolling();
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initParticleBackground();
    
    // Add mouse movement listener
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    
    // Add resize listener
    window.addEventListener('resize', onWindowResize, false);
    
    // Start animation loop
    animate();
});

// ========================================
// THREE.JS INITIALIZATION
// ========================================
function initThreeJS() {
    // Create background container for Three.js
    const bgContainer = document.createElement('div');
    bgContainer.id = 'threejs-background';
    bgContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
    `;
    document.body.appendChild(bgContainer);
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 300;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    bgContainer.appendChild(renderer.domElement);
    
    // Create floating geometric shapes
    createFloatingGeometry();
    
    // Create particle system
    createParticleSystem();
}

function createFloatingGeometry() {
    // Create floating cubes and spheres
    const geometries = [
        new THREE.BoxGeometry(20, 20, 20),
        new THREE.SphereGeometry(15, 16, 16),
        new THREE.OctahedronGeometry(18),
        new THREE.TetrahedronGeometry(22)
    ];
    
    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x4285F4, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.4 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x34A853, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.3 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0xEA4335, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.35 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x9C27B0, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.3 
        })
    ];
    
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = Math.random() * 800 - 400;
        mesh.position.y = Math.random() * 600 - 300;
        mesh.position.z = Math.random() * 500 - 250;
        
        mesh.rotation.x = Math.random() * 2 * Math.PI;
        mesh.rotation.y = Math.random() * 2 * Math.PI;
        
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.01,
                y: (Math.random() - 0.5) * 0.01,
                z: (Math.random() - 0.5) * 0.01
            },
            floatSpeed: Math.random() * 0.02 + 0.005,
            floatRange: Math.random() * 50 + 20
        };
        
        scene.add(mesh);
    }
}

function createParticleSystem() {
    const particleCount = 1500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    
    const colorPalette = [
        new THREE.Color(0x4285F4),
        new THREE.Color(0x34A853),
        new THREE.Color(0xEA4335),
        new THREE.Color(0x9C27B0)
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        positions[i3] = Math.random() * 2000 - 1000;
        positions[i3 + 1] = Math.random() * 2000 - 1000;
        positions[i3 + 2] = Math.random() * 1000 - 500;
        
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 3,
        transparent: true,
        opacity: 0.6,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
}

// ========================================
// ANIMATION LOOP
// ========================================
function animate() {
    requestAnimationFrame(animate);
    
    // Animate floating geometry
    scene.children.forEach(child => {
        if (child.userData && child.userData.rotationSpeed) {
            child.rotation.x += child.userData.rotationSpeed.x;
            child.rotation.y += child.userData.rotationSpeed.y;
            child.rotation.z += child.userData.rotationSpeed.z;
            
            // Floating motion
            child.position.y += Math.sin(Date.now() * child.userData.floatSpeed) * 0.1;
        }
    });
    
    // Animate particles based on mouse movement
    if (particleSystem) {
        const positions = particleSystem.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin((Date.now() + i) * 0.001) * 0.1;
            positions[i + 1] += Math.cos((Date.now() + i) * 0.0015) * 0.1;
        }
        particleSystem.geometry.attributes.position.needsUpdate = true;
    }
    
    // Camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.0005;
    camera.position.y += (-mouseY - camera.position.y) * 0.0005;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// ========================================
// EVENT HANDLERS
// ========================================
function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ========================================
// TYPING ANIMATION
// ========================================
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;
    
    const phrases = [
        'Data Scientist',
        'Machine Learning Enthusiast',
        'AI Researcher',
        'Gen AI Developer',
        'Tech Innovator',
        'Enterpreneur',
    ];
    
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 100;
    
    function typeText() {
        const currentPhrase = phrases[phraseIndex];
        
        if (isDeleting) {
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            delay = 50;
        } else {
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            delay = 100;
        }
        
        if (!isDeleting && charIndex === currentPhrase.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 500;
        }
        
        setTimeout(typeText, delay);
    }
    
    typeText();
}

// ========================================
// SMOOTH SCROLLING
// ========================================
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerOffset = 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                smoothScrollTo(offsetPosition, 1000);
            }
        });
    });
}

function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }
    
    requestAnimationFrame(animation);
}

function easeInOutQuad(t, b, c, d) {
    t /= d / 2;
    if (t < 1) return c / 2 * t * t + b;
    t--;
    return -c / 2 * (t * (t - 2) - 1) + b;
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const headerOffset = 80;
        const elementPosition = section.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        smoothScrollTo(offsetPosition, 1000);
    }
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Special animations for timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.style.animationDelay = '0.2s';
                }
                
                // Special animations for certificate cards
                if (entry.target.classList.contains('certificate-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
                
                // Special animations for project cards
                if (entry.target.classList.contains('project-card')) {
                    const index = Array.from(entry.target.parentNode.children).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.2}s`;
                }
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    const animatedElements = document.querySelectorAll(
        '.timeline-item, .certificate-card, .project-card, .about-content, .skill-item'
    );
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// CONTACT FORM
// ========================================
function initContactForm() {
    const form = document.querySelector('.form');
    if (!form) return;
    
    // Form field animations
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach(group => {
        const input = group.querySelector('input, textarea');
        const label = group.querySelector('label');
        
        input.addEventListener('focus', function() {
            group.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            if (this.value === '') {
                group.classList.remove('focused');
            }
        });
        
        input.addEventListener('input', function() {
            if (this.value !== '') {
                group.classList.add('has-value');
            } else {
                group.classList.remove('has-value');
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            showNotification('⚠️ Please fill in all fields', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('⚠️ Please enter a valid email address', 'error');
            return;
        }
        
        const submitBtn = form.querySelector('.btn-submit');
        const originalText = submitBtn.innerHTML;
        
        // Simulate form submission
        submitBtn.innerHTML = '<span>Sending...</span><i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            showNotification('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
            // Optional alert popup (only if you want it in addition to notification)
            // alert("✅ Message sent successfully! I'll get back to you soon.");
            
            form.reset();
            formGroups.forEach(group => {
                group.classList.remove('focused', 'has-value');
            });
            
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
    });
}


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#9ECAD6' : '#F5CBCB'};
        color: ${type === 'success' ? '#0a0a0f' : '#8b0000'};
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        backdrop-filter: blur(20px);
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// ========================================
// PARTICLE BACKGROUND EFFECT
// ========================================
function initParticleBackground() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -2;
        pointer-events: none;
        opacity: 0.1;
    `;
    
    document.body.appendChild(canvas);
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const particles = [];
    const particleCount = 50;
    
    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            size: Math.random() * 2 + 1,
            color: ['#9ECAD6', '#748DAE', '#F5CBCB', '#C0C9EE'][Math.floor(Math.random() * 4)]
        });
    }
    
    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.fill();
            
            // Connect nearby particles
            particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(otherParticle.x, otherParticle.y);
                    ctx.strokeStyle = particle.color;
                    ctx.lineWidth = (100 - distance) / 100;
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
    
    // Resize handler
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Debounce function for performance
function debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Random color from palette
function getRandomPaletteColor() {
    const colors = ['#9ECAD6', '#748DAE', '#F5CBCB', '#FFEAEA', '#C0C9EE'];
    return colors[Math.floor(Math.random() * colors.length)];
}

// Add glow effect to elements on hover
function addGlowEffect(selector) {
    const elements = document.querySelectorAll(selector);
    
    elements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 30px rgba(158, 202, 214, 0.6)';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
        });
    });
}

// Initialize glow effects
document.addEventListener('DOMContentLoaded', function() {
    addGlowEffect('.certificate-card');
    addGlowEffect('.project-card');
    addGlowEffect('.social-link');
    addGlowEffect('.btn-primary');
    addGlowEffect('.btn-secondary');
});

// Performance monitoring
function initPerformanceMonitoring() {
    let frameCount = 0;
    let lastTime = performance.now();
    
    function checkFPS() {
        frameCount++;
        const currentTime = performance.now();
        
        if (currentTime >= lastTime + 1000) {
            const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
            
            // Adjust particle count based on performance
            if (fps < 30 && particleSystem) {
                const positions = particleSystem.geometry.attributes.position.array;
                if (positions.length > 300) {
                    // Reduce particle count for better performance
                    const reducedPositions = new Float32Array(Math.floor(positions.length * 0.7));
                    for (let i = 0; i < reducedPositions.length; i++) {
                        reducedPositions[i] = positions[i];
                    }
                    particleSystem.geometry.setAttribute('position', new THREE.BufferAttribute(reducedPositions, 3));
                }
            }
            
            frameCount = 0;
            lastTime = currentTime;
        }
        
        requestAnimationFrame(checkFPS);
    }
    
    checkFPS();
}

// Initialize performance monitoring
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initPerformanceMonitoring, 5000);
});

// ========================================
// EASTER EGG - KONAMI CODE
// ========================================
(function() {
    const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let konamiIndex = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
    
    function activateEasterEgg() {
        // Create rainbow effect
        document.body.style.animation = 'rainbow 2s infinite';
        
        // Add rainbow keyframes if not exists
        if (!document.querySelector('#rainbow-keyframes')) {
            const style = document.createElement('style');
            style.id = 'rainbow-keyframes';
            style.textContent = `
                @keyframes rainbow {
                    0% { filter: hue-rotate(0deg); }
                    25% { filter: hue-rotate(90deg); }
                    50% { filter: hue-rotate(180deg); }
                    75% { filter: hue-rotate(270deg); }
                    100% { filter: hue-rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        showNotification('🎉 Easter egg activated! You found the secret!', 'success');
        
        setTimeout(() => {
            document.body.style.animation = '';
        }, 4000);
    }
})();
