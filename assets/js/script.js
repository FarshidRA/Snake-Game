const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const box = 10;
const canvasSize = 400;
let snake = [{ x: 160, y: 200 }];
let direction = 'RIGHT';
let food = {};
let score = 0;
let highScore = localStorage.getItem('snakeHighScore') || 0;
let gameInterval;
let isPaused = false;

// نمایش های‌اسکور اولیه
document.getElementById('highscore').innerText = 'High Score: ' + highScore;

function drawBox(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, box, box);
}

function draw() {
  if (isPaused) return;
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // رسم بدن مار
  for (let i = 0; i < snake.length; i++) {
    drawBox(snake[i].x, snake[i].y, i === 0 ? 'green' : 'lime');
  }

  // غذا
  drawBox(food.x, food.y, 'red');

  let head = { ...snake[0] };
  if (direction === 'LEFT') head.x -= box;
  if (direction === 'RIGHT') head.x += box;
  if (direction === 'UP') head.y -= box;
  if (direction === 'DOWN') head.y += box;

  // برخورد به دیوار یا خودش
  if (
    head.x < 0 || head.y < 0 ||
    head.x > canvasSize - box || head.y > canvasSize - box ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameInterval);
    alert('Game Over! Your score: ' + score + '\nHigh Score: ' + highScore);
    document.getElementById('playButton').style.display = 'inline'; // دکمه پلی برگرده
    return;
  }

  snake.unshift(head);

  // خوردن غذا
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem('snakeHighScore', highScore);
      document.getElementById('highscore').innerText = 'High Score: ' + highScore;
    }

    placeFood();
  } else {
    snake.pop();
  }
}

function placeFood() {
  const maxIndex = canvasSize / box - 2;
  const minIndex = 1;
  food = {
    x: Math.floor(Math.random() * (maxIndex - minIndex + 1) + minIndex) * box,
    y: Math.floor(Math.random() * (maxIndex - minIndex + 1) + minIndex) * box
  };
}

function startGame() {
  resetGame();
  gameInterval = setInterval(draw, 100);
  document.getElementById('playButton').style.display = 'none'; // مخفی کردن دکمه
}

function resetGame() {
  clearInterval(gameInterval);
  snake = [{ x: 160, y: 200 }];
  direction = 'RIGHT';
  score = 0;
  isPaused = false;
  document.getElementById('score').innerText = 'Score: ' + score;
  placeFood();
}

// کنترل با کیبورد
document.addEventListener('keydown', event => {
  const key = event.key;
  if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
});
