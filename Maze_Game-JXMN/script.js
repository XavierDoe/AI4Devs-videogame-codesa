// Get references to DOM elements
const canvas = document.getElementById('mazeCanvas');
const ctx = canvas.getContext('2d');
const resetButton = document.getElementById('resetButton');
const messageDiv = document.getElementById('message');
const timerSpan = document.getElementById('timer');

// Maze settings (adjust these for different difficulties)
let cols = 20;
let rows = 20;
const cellSize = canvas.width / cols;

// Arrays and variables for the game
let grid = [];
let startCell = { col: 0, row: 0 }; // Will be randomized in resetGame()
let exitCell = { col: cols - 1, row: rows - 1 };
let player = { col: 0, row: 0, color: 'red' };

// Timer variables
let startTime = null;
let timerInterval = null;

// Cell class for each grid cell
class Cell {
  constructor(col, row) {
    this.col = col;
    this.row = row;
    // Walls: top, right, bottom, left (all start as present)
    this.walls = { top: true, right: true, bottom: true, left: true };
    this.visited = false;
  }

  draw() {
    const x = this.col * cellSize;
    const y = this.row * cellSize;
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    // Draw top wall
    if (this.walls.top) {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellSize, y);
      ctx.stroke();
    }
    // Draw right wall
    if (this.walls.right) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y);
      ctx.lineTo(x + cellSize, y + cellSize);
      ctx.stroke();
    }
    // Draw bottom wall
    if (this.walls.bottom) {
      ctx.beginPath();
      ctx.moveTo(x + cellSize, y + cellSize);
      ctx.lineTo(x, y + cellSize);
      ctx.stroke();
    }
    // Draw left wall
    if (this.walls.left) {
      ctx.beginPath();
      ctx.moveTo(x, y + cellSize);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
  }

  // Returns an array of unvisited neighboring cells
  getUnvisitedNeighbors() {
    const neighbors = [];
    const top    = getCell(this.col, this.row - 1);
    const right  = getCell(this.col + 1, this.row);
    const bottom = getCell(this.col, this.row + 1);
    const left   = getCell(this.col - 1, this.row);

    if (top && !top.visited) neighbors.push(top);
    if (right && !right.visited) neighbors.push(right);
    if (bottom && !bottom.visited) neighbors.push(bottom);
    if (left && !left.visited) neighbors.push(left);

    return neighbors;
  }
}

// Utility: get the cell at (col, row) if it exists
function getCell(col, row) {
  if (col < 0 || row < 0 || col >= cols || row >= rows) return undefined;
  return grid[row * cols + col];
}

// Maze generation using Recursive Backtracking
function generateMaze() {
  grid = [];
  // Create the grid of cells
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      grid.push(new Cell(col, row));
    }
  }

  const stack = [];
  let current = grid[0];
  current.visited = true;

  while (true) {
    const neighbors = current.getUnvisitedNeighbors();
    if (neighbors.length) {
      // Pick a random neighbor
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      next.visited = true;
      stack.push(current);
      removeWalls(current, next);
      current = next;
    } else if (stack.length) {
      current = stack.pop();
    } else {
      break;
    }
  }

  // Reset visited flags (for potential future use)
  grid.forEach(cell => cell.visited = false);
}

// Remove the wall between two adjacent cells
function removeWalls(a, b) {
  const x = a.col - b.col;
  if (x === 1) {
    a.walls.left = false;
    b.walls.right = false;
  } else if (x === -1) {
    a.walls.right = false;
    b.walls.left = false;
  }
  const y = a.row - b.row;
  if (y === 1) {
    a.walls.top = false;
    b.walls.bottom = false;
  } else if (y === -1) {
    a.walls.bottom = false;
    b.walls.top = false;
  }
}

// Draw the maze, start/exit markers, and player
function draw() {
  // Clear the canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Draw maze walls
  grid.forEach(cell => cell.draw());

  // Draw the start cell (lightgreen)
  ctx.fillStyle = 'lightgreen';
  ctx.fillRect(startCell.col * cellSize + 4, startCell.row * cellSize + 4, cellSize - 8, cellSize - 8);

  // Draw the exit cell (lightblue)
  ctx.fillStyle = 'lightblue';
  ctx.fillRect(exitCell.col * cellSize + 4, exitCell.row * cellSize + 4, cellSize - 8, cellSize - 8);

  // Draw the player (red circle)
  ctx.fillStyle = player.color;
  const centerX = player.col * cellSize + cellSize / 2;
  const centerY = player.row * cellSize + cellSize / 2;
  ctx.beginPath();
  ctx.arc(centerX, centerY, cellSize / 4, 0, Math.PI * 2);
  ctx.fill();
}

// Check if the player has reached the exit
function checkVictory() {
  if (player.col === exitCell.col && player.row === exitCell.row) {
    messageDiv.textContent = 'Congratulations! You reached the exit!';
    clearInterval(timerInterval);
    // Remove keydown listener to prevent further moves
    document.removeEventListener('keydown', handleKeyDown);
  }
}

// Move the player if there is no wall blocking the direction
function movePlayer(direction) {
  const current = getCell(player.col, player.row);
  if (direction === 'ArrowUp' && !current.walls.top) {
    player.row--;
  } else if (direction === 'ArrowRight' && !current.walls.right) {
    player.col++;
  } else if (direction === 'ArrowDown' && !current.walls.bottom) {
    player.row++;
  } else if (direction === 'ArrowLeft' && !current.walls.left) {
    player.col--;
  }
  draw();
  checkVictory();
}

// Handle keydown event for arrow keys
function handleKeyDown(e) {
  const allowed = ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'];
  if (allowed.includes(e.key)) {
    movePlayer(e.key);
  }
}

// Update the timer display
function updateTimer() {
  if (!startTime) return;
  const elapsed = Math.floor((Date.now() - startTime) / 1000);
  timerSpan.textContent = 'Time: ' + elapsed + 's';
}

// Reset the game: generate a new maze, randomize start/exit, and start the timer
function resetGame() {
  clearInterval(timerInterval);
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
  messageDiv.textContent = '';

  generateMaze();

  // Randomize start position
  player.col = Math.floor(Math.random() * cols);
  player.row = Math.floor(Math.random() * rows);
  startCell = { col: player.col, row: player.row };

  // Randomize exit position ensuring it's different from the start
  do {
    exitCell.col = Math.floor(Math.random() * cols);
    exitCell.row = Math.floor(Math.random() * rows);
  } while (exitCell.col === player.col && exitCell.row === player.row);

  // (Re)attach the keydown listener and draw the new maze
  document.removeEventListener('keydown', handleKeyDown);
  document.addEventListener('keydown', handleKeyDown);
  draw();
}

// Set up reset button and initialize the game
resetButton.addEventListener('click', resetGame);
resetGame();