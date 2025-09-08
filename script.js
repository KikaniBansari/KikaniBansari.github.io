document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const hamburger = document.getElementById('hamburger');
  const menu = document.querySelector('.menu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    menu.classList.toggle('active');
  });

  // Scroll reveal
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  sections.forEach(sec => observer.observe(sec));

  // Particles background
  particlesJS('particles-js', {
    "particles": {
      "number": { "value": 70, "density": { "enable": true, "value_area": 800 }},
      "color": { "value": ["#a7c7e7", "#ffb6c1", "#e6e6fa"] },
      "shape": { "type": "circle" },
      "opacity": { "value": 0.5 },
      "size": { "value": 4, "random": true },
      "line_linked": { "enable": true, "distance": 150, "color": "#a7c7e7", "opacity": 0.4, "width": 1 },
      "move": { "enable": true, "speed": 2 }
    },
    "interactivity": {
      "events": { "onhover": { "enable": true, "mode": "repulse" }},
      "modes": { "repulse": { "distance": 100, "duration": 0.4 }}
    },
    "retina_detect": true
  });

  // Intro load animation
  anime.timeline({ easing: 'easeOutExpo' })
    .add({
      targets: '.profile-photo',
      scale: [0,1],
      opacity: [0,1],
      duration: 1200
    })
    .add({
      targets: '.headings h1, .headings h3, .headings h4',
      translateY: [40,0],
      opacity: [0,1],
      delay: anime.stagger(200),
      duration: 800
    }, "-=800");
});
