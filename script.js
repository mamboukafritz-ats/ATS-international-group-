const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const langBtn = document.getElementById('langBtn');

menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') !== 'true';
  menuBtn.setAttribute('aria-expanded', String(open));
  mobileMenu.classList.toggle('open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
});

mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menuBtn.setAttribute('aria-expanded', 'false');
  mobileMenu.classList.remove('open');
  mobileMenu.setAttribute('aria-hidden', 'true');
}));

langBtn.addEventListener('click', () => {
  document.documentElement.lang = document.documentElement.lang === 'fr' ? 'en' : 'fr';
  langBtn.textContent = document.documentElement.lang === 'fr' ? 'EN' : 'FR';
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

document.querySelectorAll('.section, .activity-card, .news-grid article').forEach(el => {
  el.classList.add('reveal');
  observer.observe(el);
});
