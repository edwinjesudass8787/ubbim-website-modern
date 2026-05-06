/**
 * UBBIM — Sleek Minimal Site JS
 */

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMobileMenu();
  initReveal();
  initBackToTop();
  initSmoothScroll();
  initCounters();
});

window.UBBIM = window.UBBIM || {};
window.UBBIM.showToast = showToast;

/* Navigation scroll behaviour */
function initNav() {
  const navs = document.querySelectorAll('[data-nav]');
  if (!navs.length) return;

  const onScroll = () => {
    navs.forEach(nav => {
      if (window.scrollY > 20) nav.classList.add('is-scrolled');
      else nav.classList.remove('is-scrolled');
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* Mobile menu */
function initMobileMenu() {
  const toggles = document.querySelectorAll('[data-mobile-toggle]');
  const panels = document.querySelectorAll('[data-mobile-panel]');
  const closers = document.querySelectorAll('[data-mobile-close]');

  toggles.forEach(t => t.addEventListener('click', () => {
    panels.forEach(p => p.classList.add('is-open'));
    document.body.style.overflow = 'hidden';
  }));

  closers.forEach(c => c.addEventListener('click', () => {
    panels.forEach(p => p.classList.remove('is-open'));
    document.body.style.overflow = '';
  }));

  panels.forEach(p => {
    p.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      p.classList.remove('is-open');
      document.body.style.overflow = '';
    }));
  });
}

/* Scroll reveal */
function initReveal() {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => io.observe(el));
}

/* Back to top */
function initBackToTop() {
  const btn = document.querySelector('[data-back-to-top]');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 600) btn.classList.add('is-visible');
    else btn.classList.remove('is-visible');
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* Smooth scroll for anchor links */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* Counter animation */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        const tick = (now) => {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased) + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => io.observe(c));
}

function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.setAttribute('role', 'status');
  toast.style.cssText = [
    'position:fixed',
    'right:24px',
    'bottom:24px',
    'z-index:80',
    'max-width:360px',
    'padding:14px 16px',
    'border-radius:12px',
    'background:' + (type === 'error' ? '#dc2626' : '#10131a'),
    'color:#fff',
    'font-size:14px',
    'font-weight:600',
    'box-shadow:0 18px 60px rgba(16,24,40,.18)',
    'transform:translateY(16px)',
    'opacity:0',
    'transition:opacity .25s ease, transform .25s ease'
  ].join(';');

  document.body.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(16px)';
    setTimeout(() => toast.remove(), 260);
  }, 3200);
}
