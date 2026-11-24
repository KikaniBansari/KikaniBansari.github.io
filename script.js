// ========================================
// INITIALIZE ON DOM CONTENT LOADED
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initServiceSelection();
    initContactForm();
});

// ========================================
// NAVIGATION & SMOOTH SCROLLING
// ========================================
function initNavigation() {
    const burger = document.getElementById('navBurger');
    const navLinks = document.getElementById('heroNavLinks');

    if (burger && navLinks) {
        burger.addEventListener('click', function() {
            navLinks.classList.toggle('open');
        });

        navLinks.querySelectorAll('.nav-item').forEach(link => {
            link.addEventListener('click', function() {
                navLinks.classList.remove('open');
            });
        });
    }

    // Smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId && targetId !== '#') {
                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    const offset = 20;
                    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    window.scrollTo({
                        top: top,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Highlight active nav item on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('header[id], section[id]');
        const scrollPos = window.pageYOffset + 120;

        sections.forEach(sec => {
            const top = sec.offsetTop;
            const height = sec.offsetHeight;
            const id = sec.getAttribute('id');
            const link = document.querySelector(`.hero-nav-links a[href="#${id}"]`);

            if (scrollPos >= top && scrollPos < top + height) {
                document.querySelectorAll('.hero-nav-links a').forEach(a => a.classList.remove('active'));
                if (link) link.classList.add('active');
            }
        });
    });
}

// ========================================
// SERVICE SELECTION CHIPS & CTAs
// ========================================
function initServiceSelection() {
    const serviceBtns = document.querySelectorAll('.service-tag-btn');
    const subjectField = document.getElementById('subject');

    serviceBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            serviceBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            const val = this.getAttribute('data-service');
            if (subjectField && val) {
                if (val === 'General Inquiry') {
                    subjectField.value = '';
                } else {
                    subjectField.value = `[Inquiry] ${val}`;
                }
            }
        });
    });
}

function selectService(serviceName) {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
        const top = contactSection.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({
            top: top,
            behavior: 'smooth'
        });
    }

    const serviceBtns = document.querySelectorAll('.service-tag-btn');
    serviceBtns.forEach(btn => {
        if (btn.getAttribute('data-service') === serviceName) {
            serviceBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        }
    });

    const subjectField = document.getElementById('subject');
    if (subjectField) {
        subjectField.value = `[Inquiry] ${serviceName}`;
    }

    const messageField = document.getElementById('message');
    if (messageField) {
        setTimeout(() => {
            messageField.focus();
        }, 600);
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
            showToast('Please fill out all fields before sending.', 'error');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            e.preventDefault();
            showToast('Please enter a valid email address.', 'error');
            return;
        }

        isSubmitting = true;
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<span>SENDING MESSAGE...</span> <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.disabled = true;

        if (iframe) {
            iframe.onload = function() {
                if (isSubmitting) {
                    showToast('Message sent successfully! I will reply within 24 hours.', 'success');
                    form.reset();
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                    isSubmitting = false;
                }
            };
        }

        setTimeout(() => {
            if (isSubmitting) {
                showToast('Message sent successfully! I will reply within 24 hours.', 'success');
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                isSubmitting = false;
            }
        }, 3000);
    });
}

function showToast(message, type = 'success') {
    const old = document.querySelector('.bold-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.className = 'bold-toast';
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i>
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
