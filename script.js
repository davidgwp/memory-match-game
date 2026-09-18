const emojis = ['🍕','🎈','🐶','🌟','🚀','🎸','🍎','🌈'];
let cards = [];
let flipped = [];
let matchedCount = 0;
let moves = 0;
let timer = 0;
let timerInterval = null;
let boardLocked = false;

const board = document.getElementById('board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const winMessage = document.getElementById('winMessage');
const winStats = document.getElementById('winStats');
const restartBtn = document.getElementById('restart');

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function startTimer() {
  clearInterval(timerInterval);
  timer = 0;
  timerEl.textContent = timer;
  timerInterval = setInterval(() => {
    timer++;
    timerEl.textContent = timer;
  }, 1000);
}

function initGame() {
  cards = shuffle([...emojis, ...emojis]);
  flipped = [];
  matchedCount = 0;
  moves = 0;
  boardLocked = false;
  movesEl.textContent = moves;
  winMessage.hidden = true;
  board.innerHTML = '';
  startTimer();

  cards.forEach((emoji, index) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.setAttribute('tabindex', '0');
    card.addEventListener('click', () => flipCard(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flipCard(card);
      }
    });
    board.appendChild(card);
  });
}

function flipCard(card) {
  if (boardLocked) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
  if (flipped.length === 2) return;

  card.classList.add('flipped');
  card.textContent = card.dataset.emoji;
  flipped.push(card);

  if (flipped.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  const [first, second] = flipped;
  if (first.dataset.emoji === second.dataset.emoji) {
    first.classList.add('matched');
    second.classList.add('matched');
    flipped = [];
    matchedCount++;
    if (matchedCount === emojis.length) {
      endGame();
    }
  } else {
    boardLocked = true;
    setTimeout(() => {
      first.classList.remove('flipped');
      second.classList.remove('flipped');
      first.textContent = '';
      second.textContent = '';
      flipped = [];
      boardLocked = false;
    }, 800);
  }
}

function endGame() {
  clearInterval(timerInterval);
  winStats.textContent = `Moves: ${moves} | Time: ${timer}s`;
  winMessage.hidden = false;
}

restartBtn.addEventListener('click', initGame);

initGame();