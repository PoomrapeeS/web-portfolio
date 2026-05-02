/* ==============================================
   Brand Logo Configuration
   =====================================
   ONE place to manage all logos/avatars.

   logoUrl options:
     - Simple Icons CDN: 'https://cdn.simpleicons.org/<slug>/ffffff'
     - Any public image URL (PNG, SVG, WebP)
     - Local file:        'images/my-logo.png'
     - null               → shows letter initials with gradient bg

   logoBg  — background shown BEHIND the logo image:
     - '#ffffff'          → white card (use for dark logos)
     - 'transparent'      → no background (use for logos with built-in color)
     - any CSS color/gradient
     - omit / null        → defaults to white
   ============================================== */
const BRAND_LOGOS = {

  // ── Companies ──────────────────────────────────────────────────────
  'the-gang-tech': {
    logoUrl: 'logoes/TG-logo.png',
    logoBg: '#ffffffee',      // ← white bg so dark logo is visible
    initials: 'TG',
    bg: 'linear-gradient(135deg, #b9c3d3, #2d5aa0)',
  },
  'kiatnakin-phatra': {
    logoUrl: 'logoes/kkp-logo.png',          // ← paste logo URL here when available
    logoBg: '#575075',      // ← set to 'transparent' if logo has its own color
    initials: 'KK',
    bg: 'linear-gradient(135deg, #7d1d1d, #b53030)',
  },
  'softnix': {
    logoUrl: 'logoes/softnix-logo.png',          // ← paste logo URL here when available
    logoBg: '#ffffffee',
    initials: 'SN',
    bg: 'linear-gradient(135deg, #145a32, #1e8449)',
  },
  'ford': {
    logoUrl: 'logoes/ford-logo.png',          // ← paste logo URL here when available
    logoBg: 'transparent', // ← Simple Icons are already white, keep the blue bg
    initials: 'F',
    bg: '#003399',
  },

  // ── Certifications ─────────────────────────────────────────────────
  'cert-azure-data-engineer': {
    logoUrl: 'logoes/microsoft-logo.png',
    logoBg: 'transparent', // white icon on colored bg
    initials: 'AD',
    bg: 'linear-gradient(135deg, #005ba1, #0078d4)',
  },
  'cert-arduino': {
    logoUrl: 'https://cdn.simpleicons.org/arduino/ffffff',
    logoBg: 'transparent',
    initials: 'AR',
    bg: 'linear-gradient(135deg, #006e74, #00979d)',
  },
  'cert-raspberry-pi': {
    logoUrl: 'https://cdn.simpleicons.org/raspberrypi/ffffff',
    logoBg: 'transparent',
    initials: 'PI',
    bg: 'linear-gradient(135deg, #8b1232, #c51a4a)',
  },
  'cert-python': {
    logoUrl: 'https://cdn.simpleicons.org/udemy/ffffff',
    logoBg: 'transparent',
    initials: 'PY',
    bg: 'linear-gradient(135deg, #6b21a8, #a435f0)',
  },

  // ── Education ──────────────────────────────────────────────────────
  'chulalongkorn': {
    logoUrl: 'logoes/CU-logo.svg',
    logoBg: '#2d2b2b',      // ← white bg so dark CU logo is visible
    initials: 'CU',
    bg: 'linear-gradient(135deg, #6b1231, #a01848)',
  },
  'triam-udom': {
    logoUrl: 'logoes/tu-logo.png',          // ← paste logo URL here when available
    logoBg: '#2d2b2b',
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
      // Apply background behind the logo (white for dark logos, transparent for white icons)
      el.style.background = (config.logoBg != null ? config.logoBg : '#ffffff');
      const img = document.createElement('img');
      img.src = config.logoUrl;
      img.alt = '';
      img.className = 'brand-icon';
      img.loading = 'lazy';
      img.onerror = () => { el.innerHTML = ''; el.style.background = ''; _brandFallback(el, config); };
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
