// =========================
// GAME STATE
// =========================
let currentGame = null;

// Reaction Game Variables
let reactionStartTime = null;
let reactionTimeout = null;
let reactionTimes = [];
let reactionAttempts = 0;
let reactionBest = Infinity;

// Memory Game Variables
let memorySequence = [];
let memoryPlayerSequence = [];
let memoryLevel = 1;
let memoryBest = 1;
let memoryShowingSequence = false;

// Focus Game Variables
let focusScore = 0;
let focusBest = 0;
let focusTimeLeft = 30;
let focusInterval = null;
let focusTargetTimeout = null;
let focusHits = 0;
let focusMisses = 0;

// BLOCKS Game Variables
let blocksRound = 1;
let blocksMaxRounds = 5;
let blocksScore = 0;
let blocksCount = 0;
let blocksActiveBlocks = [];
let blocksSolution = 0;
let blocksCorrectAnswers = 0;
let blocksCanvas = null;
let blocksCtx = null;

// =========================
// NAVIGATION
// =========================
function startGame(gameName) {
    document.getElementById('menu').style.display = 'none';
    currentGame = gameName;
    
    if (gameName === 'reaction') {
        document.getElementById('reaction-game').classList.add('active');
        resetReactionGame();
    } else if (gameName === 'memory') {
        document.getElementById('memory-game').classList.add('active');
        initMemoryGame();
    } else if (gameName === 'focus') {
        document.getElementById('focus-game').classList.add('active');
        startFocusGame();
    } else if (gameName === 'blocks') {
        document.getElementById('blocks-game').classList.add('active');
        initBlocksGame();
    }
}

function backToMenu() {
    document.querySelectorAll('.game-area').forEach(area => {
        area.classList.remove('active');
    });
    document.getElementById('menu').style.display = 'grid';
    
    // Clean up
    if (currentGame === 'reaction') {
        clearTimeout(reactionTimeout);
    } else if (currentGame === 'focus') {
        clearInterval(focusInterval);
        clearTimeout(focusTargetTimeout);
    }
    
    currentGame = null;
}

// =========================
// REACTION GAME
// =========================
function resetReactionGame() {
    const zone = document.getElementById('reaction-zone');
    zone.className = 'reaction-zone';
    zone.textContent = 'Cliquez pour commencer';
    document.getElementById('reaction-instruction').textContent = 'Cliquez pour commencer le test de réaction !';
    reactionStartTime = null;
}

function handleReactionClick() {
    const zone = document.getElementById('reaction-zone');
    
    if (!zone.classList.contains('ready') && reactionStartTime === null) {
        zone.textContent = 'Attendez...';
        zone.style.cursor = 'wait';
        const delay = Math.random() * 3000 + 2000;
        
        reactionTimeout = setTimeout(() => {
            zone.classList.add('ready');
            zone.textContent = 'CLIQUEZ MAINTENANT !';
            zone.style.cursor = 'pointer';
            reactionStartTime = Date.now();
            document.getElementById('reaction-instruction').textContent = 'CLIQUEZ MAINTENANT !';
        }, delay);
    } else if (zone.classList.contains('ready') && reactionStartTime !== null) {
        const reactionTime = Date.now() - reactionStartTime;
        reactionTimes.push(reactionTime);
        reactionAttempts++;
        
        if (reactionTime < reactionBest) {
            reactionBest = reactionTime;
        }
        
        const average = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
        
        document.getElementById('reaction-score').textContent = `Dernier: ${reactionTime}ms (Meilleur: ${reactionBest}ms)`;
        document.getElementById('reaction-attempts').textContent = reactionAttempts;
        document.getElementById('reaction-average').textContent = `${average}ms`;
        document.getElementById('reaction-instruction').textContent = `Excellent ! Temps de réaction: ${reactionTime}ms`;
        
        setTimeout(resetReactionGame, 1500);
    } else {
        clearTimeout(reactionTimeout);
        zone.textContent = 'Trop tôt ! Réessayez';
        zone.style.cursor = 'pointer';
        document.getElementById('reaction-instruction').textContent = 'Trop tôt ! Attendez que la zone devienne verte.';
        setTimeout(resetReactionGame, 1500);
    }
}

// =========================
// MEMORY GAME
// =========================
function initMemoryGame() {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    for (let i = 0; i < 16; i++) {
        const cell = document.createElement('div');
        cell.className = 'memory-cell';
        cell.dataset.index = i;
        cell.onclick = () => handleMemoryClick(i);
        grid.appendChild(cell);
    }
    memoryLevel = 1;
    memorySequence = [];
    memoryPlayerSequence = [];
    document.getElementById('memory-current').textContent = memorySequence.length;
    startMemoryRound();
}

function startMemoryRound() {
    memoryShowingSequence = true;
    memoryPlayerSequence = [];
    memorySequence.push(Math.floor(Math.random() * 16));
    
    document.getElementById('memory-score').textContent = `Niveau: ${memoryLevel}`;
    document.getElementById('memory-current').textContent = memorySequence.length;
    document.getElementById('memory-instruction').textContent = 'Observez la séquence...';
    
    showMemorySequence();
}

function showMemorySequence() {
    const cells = document.querySelectorAll('.memory-cell');
    let index = 0;
    
    const showNext = () => {
        if (index < memorySequence.length) {
            const cellIndex = memorySequence[index];
            cells[cellIndex].classList.add('active');
            
            setTimeout(() => {
                cells[cellIndex].classList.remove('active');
                index++;
                setTimeout(showNext, 300);
            }, 600);
        } else {
            memoryShowingSequence = false;
            document.getElementById('memory-instruction').textContent = 'À votre tour ! Reproduisez la séquence.';
        }
    };
    
    setTimeout(showNext, 500);
}

function handleMemoryClick(index) {
    if (memoryShowingSequence) return;
    
    const cells = document.querySelectorAll('.memory-cell');
    cells[index].classList.add('active');
    
    setTimeout(() => {
        cells[index].classList.remove('active');
    }, 300);
    
    memoryPlayerSequence.push(index);
    
    const currentIndex = memoryPlayerSequence.length - 1;
    
    if (memoryPlayerSequence[currentIndex] !== memorySequence[currentIndex]) {
        cells[index].classList.add('error');
        setTimeout(() => cells[index].classList.remove('error'), 500);
        document.getElementById('memory-instruction').textContent = `Erreur ! Vous avez atteint le niveau ${memoryLevel}`;
        
        if (memoryLevel > memoryBest) {
            memoryBest = memoryLevel;
            document.getElementById('memory-best').textContent = memoryBest;
        }
        
        setTimeout(initMemoryGame, 2000);
    } else if (memoryPlayerSequence.length === memorySequence.length) {
        memoryLevel++;
        document.getElementById('memory-instruction').textContent = 'Parfait ! Niveau suivant...';
        setTimeout(startMemoryRound, 1500);
    }
}

// =========================
// FOCUS GAME
// =========================
function startFocusGame() {
    focusScore = 0;
    focusTimeLeft = 30;
    focusHits = 0;
    focusMisses = 0;
    document.getElementById('focus-score').textContent = 'Score: 0';
    document.getElementById('focus-timer').textContent = '30';
    document.getElementById('focus-accuracy').textContent = '100%';
    
    const canvas = document.getElementById('focus-canvas');
    canvas.onclick = (e) => {
        if (e.target === canvas) {
            focusMisses++;
            updateFocusAccuracy();
        }
    };
    
    focusInterval = setInterval(() => {
        focusTimeLeft--;
        document.getElementById('focus-timer').textContent = focusTimeLeft;
        
        if (focusTimeLeft <= 0) {
            endFocusGame();
        }
    }, 1000);
    
    spawnFocusTarget();
}

function spawnFocusTarget() {
    if (focusTimeLeft <= 0) return;
    
    const canvas = document.getElementById('focus-canvas');
    const existingTargets = canvas.querySelectorAll('.focus-target');
    existingTargets.forEach(t => t.remove());
    
    const target = document.createElement('div');
    target.className = 'focus-target';
    
    const maxX = canvas.offsetWidth - 80;
    const maxY = canvas.offsetHeight - 80;
    const x = Math.random() * maxX;
    const y = Math.random() * maxY;
    
    target.style.left = x + 'px';
    target.style.top = y + 'px';
    
    target.onclick = (e) => {
        e.stopPropagation();
        focusScore += 10;
        focusHits++;
        document.getElementById('focus-score').textContent = `Score: ${focusScore}`;
        target.remove();
        updateFocusAccuracy();
        spawnFocusTarget();
    };
    
    canvas.appendChild(target);
    
    focusTargetTimeout = setTimeout(() => {
        if (target.parentNode) {
            target.remove();
            focusMisses++;
            updateFocusAccuracy();
            spawnFocusTarget();
        }
    }, 1500);
}

function updateFocusAccuracy() {
    const total = focusHits + focusMisses;
    const accuracy = total > 0 ? Math.round((focusHits / total) * 100) : 100;
    document.getElementById('focus-accuracy').textContent = accuracy + '%';
}

function endFocusGame() {
    clearInterval(focusInterval);
    clearTimeout(focusTargetTimeout);
    
    const canvas = document.getElementById('focus-canvas');
    const targets = canvas.querySelectorAll('.focus-target');
    targets.forEach(t => t.remove());
    
    if (focusScore > focusBest) {
        focusBest = focusScore;
        document.getElementById('focus-best').textContent = focusBest;
    }
    
    document.getElementById('focus-instruction').textContent = `Terminé ! Score final: ${focusScore} points`;
    
    setTimeout(() => {
        if (confirm('Rejouer ?')) {
            startFocusGame();
        }
    }, 1000);
}

// =========================
// BLOCKS GAME
// =========================
function initBlocksGame() {
    blocksCanvas = document.getElementById('blocks-canvas');
    blocksCtx = blocksCanvas.getContext('2d');
    
    const wrapper = document.getElementById('blocks-canvas-wrapper');
    blocksCanvas.width = wrapper.offsetWidth - 40;
    blocksCanvas.height = 400;
    
    blocksRound = 1;
    blocksScore = 0;
    blocksCount = 0;
    blocksCorrectAnswers = 0;
    
    document.getElementById('blocks-counter').textContent = '0';
    document.getElementById('blocks-round').textContent = '1';
    document.getElementById('blocks-total').textContent = '0';
    document.getElementById('blocks-accuracy').textContent = '--';
    
    // Counter controls
    const counter = document.getElementById('blocks-counter');
    counter.onclick = () => {
        blocksCount++;
        counter.textContent = blocksCount;
    };
    counter.oncontextmenu = (e) => {
        e.preventDefault();
        if (blocksCount > 0) blocksCount--;
        counter.textContent = blocksCount;
    };
    
    // Submit button
    document.getElementById('blocks-submit').onclick = () => {
        submitBlocksAnswer();
    };
    
    startBlocksRound();
}

function startBlocksRound() {
    blocksCount = 0;
    document.getElementById('blocks-counter').textContent = '0';
    document.getElementById('blocks-score').textContent = `Score: ${blocksScore} | Round: ${blocksRound}/${blocksMaxRounds}`;
    document.getElementById('blocks-round').textContent = blocksRound;
    document.getElementById('blocks-instruction').textContent = 'Observez bien les blocs...';
    
    blocksActiveBlocks = generateRandomGrid();
    blocksSolution = blocksActiveBlocks.length;
    
    drawBlocksGrid(blocksActiveBlocks);
    
    setTimeout(() => {
        clearBlocksCanvas();
        document.getElementById('blocks-instruction').textContent = 'Combien de blocs avez-vous vu ? Cliquez pour compter.';
    }, 2000);
}

function generateRandomGrid() {
    const totalCells = 24;
    const minBlocks = 3;
    const maxBlocks = 12;
    
    const numBlocks = Math.floor(Math.random() * (maxBlocks - minBlocks + 1)) + minBlocks;
    
    const activeBlocks = [];
    const available = Array.from({ length: totalCells }, (_, i) => i);
    
    for (let i = 0; i < numBlocks; i++) {
        const randomIndex = Math.floor(Math.random() * available.length);
        activeBlocks.push(available[randomIndex]);
        available.splice(randomIndex, 1);
    }
    
    return activeBlocks.sort((a, b) => a - b);
}

function clearBlocksCanvas() {
    blocksCtx.clearRect(0, 0, blocksCanvas.width, blocksCanvas.height);
    blocksCtx.fillStyle = '#0f0f0f';
    blocksCtx.fillRect(0, 0, blocksCanvas.width, blocksCanvas.height);
}

function drawBlocksGrid(active = []) {
    const cols = 6;
    const rows = 4;

    clearBlocksCanvas();

    const blockSize = Math.min(blocksCanvas.width / (cols + rows + 2), blocksCanvas.height / (rows + 3)) * 1.5;

    const offsetX = -cols / 2;
    const offsetY = -rows / 2;

    blocksCtx.save();
    blocksCtx.translate(blocksCanvas.width / 2, blocksCanvas.height / 2 + blockSize * 0.2);

    // Draw floor
    drawIsometricFloor(cols, rows, blockSize, offsetX, offsetY);

    // Sort blocks by depth
    const sortedBlocks = [];
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const idx = r * cols + c;
            if (active.includes(idx)) {
                sortedBlocks.push({ row: r, col: c, depth: r + c, idx });
            }
        }
    }
    
    sortedBlocks.sort((a, b) => a.depth - b.depth);

    // Draw shadows
    blocksCtx.globalAlpha = 0.25;
    for (const block of sortedBlocks) {
        const x = offsetX + block.col;
        const y = offsetY + block.row;
        const isoX = (x - y) * (blockSize / 2);
        const isoY = (x + y) * (blockSize / 4);
        
        blocksCtx.fillStyle = "#000";
        blocksCtx.beginPath();
        blocksCtx.ellipse(isoX, isoY + blockSize / 3.5, blockSize * 0.35, blockSize * 0.18, 0, 0, Math.PI * 2);
        blocksCtx.fill();
    }
    blocksCtx.globalAlpha = 1.0;

    // Draw blocks
    for (const block of sortedBlocks) {
        const x = offsetX + block.col;
        const y = offsetY + block.row;
        drawIsometricBlock(x, y, blockSize, "#00ffcc");
    }

    blocksCtx.restore();
}

function drawIsometricFloor(cols, rows, blockSize, offsetX, offsetY) {
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = offsetX + col;
            const y = offsetY + row;

            const isoX = (x - y) * (blockSize / 2);
            const isoY = (x + y) * (blockSize / 4);

            const isLight = (col + row) % 2 === 0;
            const baseColor = isLight ? "#2a2a2a" : "#1f1f1f";
            
            const gradient = blocksCtx.createLinearGradient(
                isoX - blockSize / 2, isoY,
                isoX + blockSize / 2, isoY + blockSize / 2
            );
            gradient.addColorStop(0, baseColor);
            gradient.addColorStop(1, shadeColor(baseColor, -8));
            
            blocksCtx.fillStyle = gradient;

            blocksCtx.beginPath();
            blocksCtx.moveTo(isoX, isoY);
            blocksCtx.lineTo(isoX - blockSize / 2, isoY + blockSize / 4);
            blocksCtx.lineTo(isoX, isoY + blockSize / 2);
            blocksCtx.lineTo(isoX + blockSize / 2, isoY + blockSize / 4);
            blocksCtx.closePath();
            blocksCtx.fill();

            blocksCtx.strokeStyle = "rgba(255,255,255,0.03)";
            blocksCtx.lineWidth = 0.5;
            blocksCtx.stroke();
        }
    }
}

function drawIsometricBlock(x, y, blockSize, color = "#00ffcc") {
    const height = blockSize * 0.8;

    const isoX = (x - y) * (blockSize / 2);
    const isoY = (x + y) * (blockSize / 4);

    // Left face
    blocksCtx.fillStyle = shadeColor(color, -30);
    blocksCtx.beginPath();
    blocksCtx.moveTo(isoX, isoY);
    blocksCtx.lineTo(isoX - blockSize / 2, isoY + blockSize / 4);
    blocksCtx.lineTo(isoX - blockSize / 2, isoY + blockSize / 4 - height);
    blocksCtx.lineTo(isoX, isoY - height);
    blocksCtx.closePath();
    blocksCtx.fill();
    blocksCtx.strokeStyle = "rgba(0,0,0,0.3)";
    blocksCtx.lineWidth = 1.5;
    blocksCtx.stroke();

    // Right face
    blocksCtx.fillStyle = shadeColor(color, -10);
    blocksCtx.beginPath();
    blocksCtx.moveTo(isoX, isoY);
    blocksCtx.lineTo(isoX + blockSize / 2, isoY + blockSize / 4);
    blocksCtx.lineTo(isoX + blockSize / 2, isoY + blockSize / 4 - height);
    blocksCtx.lineTo(isoX, isoY - height);
    blocksCtx.closePath();
    blocksCtx.fill();
    blocksCtx.strokeStyle = "rgba(0,0,0,0.3)";
    blocksCtx.stroke();

    // Top face
    const gradient = blocksCtx.createLinearGradient(
        isoX - blockSize / 2, isoY - blockSize / 4 - height,
        isoX + blockSize / 2, isoY + blockSize / 4 - height
    );
    gradient.addColorStop(0, shadeColor(color, 25));
    gradient.addColorStop(1, shadeColor(color, 5));
    
    blocksCtx.fillStyle = gradient;
    blocksCtx.beginPath();
    blocksCtx.moveTo(isoX, isoY - height);
    blocksCtx.lineTo(isoX - blockSize / 2, isoY + blockSize / 4 - height);
    blocksCtx.lineTo(isoX, isoY + blockSize / 2 - height);
    blocksCtx.lineTo(isoX + blockSize / 2, isoY + blockSize / 4 - height);
    blocksCtx.closePath();
    blocksCtx.fill();
    blocksCtx.strokeStyle = "rgba(0,0,0,0.2)";
    blocksCtx.stroke();
}

function shadeColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, Math.max(0, (num >> 16) + amt));
    const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
    const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
}

function submitBlocksAnswer() {
    const isCorrect = blocksCount === blocksSolution;
    
    if (isCorrect) {
        blocksScore++;
        blocksCorrectAnswers++;
        document.getElementById('blocks-instruction').textContent = `✓ Correct ! Il y avait bien ${blocksSolution} blocs.`;
    } else {
        document.getElementById('blocks-instruction').textContent = `✗ Raté ! Il y avait ${blocksSolution} blocs (vous avez dit ${blocksCount}).`;
    }
    
    document.getElementById('blocks-total').textContent = blocksScore;
    
    const accuracy = Math.round((blocksCorrectAnswers / blocksRound) * 100);
    document.getElementById('blocks-accuracy').textContent = accuracy + '%';
    
    if (blocksRound < blocksMaxRounds) {
        blocksRound++;
        setTimeout(startBlocksRound, 2500);
    } else {
        setTimeout(() => {
            document.getElementById('blocks-instruction').textContent = `🎉 Partie terminée ! Score final: ${blocksScore}/${blocksMaxRounds} (${accuracy}%)`;
            setTimeout(() => {
                if (confirm('Rejouer ?')) {
                    initBlocksGame();
                }
            }, 1500);
        }, 2500);
    }
}

// =========================
// WINDOW RESIZE
// =========================
window.addEventListener('resize', () => {
    if (currentGame === 'blocks' && blocksCanvas) {
        const wrapper = document.getElementById('blocks-canvas-wrapper');
        blocksCanvas.width = wrapper.offsetWidth - 40;
        clearBlocksCanvas();
    }
});

// =========================
// EASTER EGG
// =========================
let eggClicks = 0;
let eggTimeout = null;

const titleEgg = document.getElementById('title-egg');
if (titleEgg) {
    titleEgg.style.cursor = 'pointer';
    titleEgg.addEventListener('click', () => {
        eggClicks++;
        
        // Visual feedback
        titleEgg.style.transform = 'scale(1.05)';
        setTimeout(() => {
            titleEgg.style.transform = 'scale(1)';
        }, 100);
        
        // Reset counter after 3 seconds of inactivity
        clearTimeout(eggTimeout);
        eggTimeout = setTimeout(() => {
            eggClicks = 0;
        }, 3000);
        
        // Easter Egg activated after 5 clicks
        if (eggClicks === 5) {
            // Visual effect
            titleEgg.style.animation = 'none';
            setTimeout(() => {
                titleEgg.style.animation = 'pulse 3s ease-in-out infinite, rainbow 2s linear infinite';
            }, 10);
            
            // Redirect to Easter Egg page
            setTimeout(() => {
                window.location.href = 'easter-egg.html';
            }, 500);
        }
    });
}