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
});
