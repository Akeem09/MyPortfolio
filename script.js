const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

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
  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.classList.remove('is-active');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// ============================================================
// Custom cursor (desktop only)
// ============================================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

if (!isTouch && cursorDot && cursorRing && !prefersReducedMotion) {
  let tx = 0, ty = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
    cursorDot.style.left = tx + 'px';
    cursorDot.style.top = ty + 'px';
  }, { passive: true });

  (function ringLoop() {
    rx += (tx - rx) * 0.16;
    ry += (ty - ry) * 0.16;
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top = ry + 'px';
    requestAnimationFrame(ringLoop);
  })();

  document.querySelectorAll('a, button, .project-card, .cred-card, .trace-tags span').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
  });
}

// ============================================================
// Scroll progress bar
// ============================================================
const progressBar = document.getElementById('scrollProgress');

window.addEventListener('scroll', () => {
  if (progressBar) {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    progressBar.style.width = (window.scrollY / total) * 100 + '%';
  }
  const header = document.getElementById('siteHeader');
  if (header) {
    header.style.boxShadow = window.scrollY > 8 ? '0 8px 24px rgba(0,0,0,0.25)' : 'none';
  }
}, { passive: true });

// ============================================================
// Typing effect — roles cycle
// ============================================================
const typingEl = document.getElementById('typingText');
const roles = [
  'Business Analyst',
  'Requirements Engineer',
  'ServiceNow CSA & CAD Certified',
  'Agile & Waterfall Practitioner',
  'UAT & Traceability Specialist',
  'AI-Assisted Process Optimizer'
];

if (typingEl) {
  if (prefersReducedMotion) {
    typingEl.textContent = roles[0];
  } else {
    let roleIdx = 0, charIdx = 0, deleting = false;
    (function typeLoop() {
      const word = roles[roleIdx];
      typingEl.textContent = word.substring(0, charIdx);
      if (!deleting && charIdx < word.length) {
        charIdx++; setTimeout(typeLoop, 70);
      } else if (deleting && charIdx > 0) {
        charIdx--; setTimeout(typeLoop, 35);
      } else if (!deleting) {
        deleting = true; setTimeout(typeLoop, 1700);
      } else {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        setTimeout(typeLoop, 350);
      }
    })();
  }
}

// ============================================================
// Count-up stats
// ============================================================
const counters = document.querySelectorAll('.counter');

if (counters.length) {
  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    counters.forEach((el) => { el.textContent = el.dataset.target; });
  } else {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.target;
        const duration = 1600;
        const start = performance.now();
        (function step(now) {
          const p = Math.min((now - start) / duration, 1);
          el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = target;
        })(start);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => counterObserver.observe(el));
  }
}

// ============================================================
// Scroll reveal
// ============================================================
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion || !('IntersectionObserver' in window)) {
  revealEls.forEach((el) => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('is-visible'), (i % 3) * 90);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach((el) => revealObserver.observe(el));
}

// ============================================================
// Traceability line fill
// ============================================================
const traceFill = document.getElementById('traceFill');
const traceSection = document.querySelector('.trace');

if (traceFill && traceSection && !prefersReducedMotion && 'IntersectionObserver' in window) {
  const fillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        traceFill.style.height = '100%';
        fillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  fillObserver.observe(traceSection);
} else if (traceFill) {
  traceFill.style.height = '100%';
}

// ============================================================
// Active nav link highlighting
// ============================================================
const navLinks = document.querySelectorAll('.site-nav a[href^="#"]');
const trackedSections = ['work', 'projects', 'competencies', 'credentials', 'contact']
  .map((id) => document.getElementById(id))
  .filter(Boolean);

if (trackedSections.length && 'IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = document.querySelector(`.site-nav a[href="#${entry.target.id}"]`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((l) => l.classList.remove('is-active'));
        link.classList.add('is-active');
      }
    });
  }, { threshold: 0.3, rootMargin: '-72px 0px -50% 0px' });
  trackedSections.forEach((section) => navObserver.observe(section));
}

// ============================================================
// Spotlight hover — cursor-tracked radial glow on cards
// ============================================================
if (!isTouch) {
  document.querySelectorAll('.spotlight').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--my', (e.clientY - rect.top) + 'px');
    }, { passive: true });
  });
}

// ============================================================
// 3D tilt on project cards
// ============================================================
if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll('.tilt').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${px * 6}deg) rotateX(${py * -6}deg) translateY(-3px)`;
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================
// Magnetic buttons — subtle pull toward cursor
// ============================================================
if (!isTouch && !prefersReducedMotion) {
  document.querySelectorAll('.magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.22}px)`;
    }, { passive: true });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ============================================================
// Hero diagram parallax on scroll
// ============================================================
const heroDiagram = document.getElementById('heroDiagram');

if (heroDiagram && !prefersReducedMotion && !isTouch) {
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y < window.innerHeight) {
      heroDiagram.style.transform = `translateY(${y * 0.08}px)`;
    }
  }, { passive: true });
}
