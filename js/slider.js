/* ================================================
   SLIDERS — Hero Slider & Testimonials
   Centro Educativo NINA
   ================================================ */

// ── HERO SLIDER ───────────────────────────────────
(function () {
    const slides   = document.querySelectorAll('.hero-slide');
    const dotsWrap = document.getElementById('heroDots');
    const prev     = document.getElementById('heroPrev');
    const next     = document.getElementById('heroNext');
    let current    = 0;
    let timer      = null;

    slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Slide ' + (i + 1));
        dot.addEventListener('click', function () { goTo(i); resetTimer(); });
        dotsWrap.appendChild(dot);
    });

    function goTo(idx) {
        slides[current].classList.remove('active');
        dotsWrap.children[current].classList.remove('active');
        current = (idx + slides.length) % slides.length;
        slides[current].classList.add('active');
        dotsWrap.children[current].classList.add('active');
    }

    function resetTimer() {
        clearInterval(timer);
        timer = setInterval(function () { goTo(current + 1); }, 2500);
    }

    prev.addEventListener('click', function () { goTo(current - 1); resetTimer(); });
    next.addEventListener('click', function () { goTo(current + 1); resetTimer(); });

    // Touch / swipe support
    let touchStartX = 0;
    document.getElementById('heroSlider').addEventListener('touchstart', function (e) {
        touchStartX = e.touches[0].clientX;
    }, { passive: true });
    document.getElementById('heroSlider').addEventListener('touchend', function (e) {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) { goTo(current + (diff > 0 ? 1 : -1)); resetTimer(); }
    });

    resetTimer();
})();


// ── TESTIMONIALS SLIDER ───────────────────────────
let currentSlide = 0;
const track        = document.getElementById('testimonialsTrack');
const cards        = document.querySelectorAll('.testimonial-card');
const totalSlides  = cards.length;
const dotsContainer = document.getElementById('sliderDots');
let autoTimer = null, userPaused = false;

for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.onclick = () => { goToSlide(i); userPaused = true; stopAuto(); };
    dotsContainer.appendChild(dot);
}
const dots = document.querySelectorAll('.dot');

function updateSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    updateSlider();
}

function startAuto() {
    if (autoTimer) return;
    autoTimer = setInterval(() => goToSlide(currentSlide + 1), 6000);
}

function stopAuto() { clearInterval(autoTimer); autoTimer = null; }

// Exposed globally for inline onclick buttons
window.moveSlider = function (direction) {
    goToSlide(currentSlide + direction);
    userPaused = true;
    stopAuto();
};

const testimonialsSection = document.getElementById('testimonios');
if (testimonialsSection) {
    new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) { userPaused = false; stopAuto(); startAuto(); }
            else { if (!userPaused) startAuto(); }
        });
    }, { threshold: 0.2 }).observe(testimonialsSection);
}

startAuto();
