/* ================================================
   CATCH GAME — Atrapa la Fruta
   Centro Educativo NINA
   ================================================ */

let catchGameActive   = false;
let catchScore        = 0;
let catchLives        = 3;
const MAX_LIVES       = 5;
let catchLevel        = 1;
let catchItems        = [];
let catchSpawnInterval = null;
let catchGameLoop     = null;
let catchBasketX      = 0;
let catchTargetX      = 0;

const CATCH_ITEMS_GOOD = [
    { emoji: '🍎', points: 10 }, { emoji: '🍌', points: 15 },
    { emoji: '🍇', points: 20 }, { emoji: '📚', points: 25 },
    { emoji: '⭐', points: 50 }, { emoji: '🍓', points: 12 },
    { emoji: '🍊', points: 18 }
];
const CATCH_ITEMS_BAD = [
    { emoji: '💣', label: 'bomba'  }, { emoji: '🌶️', label: 'chile' },
    { emoji: '💣', label: 'bomba'  }, { emoji: '🌶️', label: 'chile' },
    { emoji: '💀', label: 'calavera' }
];

// ── START / STOP ──────────────────────────────────
function startCatchGame() {
    if (catchGameActive) stopCatchGame();
    catchGameActive = true;
    catchScore      = 0;
    catchLives      = 3;
    catchLevel      = 1;
    catchItems      = [];

    const gameArea = document.getElementById('catchGameArea');
    const basket   = document.getElementById('catchBasket');
    catchBasketX   = gameArea.offsetWidth / 2 - 26;
    catchTargetX   = catchBasketX;
    basket.textContent    = '🧺';
    basket.style.fontSize = '2.8rem';
    basket.style.transform = `translateX(${catchBasketX}px)`;

    updateCatchStats();
    document.getElementById('catchMessage').style.display = 'none';
    document.querySelectorAll('.falling-item, .heart-popup').forEach(el => el.remove());

    catchSpawnInterval = setInterval(spawnCatchItem, 1500);
    catchGameLoop      = requestAnimationFrame(updateCatchGame);
    setupCatchControls();
}

function stopCatchGame() {
    catchGameActive = false;
    clearInterval(catchSpawnInterval);
    cancelAnimationFrame(catchGameLoop);
    document.querySelectorAll('.falling-item, .heart-popup').forEach(el => el.remove());
    catchItems = [];
    const gameArea = document.getElementById('catchGameArea');
    if (gameArea._catchCleanup) { gameArea._catchCleanup(); gameArea._catchCleanup = null; }
    document.getElementById('catchMessage').style.display = 'block';
}

function endCatchGame(won) {
    catchGameActive = false;
    clearInterval(catchSpawnInterval);
    cancelAnimationFrame(catchGameLoop);
    catchItems.forEach(item => item.remove());
    catchItems = [];
    showOverlay(
        won || catchScore > 0 ? '🏆' : '💔',
        won || catchScore > 0 ? '¡Excelente!' : '¡Inténtalo de nuevo!',
        `Puntos: ${catchScore}`,
        `Nivel: ${catchLevel} | Vidas: ${catchLives}`
    );
    document.getElementById('catchMessage').style.display = 'block';
}

// ── CONTROLS ─────────────────────────────────────
function setupCatchControls() {
    const gameArea = document.getElementById('catchGameArea');
    const onMouseMove = (e) => {
        if (!catchGameActive) return;
        const rect = gameArea.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left - 26, rect.width - 52));
        catchTargetX = x;
        catchBasketX = x; // snap instantly on mouse — zero lag
    };
    const onTouchMove = (e) => {
        if (!catchGameActive) return;
        e.preventDefault();
        const rect = gameArea.getBoundingClientRect();
        catchTargetX = Math.max(0, Math.min(e.touches[0].clientX - rect.left - 26, rect.width - 52));
    };
    const onKeyDown = (e) => {
        if (!catchGameActive) return;
        const step = 48;
        if (e.key === 'ArrowLeft')  catchTargetX = Math.max(0, catchTargetX - step);
        if (e.key === 'ArrowRight') catchTargetX = Math.min(gameArea.offsetWidth - 52, catchTargetX + step);
    };
    document.addEventListener('mousemove', onMouseMove);
    gameArea.addEventListener('touchmove', onTouchMove, { passive: false });
    document.addEventListener('keydown', onKeyDown);
    gameArea._catchCleanup = () => {
        document.removeEventListener('mousemove', onMouseMove);
        gameArea.removeEventListener('touchmove', onTouchMove);
        document.removeEventListener('keydown', onKeyDown);
    };
}

// ── SPAWN ITEMS ───────────────────────────────────
function spawnCatchItem() {
    if (!catchGameActive) return;
    const gameArea     = document.getElementById('catchGameArea');
    const item         = document.createElement('div');
    const rand         = Math.random();
    const levelDuration = Math.max(1.3, 3.4 - (catchLevel * 0.18));
    const heartDuration = Math.min(levelDuration * 0.55, 1.1);
    let fallDuration;

    if (rand < 0.08) {
        item.className     = 'falling-item heart';
        item.textContent   = '❤️';
        item.dataset.type   = 'heart';
        item.dataset.points = '0';
        fallDuration        = heartDuration;
        item.style.animation = `fallLinear ${fallDuration}s linear forwards, heartPulse 0.35s ease infinite`;
    } else if (rand < 0.53) {
        const bad          = CATCH_ITEMS_BAD[Math.floor(Math.random() * CATCH_ITEMS_BAD.length)];
        item.className     = 'falling-item bad-item';
        item.textContent   = bad.emoji;
        item.dataset.type   = 'bad';
        item.dataset.points = '0';
        item.dataset.label  = bad.label;
        fallDuration        = levelDuration;
        item.style.animation = `fallLinear ${fallDuration}s linear forwards, badPulse 0.5s ease infinite`;
    } else {
        const good         = CATCH_ITEMS_GOOD[Math.floor(Math.random() * CATCH_ITEMS_GOOD.length)];
        item.className     = 'falling-item';
        item.textContent   = good.emoji;
        item.dataset.type   = 'good';
        item.dataset.points = good.points;
        fallDuration        = levelDuration;
        item.style.animation = `fallLinear ${fallDuration}s linear forwards`;
    }

    item.style.left = Math.random() * (gameArea.offsetWidth - 55) + 'px';
    item.style.top  = '-55px';
    gameArea.appendChild(item);
    catchItems.push(item);
    setTimeout(() => {
        if (item.parentNode) { item.remove(); catchItems = catchItems.filter(i => i !== item); }
    }, fallDuration * 1000 + 100);
}

// ── GAME LOOP ─────────────────────────────────────
function updateCatchGame() {
    if (!catchGameActive) return;
    const basket   = document.getElementById('catchBasket');
    catchBasketX  += (catchTargetX - catchBasketX) * 0.55;
    basket.style.transform = `translateX(${catchBasketX}px)`;

    const gameArea   = document.getElementById('catchGameArea');
    const areaRect   = gameArea.getBoundingClientRect();
    const BASKET_W   = 52, BASKET_PAD = 4;
    const basketLeft = catchBasketX + BASKET_PAD;
    const basketRight = catchBasketX + BASKET_W - BASKET_PAD;
    const basketTop  = areaRect.height - 78;
    const basketBottom = areaRect.height - 12;

    for (let i = catchItems.length - 1; i >= 0; i--) {
        const item = catchItems[i];
        if (!item.parentNode) { catchItems.splice(i, 1); continue; }
        const itemRect   = item.getBoundingClientRect();
        const itemLeft   = itemRect.left   - areaRect.left;
        const itemRight  = itemRect.right  - areaRect.left;
        const itemBottom = itemRect.bottom - areaRect.top;
        const itemTop    = itemRect.top    - areaRect.top;

        const overlap = !(itemRight < basketLeft || itemLeft > basketRight || itemBottom < basketTop || itemTop > basketBottom);
        if (overlap) {
            const type = item.dataset.type;
            const cx   = itemLeft + (itemRight - itemLeft) / 2;
            const cy   = itemTop;

            if (type === 'heart') {
                if (catchLives < MAX_LIVES) { catchLives++; showHeartPopup(cx, cy); }
                else { catchScore += 30; spawnCatchScorePopup('+30', cx, cy, '#FFD700'); }
            } else if (type === 'good') {
                const pts = parseInt(item.dataset.points);
                catchScore += pts;
                if (catchScore >= catchLevel * 100) { catchLevel++; spawnCatchLevelUp(); }
                spawnCatchScorePopup('+' + pts, cx, cy, '#11d458');
                spawnCatchBurst(cx, cy, ['#11d458','#FFD700','#4ECDC4','white']);
            } else if (type === 'bad') {
                catchLives--;
                basket.style.filter = 'brightness(0.3) saturate(3)';
                setTimeout(() => basket.style.filter = '', 400);
                spawnCatchBurst(cx, cy, ['#e74c3c','#FF9500','#c0392b','#ff6b6b']);
                flashCatchArea();
            }

            item.remove();
            catchItems.splice(i, 1);
            updateCatchStats();
            if (catchLives <= 0) { endCatchGame(false); return; }
        }
    }
    catchGameLoop = requestAnimationFrame(updateCatchGame);
}

// ── HELPERS ───────────────────────────────────────
function spawnCatchScorePopup(text, x, y, color) {
    const gameArea = document.getElementById('catchGameArea');
    const p = document.createElement('div');
    p.style.cssText = `position:absolute;left:${x}px;top:${y}px;font-family:'Fredoka',sans-serif;font-size:1.5rem;font-weight:700;color:${color};pointer-events:none;z-index:20;text-shadow:0 2px 4px rgba(0,0,0,0.5);animation:catchScorePop 1s ease forwards;`;
    p.textContent = text;
    gameArea.appendChild(p);
    setTimeout(() => p.remove(), 1100);
}

function spawnCatchBurst(x, y, colors) {
    const gameArea = document.getElementById('catchGameArea');
    colors.forEach((color, i) => {
        const p = document.createElement('div');
        const angle = (Math.PI * 2 / colors.length) * i;
        const dist  = 30 + Math.random() * 30;
        p.style.cssText = `position:absolute;width:10px;height:10px;border-radius:50%;background:${color};left:${x}px;top:${y}px;pointer-events:none;z-index:15;transform:translate(-5px,-5px);animation:catchBurst 0.6s ease forwards;--bx:${Math.cos(angle)*dist}px;--by:${Math.sin(angle)*dist}px;`;
        gameArea.appendChild(p);
        setTimeout(() => p.remove(), 700);
    });
}

function flashCatchArea() {
    const gameArea = document.getElementById('catchGameArea');
    gameArea.style.boxShadow = '0 0 0 6px #e74c3c inset, 0 0 30px rgba(231,76,60,0.6)';
    setTimeout(() => { gameArea.style.boxShadow = ''; }, 400);
}

function spawnCatchLevelUp() {
    const gameArea = document.getElementById('catchGameArea');
    const banner   = document.createElement('div');
    banner.style.cssText = `position:absolute;top:35%;left:50%;transform:translateX(-50%) scale(0);background:linear-gradient(135deg,#FFD700,#FF6B9D);color:white;font-family:'Fredoka',sans-serif;font-size:1.8rem;font-weight:700;padding:0.8rem 2rem;border-radius:20px;z-index:25;pointer-events:none;white-space:nowrap;box-shadow:0 5px 20px rgba(0,0,0,0.4);animation:catchLvlUp 1.5s ease forwards;`;
    banner.textContent = `⭐ ¡Nivel ${catchLevel}! ⭐`;
    gameArea.appendChild(banner);
    setTimeout(() => banner.remove(), 1600);
}

function showHeartPopup(x, y) {
    const popup = document.createElement('div');
    popup.className   = 'heart-popup';
    popup.textContent = '+❤️';
    popup.style.left  = x + 'px';
    popup.style.top   = y + 'px';
    document.getElementById('catchGameArea').appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
}

function updateCatchStats() {
    document.getElementById('catchScore').textContent = catchScore;
    document.getElementById('catchLives').textContent = `${catchLives}/${MAX_LIVES}`;
    document.getElementById('catchLevel').textContent = catchLevel;
}
