/**
 * WAP Games 2D Engine
 * Provides interactive 2D Canvas games with desktop keyboard & mobile touch controls.
 * Integrates directly with player score recording and game over states.
 */

class WAPGamesEngine {
  constructor(canvasId, gameKey, onGameOverCallback, onScoreUpdateCallback) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.gameKey = gameKey;
    this.onGameOver = onGameOverCallback || (() => {});
    this.onScoreUpdate = onScoreUpdateCallback || (() => {});

    this.isRunning = false;
    this.score = 0;
    this.animationFrameId = null;

    this.keys = {};
    this.initControls();
    this.resizeCanvas();
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    const width = Math.min(parent.clientWidth || 400, 600);
    const height = Math.min(window.innerHeight * 0.55, 480);
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
  }

  initControls() {
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Touch control triggers (for on-screen D-pads or buttons)
    window.handleVirtualControl = (key, isDown) => {
      this.keys[key] = isDown;
    };
  }

  start() {
    this.isRunning = true;
    this.score = 0;
    this.onScoreUpdate(this.score);

    if (this.gameKey === 'space-blaster') {
      this.initSpaceBlaster();
    } else if (this.gameKey === 'flappy-bird') {
      this.initFlappyBird();
    } else if (this.gameKey === 'retro-snake') {
      this.initRetroSnake();
    } else {
      this.initBrickBreaker();
    }

    this.loop();
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  loop() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.gameKey === 'space-blaster') {
      this.updateSpaceBlaster();
    } else if (this.gameKey === 'flappy-bird') {
      this.updateFlappyBird();
    } else if (this.gameKey === 'retro-snake') {
      this.updateRetroSnake();
    } else {
      this.updateBrickBreaker();
    }

    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  triggerGameOver() {
    this.isRunning = false;
    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.ctx.fillStyle = '#ef4444';
    this.ctx.font = 'bold 28px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.width / 2, this.height / 2 - 20);

    this.ctx.fillStyle = '#f8fafc';
    this.ctx.font = '18px sans-serif';
    this.ctx.fillText(`Final Score: ${this.score}`, this.width / 2, this.height / 2 + 20);

    this.onGameOver(this.score);
  }

  /* -------------------------------------------------------------
   * 1. Space Blaster 2D
   * ------------------------------------------------------------- */
  initSpaceBlaster() {
    this.player = {
      x: this.width / 2 - 20,
      y: this.height - 50,
      w: 40,
      h: 30,
      speed: 6,
      lives: 3
    };
    this.bullets = [];
    this.enemies = [];
    this.particles = [];
    this.enemySpawnTimer = 0;
    this.fireCooldown = 0;
  }

  updateSpaceBlaster() {
    // Background starfield
    this.ctx.fillStyle = '#090d16';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Controls
    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.player.x -= this.player.speed;
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.player.x += this.player.speed;
    }
    this.player.x = Math.max(10, Math.min(this.width - this.player.w - 10, this.player.x));

    // Shooting
    if ((this.keys['Space'] || this.keys['KeyW'] || this.keys['Fire']) && this.fireCooldown <= 0) {
      this.bullets.push({ x: this.player.x + this.player.w / 2 - 3, y: this.player.y - 6, w: 6, h: 14 });
      this.fireCooldown = 12;
    }
    if (this.fireCooldown > 0) this.fireCooldown--;

    // Bullets update
    this.ctx.fillStyle = '#38bdf8';
    this.bullets.forEach((b, idx) => {
      b.y -= 8;
      this.ctx.fillRect(b.x, b.y, b.w, b.h);
      if (b.y < -20) this.bullets.splice(idx, 1);
    });

    // Enemy spawn
    this.enemySpawnTimer++;
    if (this.enemySpawnTimer > 45) {
      this.enemySpawnTimer = 0;
      this.enemies.push({
        x: Math.random() * (this.width - 40) + 10,
        y: -30,
        w: 32,
        h: 24,
        speed: 2 + Math.random() * 2
      });
    }

    // Enemy update & collisions
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.y += e.speed;

      // Draw enemy (cyber invader)
      this.ctx.fillStyle = '#f43f5e';
      this.ctx.beginPath();
      this.ctx.moveTo(e.x + e.w / 2, e.y + e.h);
      this.ctx.lineTo(e.x, e.y);
      this.ctx.lineTo(e.x + e.w, e.y);
      this.ctx.closePath();
      this.ctx.fill();

      // Bullet hit
      for (let j = this.bullets.length - 1; j >= 0; j--) {
        const b = this.bullets[j];
        if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
          // Hit!
          this.score += 10;
          this.onScoreUpdate(this.score);
          this.enemies.splice(i, 1);
          this.bullets.splice(j, 1);
          break;
        }
      }

      // Hit player
      if (e.y + e.h > this.player.y && e.x < this.player.x + this.player.w && e.x + e.w > this.player.x) {
        this.enemies.splice(i, 1);
        this.player.lives--;
        if (this.player.lives <= 0) {
          this.triggerGameOver();
          return;
        }
      }

      // Past screen bottom
      if (e.y > this.height) {
        this.enemies.splice(i, 1);
      }
    }

    // Draw Player Jet
    this.ctx.fillStyle = '#10b981';
    this.ctx.beginPath();
    this.ctx.moveTo(this.player.x + this.player.w / 2, this.player.y);
    this.ctx.lineTo(this.player.x, this.player.y + this.player.h);
    this.ctx.lineTo(this.player.x + this.player.w / 2, this.player.y + this.player.h - 8);
    this.ctx.lineTo(this.player.x + this.player.w, this.player.y + this.player.h);
    this.ctx.closePath();
    this.ctx.fill();

    // Draw HUD
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 16, 24);
    this.ctx.textAlign = 'right';
    this.ctx.fillText(`Lives: ${'❤️ '.repeat(this.player.lives)}`, this.width - 16, 24);
  }

  /* -------------------------------------------------------------
   * 2. Neon Flappy 2D
   * ------------------------------------------------------------- */
  initFlappyBird() {
    this.bird = {
      x: 60,
      y: this.height / 2,
      radius: 14,
      velocity: 0,
      gravity: 0.35,
      jump: -6.2
    };
    this.pipes = [];
    this.pipeTimer = 0;
    this.pipeGap = 125;
  }

  updateFlappyBird() {
    // Cyber gradient background
    this.ctx.fillStyle = '#050814';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Jump
    if ((this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['Jump']) && !this.birdJustJumped) {
      this.bird.velocity = this.bird.jump;
      this.birdJustJumped = true;
    }
    if (!this.keys['Space'] && !this.keys['ArrowUp'] && !this.keys['KeyW'] && !this.keys['Jump']) {
      this.birdJustJumped = false;
    }

    this.bird.velocity += this.bird.gravity;
    this.bird.y += this.bird.velocity;

    // Boundaries check
    if (this.bird.y + this.bird.radius >= this.height || this.bird.y - this.bird.radius <= 0) {
      this.triggerGameOver();
      return;
    }

    // Pipes spawn
    this.pipeTimer++;
    if (this.pipeTimer > 85) {
      this.pipeTimer = 0;
      const topHeight = Math.floor(Math.random() * (this.height - this.pipeGap - 100)) + 40;
      this.pipes.push({
        x: this.width,
        w: 48,
        top: topHeight,
        bottom: topHeight + this.pipeGap,
        passed: false
      });
    }

    // Update pipes
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= 2.6;

      // Draw Top Pipe
      this.ctx.fillStyle = '#8b5cf6';
      this.ctx.fillRect(p.x, 0, p.w, p.top);
      this.ctx.fillStyle = '#a78bfa';
      this.ctx.fillRect(p.x - 3, p.top - 12, p.w + 6, 12);

      // Draw Bottom Pipe
      this.ctx.fillStyle = '#8b5cf6';
      this.ctx.fillRect(p.x, p.bottom, p.w, this.height - p.bottom);
      this.ctx.fillStyle = '#a78bfa';
      this.ctx.fillRect(p.x - 3, p.bottom, p.w + 6, 12);

      // Collision Check
      if (
        this.bird.x + this.bird.radius > p.x &&
        this.bird.x - this.bird.radius < p.x + p.w &&
        (this.bird.y - this.bird.radius < p.top || this.bird.y + this.bird.radius > p.bottom)
      ) {
        this.triggerGameOver();
        return;
      }

      // Score
      if (!p.passed && p.x + p.w < this.bird.x) {
        p.passed = true;
        this.score += 1;
        this.onScoreUpdate(this.score);
      }

      if (p.x + p.w < 0) {
        this.pipes.splice(i, 1);
      }
    }

    // Draw Bird
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.beginPath();
    this.ctx.arc(this.bird.x, this.bird.y, this.bird.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // Eye
    this.ctx.fillStyle = '#0f172a';
    this.ctx.beginPath();
    this.ctx.arc(this.bird.x + 5, this.bird.y - 3, 3, 0, Math.PI * 2);
    this.ctx.fill();

    // HUD
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.font = 'bold 24px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.score, this.width / 2, 40);
  }

  /* -------------------------------------------------------------
   * 3. Retro Snake 2D
   * ------------------------------------------------------------- */
  initRetroSnake() {
    this.gridSize = 16;
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.dir = { x: 1, y: 0 };
    this.nextDir = { x: 1, y: 0 };
    this.food = this.spawnFood();
    this.snakeTick = 0;
  }

  spawnFood() {
    const cols = Math.floor(this.width / this.gridSize);
    const rows = Math.floor(this.height / this.gridSize);
    return {
      x: Math.floor(Math.random() * (cols - 2)) + 1,
      y: Math.floor(Math.random() * (rows - 2)) + 1
    };
  }

  updateRetroSnake() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.width, this.height);

    // Direction input
    if ((this.keys['ArrowUp'] || this.keys['KeyW']) && this.dir.y === 0) this.nextDir = { x: 0, y: -1 };
    if ((this.keys['ArrowDown'] || this.keys['KeyS']) && this.dir.y === 0) this.nextDir = { x: 0, y: 1 };
    if ((this.keys['ArrowLeft'] || this.keys['KeyA']) && this.dir.x === 0) this.nextDir = { x: -1, y: 0 };
    if ((this.keys['ArrowRight'] || this.keys['KeyD']) && this.dir.x === 0) this.nextDir = { x: 1, y: 0 };

    this.snakeTick++;
    if (this.snakeTick >= 6) {
      this.snakeTick = 0;
      this.dir = this.nextDir;

      const head = { x: this.snake[0].x + this.dir.x, y: this.snake[0].y + this.dir.y };
      const cols = Math.floor(this.width / this.gridSize);
      const rows = Math.floor(this.height / this.gridSize);

      // Wall hit
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        this.triggerGameOver();
        return;
      }

      // Self hit
      for (let segment of this.snake) {
        if (segment.x === head.x && segment.y === head.y) {
          this.triggerGameOver();
          return;
        }
      }

      this.snake.unshift(head);

      // Food eaten
      if (head.x === this.food.x && head.y === this.food.y) {
        this.score += 15;
        this.onScoreUpdate(this.score);
        this.food = this.spawnFood();
      } else {
        this.snake.pop();
      }
    }

    // Draw Food
    this.ctx.fillStyle = '#ef4444';
    this.ctx.beginPath();
    this.ctx.arc(
      this.food.x * this.gridSize + this.gridSize / 2,
      this.food.y * this.gridSize + this.gridSize / 2,
      this.gridSize / 2 - 1,
      0,
      Math.PI * 2
    );
    this.ctx.fill();

    // Draw Snake
    this.snake.forEach((part, idx) => {
      this.ctx.fillStyle = idx === 0 ? '#10b981' : '#34d399';
      this.ctx.fillRect(
        part.x * this.gridSize + 1,
        part.y * this.gridSize + 1,
        this.gridSize - 2,
        this.gridSize - 2
      );
    });

    // HUD
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 16, 24);
  }

  /* -------------------------------------------------------------
   * 4. Cyber Brick Breaker
   * ------------------------------------------------------------- */
  initBrickBreaker() {
    this.paddle = {
      w: 80,
      h: 12,
      x: this.width / 2 - 40,
      speed: 7
    };
    this.ball = {
      x: this.width / 2,
      y: this.height - 60,
      radius: 6,
      dx: 4,
      dy: -4
    };
    this.bricks = [];
    const rows = 4;
    const cols = 7;
    const padding = 6;
    const brickW = (this.width - 40 - (cols - 1) * padding) / cols;
    const brickH = 18;

    const colors = ['#f43f5e', '#ec4899', '#8b5cf6', '#3b82f6'];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.bricks.push({
          x: 20 + c * (brickW + padding),
          y: 40 + r * (brickH + padding),
          w: brickW,
          h: brickH,
          color: colors[r],
          alive: true
        });
      }
    }
  }

  updateBrickBreaker() {
    this.ctx.fillStyle = '#0f172a';
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
      this.paddle.x -= this.paddle.speed;
    }
    if (this.keys['ArrowRight'] || this.keys['KeyD']) {
      this.paddle.x += this.paddle.speed;
    }
    this.paddle.x = Math.max(10, Math.min(this.width - this.paddle.w - 10, this.paddle.x));

    // Ball movement
    this.ball.x += this.ball.dx;
    this.ball.y += this.ball.dy;

    // Walls
    if (this.ball.x - this.ball.radius < 0 || this.ball.x + this.ball.radius > this.width) {
      this.ball.dx = -this.ball.dx;
    }
    if (this.ball.y - this.ball.radius < 0) {
      this.ball.dy = -this.ball.dy;
    }

    // Paddle hit
    if (
      this.ball.y + this.ball.radius >= this.height - 30 &&
      this.ball.x >= this.paddle.x &&
      this.ball.x <= this.paddle.x + this.paddle.w
    ) {
      this.ball.dy = -Math.abs(this.ball.dy);
      // Angular bounce
      const hitPoint = (this.ball.x - (this.paddle.x + this.paddle.w / 2)) / (this.paddle.w / 2);
      this.ball.dx = hitPoint * 5;
    }

    // Bottom loss
    if (this.ball.y - this.ball.radius > this.height) {
      this.triggerGameOver();
      return;
    }

    // Bricks hit
    let remaining = 0;
    this.bricks.forEach(b => {
      if (b.alive) {
        remaining++;
        if (
          this.ball.x > b.x &&
          this.ball.x < b.x + b.w &&
          this.ball.y - this.ball.radius < b.y + b.h &&
          this.ball.y + this.ball.radius > b.y
        ) {
          b.alive = false;
          this.ball.dy = -this.ball.dy;
          this.score += 25;
          this.onScoreUpdate(this.score);
        }
      }
    });

    if (remaining === 0) {
      // You cleared all bricks!
      this.score += 200;
      this.onScoreUpdate(this.score);
      this.triggerGameOver();
      return;
    }

    // Draw Bricks
    this.bricks.forEach(b => {
      if (b.alive) {
        this.ctx.fillStyle = b.color;
        this.ctx.fillRect(b.x, b.y, b.w, b.h);
      }
    });

    // Draw Paddle
    this.ctx.fillStyle = '#06b6d4';
    this.ctx.fillRect(this.paddle.x, this.height - 30, this.paddle.w, this.paddle.h);

    // Draw Ball
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.beginPath();
    this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
    this.ctx.fill();

    // HUD
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '14px sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.fillText(`Score: ${this.score}`, 16, 24);
  }
}

window.WAPGamesEngine = WAPGamesEngine;
