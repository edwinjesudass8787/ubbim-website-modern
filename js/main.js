/**
 * UBBIM Modern Website - Main JavaScript
 */

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initNavigation();
  initScrollAnimations();
  initParticles();
  initCounterAnimation();
  initMobileMenu();
  initSmoothScroll();
  initStickyNav();
});

// Navigation
function initNavigation() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('nav-blur');
      nav.classList.remove('bg-transparent');
    } else {
      nav.classList.remove('nav-blur');
      nav.classList.add('bg-transparent');
    }
  });
}

// Sticky Navigation
function initStickyNav() {
  const nav = document.getElementById('main-nav');
  if (!nav) return;
  
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    
    if (currentScroll > 100) {
      nav.style.transform = currentScroll > lastScroll ? 'translateY(-100%)' : 'translateY(0)';
    } else {
      nav.style.transform = 'translateY(0)';
    }
    
    lastScroll = currentScroll;
  });
  
  nav.style.transition = 'transform 0.3s ease, background 0.3s ease';
}

// Mobile Menu
function initMobileMenu() {
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeBtn = document.getElementById('mobile-menu-close');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeBtn && mobileMenu) {
    closeBtn.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  }

  // Close menu on link click
  const mobileLinks = mobileMenu?.querySelectorAll('a');
  mobileLinks?.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Smooth Scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

// Scroll Animations (Custom AOS)
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('[data-aos]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('aos-animate');
        
        // Add stagger delay if specified
        const delay = entry.target.dataset.aosDelay;
        if (delay) {
          entry.target.style.transitionDelay = `${delay}ms`;
        }
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  animatedElements.forEach(el => observer.observe(el));
}

// Counter Animation
function initCounterAnimation() {
  const counters = document.querySelectorAll('[data-counter]');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.dataset.counter);
        const suffix = counter.dataset.suffix || '';
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const updateCounter = () => {
          current += step;
          if (current < target) {
            counter.textContent = Math.floor(current) + suffix;
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + suffix;
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => observer.observe(counter));
}

// Particle System
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let isActive = true;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(6, 182, 212, ${this.opacity})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    const particleCount = Math.min(50, Math.floor(canvas.width * canvas.height / 15000));
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDistance = 100;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(6, 182, 212, ${0.1 * (1 - distance / maxDistance)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (!isActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    connectParticles();
    animationId = requestAnimationFrame(animate);
  }

  createParticles();
  animate();

  // Pause when not visible
  const heroSection = canvas.closest('.hero-section');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isActive = entry.isIntersecting;
        if (isActive && !animationId) animate();
      });
    });
    observer.observe(heroSection);
  }
}

// Typing Effect for Hero
function typeWriter(element, text, speed = 100) {
  let i = 0;
  element.textContent = '';
  
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  
  type();
}

// Parallax Effect
function initParallax() {
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    
    parallaxElements.forEach(el => {
      const speed = el.dataset.parallax || 0.5;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    });
  });
}

// Image Lazy Loading
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}

// Form Validation
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add('border-red-500');
    } else {
      input.classList.remove('border-red-500');
    }
  });

  return isValid;
}

// Toast Notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-xl shadow-lg transform translate-y-full transition-transform duration-300 z-50 ${
    type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
  } text-white`;
  toast.textContent = message;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.transform = 'translateY(0)';
  }, 100);
  
  setTimeout(() => {
    toast.style.transform = 'translateY(200%)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Export functions for global access
window.UBBIM = {
  typeWriter,
  showToast,
  validateForm
};
