const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

function drawWelcomeText() {
  ctx.fillStyle = "white";
  ctx.font = "24px Arial";
  ctx.fillText("Solitaire Game Loading...", 50, 100);
}

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerHeight * 0.7;

drawWelcomeText();
