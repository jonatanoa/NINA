/* ================================================
   ROCKET MATH GAME — Matemáticas Cohete
   Centro Educativo NINA
   ================================================ */

let rocketGameActive  = false;
let rocketScore       = 0;
let rocketLives       = 5;
const ROCKET_MAX_LIVES = 5;
let rocketStreak      = 0;
let rocketLevel       = 1;
let rocketLastLevel   = 1;
let currentProblem    = {};
let timeLeft          = 100;
let timerInterval     = null;
let shootingStarInterval = null;

// ── STAR FIELD ────────────────────────────────────
function initStarField() {
    const starField = document.getElementById('starField');
    starField.innerHTML = '';
    const sizes = ['small', 'medium', 'large'];
    for (let i = 0; i < 90; i++) {
        const star = document.createElement('div');
        star.className = 'star ' + sizes[Math.floor(Math.random() * sizes.length)];
        star.style.left              = Math.random() * 100 + '%';
        star.style.top               = Math.random() * 100 + '%';
        star.style.animationDelay    = Math.random() * 3 + 's';
        star.style.animationDuration = (1.5 + Math.random() * 3) + 's';
        starField.appendChild(star);
    }
}

function spawnShootingStar() {
    const area = document.getElementById('rocketGameArea');
    if (!area) return;
    const s = document.createElement('div');
    s.className    = 'shooting-star';
    s.style.left   = (Math.random() * 60) + '%';
    s.style.top    = (Math.random() * 40) + '%';
    s.style.transform = `rotate(${30 + Math.random() * 30}deg)`;
    area.appendChild(s);
    setTimeout(() => s.remove(), 1200);
}

// ── VFX HELPERS ───────────────────────────────────
function flashScreen(type) {
    const flash = document.getElementById('screenFlash');
    if (!flash) return;
    flash.className = 'screen-flash ' + type;
    setTimeout(() => { if (flash) flash.className = 'screen-flash'; }, 700);
}

function spawnScorePopup(pts) {
    const area = document.getElementById('rocketGameArea');
    if (!area) return;
    const pop = document.createElement('div');
    pop.className   = 'score-popup';
    pop.textContent = '+' + pts;
    pop.style.left  = '47%';
    pop.style.top   = '52%';
    area.appendChild(pop);
    setTimeout(() => pop.remove(), 1300);
}

function spawnExplosion(x, y, colors) {
    const area = document.getElementById('rocketGameArea');
    if (!area) return;
    colors.forEach((color, i) => {
        setTimeout(() => {
            const p     = document.createElement('div');
            p.className = 'explosion-particle';
            const angle = (Math.PI * 2 / colors.length) * i + Math.random() * 0.5;
            const dist  = 50 + Math.random() * 60;
            p.style.setProperty('--ex', Math.cos(angle) * dist + 'px');
            p.style.setProperty('--ey', Math.sin(angle) * dist + 'px');
            p.style.width    = (6 + Math.random() * 8) + 'px';
            p.style.height   = p.style.width;
            p.style.background = color;
            p.style.left     = x + '%';
            p.style.top      = y + '%';
            p.style.animationDuration = (0.6 + Math.random() * 0.4) + 's';
            area.appendChild(p);
            setTimeout(() => p.remove(), 1000);
        }, i * 20);
    });
}

function showLevelUpBanner(level) {
    const banner = document.getElementById('levelUpBanner');
    if (!banner) return;
    banner.textContent = `⭐ NIVEL ${level} ⭐`;
    banner.classList.add('show');
    flashScreen('gold');
    spawnExplosion(48, 45, ['#FFD700','#FF6B9D','#4ECDC4','#a8ff78','#FF9500','white']);
    setTimeout(() => banner.classList.remove('show'), 2000);
}

function updateLivesDisplay(lostIdx = -1) {
    const display = document.getElementById('livesDisplay');
    display.innerHTML = '';
    for (let i = 0; i < ROCKET_MAX_LIVES; i++) {
        const span = document.createElement('span');
        span.className = 'life-icon';
        if (i >= rocketLives) {
            span.classList.add('lost');
            if (i === rocketLives && lostIdx >= 0) span.classList.add('losing');
        }
        span.textContent = '🚀';
        display.appendChild(span);
    }
}

// ── START / STOP ──────────────────────────────────
function startRocketGame() {
    if (rocketGameActive) { stopRocketGame(); setTimeout(startRocketGame, 100); return; }
    rocketGameActive = true;
    rocketScore      = 0;
    rocketLives      = 5;
    rocketStreak     = 0;
    rocketLevel      = 1;
    rocketLastLevel  = 1;
    initStarField();
    updateRocketStats();
    updateLivesDisplay();
    clearInterval(shootingStarInterval);
    shootingStarInterval = setInterval(spawnShootingStar, 4000);
    document.getElementById('rocketMessage').style.display = 'none';
    document.getElementById('rocket').className = 'rocket-container';
    document.getElementById('screenFlash').className = 'screen-flash';
    generateNewProblem();
}

function stopRocketGame() {
    rocketGameActive = false;
    clearInterval(timerInterval);
    clearInterval(shootingStarInterval);
    document.getElementById('rocketMessage').style.display = 'block';
    document.getElementById('answerButtons').innerHTML = '';
}

function endRocketGame() {
    rocketGameActive = false;
    clearInterval(timerInterval);
    clearInterval(shootingStarInterval);
    showOverlay(
        '🚀', '¡Misión Completada!',
        `Puntos: ${rocketScore} | Nivel: ${rocketLevel}`,
        `🚀 Vidas restantes: ${rocketLives}/5<br>🔥 Mejor racha: ${rocketStreak}<br>⭐ ¡Gran trabajo!`
    );
    document.getElementById('rocketMessage').style.display = 'block';
}

// ── PROBLEM GENERATION ────────────────────────────
function generateNewProblem() {
    if (!rocketGameActive) return;
    let maxNum = 10;
    if (rocketLevel >= 3) maxNum = 20;
    if (rocketLevel >= 5) maxNum = 50;
    if (rocketLevel >= 8) maxNum = 100;

    const isAddition = Math.random() > 0.4;
    let num1 = Math.floor(Math.random() * maxNum) + 1;
    let num2 = Math.floor(Math.random() * maxNum) + 1;
    let answer;

    if (isAddition) {
        answer = num1 + num2;
    } else {
        if (num1 < num2) [num1, num2] = [num2, num1];
        answer = num1 - num2;
    }

    currentProblem = { num1, num2, operation: isAddition ? '+' : '-', answer };
    const operatorColor = isAddition ? 'var(--green)' : 'var(--orange)';
    document.getElementById('problemText').innerHTML =
        `${num1} <span class="operator" style="color:${operatorColor}">${isAddition ? '+' : '-'}</span> ${num2} = ?`;

    const card = document.getElementById('mathProblem');
    card.classList.remove('pop-in');
    void card.offsetWidth;
    card.classList.add('pop-in');

    generateAnswerOptions(answer);
    startTimer();
}

function generateAnswerOptions(correctAnswer) {
    const container = document.getElementById('answerButtons');
    container.innerHTML = '';
    const options = [correctAnswer];
    let attempts = 0;
    while (options.length < 4 && attempts < 50) {
        attempts++;
        const offset = Math.floor(Math.random() * 12) - 6;
        const wrong  = correctAnswer + offset;
        if (wrong >= 0 && wrong !== correctAnswer && !options.includes(wrong)) options.push(wrong);
    }
    options.sort(() => Math.random() - 0.5);
    options.forEach((num, i) => {
        const btn = document.createElement('button');
        btn.className   = 'answer-btn';
        btn.textContent = num;
        btn.style.animationDelay = (i * 0.08) + 's';
        btn.onclick = () => checkAnswer(num, btn);
        container.appendChild(btn);
    });
}

// ── TIMER ────────────────────────────────────────
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 100;
    const timeBar = document.getElementById('timerBar');
    timeBar.classList.remove('danger');
    const baseTime = Math.max(5, 10 - (rocketLevel * 0.4));
    const step     = 100 / (baseTime * 60);
    timerInterval  = setInterval(() => {
        if (!rocketGameActive) { clearInterval(timerInterval); return; }
        timeLeft -= step;
        timeBar.style.width = Math.max(0, timeLeft) + '%';
        if (timeLeft <= 25 && !timeBar.classList.contains('danger')) timeBar.classList.add('danger');
        if (timeLeft <= 0) { clearInterval(timerInterval); handleWrongAnswer(true); }
    }, 16);
}

// ── ANSWER HANDLING ───────────────────────────────
function checkAnswer(selected, btnElement) {
    if (!rocketGameActive) return;
    const correct = selected === currentProblem.answer;
    const rocket  = document.getElementById('rocket');
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);

    if (correct) {
        btnElement.classList.add('correct');
        rocket.classList.add('launching');
        flashScreen('green');

        const timeBonus   = Math.floor(timeLeft / 10);
        const streakBonus = Math.min(rocketStreak * 5, 30);
        const points      = 10 + timeBonus + streakBonus;
        rocketScore  += points;
        rocketStreak++;
        spawnScorePopup(points);
        spawnExplosion(48, 60, ['#FFD700','#11d458','white','#4ECDC4','#a8ff78']);

        if (rocketStreak >= 3) {
            const comboEl = document.getElementById('comboText');
            const icons   = ['🔥','⚡','💫','🌟','🎯'];
            const icon    = icons[Math.min(rocketStreak - 3, icons.length - 1)];
            comboEl.textContent = `¡COMBO x${rocketStreak}! ${icon}`;
            comboEl.classList.remove('show');
            void comboEl.offsetWidth;
            comboEl.classList.add('show');
            setTimeout(() => comboEl.classList.remove('show'), 1500);
        }

        const prevLevel = rocketLastLevel;
        if (rocketScore >= rocketLevel * 60) {
            rocketLevel++;
            if (rocketLevel > prevLevel) {
                rocketLastLevel = rocketLevel;
                setTimeout(() => showLevelUpBanner(rocketLevel), 400);
            }
        }

        const scoreEl = document.getElementById('rocketScore').parentNode;
        scoreEl.classList.remove('score-bump');
        void scoreEl.offsetWidth;
        scoreEl.classList.add('score-bump');
        updateRocketStats();
        setTimeout(() => { rocket.classList.remove('launching'); generateNewProblem(); }, 700);
    } else {
        handleWrongAnswer(false, btnElement, rocket);
    }
}

function handleWrongAnswer(timeOut, btnElement = null, rocket = null) {
    if (!rocket) rocket = document.getElementById('rocket');
    rocketLives--;
    rocketStreak = 0;
    updateLivesDisplay(rocketLives);
    updateRocketStats();
    flashScreen('red');

    if (btnElement) {
        btnElement.classList.add('wrong');
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (parseInt(btn.textContent) === currentProblem.answer) btn.classList.add('correct');
            btn.disabled = true;
        });
    }

    rocket.classList.add('wrong');
    spawnExplosion(48, 60, ['#e74c3c','#c0392b','#ff6b6b','#e74c3c','#ff9500']);

    if (rocketLives <= 0) {
        clearInterval(timerInterval);
        clearInterval(shootingStarInterval);
        setTimeout(() => endRocketGame(), 900);
    } else {
        setTimeout(() => { rocket.classList.remove('wrong'); generateNewProblem(); }, timeOut ? 1500 : 1100);
    }
}

// ── STATS ─────────────────────────────────────────
function updateRocketStats() {
    document.getElementById('rocketScore').textContent  = rocketScore;
    document.getElementById('rocketStreak').textContent = rocketStreak;
    document.getElementById('rocketLevel').textContent  = rocketLevel;
    const streakEl = document.getElementById('rocketStreak').parentNode;
    if (rocketStreak >= 3) streakEl.classList.add('streak-flame');
    else streakEl.classList.remove('streak-flame');
}
