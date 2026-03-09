/* ================================================
   LIGHTBOX — Imágenes y Videos
   Centro Educativo NINA
   ================================================ */

(function () {
    const lb    = document.getElementById('lightbox');
    const inner = document.getElementById('lbInner');
    const close = document.getElementById('lbClose');

    /* ── Abrir imagen ── */
    function openImage(item) {
        inner.innerHTML = '';
        const img = document.createElement('img');
        img.src      = item.getAttribute('data-src');
        img.decoding = 'async';
        inner.appendChild(img);
        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    /* ── Abrir video ── */
    function openVideo(item) {
        inner.innerHTML = '';

        // Pausar TODOS los previews para liberar CPU y ancho de banda
        document.querySelectorAll('.gallery-video-preview').forEach(function (v) {
            v.pause();
        });

        const video       = document.createElement('video');
        video.src         = item.getAttribute('data-src');
        video.className   = 'lb-video';
        video.controls    = false;
        video.autoplay    = false;   // arrancamos manualmente en canplay
        video.playsInline = true;
        video.loop        = false;
        video.preload     = 'auto';  // buffer agresivo en lightbox
        video.style.cssText = 'opacity:0;transition:opacity 0.35s ease;';

        // Botón play/pausa
        const controls = document.createElement('div');
        controls.className = 'lb-video-controls';

        const playBtn = document.createElement('button');
        playBtn.className = 'lb-ctrl-btn';
        playBtn.innerHTML = '&#9203;';
        playBtn.setAttribute('aria-label', 'Cargando...');

        playBtn.addEventListener('click', function () {
            if (video.paused) { video.play(); }
            else              { video.pause(); }
        });

        // Arrancar suavemente cuando hay suficiente buffer
        video.addEventListener('canplay', function () {
            video.style.opacity = '1';
            playBtn.innerHTML   = '&#9208;';
            playBtn.setAttribute('aria-label', 'Pausar video');
            video.play().catch(function () {});
        }, { once: true });

        video.addEventListener('play',  function () { playBtn.innerHTML = '&#9208;'; });
        video.addEventListener('pause', function () { playBtn.innerHTML = '&#9654;'; });
        video.addEventListener('ended', function () { playBtn.innerHTML = '&#9654;'; });

        controls.appendChild(playBtn);
        inner.appendChild(video);
        inner.appendChild(controls);

        lb.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    /* ── Cerrar ── */
    function closeLb() {
        lb.classList.remove('open');

        // Destruir video completamente para liberar memoria
        const video = inner.querySelector('video');
        if (video) {
            video.pause();
            video.src  = '';
            video.load(); // libera el buffer del decodificador
        }

        inner.innerHTML = '';
        document.body.style.overflow = '';

        // Reanudar solo previews visibles (IntersectionObserver en main.js los gestiona)
        document.querySelectorAll('.gallery-video-preview').forEach(function (v) {
            const item = v.closest('.gallery-item');
            if (!item) return;
            const rect    = item.getBoundingClientRect();
            const visible = rect.top < window.innerHeight && rect.bottom > 0;
            if (visible) v.play().catch(function () {});
        });
    }

    /* ── Listeners ── */
    document.querySelectorAll('.gallery-item[data-type="image"]').forEach(function (item) {
        item.addEventListener('click', function () { openImage(item); });
    });

    document.querySelectorAll('.gallery-item[data-type="video"]').forEach(function (item) {
        item.addEventListener('click', function () { openVideo(item); });
    });

    close.addEventListener('click', closeLb);
    lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLb(); });
})();
