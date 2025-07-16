const cells = document.querySelectorAll('.cell');
const statusText = document.getElementById('statusText');
const resetBtn = document.getElementById('resetBtn');
const modeSelect = document.getElementById('modeSelect');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let mode = modeSelect.value;

// All possible winning combinations
const winConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

// for mode change
modeSelect.addEventListener('change', () => {
  mode = modeSelect.value;
  resetGame();
});

// Handle click on cell
function handleCellClick(e) {
  const index = e.target.getAttribute('data-index');
  if (gameBoard[index] !== '' || !gameActive) {
    return;
  }

  if (mode === 'multiplayer') {
    makeMove(index, currentPlayer);
    if (checkWinner(currentPlayer)) {
      endGame(`Player ${currentPlayer} Wins! 🎉`);
    } else if (isDraw()) {
      endGame("It's a Draw!");
    } else {
      currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
      statusText.textContent = `Player ${currentPlayer}'s turn`;
    }
  } else if (mode === 'ai') {
    if (currentPlayer !== 'X') return;

    makeMove(index, 'X');
    if (checkWinner('X')) {
      endGame('Player X Wins! 🎉');
    } else if (isDraw()) {
      endGame("It's a Draw!");
    } else {
      currentPlayer = 'O';
      statusText.textContent = `AI is thinking...`;

      setTimeout(() => {
        aiMove();
      }, 500);
    }
  }
}

// AI  move
function aiMove() {
  if (!gameActive) return;

  const bestMove = getBestMove(); // Get best move using minimax
  makeMove(bestMove, 'O');

  if (checkWinner('O')) {
    endGame('AI Wins! 🤖');
  } else if (isDraw()) {
    endGame("It's a Draw!");
  } else {
    currentPlayer = 'X';
    statusText.textContent = `Player X's turn`;
  }
}

// player move 
function makeMove(index, player) {
  gameBoard[index] = player;
  cells[index].textContent = player;
  console.log(`Player ${player} moved to cell ${index}`);
}

// Check if  player won
function checkWinner(player) {
  for (let i = 0; i < winConditions.length; i++) {
    const [a, b, c] = winConditions[i];
    if (gameBoard[a] === player && gameBoard[b] === player && gameBoard[c] === player) {
      // Highlight the winning combination
      cells[a].classList.add('win');
      cells[b].classList.add('win');
      cells[c].classList.add('win');
      return true;
    }
  }
  return false;
}

// Check if the board is full and no winner
function isDraw() {
  return gameBoard.indexOf('') === -1;
}

// End the game
function endGame(message) {
  statusText.textContent = message;
  gameActive = false;
  console.log("Game ended:", message);
}

// Reset the game
function resetGame() {
  gameBoard = ['', '', '', '', '', '', '', '', ''];
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('win');
  });
  currentPlayer = 'X';
  statusText.textContent = `Player X's turn`;
  gameActive = true;
  console.log("Game has been reset.");
}

// AI: Get best move using minimax
function getBestMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (gameBoard[i] === '') {
      gameBoard[i] = 'O';
      let score = minimax(gameBoard, 0, false);
      gameBoard[i] = '';
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  console.log("AI chooses move:", move);
  return move;
}

// Minimax algorithm
function minimax(board, depth, isMaximizing) {
  // Base cases
  if (checkWinner('O')) return 10 - depth;
  if (checkWinner('X')) return depth - 10;
  if (isDraw()) return 0;

  if (isMaximizing) {
    let best = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'O';
        let score = minimax(board, depth + 1, false);
        board[i] = '';
        if (score > best) {
          best = score;
        }
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === '') {
        board[i] = 'X';
        let score = minimax(board, depth + 1, true);
        board[i] = '';
        if (score < best) {
          best = score;
        }
      }
    }
    return best;
  }
}

// Event listeners
cells.forEach(cell => {
  cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);
