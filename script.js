// ========================================
// GLOBAL VARIABLES & SCENE SETUP
// ========================================
let scene, camera, renderer, particleSystem;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// ========================================
// INITIALIZATION ON DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();
    initTypingAnimation();
    initNavigation();
    initScrollAnimations();
    initServiceSelection();
    initContactForm();

    document.addEventListener('mousemove', onDocumentMouseMove, false);
    window.addEventListener('resize', onWindowResize, false);
    
    animate();
});

// ========================================
// THREE.JS 3D BACKGROUND
// ========================================
function initThreeJS() {
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

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 320;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    bgContainer.appendChild(renderer.domElement);

    createFloatingGeometry();
    createParticleSystem();
}

function createFloatingGeometry() {
    const geometries = [
        new THREE.OctahedronGeometry(16),
        new THREE.TetrahedronGeometry(20),
        new THREE.BoxGeometry(18, 18, 18),
        new THREE.IcosahedronGeometry(14)
    ];

    const materials = [
        new THREE.MeshBasicMaterial({ color: 0x4285F4, wireframe: true, transparent: true, opacity: 0.25 }),
        new THREE.MeshBasicMaterial({ color: 0x9C27B0, wireframe: true, transparent: true, opacity: 0.22 }),
        new THREE.MeshBasicMaterial({ color: 0x00D2FF, wireframe: true, transparent: true, opacity: 0.28 }),
        new THREE.MeshBasicMaterial({ color: 0x00C896, wireframe: true, transparent: true, opacity: 0.22 })
    ];

    for (let i = 0; i < 18; i++) {
        const geom = geometries[Math.floor(Math.random() * geometries.length)];
        const mat = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geom, mat);

        mesh.position.x = Math.random() * 900 - 450;
        mesh.position.y = Math.random() * 700 - 350;
        mesh.position.z = Math.random() * 500 - 250;

        mesh.userData = {
            rotSpeed: {
                x: (Math.random() - 0.5) * 0.008,
                y: (Math.random() - 0.5) * 0.008,
                z: (Math.random() - 0.5) * 0.008
            },
            floatSpeed: Math.random() * 0.002 + 0.001,
            initY: mesh.position.y
        };

        scene.add(mesh);
    }
}

function createParticleSystem() {
    const particleCount = 1200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const palette = [
        new THREE.Color(0x4285F4),
        new THREE.Color(0x9C27B0),
        new THREE.Color(0x00D2FF),
        new THREE.Color(0x00C896)
    ];

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = Math.random() * 1800 - 900;
        positions[i3 + 1] = Math.random() * 1800 - 900;
        positions[i3 + 2] = Math.random() * 1000 - 500;

        const color = palette[Math.floor(Math.random() * palette.length)];
        colors[i3] = color.r;
        colors[i3 + 1] = color.g;
        colors[i3 + 2] = color.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 2.8,
        vertexColors: true,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending
    });

    particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);
}

function animate() {
    requestAnimationFrame(animate);

    const time = Date.now();

    scene.children.forEach(child => {
        if (child.userData && child.userData.rotSpeed) {
            child.rotation.x += child.userData.rotSpeed.x;
            child.rotation.y += child.userData.rotSpeed.y;
            child.rotation.z += child.userData.rotSpeed.z;
            child.position.y = child.userData.initY + Math.sin(time * child.userData.floatSpeed) * 15;
        }
    });

    if (particleSystem) {
        particleSystem.rotation.y += 0.0003;
    }

    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}

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
// TYPING TEXT ANIMATION
// ========================================
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const phrases = [
        'AI Systems Architect',
        'CEO & Founder @ Polarions AI',
        'Former Interim CTO @ Yugal Wellness',
        'Enterprise ERP & Automation Builder',
        'Gen AI & Multi-Agent Specialist',
        'Full-Stack & Intelligent App Developer',
        'Tech Advisor & Startup Growth Partner'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            typingElement.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 35;
        } else {
            typingElement.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 70;
        }

        if (!isDeleting && charIndex === current.length) {
            typingSpeed = 2200;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400;
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

// ========================================
// NAVIGATION & SMOOTH SCROLLING
// ========================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    // Sticky navbar effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close on nav link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // Smooth scroll for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                e.preventDefault();
                scrollToSection(targetId.substring(1));
            }
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        const navHeight = 75;
        const targetPos = section.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
            top: targetPos,
            behavior: 'smooth'
        });
    }
}

// ========================================
// SERVICE SELECTION CHIPS & PREFILL
// ========================================
function initServiceSelection() {
    const chips = document.querySelectorAll('.service-chip');
    const subjectInput = document.getElementById('subject');

    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const serviceName = this.getAttribute('data-service');
            if (serviceName && subjectInput) {
                if (serviceName === 'General Inquiry') {
                    subjectInput.value = '';
                } else {
                    subjectInput.value = `[Inquiry] ${serviceName}`;
                }
                subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    });
}

function selectService(serviceName) {
    scrollToSection('contact');

    const chips = document.querySelectorAll('.service-chip');
    let matchedChip = null;

    chips.forEach(chip => {
        if (chip.getAttribute('data-service') === serviceName) {
            matchedChip = chip;
        }
    });

    if (matchedChip) {
        chips.forEach(c => c.classList.remove('active'));
        matchedChip.classList.add('active');
    }

    const subjectInput = document.getElementById('subject');
    if (subjectInput) {
        subjectInput.value = `[Inquiry] ${serviceName}`;
        subjectInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const messageInput = document.getElementById('message');
    if (messageInput) {
        setTimeout(() => {
            messageInput.focus();
        }, 800);
    }
}

// ========================================
// CONTACT FORM & GOOGLE FORMS INTEGRATION
// ========================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const iframe = document.getElementById('hidden_iframe');
    let isSubmitting = false;

    if (!form) return;

    form.addEventListener('submit', function(e) {
        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const subject = document.getElementById('subject').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !subject || !message) {
            e.preventDefault();
            showNotification('Please fill out all required fields.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.preventDefault();
            showNotification('Please enter a valid email address.', 'error');
            return;
        }

        // Allow form to submit to hidden iframe, but show feedback
        isSubmitting = true;
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        if (iframe) {
            iframe.onload = function() {
                if (isSubmitting) {
                    showNotification('Message sent successfully! I will get back to you within 24 hours.', 'success');
                    form.reset();
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                    isSubmitting = false;

                    // Reset service chips
                    document.querySelectorAll('.service-chip').forEach((c, idx) => {
                        c.classList.toggle('active', idx === 0);
                    });
                }
            };
        }

        // Fallback reset in case iframe onload does not fire
        setTimeout(() => {
            if (isSubmitting) {
                showNotification('Message sent successfully! I will get back to you within 24 hours.', 'success');
                form.reset();
                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
                isSubmitting = false;
            }
        }, 3000);
    });
}

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notif = document.createElement('div');
    notif.className = `notification ${type}`;
    notif.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
            <span>${message}</span>
        </div>
    `;

    document.body.appendChild(notif);

    setTimeout(() => {
        notif.classList.add('active');
    }, 50);

    setTimeout(() => {
        notif.classList.remove('active');
        setTimeout(() => notif.remove(), 400);
    }, 4500);
}

// ========================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// ========================================
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    document.querySelectorAll('.service-card, .exp-card, .project-card, .certificate-card, .metric-card').forEach(el => {
        observer.observe(el);
    });
}

// ========================================
// EASTER EGG (KONAMI CODE)
// ========================================
(function() {
    const konami = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
    let kIndex = 0;

    document.addEventListener('keydown', function(e) {
        if (e.keyCode === konami[kIndex]) {
            kIndex++;
            if (kIndex === konami.length) {
                document.body.style.filter = 'hue-rotate(180deg)';
                showNotification('Special Mode Unlocked: Cyber Matrix Activated!', 'success');
                setTimeout(() => {
                    document.body.style.filter = '';
                }, 5000);
                kIndex = 0;
            }
        } else {
            kIndex = 0;
        }
    });
})();
