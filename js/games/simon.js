/* ================================================
   SIMON SAYS GAME — Secuencias
   Centro Educativo NINA
   ================================================ */

let simonSequence   = [];
let simonPlayerStep = 0;
let simonLevel      = 0;
let simonScore      = 0;
let simonStreak     = 0;
let simonActive     = false;
let simonPlaying    = false;
let simonAudioCtx   = null;

const SIMON_SOUNDS = [262, 330, 392, 523];
const SIMON_EMOJIS = ['🎵','⭐','🔥','💫','🌟','🎯','🚀','🏆'];

// ── AUDIO ─────────────────────────────────────────
function getSimonAudio() {
    if (!simonAudioCtx) simonAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
    return simonAudioCtx;
}

function playSimonSound(freq, duration = 0.25) {
    try {
        const ctx  = getSimonAudio();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.5, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + duration);
    } catch(e) {}
}

function playSimonErrorSound() {
    try {
        const ctx  = getSimonAudio();
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sawtooth'; osc.frequency.value = 110;
        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.5);
    } catch(e) {}
}

function playSimonSuccessSound() {
    [523, 659, 784, 1047].forEach((f, i) => {
        setTimeout(() => playSimonSound(f, 0.18), i * 110);
    });
}

// ── BUTTON EFFECTS ────────────────────────────────
function litSimonBtn(idx, duration = 350) {
    const btn = document.querySelector(`.simon-btn[data-color="${idx}"]`);
    if (!btn) return;
    btn.classList.add('lit');
    playSimonSound(SIMON_SOUNDS[idx], duration / 1000);
    const icon = document.getElementById('simonCenterIcon');
    icon.classList.remove('pulse');
    void icon.offsetWidth;
    icon.classList.add('pulse');
    setTimeout(() => { btn.classList.remove('lit'); icon.classList.remove('pulse'); }, duration);
}

function setSimonMessage(text, type = '') {
    const el = document.getElementById('simonMessage');
    el.textContent = text;
    el.className = 'simon-message' + (type ? ' ' + type : '');
}

function setSimonButtons(disabled) {
    document.querySelectorAll('.simon-btn').forEach(b => {
        if (disabled) b.classList.add('disabled');
        else b.classList.remove('disabled');
    });
}

function updateSimonStats() {
    document.getElementById('simonLevel').textContent    = 'Nivel ' + simonLevel;
    document.getElementById('simonScore').textContent    = simonScore;
    document.getElementById('simonStreak').textContent   = simonStreak;
    document.getElementById('simonStepDisplay').textContent =
        simonActive ? (!simonPlaying ? `${simonPlayerStep}/${simonSequence.length}` : '') : '';
}

// ── GAME FLOW ─────────────────────────────────────
function startSimon() {
    simonSequence   = [];
    simonPlayerStep = 0;
    simonLevel      = 0;
    simonScore      = 0;
    simonStreak     = 0;
    simonActive     = true;
    document.getElementById('simonStartBtn').textContent = '🔄 Reiniciar';
    setSimonMessage('¡Prepárate!');
    updateSimonStats();

    const icon = document.getElementById('simonCenterIcon');
    icon.textContent = '3';
    setTimeout(() => { icon.textContent = '2'; }, 600);
    setTimeout(() => { icon.textContent = '1'; }, 1200);
    setTimeout(() => { icon.textContent = '🎵'; nextSimonRound(); }, 1800);
}

function stopSimon() {
    simonActive  = false;
    simonPlaying = false;
    setSimonButtons(false);
    setSimonMessage('Pulsa ▶️ para empezar');
    document.getElementById('simonCenterIcon').textContent  = '🎵';
    document.getElementById('simonStepDisplay').textContent = '';
    document.getElementById('simonStartBtn').textContent    = '▶️ Comenzar';
}

function nextSimonRound() {
    if (!simonActive) return;
    simonLevel++;
    simonPlayerStep = 0;
    simonPlaying    = true;
    simonSequence.push(Math.floor(Math.random() * 4));
    setSimonButtons(true);
    setSimonMessage(`👀 Observa la secuencia… (${simonSequence.length} pasos)`);
    updateSimonStats();

    const delay   = Math.max(300, 700 - simonLevel * 30);
    const litTime = Math.max(200, 450 - simonLevel * 20);
    let i = 0;
    const interval = setInterval(() => {
        if (!simonActive) { clearInterval(interval); return; }
        litSimonBtn(simonSequence[i], litTime);
        i++;
        if (i >= simonSequence.length) {
            clearInterval(interval);
            setTimeout(() => {
                if (!simonActive) return;
                simonPlaying = false;
                setSimonButtons(false);
                setSimonMessage(`🎯 ¡Tu turno! Paso 1/${simonSequence.length}`);
                updateSimonStats();
            }, litTime + 200);
        }
    }, delay + litTime);
}

// ── PLAYER INPUT ──────────────────────────────────
function handleSimonClick(idx) {
    if (!simonActive || simonPlaying) return;
    litSimonBtn(idx, 250);
    const btn = document.querySelector(`.simon-btn[data-color="${idx}"]`);

    if (idx === simonSequence[simonPlayerStep]) {
        // Correct!
        btn.classList.add('player-correct');
        setTimeout(() => btn.classList.remove('player-correct'), 350);
        simonPlayerStep++;
        setSimonMessage(`✅ ¡Bien! Paso ${simonPlayerStep}/${simonSequence.length}`);

        if (simonPlayerStep >= simonSequence.length) {
            simonStreak++;
            const bonus  = simonStreak >= 3 ? simonStreak * 5 : 0;
            const points = simonLevel * 10 + bonus;
            simonScore  += points;
            updateSimonStats();

            const badges = document.querySelectorAll('.simon-stat-badge');
            badges.forEach(b => { b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); });

            const icon = document.getElementById('simonCenterIcon');
            icon.textContent = SIMON_EMOJIS[Math.min(simonStreak - 1, SIMON_EMOJIS.length - 1)] || '🌟';
            icon.classList.remove('pulse'); void icon.offsetWidth; icon.classList.add('pulse');
            playSimonSuccessSound();

            if (simonStreak >= 3) setSimonMessage(`🔥 ¡COMBO x${simonStreak}! +${points} pts`);
            else setSimonMessage(`🎉 ¡Perfecto! +${points} pts. Siguiente nivel…`);

            setSimonButtons(true);
            setTimeout(() => nextSimonRound(), 1400);
        }
    } else {
        // Wrong!
        simonActive = false;
        setSimonButtons(true);
        btn.classList.add('player-wrong');
        setTimeout(() => btn.classList.remove('player-wrong'), 500);

        document.querySelectorAll('.simon-btn').forEach(b => {
            b.style.filter = 'brightness(0.4)';
            setTimeout(() => b.style.filter = '', 500);
        });

        const icon = document.getElementById('simonCenterIcon');
        icon.textContent = '😢';
        playSimonErrorSound();
        setSimonMessage('❌ ¡Error! Inténtalo de nuevo', 'error');
        document.getElementById('simonStepDisplay').textContent = '';

        setTimeout(() => {
            document.getElementById('simonStartBtn').textContent = '🔄 Jugar de nuevo';
            showOverlay('😢', '¡Ups!', `Nivel alcanzado: ${simonLevel}`, `⭐ Puntos: ${simonScore}<br>🔥 Mejor racha: ${simonStreak}`);
        }, 800);
    }
}

// ── INIT LISTENERS ────────────────────────────────
function initSimonGame() {
    document.querySelectorAll('.simon-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            handleSimonClick(parseInt(btn.dataset.color));
        });
    });
}

initSimonGame();
