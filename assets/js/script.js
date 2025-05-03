let highScore = localStorage.getItem('snakeHighScore') || 0;
document.getElementById('highscore').innerText = 'High Score: ' + highScore;
const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const box = 10;
  const canvasSize = 400;
  let snake = [{ x: 160, y: 200 }];
  let direction = 'RIGHT';
  let food = {};
  let score = 0;
  let gameInterval;
  let isPaused = false;

  function drawBox(x, y, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, box, box);
  }

  function draw() {
    if (score > highScore) {
  highScore = score;
  localStorage.setItem('snakeHighScore', highScore);
  document.getElementById('highscore').innerText = 'High Score: ' + highScore;
}

    if (isPaused) return;
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
      if (i === 0) { // Head of the snake
        drawBox(snake[i].x, snake[i].y, 'lime');  // Head color is brighter (lime)
        drawEyes(snake[i].x, snake[i].y);  // Add eyes to the head
      } else {
        drawBox(snake[i].x, snake[i].y, 'green'); // Body color is darker
      }
    }

    drawBox(food.x, food.y, 'red');

    let head = { ...snake[0] };
    if (direction === 'LEFT') head.x -= box;
    if (direction === 'RIGHT') head.x += box;
    if (direction === 'UP') head.y -= box;
    if (direction === 'DOWN') head.y += box;

    // Game over conditions
    if (
  head.x < 0 || head.y < 0 ||
  head.x > canvasSize - box || head.y > canvasSize - box ||
  snake.some(segment => segment.x === head.x && segment.y === head.y)
) {
  clearInterval(gameInterval);
  document.getElementById('lastScore').innerText = 'Your Score: ' + score;
  document.getElementById('controls').style.display = 'block';
  return;
}
alert('Game Over! Your score: ' + score + '\nHigh Score: ' + highScore);


    snake.unshift(head);

    // Eat food
    if (head.x === food.x && head.y === food.y) {
      score++;
      document.getElementById('score').innerText = 'Score: ' + score;
      placeFood();
    } else {
      snake.pop();
    }
  }
function drawEyes(x, y) {
  const eyeRadius = 3;
  let offset1 = { x: 0, y: 0 };
  let offset2 = { x: 0, y: 0 };

  switch (direction) {
    case 'RIGHT':
      offset1 = { x: 6, y: 2 };
      offset2 = { x: 6, y: 7 };
      break;
    case 'LEFT':
      offset1 = { x: 1, y: 2 };
      offset2 = { x: 1, y: 7 };
      break;
    case 'UP':
      offset1 = { x: 2, y: 1 };
      offset2 = { x: 7, y: 1 };
      break;
    case 'DOWN':
      offset1 = { x: 2, y: 6 };
      offset2 = { x: 7, y: 6 };
      break;
  }

  // w eye
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x + offset1.x, y + offset1.y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + offset2.x, y + offset2.y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // eye
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(x + offset1.x, y + offset1.y, eyeRadius / 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(x + offset2.x, y + offset2.y, eyeRadius / 2, 0, Math.PI * 2);
  ctx.fill();
}

  function placeFood() {
    food = {
      x: Math.floor(Math.random() * (canvasSize / box)) * box,
      y: Math.floor(Math.random() * (canvasSize / box)) * box
    };
  }
//start Game
  function startGame() {
  document.getElementById('controls').style.display = 'none';

    resetGame();
    gameInterval = setInterval(draw, 100);
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

  function resumeGame() {
    if (!gameInterval) {
      gameInterval = setInterval(draw, 100);
      isPaused = false;
    }
  }

  document.addEventListener('keydown', event => {
    const key = event.key;
    if (key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
    if (key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
    if (key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
    if (key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
  });
