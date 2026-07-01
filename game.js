const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game state
const STATE = {
    START: 0,
    PLAYING: 1,
    GAMEOVER: 2
};

let gameState = STATE.START;
let score = 0;
let bestScore = localStorage.getItem('flappyPlaneBest') || 0;
let frames = 0;
let gameSpeed = 2.5;

// Canvas dimensions
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Plane object
const plane = {
    x: 80,
    y: HEIGHT / 2,
    width: 44,
    height: 28,
    velocity: 0,
    gravity: 0.25,
    jump: -5.5,
    rotation: 0,
    radius: 12,
    reset() {
        this.y = HEIGHT / 2;
        this.velocity = 0;
        this.rotation = 0;
    },
    flap() {
        this.velocity = this.jump;
    },
    update() {
        this.velocity += this.gravity;
        this.y += this.velocity;
        this.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 6, (this.velocity * 0.1)));

        // Floor / ceiling collision
        if (this.y + this.height / 2 >= HEIGHT - 20 || this.y - this.height / 2 <= 0) {
            gameOver();
        }
    },
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        // Fuselage
        ctx.fillStyle = '#f0f0f0';
        ctx.beginPath();
        ctx.ellipse(0, 0, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();

        // Cockpit
        ctx.fillStyle = '#2a6fdb';
        ctx.beginPath();
        ctx.ellipse(6, -4, 9, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Windows
        ctx.fillStyle = '#87CEEB';
        ctx.beginPath();
        ctx.ellipse(6, -4, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wings
        ctx.fillStyle = '#e0e0e0';
        ctx.beginPath();
        ctx.moveTo(-4, 2);
        ctx.lineTo(12, 2);
        ctx.lineTo(6, 12);
        ctx.lineTo(-12, 12);
        ctx.closePath();
        ctx.fill();

        // Tail
        ctx.fillStyle = '#d0d0d0';
        ctx.beginPath();
        ctx.moveTo(-18, -2);
        ctx.lineTo(-12, -2);
        ctx.lineTo(-16, -10);
        ctx.closePath();
        ctx.fill();

        // Engines
        ctx.fillStyle = '#555';
        ctx.beginPath();
        ctx.rect(-8, 6, 8, 5);
        ctx.rect(2, 6, 8, 5);
        ctx.fill();

        // Propeller / nose detail
        ctx.fillStyle = '#333';
        ctx.beginPath();
        ctx.arc(20, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
};

// Obstacles (airport towers/buildings)
const obstacles = {
    items: [],
    width: 60,
    gap: 170,
    spawnRate: 160,
    dx: 2.5,
    reset() {
        this.items = [];
    },
    add() {
        const minHeight = 60;
        const maxHeight = HEIGHT - this.gap - minHeight - 40;
        const topHeight = Math.floor(Math.random() * (maxHeight - minHeight + 1)) + minHeight;
        const bottomY = topHeight + this.gap;
        this.items.push({
            x: WIDTH,
            topHeight: topHeight,
            bottomY: bottomY,
            bottomHeight: HEIGHT - bottomY,
            passed: false
        });
    },
    update() {
        if (frames % this.spawnRate === 0) {
            this.add();
        }
        for (let i = 0; i < this.items.length; i++) {
            const obs = this.items[i];
            obs.x -= this.dx;

            // Collision detection
            if (
                plane.x + plane.width / 2 > obs.x &&
                plane.x - plane.width / 2 < obs.x + this.width &&
                (
                    plane.y - plane.height / 2 < obs.topHeight ||
                    plane.y + plane.height / 2 > obs.bottomY
                )
            ) {
                gameOver();
            }

            // Score increment
            if (!obs.passed && obs.x + this.width < plane.x - plane.width / 2) {
                score++;
                obs.passed = true;
            }

            // Remove off-screen
            if (obs.x + this.width < 0) {
                this.items.shift();
                i--;
            }
        }
    },
    draw() {
        for (const obs of this.items) {
            // Top tower
            drawTower(obs.x, 0, this.width, obs.topHeight, true);
            // Bottom tower
            drawTower(obs.x, obs.bottomY, this.width, obs.bottomHeight, false);
        }
    }
};

function drawTower(x, y, w, h, isTop) {
    // Building body
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(x, y, w, h);

    // Windows
    ctx.fillStyle = '#FFD700';
    const rows = Math.floor(h / 20);
    const cols = 2;
    for (let r = 1; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const wx = x + 10 + c * 22;
            const wy = isTop ? y + h - 10 - r * 20 : y + 10 + r * 20;
            if (isTop) {
                if (wy > y + 10) ctx.fillRect(wx, wy, 10, 10);
            } else {
                if (wy < y + h - 10) ctx.fillRect(wx, wy, 10, 10);
            }
        }
    }

    // Roof / edge stripe
    ctx.fillStyle = '#5D3A1A';
    if (isTop) {
        ctx.fillRect(x - 4, y + h - 10, w + 8, 10);
    } else {
        ctx.fillRect(x - 4, y, w + 8, 10);
    }

    // Red warning light on top
    ctx.fillStyle = '#ff3333';
    if (isTop) {
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h - 15, 4, 0, Math.PI * 2);
        ctx.fill();
    } else {
        ctx.beginPath();
        ctx.arc(x + w / 2, y + 15, 4, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Background clouds
const clouds = {
    items: [],
    reset() {
        this.items = [];
        for (let i = 0; i < 5; i++) {
            this.items.push({
                x: Math.random() * WIDTH,
                y: 40 + Math.random() * 150,
                speed: 0.3 + Math.random() * 0.5,
                scale: 0.6 + Math.random() * 0.8
            });
        }
    },
    update() {
        for (const cloud of this.items) {
            cloud.x -= cloud.speed;
            if (cloud.x + 80 * cloud.scale < 0) {
                cloud.x = WIDTH + 20;
                cloud.y = 40 + Math.random() * 150;
            }
        }
    },
    draw() {
        for (const cloud of this.items) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
            const s = cloud.scale;
            ctx.beginPath();
            ctx.arc(cloud.x, cloud.y, 20 * s, 0, Math.PI * 2);
            ctx.arc(cloud.x + 22 * s, cloud.y - 10 * s, 25 * s, 0, Math.PI * 2);
            ctx.arc(cloud.x + 48 * s, cloud.y, 20 * s, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};

// Ground / runway line
function drawGround() {
    ctx.fillStyle = '#2d5a27';
    ctx.fillRect(0, HEIGHT - 20, WIDTH, 20);
    ctx.fillStyle = '#f0e68c';
    ctx.fillRect(0, HEIGHT - 20, WIDTH, 4);
}

// UI drawing
function drawUI() {
    // Score
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 40px "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(score, WIDTH / 2, 60);
    ctx.fillText(score, WIDTH / 2, 60);

    if (gameState === STATE.START) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px "Segoe UI", sans-serif';
        ctx.fillText('FLAPPY PLANE', WIDTH / 2, HEIGHT / 2 - 40);
        ctx.font = '20px "Segoe UI", sans-serif';
        ctx.fillText('Klik / Tap / Spasi untuk terbang', WIDTH / 2, HEIGHT / 2 + 20);
        ctx.font = '16px "Segoe UI", sans-serif';
        ctx.fillText('Hindari menara bandara!', WIDTH / 2, HEIGHT / 2 + 55);
    } else if (gameState === STATE.GAMEOVER) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 36px "Segoe UI", sans-serif';
        ctx.fillText('GAME OVER', WIDTH / 2, HEIGHT / 2 - 50);
        ctx.font = '22px "Segoe UI", sans-serif';
        ctx.fillText(`Skor: ${score}`, WIDTH / 2, HEIGHT / 2);
        ctx.fillText(`Terbaik: ${bestScore}`, WIDTH / 2, HEIGHT / 2 + 30);
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(WIDTH / 2 - 80, HEIGHT / 2 + 55, 160, 40);
        ctx.fillStyle = '#000';
        ctx.font = 'bold 18px "Segoe UI", sans-serif';
        ctx.fillText('TERBANG LAGI', WIDTH / 2, HEIGHT / 2 + 82);
    }
}

function gameOver() {
    gameState = STATE.GAMEOVER;
    if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('flappyPlaneBest', bestScore);
    }
}

function resetGame() {
    plane.reset();
    obstacles.reset();
    clouds.reset();
    score = 0;
    frames = 0;
    gameState = STATE.PLAYING;
}

function startGame() {
    resetGame();
}

function handleInput(e) {
    if (e.type === 'keydown' && e.code !== 'Space') return;
    if (e.type === 'keydown') e.preventDefault();

    if (gameState === STATE.START) {
        startGame();
    } else if (gameState === STATE.PLAYING) {
        plane.flap();
    } else if (gameState === STATE.GAMEOVER) {
        // Check if restart button clicked
        const rect = canvas.getBoundingClientRect();
        let clientX, clientY;
        if (e.type === 'touchstart') {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else if (e.type === 'click') {
            clientX = e.clientX;
            clientY = e.clientY;
        } else {
            startGame();
            return;
        }
        const x = (clientX - rect.left) * (WIDTH / rect.width);
        const y = (clientY - rect.top) * (HEIGHT / rect.height);
        if (x >= WIDTH / 2 - 80 && x <= WIDTH / 2 + 80 && y >= HEIGHT / 2 + 55 && y <= HEIGHT / 2 + 95) {
            startGame();
        } else {
            startGame();
        }
    }
}

// Event listeners
canvas.addEventListener('click', handleInput);
canvas.addEventListener('touchstart', (e) => { e.preventDefault(); handleInput(e); }, { passive: false });
window.addEventListener('keydown', handleInput);

function loop() {
    // Background
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    clouds.update();
    clouds.draw();

    if (gameState === STATE.PLAYING) {
        plane.update();
        obstacles.update();
        frames++;
    }

    obstacles.draw();
    plane.draw();
    drawGround();
    drawUI();

    requestAnimationFrame(loop);
}

// Initial render
clouds.reset();
loop();
