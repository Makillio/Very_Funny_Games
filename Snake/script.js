const boardSize = 10;
const gameBoard = document.getElementById('game-board');
const cells = [];
let snake = [{ x: 0, y: 0 }];
let food = { x: 5, y: 5 };
let direction = 'right';
let speed = 800;
let gameLoopTimeout = null;

const scoreSpan = document.getElementById('score');
const speedRange = document.getElementById('speed-range');
const speedSpan = document.getElementById('speed-value');

// Инициализация доски
function initBoard() {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cells.push(cell);
      gameBoard.appendChild(cell);
    }
  }
}

function render() {
  cells.forEach(c => c.classList.remove('snake', 'food'));
  snake.forEach(s => {
    const index = s.y * boardSize + s.x;
    cells[index].classList.add('snake');
  });
  const foodIndex = food.y * boardSize + food.x;
  cells[foodIndex].classList.add('food');
  scoreSpan.textContent = snake.length;
}

function update() {
  const head = { ...snake[0] };
  switch (direction) {
    case 'up': head.y--; break;
    case 'down': head.y++; break;
    case 'left': head.x--; break;
    case 'right': head.x++; break;
  }

  if (head.x < 0 || head.x >= boardSize || head.y < 0 || head.y >= boardSize) {
    resetGame();
    return;
  }

  const collision = snake.some((seg, i) => i > 0 && seg.x === head.x && seg.y === head.y);
  if (collision) {
    resetGame();
    return;
  }

  if (head.x === food.x && head.y === food.y) {
    snake.unshift(head);
    generateFood();
  } else {
    snake.pop();
    snake.unshift(head);
  }
}

function generateFood() {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * boardSize),
      y: Math.floor(Math.random() * boardSize)
    };
  } while (snake.some(s => s.x === newFood.x && s.y === newFood.y));
  food = newFood;
}

function resetGame() {
  snake = [{ x: 0, y: 0 }];
  direction = 'right';
  generateFood();
  render();
}

function gameLoop() {
  update();
  render();
  gameLoopTimeout = setTimeout(gameLoop, speed);
}

function restartLoop() {
  clearTimeout(gameLoopTimeout);
  gameLoopTimeout = setTimeout(gameLoop, speed);
}

// Обработчики
document.addEventListener('keydown', (e) => {
  const key = e.key;
  if (key === 'ArrowUp') { e.preventDefault(); direction = 'up'; }
  else if (key === 'ArrowDown') { e.preventDefault(); direction = 'down'; }
  else if (key === 'ArrowLeft') { e.preventDefault(); direction = 'left'; }
  else if (key === 'ArrowRight') { e.preventDefault(); direction = 'right'; }
  else if (key.toLowerCase() === 'r') { resetGame(); }
});

document.getElementById('btn-up').addEventListener('click', () => direction = 'up');
document.getElementById('btn-down').addEventListener('click', () => direction = 'down');
document.getElementById('btn-left').addEventListener('click', () => direction = 'left');
document.getElementById('btn-right').addEventListener('click', () => direction = 'right');

speedRange.addEventListener('input', (e) => {
  speedSpan.textContent = e.target.value;
});

speedRange.addEventListener('change', (e) => {
  speed = parseInt(e.target.value, 10);
  restartLoop();
});

// Старт
initBoard();
generateFood();
render();
gameLoopTimeout = setTimeout(gameLoop, speed);
