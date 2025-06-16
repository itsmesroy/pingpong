const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// Paddle constants
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 90;
const PADDLE_MARGIN = 20;
const PADDLE_SPEED = 6;

// Ball constants
const BALL_SIZE = 16;
const BALL_SPEED = 6;

// Game state
let playerPaddle = { x: PADDLE_MARGIN, y: HEIGHT/2 - PADDLE_HEIGHT/2 };
let aiPaddle = { x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH, y: HEIGHT/2 - PADDLE_HEIGHT/2 };
let ball = { x: WIDTH/2 - BALL_SIZE/2, y: HEIGHT/2 - BALL_SIZE/2, dx: BALL_SPEED, dy: BALL_SPEED };
let playerScore = 0;
let aiScore = 0;

// Mouse control
canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    let mouseY = e.clientY - rect.top;
    playerPaddle.y = mouseY - PADDLE_HEIGHT / 2;
    // Clamp to bounds
    if (playerPaddle.y < 0) playerPaddle.y = 0;
    if (playerPaddle.y > HEIGHT - PADDLE_HEIGHT) playerPaddle.y = HEIGHT - PADDLE_HEIGHT;
});

function drawRect(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI*2, false);
    ctx.closePath();
    ctx.fill();
}

function drawNet() {
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([8, 18]);
    ctx.beginPath();
    ctx.moveTo(WIDTH/2, 0);
    ctx.lineTo(WIDTH/2, HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    // Draw net
    drawNet();
    // Draw paddles
    drawRect(playerPaddle.x, playerPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    drawRect(aiPaddle.x, aiPaddle.y, PADDLE_WIDTH, PADDLE_HEIGHT, '#fff');
    // Draw ball
    drawCircle(ball.x + BALL_SIZE/2, ball.y + BALL_SIZE/2, BALL_SIZE/2, '#fff');
}

function resetBall(direction = 1) {
    ball.x = WIDTH/2 - BALL_SIZE/2;
    ball.y = HEIGHT/2 - BALL_SIZE/2;
    // Alternate serve direction
    ball.dx = BALL_SPEED * direction;
    // Randomize vertical angle
    ball.dy = (Math.random() > 0.5 ? 1 : -1) * (BALL_SPEED * (0.3 + Math.random() * 0.7));
}

function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy = -ball.dy;
    }
    if (ball.y + BALL_SIZE > HEIGHT) {
        ball.y = HEIGHT - BALL_SIZE;
        ball.dy = -ball.dy;
    }

    // Ball collision with player paddle
    if (
        ball.x < playerPaddle.x + PADDLE_WIDTH &&
        ball.x > playerPaddle.x &&
        ball.y + BALL_SIZE > playerPaddle.y &&
        ball.y < playerPaddle.y + PADDLE_HEIGHT
    ) {
        ball.x = playerPaddle.x + PADDLE_WIDTH;
        ball.dx = -ball.dx;
        // Add some angle based on where it hits the paddle
        let collidePoint = (ball.y + BALL_SIZE/2) - (playerPaddle.y + PADDLE_HEIGHT/2);
        collidePoint = collidePoint / (PADDLE_HEIGHT/2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let speed = Math.sqrt(ball.dx*ball.dx + ball.dy*ball.dy);
        ball.dx = speed * Math.cos(angleRad);
        ball.dy = speed * Math.sin(angleRad);
        if (ball.dx > 0) ball.dx = -ball.dx;
    }

    // Ball collision with AI paddle
    if (
        ball.x + BALL_SIZE > aiPaddle.x &&
        ball.x < aiPaddle.x + PADDLE_WIDTH &&
        ball.y + BALL_SIZE > aiPaddle.y &&
        ball.y < aiPaddle.y + PADDLE_HEIGHT
    ) {
        ball.x = aiPaddle.x - BALL_SIZE;
        ball.dx = -ball.dx;
        // Add some angle based on where it hits the paddle
        let collidePoint = (ball.y + BALL_SIZE/2) - (aiPaddle.y + PADDLE_HEIGHT/2);
        collidePoint = collidePoint / (PADDLE_HEIGHT/2);
        let angleRad = (Math.PI / 4) * collidePoint;
        let speed = Math.sqrt(ball.dx*ball.dx + ball.dy*ball.dy);
        ball.dx = speed * Math.cos(angleRad);
        ball.dy = speed * Math.sin(angleRad);
        if (ball.dx < 0) ball.dx = -ball.dx;
    }

    // Score update
    if (ball.x < 0) {
        aiScore++;
        updateScore();
        resetBall(-1);
    } else if (ball.x + BALL_SIZE > WIDTH) {
        playerScore++;
        updateScore();
        resetBall(1);
    }

    // AI paddle movement (basic)
    let aiCenter = aiPaddle.y + PADDLE_HEIGHT/2;
    let ballCenter = ball.y + BALL_SIZE/2;
    if (aiCenter < ballCenter - 18) {
        aiPaddle.y += PADDLE_SPEED;
    } else if (aiCenter > ballCenter + 18) {
        aiPaddle.y -= PADDLE_SPEED;
    }
    // Clamp AI paddle
    if (aiPaddle.y < 0) aiPaddle.y = 0;
    if (aiPaddle.y > HEIGHT - PADDLE_HEIGHT) aiPaddle.y = HEIGHT - PADDLE_HEIGHT;
}

function updateScore() {
    document.getElementById('player-score').textContent = playerScore;
    document.getElementById('ai-score').textContent = aiScore;
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start game
resetBall();
updateScore();
gameLoop();