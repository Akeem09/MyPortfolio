// ============================================================
// Mobile nav toggle
// ============================================================
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.classList.toggle('is-active', isOpen);
  });

  // close menu after tapping a link (mobile)
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// Scroll reveal for .reveal elements
// ============================================================
const revealEls = document.querySelectorAll('.reveal');

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el) => revealObserver.observe(el));
} else {
  // fallback: no IO support
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// ============================================================
// Traceability line fill — animates as the experience section
// scrolls into view, echoing "100% requirement traceability"
// ============================================================
const traceFill = document.getElementById('traceFill');
const traceSection = document.querySelector('.trace');

if (traceFill && traceSection && !prefersReducedMotion) {
  const fillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          traceFill.style.height = '100%';
          fillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );
  fillObserver.observe(traceSection);
} else if (traceFill) {
  traceFill.style.height = '100%';
}

// ============================================================
// Active nav link highlighting on scroll
// ============================================================
const sections = document.querySelectorAll('main section[id], main section.work, main section.projects, main section.competencies, main section.credentials, main section.contact');
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');

const sectionIds = ['work', 'projects', 'competencies', 'credentials', 'contact'];
const trackedSections = sectionIds
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (trackedSections.length && 'IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`.site-nav a[href="#${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    },
    { threshold: 0.3, rootMargin: '-72px 0px -50% 0px' }
  );

  trackedSections.forEach((section) => navObserver.observe(section));
}

// ============================================================
// Header shadow on scroll
// ============================================================
const header = document.querySelector('.site-header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const current = window.scrollY;
  if (header) {
    header.style.boxShadow = current > 8 ? '0 8px 24px rgba(0,0,0,0.25)' : 'none';
  }
  lastScroll = current;
}, { passive: true });