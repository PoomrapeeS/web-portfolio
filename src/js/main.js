/* ==============================================
   Brand Logo Configuration
   =====================================
   ONE place to manage all logos/avatars.

   logoUrl options:
     - Simple Icons CDN: 'https://cdn.simpleicons.org/<slug>/ffffff'
     - Any public image URL (PNG, SVG, WebP)
     - Local file:        'images/my-logo.png'
     - null               → shows letter initials with gradient bg
   ============================================== */
const BRAND_LOGOS = {

  // ── Companies ──────────────────────────────────────────────────────
  'the-gang-tech': {
    logoUrl: null,          // ← paste logo URL here when available
    initials: 'TG',
    bg: 'linear-gradient(135deg, #1a3a6e, #2d5aa0)',
  },
  'kiatnakin-phatra': {
    logoUrl: null,          // ← paste logo URL here when available
    initials: 'KK',
    bg: 'linear-gradient(135deg, #7d1d1d, #b53030)',
  },
  'softnix': {
    logoUrl: null,          // ← paste logo URL here when available
    initials: 'SN',
    bg: 'linear-gradient(135deg, #145a32, #1e8449)',
  },
  'ford': {
    logoUrl: 'https://cdn.simpleicons.org/ford/ffffff',
    initials: 'F',
    bg: '#003399',
  },

  // ── Certifications ─────────────────────────────────────────────────
  'cert-ai-cloud': {
    logoUrl: 'https://cdn.simpleicons.org/microsoftazure/ffffff',
    initials: 'AI',
    bg: 'linear-gradient(135deg, #005ba1, #0078d4)',
  },
  'cert-arduino': {
    logoUrl: 'https://cdn.simpleicons.org/arduino/ffffff',
    initials: 'AR',
    bg: 'linear-gradient(135deg, #006e74, #00979d)',
  },
  'cert-raspberry-pi': {
    logoUrl: 'https://cdn.simpleicons.org/raspberrypi/ffffff',
    initials: 'PI',
    bg: 'linear-gradient(135deg, #8b1232, #c51a4a)',
  },
  'cert-python': {
    logoUrl: 'https://cdn.simpleicons.org/udemy/ffffff',
    initials: 'PY',
    bg: 'linear-gradient(135deg, #6b21a8, #a435f0)',
  },

  // ── Education ──────────────────────────────────────────────────────
  'chulalongkorn': {
    logoUrl: 'logoes/CU-logo.svg', // ← local file from src/logoes/
    initials: 'CU',
    bg: 'linear-gradient(135deg, #6b1231, #a01848)',
  },
  'triam-udom': {
    logoUrl: null,          // ← paste logo URL here when available
    initials: 'TU',
    bg: 'linear-gradient(135deg, #1a3a6e, #2d5aa0)',
  },
};

function _brandFallback(el, config) {
  el.style.background = config.bg;
  el.textContent = config.initials;
}

function renderBrandSlots() {
  document.querySelectorAll('[data-brand]').forEach((el) => {
    const config = BRAND_LOGOS[el.dataset.brand];
    if (!config) return;
    if (config.logoUrl) {
      const img = document.createElement('img');
      img.src = config.logoUrl;
      img.alt = '';
      img.className = 'brand-icon';
      img.loading = 'lazy';
      img.onerror = () => { el.innerHTML = ''; _brandFallback(el, config); };
      el.appendChild(img);
    } else {
      _brandFallback(el, config);
    }
  });
}

/* ==============================================
   Typing Effect
   ============================================== */
const TITLES = [
  'Data Engineer',
  'ETL Developer',
  'Data Analyst',
  'Azure Data Platform Specialist',
  'Python Developer',
];

let titleIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typedEl = document.querySelector('.typed-text');

function type() {
  const current = TITLES[titleIndex];
  typedEl.textContent = isDeleting
    ? current.slice(0, --charIndex)
    : current.slice(0, ++charIndex);

  let delay = isDeleting ? 55 : 95;

  if (!isDeleting && charIndex === current.length) {
    delay = 2200;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    titleIndex = (titleIndex + 1) % TITLES.length;
    delay = 450;
  }

  setTimeout(type, delay);
}

/* ==============================================
   Navbar: scroll shadow + active link
   ============================================== */
const navbar = document.getElementById('navbar');
const sections = Array.from(document.querySelectorAll('section[id]'));

function updateNavbar() {
  if (window.scrollY > 24) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  const scrollMid = window.scrollY + window.innerHeight / 3;

  let activeId = null;
  for (const section of sections) {
    if (scrollMid >= section.offsetTop) {
      activeId = section.id;
    }
  }

  document.querySelectorAll('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${activeId}`) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==============================================
   Mobile nav toggle
   ============================================== */
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ==============================================
   Scroll reveal (IntersectionObserver)
   ============================================== */
const REVEAL_SELECTORS = [
  '.section-title',
  '.about-text',
  '.stat-card',
  '.timeline-item',
  '.skill-category',
  '.cert-card',
  '.edu-card',
  '.contact-link',
  '.contact-subtitle',
].join(', ');

function initReveal() {
  const revealEls = document.querySelectorAll(REVEAL_SELECTORS);

  revealEls.forEach((el, i) => {
    el.classList.add('reveal');
    // Subtle stagger within groups of 5
    el.style.transitionDelay = `${(i % 5) * 70}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* ==============================================
   Init on DOMContentLoaded
   ============================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Start typing effect after a short delay
  setTimeout(type, 700);

  // Bind scroll listener
  window.addEventListener('scroll', updateNavbar, { passive: true });
  updateNavbar();

  // Init scroll reveal
  initReveal();

  // Render brand logos / letter avatars
  renderBrandSlots();
});
