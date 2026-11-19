/**
 * Theme 4: Dark Minimalist / E-Sports Pro Game Engine
 * 2D Canvas Games (Space Blaster, Neon Flappy, Retro Snake, Cyber Pong)
 * Minimalist geometric styling, electric violet & laser cyan HUD, responsive touch & keyboard controls.
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
    const width = Math.min(parent.clientWidth || 400, 640);
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
    } else if (this.gameKey === 'cyber-pong') {
      this.initCyberPong();
    } else {
      this.initSpaceBlaster();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }

  /* ==========================================================
     GAME 1: SPACE BLASTER 2D (Precision Dark Minimalist Vector)
     ========================================================== */
  initSpaceBlaster() {
    const player = {
      x: this.width / 2 - 16,
      y: this.height - 48,
      w: 32,
      h: 24,
      speed: 7,
      lives: 3
    };

    let bullets = [];
    let enemies = [];
    let enemyTimer = 0;
    let lastShot = 0;

    const loop = (timestamp) => {
      if (!this.isRunning) return;

      this.ctx.fillStyle = '#08090C';
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Starfield grid
      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 37 + (timestamp * 0.05)) % this.width;
        const sy = (i * 53 + (timestamp * 0.08)) % this.height;
        this.ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Player Movement
      if ((this.keys['ArrowLeft'] || this.keys['KeyA']) && player.x > 0) {
        player.x -= player.speed;
      }
      if ((this.keys['ArrowRight'] || this.keys['KeyD']) && player.x + player.w < this.width) {
        player.x += player.speed;
      }

      // Firing
      if ((this.keys['Space'] || this.keys['KeyW'] || this.keys['ArrowUp']) && timestamp - lastShot > 180) {
        bullets.push({ x: player.x + player.w / 2 - 2, y: player.y, w: 4, h: 12, speed: 10 });
        lastShot = timestamp;
      }

      // Spawn Enemies
      enemyTimer++;
      if (enemyTimer % 45 === 0) {
        enemies.push({
          x: Math.random() * (this.width - 32),
          y: -24,
          w: 26,
          h: 20,
          speed: 2 + Math.random() * 2
        });
      }

      // Update Bullets
      this.ctx.fillStyle = '#6366F1';
      bullets.forEach((b, bi) => {
        b.y -= b.speed;
        this.ctx.fillRect(b.x, b.y, b.w, b.h);
        if (b.y < -10) bullets.splice(bi, 1);
      });

      // Update Enemies & Collisions
      enemies.forEach((e, ei) => {
        e.y += e.speed;
        this.ctx.fillStyle = '#EF4444';
        // Minimalist angular enemy ship
        this.ctx.beginPath();
        this.ctx.moveTo(e.x + e.w / 2, e.y + e.h);
        this.ctx.lineTo(e.x, e.y);
        this.ctx.lineTo(e.x + e.w, e.y);
        this.ctx.closePath();
        this.ctx.fill();

        // Bullet Hit
        bullets.forEach((b, bi) => {
          if (b.x < e.x + e.w && b.x + b.w > e.x && b.y < e.y + e.h && b.y + b.h > e.y) {
            enemies.splice(ei, 1);
            bullets.splice(bi, 1);
            this.score += 15;
            this.onScoreUpdate(this.score);
          }
        });

        // Player Collision
        if (player.x < e.x + e.w && player.x + player.w > e.x && player.y < e.y + e.h && player.y + player.h > e.y) {
          enemies.splice(ei, 1);
          player.lives--;
          if (player.lives <= 0) {
            this.stop();
            this.onGameOver(this.score);
          }
        }

        if (e.y > this.height + 30) enemies.splice(ei, 1);
      });

      // Render Player Ship (Crisp minimalist triangle with cyan core)
      this.ctx.fillStyle = '#F8FAFC';
      this.ctx.beginPath();
      this.ctx.moveTo(player.x + player.w / 2, player.y);
      this.ctx.lineTo(player.x, player.y + player.h);
      this.ctx.lineTo(player.x + player.w, player.y + player.h);
      this.ctx.closePath();
      this.ctx.fill();

      // Thruster
      this.ctx.fillStyle = '#06B6D4';
      this.ctx.fillRect(player.x + player.w / 2 - 3, player.y + player.h, 6, 6);

      // Minimalist HUD Overlay
      this.ctx.fillStyle = '#94A3B8';
      this.ctx.font = '600 13px "JetBrains Mono", monospace';
      this.ctx.fillText(`SCORE: ${this.score}`, 16, 26);
      this.ctx.fillText(`LIVES: ${player.lives}`, this.width - 80, 26);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /* ==========================================================
     GAME 2: NEON FLAPPY 2D (Clean Minimalist Vector Obstacles)
     ========================================================== */
  initFlappyBird() {
    const bird = {
      x: 60,
      y: this.height / 2,
      w: 20,
      h: 20,
      velocity: 0,
      gravity: 0.38,
      jump: -6.5
    };

    let pipes = [];
    let pipeTimer = 0;
    const gap = 115;

    const loop = () => {
      if (!this.isRunning) return;

      this.ctx.fillStyle = '#08090C';
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Flap input
      if (this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW']) {
        bird.velocity = bird.jump;
        this.keys['Space'] = false;
        this.keys['ArrowUp'] = false;
        this.keys['KeyW'] = false;
      }

      bird.velocity += bird.gravity;
      bird.y += bird.velocity;

      // Spawn pipes
      pipeTimer++;
      if (pipeTimer % 85 === 0) {
        const topH = Math.floor(Math.random() * (this.height - gap - 80)) + 30;
        pipes.push({
          x: this.width,
          topH: topH,
          bottomY: topH + gap,
          w: 42,
          passed: false
        });
      }

      // Draw & Update Pipes
      pipes.forEach((p, index) => {
        p.x -= 3;

        // Top Pipe
        this.ctx.fillStyle = '#161B26';
        this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
        this.ctx.lineWidth = 1.5;
        this.ctx.fillRect(p.x, 0, p.w, p.topH);
        this.ctx.strokeRect(p.x, 0, p.w, p.topH);

        // Bottom Pipe
        this.ctx.fillRect(p.x, p.bottomY, p.w, this.height - p.bottomY);
        this.ctx.strokeRect(p.x, p.bottomY, p.w, this.height - p.bottomY);

        // Scoring
        if (!p.passed && p.x + p.w < bird.x) {
          p.passed = true;
          this.score += 1;
          this.onScoreUpdate(this.score);
        }

        // Collision Check
        if (bird.x + bird.w > p.x && bird.x < p.x + p.w) {
          if (bird.y < p.topH || bird.y + bird.h > p.bottomY) {
            this.stop();
            this.onGameOver(this.score);
          }
        }

        if (p.x < -60) pipes.splice(index, 1);
      });

      // Ground / Ceiling bounds
      if (bird.y < 0 || bird.y + bird.h > this.height) {
        this.stop();
        this.onGameOver(this.score);
      }

      // Draw Bird (Sleek minimalist glowing diamond)
      this.ctx.fillStyle = '#8B5CF6';
      this.ctx.beginPath();
      this.ctx.moveTo(bird.x + bird.w / 2, bird.y);
      this.ctx.lineTo(bird.x + bird.w, bird.y + bird.h / 2);
      this.ctx.lineTo(bird.x + bird.w / 2, bird.y + bird.h);
      this.ctx.lineTo(bird.x, bird.y + bird.h / 2);
      this.ctx.closePath();
      this.ctx.fill();

      // HUD
      this.ctx.fillStyle = '#F8FAFC';
      this.ctx.font = '700 16px "JetBrains Mono", monospace';
      this.ctx.fillText(`SCORE: ${this.score}`, 16, 28);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /* ==========================================================
     GAME 3: RETRO SNAKE ARENA (Sharp Pro Grid)
     ========================================================== */
  initRetroSnake() {
    const gridSize = 16;
    const tileW = Math.floor(this.width / gridSize);
    const tileH = Math.floor(this.height / gridSize);

    let snake = [
      { x: 8, y: 8 },
      { x: 7, y: 8 },
      { x: 6, y: 8 }
    ];
    let dx = 1;
    let dy = 0;
    let food = { x: 14, y: 12 };
    let tick = 0;
    const speed = 7; // ticks per move

    const loop = () => {
      if (!this.isRunning) return;

      // Handle Direction
      if ((this.keys['ArrowUp'] || this.keys['KeyW']) && dy === 0) { dx = 0; dy = -1; }
      if ((this.keys['ArrowDown'] || this.keys['KeyS']) && dy === 0) { dx = 0; dy = 1; }
      if ((this.keys['ArrowLeft'] || this.keys['KeyA']) && dx === 0) { dx = -1; dy = 0; }
      if ((this.keys['ArrowRight'] || this.keys['KeyD']) && dx === 0) { dx = 1; dy = 0; }

      tick++;
      if (tick % speed === 0) {
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };

        // Wall collision
        if (head.x < 0 || head.x >= tileW || head.y < 0 || head.y >= tileH) {
          this.stop();
          this.onGameOver(this.score);
          return;
        }

        // Self collision
        for (let i = 0; i < snake.length; i++) {
          if (snake[i].x === head.x && snake[i].y === head.y) {
            this.stop();
            this.onGameOver(this.score);
            return;
          }
        }

        snake.unshift(head);

        // Food collision
        if (head.x === food.x && head.y === food.y) {
          this.score += 20;
          this.onScoreUpdate(this.score);
          food = {
            x: Math.floor(Math.random() * (tileW - 2)) + 1,
            y: Math.floor(Math.random() * (tileH - 2)) + 1
          };
        } else {
          snake.pop();
        }
      }

      // Draw Grid Arena
      this.ctx.fillStyle = '#08090C';
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Subtle boundary line
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      this.ctx.strokeRect(0, 0, tileW * gridSize, tileH * gridSize);

      // Draw Food (Emerald Pulse)
      this.ctx.fillStyle = '#10B981';
      this.ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 4, gridSize - 4);

      // Draw Snake (Clean modern rounded segments)
      snake.forEach((seg, i) => {
        this.ctx.fillStyle = i === 0 ? '#FFFFFF' : '#6366F1';
        this.ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
      });

      // HUD
      this.ctx.fillStyle = '#94A3B8';
      this.ctx.font = '600 13px "JetBrains Mono", monospace';
      this.ctx.fillText(`LENGTH: ${snake.length} | SCORE: ${this.score}`, 14, 22);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }

  /* ==========================================================
     GAME 4: CYBER PONG CLASH (Pro Dual Competitive Paddle)
     ========================================================== */
  initCyberPong() {
    const paddleH = 68;
    const paddleW = 10;
    const player = { x: 18, y: this.height / 2 - paddleH / 2, speed: 7 };
    const ai = { x: this.width - 28, y: this.height / 2 - paddleH / 2, speed: 4.8 };
    const ball = {
      x: this.width / 2,
      y: this.height / 2,
      vx: 4.5,
      vy: 2.8,
      r: 6
    };
    let aiScore = 0;

    const loop = () => {
      if (!this.isRunning) return;

      this.ctx.fillStyle = '#08090C';
      this.ctx.fillRect(0, 0, this.width, this.height);

      // Center court line
      this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
      this.ctx.setLineDash([6, 6]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.width / 2, 0);
      this.ctx.lineTo(this.width / 2, this.height);
      this.ctx.stroke();
      this.ctx.setLineDash([]);

      // Player Movement
      if ((this.keys['ArrowUp'] || this.keys['KeyW']) && player.y > 0) player.y -= player.speed;
      if ((this.keys['ArrowDown'] || this.keys['KeyS']) && player.y + paddleH < this.height) player.y += player.speed;

      // AI Movement
      if (ai.y + paddleH / 2 < ball.y - 12) ai.y += ai.speed;
      else if (ai.y + paddleH / 2 > ball.y + 12) ai.y -= ai.speed;

      // Ball Movement
      ball.x += ball.vx;
      ball.y += ball.vy;

      // Top/Bottom bounce
      if (ball.y - ball.r <= 0 || ball.y + ball.r >= this.height) {
        ball.vy = -ball.vy;
      }

      // Player Paddle Hit
      if (ball.x - ball.r <= player.x + paddleW && ball.y >= player.y && ball.y <= player.y + paddleH) {
        ball.vx = Math.abs(ball.vx) + 0.2;
        this.score += 5;
        this.onScoreUpdate(this.score);
      }

      // AI Paddle Hit
      if (ball.x + ball.r >= ai.x && ball.y >= ai.y && ball.y <= ai.y + paddleH) {
        ball.vx = -Math.abs(ball.vx) - 0.2;
      }

      // Player Goal
      if (ball.x > this.width) {
        this.score += 25;
        this.onScoreUpdate(this.score);
        ball.x = this.width / 2;
        ball.y = this.height / 2;
        ball.vx = -4.5;
      }

      // AI Goal / Player Miss
      if (ball.x < 0) {
        aiScore++;
        if (aiScore >= 3) {
          this.stop();
          this.onGameOver(this.score);
          return;
        }
        ball.x = this.width / 2;
        ball.y = this.height / 2;
        ball.vx = 4.5;
      }

      // Draw Paddles
      this.ctx.fillStyle = '#6366F1';
      this.ctx.fillRect(player.x, player.y, paddleW, paddleH);

      this.ctx.fillStyle = '#EF4444';
      this.ctx.fillRect(ai.x, ai.y, paddleW, paddleH);

      // Draw Ball
      this.ctx.fillStyle = '#FFFFFF';
      this.ctx.beginPath();
      this.ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
      this.ctx.fill();

      // HUD
      this.ctx.fillStyle = '#94A3B8';
      this.ctx.font = '700 14px "JetBrains Mono", monospace';
      this.ctx.fillText(`YOU: ${this.score}`, this.width / 4, 28);
      this.ctx.fillText(`AI: ${aiScore}/3`, (this.width / 4) * 3, 28);

      this.animationFrameId = requestAnimationFrame(loop);
    };

    this.animationFrameId = requestAnimationFrame(loop);
  }
}

window.WAPGamesEngine = WAPGamesEngine;
