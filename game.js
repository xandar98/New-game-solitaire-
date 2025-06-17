// ------- Deck Creation --------
const suits = ['♠', '♥', '♣', '♦'];
const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

function generateDeck() {
  const deck = [];
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value, faceUp: false });
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const deck = shuffle(generateDeck());

// ------- Tableau Setup --------
const tableau = [[], [], [], [], [], [], []];

function dealToTableau(deck) {
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = deck.pop();
      card.faceUp = (row === col); // Just top card is face-up
      tableau[col].push(card);
    }
  }
}
dealToTableau(deck);

// ------- Canvas Setup --------
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.9;

const CARD_WIDTH = 60;
const CARD_HEIGHT = 90;
const CARD_GAP_X = 20;
const CARD_GAP_Y = 25;
const TABLEAU_START_X = 50;
const TABLEAU_START_Y = 50;

// ------- Draw Cards --------
function drawCard(x, y, card) {
  ctx.fillStyle = "white";
  ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
  ctx.strokeStyle = "black";
  ctx.strokeRect(x, y, CARD_WIDTH, CARD_HEIGHT);

  if (card.faceUp) {
    ctx.fillStyle = (card.suit === '♥' || card.suit === '♦') ? "red" : "black";
    ctx.font = "16px Arial";
    ctx.fillText(`${card.value}${card.suit}`, x + 10, y + 20);
  } else {
    ctx.fillStyle = "black";
    ctx.fillRect(x, y, CARD_WIDTH, CARD_HEIGHT);
  }
}

function drawTableau() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let col = 0; col < tableau.length; col++) {
    let x = TABLEAU_START_X + col * (CARD_WIDTH + CARD_GAP_X);
    for (let row = 0; row < tableau[col].length; row++) {
      let y = TABLEAU_START_Y + row * CARD_GAP_Y;
      drawCard(x, y, tableau[col][row]);
    }
  }
}
drawTableau();

// ------- Touch Drag System --------
let draggingCard = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

canvas.addEventListener("touchstart", function(e) {
  const touch = e.touches[0];
  const touchX = touch.clientX;
  const touchY = touch.clientY;

  for (let col = 0; col < tableau.length; col++) {
    const x = TABLEAU_START_X + col * (CARD_WIDTH + CARD_GAP_X);
    for (let row = 0; row < tableau[col].length; row++) {
      const y = TABLEAU_START_Y + row * CARD_GAP_Y;
      const card = tableau[col][row];

      if (
        card.faceUp &&
        touchX >= x &&
        touchX <= x + CARD_WIDTH &&
        touchY >= y &&
        touchY <= y + CARD_HEIGHT
      ) {
        draggingCard = { card, col, row };
        dragOffsetX = touchX - x;
        dragOffsetY = touchY - y;
        return;
      }
    }
  }
});

canvas.addEventListener("touchmove", function(e) {
  if (!draggingCard) return;
  e.preventDefault();
  const touch = e.touches[0];
  const x = touch.clientX - dragOffsetX;
  const y = touch.clientY - dragOffsetY;

  drawTableau();
  drawCard(x, y, draggingCard.card);
});

canvas.addEventListener("touchend", function(e) {
  if (draggingCard) {
    draggingCard = null;
    drawTableau();
  }
});
