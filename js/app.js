const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext("2d");
let cw = (canvas.width = 900);
let ch = (canvas.height = 450);
let allObj = [];
let ballSize = 20;
let animationID;
const population = 100;
let globetrotters = 50;

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

  moveBall(allObj) {
    console.log("move");
  }
}

const intRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const clearCanvas = (canvas, context) => context.clearRect(0, 0, cw, ch);

const addObj = (num) => {
  for (let i = 0; i < num; i++) {
    const obj = new Ball(
      intRandom(0, cw),
      intRandom(0, ch),
      ballSize,
      "blue",
      intRandom(1, 2),
      intRandom(1, 2)
    );
    allObj.push(obj);
  }
  allObj[0].color = "red";
};
addObj(5);
const delAllObj = (arr) => arr.splice(0, arr.length);

const drawAllObj = (allObj, context) => {
  allObj.forEach((e) => {
    context.fillStyle = e.color;
    e.drawBall(context);
    e.move(allObj);
  });
};

const animationLoop = () => {
  animationID = requestAnimationFrame(animationLoop);
  clearCanvas(canvas, ctx);
  drawAllObj(allObj, ctx);
};
