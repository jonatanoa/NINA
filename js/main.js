/* ================================================
   MAIN JS — Nav, Scroll, Reveal, Typing,
              Fondo por Sección, Videos
   Centro Educativo NINA
   ================================================ */

// ── NAV ──────────────────────────────────────────
const nav = document.getElementById('mainNav');
nav.classList.add('nav-default');

let scrollRAF = null;
window.addEventListener('scroll', () => {
    if (scrollRAF) return;
    scrollRAF = requestAnimationFrame(() => {
        if (window.innerWidth > 900) {
            const glass = window.pageYOffset > 100;
            nav.classList.toggle('nav-glass', glass);
            nav.classList.toggle('nav-default', !glass);
        }
        scrollRAF = null;
    });
}, { passive: true });

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks      = document.getElementById('navLinks');

function toggleMenu() {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

function closeMenu() {
    mobileMenuBtn.classList.remove('active');
    navLinks.classList.remove('active');
    document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && navLinks.classList.contains('active')) closeMenu();
});
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        if (window.innerWidth > 900 && navLinks.classList.contains('active')) closeMenu();
    }, 100);
}, { passive: true });
mobileMenuBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleMenu(); });
navLinks.addEventListener('click', (e) => { if (e.target === navLinks) closeMenu(); });

// ── SCROLL REVEAL ─────────────────────────────────
const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('active'); revealObserver.unobserve(entry.target); }
    }),
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const titleObserver = new IntersectionObserver(
    (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); titleObserver.unobserve(entry.target); }
    }),
    { threshold: 0.5 }
);
document.querySelectorAll('.section-title').forEach(title => titleObserver.observe(title));

// ── TYPING ANIMATION ──────────────────────────────
const words         = ['Aprende', 'Juega', 'Crece'];
let wordIndex = 0, charIndex = 0, isDeleting = false;
const typingElement = document.getElementById('typingText');

function typeEffect() {
    const currentWord = words[wordIndex];
    if (isDeleting) {
        typingElement.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;
    }
    let typeSpeed = isDeleting ? 100 : 200;
    if (!isDeleting && charIndex === currentWord.length) { typeSpeed = 2000; isDeleting = true; }
    else if (isDeleting && charIndex === 0) { isDeleting = false; wordIndex = (wordIndex + 1) % words.length; typeSpeed = 500; }
    setTimeout(typeEffect, typeSpeed);
}

// ── SMOOTH SCROLL ─────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ── FONDO POR SECCIÓN ────────────────────────────
// Cada sección tiene su pastel coordinado con los colores de NINA
// El body hace fade suave entre colores vía CSS transition
const sectionColors = {
    'inicio':      '#FFB3D1',   // rosa fuerte — identidad NINA
    'nosotros':    '#FFD49A',   // naranja durazno — calidez
    'programas':   '#A8EDCC',   // verde menta intenso — frescura
    'galeria':     '#C9B8FF',   // lavanda intensa — creatividad
    'testimonios': '#FFB89A',   // coral vivo — emoción
    'ubicacion':   '#A8D8FF',   // azul cielo intenso — bienvenida
    'contacto':    '#D8B8FF',   // violeta intenso — inspiración
    'juego':       '#FFE680',   // amarillo brillante — alegría
};

const sectionObserver = new IntersectionObserver(function (entries) {
    // Tomar la sección más visible en pantalla en este momento
    let best = null;
    entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        if (!best || entry.intersectionRatio > best.intersectionRatio) best = entry;
    });
    if (best) {
        const color = sectionColors[best.target.id];
        if (color) document.body.style.backgroundColor = color;
    }
}, {
    // threshold múltiple: dispara en cualquier punto de visibilidad (0) y a 50%
    // Funciona en secciones cortas (móvil) y largas (desktop)
    threshold: [0, 0.1, 0.25, 0.5],
    rootMargin: '-20% 0px -20% 0px'  // zona central del viewport = trigger limpio
});

Object.keys(sectionColors).forEach(function (id) {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
});

// Color inicial
document.body.style.backgroundColor = '#FFB3D1';

// ── INIT ─────────────────────────────────────────
typeEffect();

// ── VIDEO GALLERY: play solo cuando son visibles ─────────────
(function () {
    const videoObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            const video = entry.target.querySelector('.gallery-video-preview');
            if (!video) return;
            if (entry.isIntersecting) {
                if (video.readyState === 0) video.load();
                video.play().catch(function () {});
            } else {
                video.pause();
            }
        });
    }, { threshold: 0.25 });

    document.querySelectorAll('.gallery-item.video-item').forEach(function (item) {
        videoObserver.observe(item);
    });
})();


// ── LOADER — ocultar cuando la página está completamente lista ──
(function () {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    function hideLoader() {
        loader.classList.add('hidden');
        // Eliminar del DOM tras el fade para no ocupar memoria
        loader.addEventListener('transitionend', function () {
            loader.remove();
        }, { once: true });
    }

    // window.load espera imágenes, videos (poster), iframes — todo
    if (document.readyState === 'complete') {
        // Ya cargó (raro pero posible con caché)
        setTimeout(hideLoader, 300);
    } else {
        window.addEventListener('load', function () {
            // Pequeño delay mínimo para que la animación no sea imperceptible
            setTimeout(hideLoader, 500);
        });
    }

    // Safety net: si algo falla y load no dispara en 8s, ocultar igual
    setTimeout(hideLoader, 8000);
})();
