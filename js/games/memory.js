/* ================================================
   MEMORY GAME
   Centro Educativo NINA
   ================================================ */

const MEMORY_LEVELS = {
    1: { cols: 4, pairs: 6,  label: 'Fácil'  },
    2: { cols: 4, pairs: 8,  label: 'Medio'  },
    3: { cols: 5, pairs: 10, label: 'Difícil' }
};
const ALL_MEMORY_EMOJIS = ['📚','🎨','🔬','🎭','🎵','🚀','🌟','🧩','🦋','🎯'];

let memoryLevel   = 1;
let memoryCards   = [];
let flippedCards  = [];
let matchedPairs  = 0;
let memoryMoves   = 0;
let memorySeconds = 0;
let memoryTimer   = null;
let memoryStarted = false;
let memoryBlocked = false;

// ── LEVEL SELECTOR ───────────────────────────────
function setMemoryLevel(lvl) {
    memoryLevel = lvl;
    document.querySelectorAll('.mem-lvl-btn').forEach(b => {
        b.classList.toggle('active', parseInt(b.dataset.lvl) === lvl);
    });
    restartMemory();
}

// ── INIT BOARD ────────────────────────────────────
function initMemory() {
    const cfg   = MEMORY_LEVELS[memoryLevel];
    const board = document.getElementById('memoryBoard');
    board.innerHTML = '';
    board.className = `memory-board lvl-${memoryLevel}`;

    const emojis = ALL_MEMORY_EMOJIS.slice(0, cfg.pairs);
    memoryCards  = [...emojis, ...emojis].sort(() => Math.random() - 0.5);

    matchedPairs  = 0;
    memoryMoves   = 0;
    memorySeconds = 0;
    memoryStarted = false;
    memoryBlocked = false;
    flippedCards  = [];
    clearInterval(memoryTimer);

    document.getElementById('memoryVictory').textContent   = '';
    document.getElementById('memoryTotalPairs').textContent = cfg.pairs;
    updateMemoryStats();

    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.style.opacity   = '0';
        card.style.transform = 'scale(0.5) rotateY(90deg)';
        card.innerHTML = `<div class="card-back"></div><div class="card-front"><span class="card-emoji">${emoji}</span></div>`;

        setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.68,-0.55,0.265,1.55)';
            card.style.opacity    = '1';
            card.style.transform  = '';
        }, 50 + index * 50);

        card.addEventListener('click', () => flipMemoryCard(card, emoji));
        board.appendChild(card);
    });
}

// ── FLIP CARD ─────────────────────────────────────
function flipMemoryCard(card, emoji) {
    if (memoryBlocked || flippedCards.length >= 2 ||
        card.classList.contains('flipped') || card.classList.contains('matched')) return;

    if (!memoryStarted) {
        memoryStarted = true;
        memoryTimer   = setInterval(() => { memorySeconds++; updateMemoryStats(); }, 1000);
    }

    card.classList.add('flipped');
    flippedCards.push({ card, emoji });

    if (flippedCards.length === 2) {
        memoryMoves++;
        updateMemoryStats();
        memoryBlocked = true;
        checkMemoryMatch();
    }
}

// ── CHECK MATCH ───────────────────────────────────
function checkMemoryMatch() {
    const [first, second] = flippedCards;
    const match = first.emoji === second.emoji;
    const cfg   = MEMORY_LEVELS[memoryLevel];

    if (match) {
        setTimeout(() => {
            first.card.classList.add('matched');
            second.card.classList.add('matched');
            spawnMemorySparkles(first.card);
            spawnMemorySparkles(second.card);
            matchedPairs++;
            flippedCards  = [];
            memoryBlocked = false;
            updateMemoryStats();

            if (matchedPairs === cfg.pairs) {
                clearInterval(memoryTimer);
                const mins = Math.floor(memorySeconds / 60);
                const secs = (memorySeconds % 60).toString().padStart(2, '0');
                document.getElementById('memoryVictory').textContent =
                    `🏆 ¡Completado! ${memoryMoves} movimientos · ⏱️ ${mins}:${secs}`;
                setTimeout(() => {
                    showOverlay('🏆', '¡Completado!', `${memoryMoves} movimientos`, `Tiempo: ${mins}:${secs}`);
                }, 600);
            }
        }, 400);
    } else {
        first.card.classList.add('no-match');
        second.card.classList.add('no-match');
        setTimeout(() => {
            first.card.classList.remove('flipped', 'no-match');
            second.card.classList.remove('flipped', 'no-match');
            flippedCards  = [];
            memoryBlocked = false;
        }, 900);
    }
}

// ── SPARKLES ──────────────────────────────────────
function spawnMemorySparkles(card) {
    const sparkles  = ['✨','⭐','💫','🌟','💥'];
    const rect      = card.getBoundingClientRect();
    const boardRect = document.getElementById('memoryBoard').getBoundingClientRect();

    for (let i = 0; i < 5; i++) {
        const s  = document.createElement('div');
        s.className   = 'memory-sparkle';
        s.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        const tx = (Math.random() - 0.5) * 80;
        const ty = -40 - Math.random() * 40;
        s.style.setProperty('--tx', tx + 'px');
        s.style.setProperty('--ty', ty + 'px');
        s.style.left         = (rect.left - boardRect.left + rect.width  / 2) + 'px';
        s.style.top          = (rect.top  - boardRect.top  + rect.height / 2) + 'px';
        s.style.animationDelay = (i * 0.08) + 's';
        document.getElementById('memoryBoard').appendChild(s);
        setTimeout(() => s.remove(), 1000);
    }
}

// ── STATS ─────────────────────────────────────────
function updateMemoryStats() {
    const mins = Math.floor(memorySeconds / 60);
    const secs = (memorySeconds % 60).toString().padStart(2, '0');
    document.getElementById('memoryTimer').textContent = `${mins}:${secs}`;
    document.getElementById('memoryMoves').textContent  = memoryMoves;
    document.getElementById('memoryPairs').textContent  = matchedPairs;
}

// ── RESTART ───────────────────────────────────────
function restartMemory() { clearInterval(memoryTimer); initMemory(); }
