/* ================================================
   GAME MANAGER — Modal fullscreen, tab switching, overlay
   Centro Educativo NINA
   ================================================ */

let activeGameName = null;

// ── GAME MODAL ────────────────────────────────────
function openGame(game) {
    activeGameName = game;
    const modal = document.getElementById('gameModal');

    // Activar tab y panel
    _activateTab(game);

    // Abrir modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Resetear juego al abrir
    if (game === 'memory') restartMemory();
    if (game === 'catch')  stopCatchGame();
    if (game === 'rocket') stopRocketGame();
    if (game === 'simon')  stopSimon();
}

function closeGame() {
    stopCatchGame();
    stopRocketGame();
    stopSimon();
    document.getElementById('gameModal').classList.remove('active');
    document.body.style.overflow = '';
    activeGameName = null;
}

function switchGameTab(game) {
    activeGameName = game;
    _activateTab(game);
    if (game === 'memory') restartMemory();
    if (game === 'catch')  stopCatchGame();
    if (game === 'rocket') stopRocketGame();
    if (game === 'simon')  stopSimon();
}

function _activateTab(game) {
    document.querySelectorAll('.gms-btn').forEach(t => t.classList.remove('active'));
    const tab = document.getElementById('tab-' + game);
    if (tab) tab.classList.add('active');

    document.querySelectorAll('.game-panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById(game + 'Panel');
    if (panel) panel.classList.add('active');
}

function restartCurrentGame() {
    if (activeGameName === 'memory') restartMemory();
    if (activeGameName === 'catch')  startCatchGame();
    if (activeGameName === 'rocket') startRocketGame();
    if (activeGameName === 'simon')  startSimon();
}

// Cerrar con ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('gameModal');
        if (modal && modal.classList.contains('active')) closeGame();
    }
});


// ── OVERLAY ──────────────────────────────────────
function showOverlay(icon, title, message, stats) {
    document.getElementById('overlayIcon').textContent    = icon;
    document.getElementById('overlayTitle').textContent   = title;
    document.getElementById('overlayMessage').textContent = message;
    document.getElementById('overlayStats').innerHTML     = stats
        ? `<p style="margin-top:1rem;color:#666;line-height:1.6">${stats}</p>` : '';
    document.getElementById('gameOverlay').classList.add('active');
}

function closeOverlay() {
    document.getElementById('gameOverlay').classList.remove('active');
}
