const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext("2d");
let cw = (canvas.width = 900);
let ch = (canvas.height = 450);

class Ball {
  constructor(x, y, size, color, speedX, speedY) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
    this.speedX = speedX;
    this.speedY = speedY;
  }

  drawBall(context) {
    context.beginPath();
    context.fillStyle = this.color;
    context.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();
  }
}
