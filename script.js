// ========================================
// INITIALIZATION ON DOM READY
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initTyping();
    initNavbar();
    initServiceChips();
    initContactForm();
});

// ========================================
// TYPING EFFECT
// ========================================
function initTyping() {
    const textTarget = document.querySelector('.typing-text');
    if (!textTarget) return;

    const phrases = [
        'Autonomous Multi-Agent AI Systems',
        'Enterprise ERP & Operations Platforms',
        'High-Velocity 30-Day MVP Engineering',
        'Model Context Protocol (MCP) & RAG',
        'Fractional & Interim CTO Advisory'
    ];

    let pIdx = 0;
    let cIdx = 0;
    let deleting = false;
    let speed = 65;

    function tick() {
        const current = phrases[pIdx];

        if (deleting) {
            textTarget.textContent = current.substring(0, cIdx - 1);
            cIdx--;
            speed = 30;
        } else {
            textTarget.textContent = current.substring(0, cIdx + 1);
            cIdx++;
            speed = 65;
        }

        if (!deleting && cIdx === current.length) {
            speed = 2200;
            deleting = true;
        } else if (deleting && cIdx === 0) {
            deleting = false;
            pIdx = (pIdx + 1) % phrases.length;
            speed = 400;
        }

        setTimeout(tick, speed);
    }

    tick();
}

// ========================================
// NAVBAR & MOBILE MENU
// ========================================
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    const toggle = document.getElementById('mobileToggle');
    const menu = document.getElementById('navMenu');

    // Scroll shadow effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });

        menu.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
            link.addEventListener('click', function() {
                menu.classList.remove('active');
            });
        });
    }

    // Smooth anchor scrolling
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const navHeight = 72;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                    window.scrollTo({
                        top: top,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// ========================================
// SERVICE SELECTION CHIPS & CTAs
// ========================================
function initServiceChips() {
    const chips = document.querySelectorAll('.chip-btn');
    const subjectField = document.getElementById('subject');

    chips.forEach(chip => {
        chip.addEventListener('click', function() {
            chips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');

            const val = this.getAttribute('data-service');
            if (subjectField && val) {
                if (val === 'General Consultation') {
                    subjectField.value = '';
                } else {
                    subjectField.value = `[Consultation] ${val}`;
                }
            }
        });
    });
}

function inquireService(serviceName) {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const navHeight = 72;
        const top = contactSection.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }

    const chips = document.querySelectorAll('.chip-btn');
    chips.forEach(chip => {
        if (chip.getAttribute('data-service') === serviceName) {
            chips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
        }
    });

    const subjectField = document.getElementById('subject');
    if (subjectField) {
        subjectField.value = `[Consultation] ${serviceName}`;
    }

    const messageField = document.getElementById('message');
    if (messageField) {
        setTimeout(() => {
            messageField.focus();
        }, 600);
    }
}

// ========================================
// CONTACT FORM SUBMISSION
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
            showToast('Please fill out all fields.', 'toast-error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.preventDefault();
            showToast('Please provide a valid email address.', 'toast-error');
            return;
        }

        isSubmitting = true;
        const origText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        if (iframe) {
            iframe.onload = function() {
                if (isSubmitting) {
                    showToast('Message sent successfully! I will respond within 24 hours.', 'toast-success');
                    form.reset();
                    submitBtn.innerHTML = origText;
                    submitBtn.disabled = false;
                    isSubmitting = false;
                }
            };
        }

        setTimeout(() => {
            if (isSubmitting) {
                showToast('Message sent successfully! I will respond within 24 hours.', 'toast-success');
                form.reset();
                submitBtn.innerHTML = origText;
                submitBtn.disabled = false;
                isSubmitting = false;
            }
        }, 3000);
    });
}

function showToast(message, typeClass) {
    const old = document.querySelector('.toast-notice');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notice ${typeClass}`;
    toast.innerHTML = `
        <i class="fas ${typeClass === 'toast-success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
        <span>${message}</span>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
    }, 40);

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 4500);
}
