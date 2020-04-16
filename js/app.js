"use strict";
const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext("2d");
let cw = (canvas.width = 900);
let ch = (canvas.height = 450);
const allObj = [];
const allChart = [];
let ballSize = 20;
let animationID;
const population = 100;
let globetrotters = 50;
let clicks = 0;
let apm = [];
let timeInfo, apmInfo;
const colorHealthy = "#123258";
const colorInfected = "red";
const wrapper = document.querySelector(".wrapper");
const menu = document.querySelector(".menu");
const difficult = document.querySelector('input[type="range"]');
const diffInfo = document.querySelector(".diff-info span");
const about = document.querySelector(".btn--about");
const help = document.querySelector(".btn--help");
const music = document.querySelector(".btn--music");
const start = document.querySelector(".btn--start");
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
    // mouth
    context.strokeStyle = "#fefefe";
    context.moveTo(this.x, this.y);
    context.beginPath();
    context.arc(this.x, this.y, this.size / 2, 0, Math.PI, false);
    context.stroke();
    context.closePath();
    // left eye
    context.moveTo(this.x + 10, this.y - 10);
    context.beginPath();
    context.arc(this.x - 6, this.y - 8, this.size / 8, 0, Math.PI * 2, true);
    context.stroke();
    context.closePath();
    // right eye
    context.moveTo(this.x + 10, this.y - 10);
    context.beginPath();
    context.arc(this.x + 6, this.y - 8, this.size / 8, 0, Math.PI * 2, true);
    context.stroke();
    context.closePath();
  }

  moveBall(allObj) {
    const bL = this.x;
    const bR = this.x + this.size;
    const bB = this.y + this.size;
    const bT = this.y;
    let collisionType = 0;

    for (let i in allObj) {
      let oR = allObj[i].x + allObj[i].size;
      let oL = allObj[i].x;
      let oT = allObj[i].y;
      let oB = allObj[i].y + allObj[i].size;
      if (this === allObj[i]) continue;
      else if (
        ((oL <= bR && bR <= oR) || (oL <= bL && bL <= oR)) &&
        ((oT <= bT && bT <= oB) || (oT <= bB && bB <= oB))
      ) {
        this.speedX = -this.speedX;
        break;
      }
      if (this.speedX > 0 && bR + this.speedX > cw) {
        collisionType = 2;
        break;
      } else if (this.speedX < 0 && bL - this.speedX < this.size) {
        collisionType = 2;
        break;
      }
      if (this.speedY > 0 && bB + this.speedY > ch) {
        collisionType = 3;
        break;
      } else if (this.speedY < 0 && bT - this.speedY < this.size) {
        collisionType = 3;
        break;
      }

      if (this.speedX > 0 && this.speedY > 0) {
        if (
          bL < oR &&
          ((oL <= bR + this.speedX && bR + this.speedX <= oR) ||
            (oL <= bL + this.speedX && bL + this.speedX <= oR)) &&
          bT < oB &&
          ((oT <= bT - this.speedY && bT - this.speedY <= oB) ||
            (oT <= bB + this.speedY && bB + this.speedY <= oB))
        ) {
          collisionType = 1;
          if (allObj[i].color == colorInfected) {
            this.color = colorInfected;
          } else if (this.color == colorInfected) {
            allObj[i].color = colorInfected;
          }
          break;
        }
      } else if (this.speedX > 0 && this.speedY < 0) {
        if (
          bL < oR &&
          ((oL <= bR + this.speedX && bR + this.speedX <= oR) ||
            (oL <= bL + this.speedX && bL + this.speedX <= oR)) &&
          bB > oT &&
          ((oT <= bT - this.speedY && bT - this.speedY <= oB) ||
            (oT <= bB - this.speedY && bB - this.speedY <= oB))
        ) {
          collisionType = 1;
          break;
        }
      } else if (this.speedX < 0 && this.speedY > 0) {
        if (
          bR > oL &&
          ((oL <= bR - this.speedX && bR - this.speedX <= oR) ||
            (oL <= bL - this.speedX && bL - this.speedX <= oR)) &&
          bT < oB &&
          ((oT <= bT - this.speedY && bT - this.speedY <= oB) ||
            (oT <= bB + this.speedY && bB + this.speedY <= oB))
        ) {
          collisionType = 1;
          break;
        }
      } else {
        if (
          bR > oL &&
          ((oL <= bR - this.speedX && bR - this.speedX <= oR) ||
            (oL <= bL - this.speedX && bL - this.speedX <= oR)) &&
          bB > oT &&
          ((oT <= bT - this.speedY && bT - this.speedY <= oB) ||
            (oT <= bB - this.speedY && bB - this.speedY <= oB))
        ) {
          collisionType = 1;
          break;
        }
      }
    }
    if (collisionType) {
      if (collisionType == 1) {
        this.speedX = -this.speedX;
        if (Math.round(Math.random())) this.speedY = -this.speedY;
      } else if (collisionType == 2) {
        this.speedX = -this.speedX;
      } else if (collisionType == 3) {
        this.speedY = -this.speedY;
      }
    } else {
      this.x += this.speedX;
      this.y += this.speedY;
    }
  }
}

class Chart {
  constructor(time, healthy, infected) {
    this.time = time;
    this.healthy = healthy;
    this.infected = infected;
  }
  // drawChart(context) {}
}

// FUNCTIONS

// RANDOM
const intRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

// UPDATE ELEMENT POSITION
const updatePosition = (element, t, l) => {
  const top = canvas.offsetTop;
  const left = canvas.offsetLeft;

  element.style.top = `${top + t}px`;
  element.style.left = `${left + l}px`;
};

// DELETE ARR
const delAllObj = (arr) => arr.splice(0, arr.length);

// REMOVE WINDOW
const removeWindow = (window) => {
  wrapper.contains(window) ? window.remove() : null;
};

// UPDATE CANVAS RESOLUTION
const updateGameArea = (allObj) => {
  cw = canvas.width = screen.availWidth > 900 ? 900 : screen.availWidth * 0.95;
  // cw = canvas.width = innerWidth > 900 ? 900 : innerWidth * 0.95;
  ch = canvas.height =
    screen.availHeight > 450 ? 450 : screen.availHeight * 0.9;
  // ch = canvas.height = innerHeight > 450 ? 450 : innerHeight * 0.7;
  wrapper.style.width =
    screen.availWidth > 900 ? 900 + "px" : screen.availWidth * 0.95 + "px";
  wrapper.style.height =
    screen.availHeight > 515 ? 515 + "px" : screen.availHeight * 0.8 + "px";
  menu.style.width = screen.availWidth > 900 ? `${cw - 65}px` : cw + "px";
  ballSize = innerWidth > 900 ? 20 : 15;
  allObj.map((e) => {
    e.size = innerWidth > 900 ? 20 : 15;
  });
};

// ADD BUBBLES
const addObj = (num) => {
  for (let i = 0; i < num; i++) {
    const obj = new Ball(
      intRandom(0, cw),
      intRandom(0, ch),
      ballSize,
      colorHealthy,
      intRandom(1, 2),
      intRandom(1, 2)
    );
    allObj.push(obj);
  }
};

// INFECTED BUBBLES
const infected = (arr, n, p) => {
  const c = Math.floor((n * p) / 100) < 1 ? 1 : Math.floor((n * p) / 100);
  for (let i = 0; i < c; i++) {
    arr[i].color = colorInfected;
  }
};
// DRAW ON CANVAS
const drawAllObj = (allObj, context) => {
  allObj.forEach((e) => {
    context.fillStyle = "#000";
    context.font = "normal 16px Arial";
    // context.textAlign = "end";
    // context.textAlign = "start";
    context.fillText(clicks, 10, 20);
    context.fillText(timeInfo, 10, 440);
    context.fillStyle = e.color;
    e.drawBall(context);
    e.moveBall(allObj);
  });
};

// CLEAR CANVAS
const clearCanvas = (canvas, context) => context.clearRect(0, 0, cw, ch);

// CANVAS ANIMATION
const animationLoop = () => {
  animationID = requestAnimationFrame(animationLoop);
  clearCanvas(canvas, ctx);
  drawAllObj(allObj, ctx);
};

// CANVAS CLICKS
canvas.addEventListener("click", (event) => {
  clicks++;
  const radius = 40;
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;
  allObj.forEach((e) => {
    let distanse = Math.sqrt(
      Math.pow(mouseX - e.x, 2) + Math.pow(mouseY - e.y, 2)
    );
    if (distanse < radius) {
      e.color = colorHealthy;
    }
  });
});

// QUARANTINE
difficult.addEventListener(
  "change",
  (e) => {
    diffInfo.innerHTML = `${difficult.value}`;
    globetrotters = (population * (100 - difficult.value)) / 100;
  },
  false
);

updateGameArea(allObj);

// RESIZE LISTENER
window.addEventListener(
  "resize",
  () => {
    updateGameArea(allObj);
  },
  false
);

// START
start.addEventListener("click", () => {
  clicks = 0;
  timeInfo = "00:00";
  delAllObj(apm);
  clearInterval(goTime);
  timer();
  clearCanvas(canvasChart, ctxChart);
  removeWindow(canvasChart);
  document.querySelector(".save-chart")
    ? document.querySelector(".save-chart").remove()
    : null;
  updateGameArea(allObj);
  cancelAnimationFrame(animationID);
  delAllObj(allObj);
  delAllObj(allChart);
  addObj(globetrotters);
  infected(allObj, globetrotters, 10);
  animationLoop();
  addChart();
});

// AUDIO
const audio = document.querySelector("#myAudio");
const playAudio = () => audio.play();
const pauseAudio = () => audio.pause();

const togglePlay = () => {
  if (audio.paused) {
    music.innerHTML = '<i class="fas fa-volume-mute"></i>';
    audio.play();
  } else {
    music.innerHTML = '<i class="fas fa-volume-up"></i>';
    audio.pause();
  }
};
music.addEventListener("click", togglePlay, false);

// COUNT INFECTED  BUBBLES
const countInfected = () => {
  let count = 0;
  allObj.forEach((e) => {
    e.color === colorInfected ? count++ : null;
  });
  return count;
};

// END GAME
const endGame = (score) => {
  clearInterval(goTime);
  endGameInfo(score);
  addCanvasChart();
  drawChartFrame(ctxChart);
  drawChartData(ctxChart, allChart);
};

const addChart = () => {
  const add = setInterval(() => {
    const obj = new Chart(
      allChart.length,
      allObj.length - countInfected(),
      countInfected()
    );
    allChart.push(obj);
    // console.log(allObj.length, countInfected(), add);
    if (allObj.length - countInfected() === 0) {
      clearInterval(add);
      endGame("lose");
    }
    if (countInfected() === 0) {
      clearInterval(add);
      endGame("win");
    }
  }, 1000);
  add;
};

// SAVE CANVAS CHART
const saveChartBtn = () => {
  const content = document.createElement("a");
  content.classList.add("save-chart");
  content.style.top = canvasChart.offsetTop + 10 + "px";
  content.style.left =
    canvasChart.offsetLeft + canvasChart.offsetWidth - 25 + "px";
  content.title = "Zapisz wykres";
  content.download = "The Virus Busters.png";
  content.innerHTML = `
  <i class="fas fa-save" onclick="saveChart(canvasChart)"></i>
  `;
  wrapper.appendChild(content);
};

const saveChart = (canvas) => {
  const saveBtn = document.querySelector(".save-chart");
  const dataURL = canvas
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  saveBtn.href = dataURL;
};

// ABOUT
const aboutWindow = document.createElement("div");
const addAboutWindow = () => {
  aboutWindow.classList.add("about");
  aboutWindow.innerHTML = `
<i class="fas fa-times" onclick="removeWindow(aboutWindow)"></i>
<p class="about__title">The Virus Busters</p>
<div class="about__links">
<p>Created by
<a href="https://www.kawalec.eu" target="_blank">Paweł Kawalec</a>
</p>
<p> Images from  
<a href="https://www.freepik.com" target="_blank">Freepik</a>
</p>
<p> Music from  
<a href="https://www.bensound.com" target="_blank">Bensound</a>
</p>
<p> Icons from  
<a href="https://fontawesome.com" target="_blank">Font Awesome</a>
</p>
</div>
<p class="about__version">TheVirusBusters version 1.1.0</p>
`;
  updatePosition(aboutWindow, 40, 40);
  wrapper.appendChild(aboutWindow);
};
about.addEventListener("click", () => {
  addAboutWindow();
});

// HELP
const howPlay = document.createElement("div");
const addHowPlayWindow = () => {
  howPlay.classList.add("play");
  howPlay.innerHTML = `
    <i class="fas fa-times" onclick="removeWindow(howPlay)"></i>
    <div>
    <p>Zapraszamy dzielnych pogromców wirusów do gry <b>The Virus Busters</b>.</p>
    <p>Twoim celem w grze będzie wyleczenie wszystkich zainfekowanych wirusem bąbelków. Można to zrobić klikając w zarażony bąbelek.</p>
    <div class="bubbles play__desktop-info">
    <div class="bubble bubbleRed"></div>
    <div class="bubble bubbleBlue"></div>
    </div>
    <p>Suwak w menu, domyślnie ustawiony na 50%, pozwoli Ci na decyzję, jaki procent populacji bąbelków zostanie wysłany na kwarantannę. <u>Sprawdź jaki to ma wpływ na grę!</u></p>
    <p class="play__desktop-info">Przycisk <i class="fas fa-volume-up"></i> w każdej chwili pozwoli Ci włączyć / wyłączyć muzykę w tle.</p>
    <P class="play__desktop-info">Korzystając z przycisku <i class="fas fa-power-off"></i> możesz uruchomić nową grę. Po jej uruchomieniu populacja bąbelków, których nie wysłałeś na kwarantannę, zacznie siać zarazę wśród pozostałych.</p>
    <p class="play__desktop-info>Po zakończeniu gry, podsumowanie Twoich osiągnięć zostanie zaprezentowane na wykresie.</p>
    <p>W ramach <b>nagrody</b> niespodzianki, dostaniesz ważne informacje, które mogą być dla Ciebie bardzo cenne, dlatego przeczytaj uważnie wyskakujący po ukończeniu gry komunikat.</p>
    </div>
    `;
  updatePosition(howPlay, 20, 20);
  wrapper.appendChild(howPlay);
};

help.addEventListener("click", () => {
  addHowPlayWindow();
});

// WIN - LOSE
const endInfo = document.createElement("div");
const endGameInfo = (score) => {
  endInfo.classList.add("end-info");

  endInfo.innerHTML =
    score === "win"
      ? `
  <i class="fas fa-times" onclick="removeWindow(endInfo)"></i>
  <h2>Gratulacje zwycięstwa!</h2>
  <p>Jesteś super! Masz bystry umysł i szybkie palce. Szybko klikasz, albo wysłałeś większość bąbelków na kwarantannę, bo doskonale wiesz jakie to ważne i to nie tylko w grze.</p>

  `
      : `
  <i class="fas fa-times" onclick="removeWindow(endInfo)"></i>
  <h2>Tym razem się nie udało.</h2>
  <p>Nie martw się, to tylko gra. Jeśli zostaniesz w domu, to możesz zagrać ponownie. Jeśli wyślesz więcej bąbelków na kwarantannę, to będzie łatwiej wygrać z wirusem.</p>
  `;

  endInfo.innerHTML += `
  <p>Możesz zagrać ponownie, lub zrobić coś innego, na co zawsze brakowało Ci czasu. Tylko pamiętaj - <b>zostań w domu</b>! Dzięki temu możesz ocalić siebie, albo <b>kogoś bliskiego!</b></p>
  <p class="important"><i class="fas fa-biohazard"></i> Nie narażaj i nie zarażaj! <i class="fas fa-biohazard"></i></p>
  <p class="endInfo__desktop">Chociaż czujesz się dobrze, to możesz być nosicielem i zarażać innych. Nawet, jeśli nie jesteś w grupie ryzyka i potencjalnie Twój organizm poradzi sobie z choroba, to pamiętaj, że Twoi najbliżsi mogą nie mieć tyle szczęścia.</p>
  `;
  updatePosition(endInfo, 20, 20);
  wrapper.appendChild(endInfo);
};

// CANVAS CHART
const canvasChart = document.createElement("canvas");
canvasChart.setAttribute("class", "chart");
const ctxChart = canvasChart.getContext("2d");
canvasChart.height = 400;
canvasChart.width = 800;

const addCanvasChart = () => {
  updatePosition(canvasChart, 25, 45);
  wrapper.appendChild(canvasChart);
  // ADD SAVE BUTTON
  saveChartBtn();
};

const drawChartFrame = (context) => {
  // BCG CHART
  context.fillStyle = "#fff";
  context.fillRect(0, 0, cw, ch);

  // FRAME CHART
  context.beginPath();
  context.strokeStyle = "#000";
  context.moveTo(20, 20);
  context.lineTo(30, 30);
  context.moveTo(20, 20);
  context.lineTo(10, 30);
  context.moveTo(20, 20);
  context.lineTo(20, 380);
  context.lineTo(780, 380);
  context.lineTo(770, 370);
  context.moveTo(780, 380);
  context.lineTo(770, 390);
  context.stroke();
  context.closePath();

  // const waterMark = Math.trunc(
  //   (clicks + 97) % Math.trunc((60 * clicks) / (apm.length - 1))
  // ).toString(16);
  // context.fillStyle = "#dedede";
  // context.fillText(waterMark, 780, 55);
  context.shadowOffsetX = -5;
  context.shadowOffsetY = 5;
  context.shadowColor = "rgba(0,0,0,0.2)";
  context.shadowBlur = 3;
  context.font = "bold 12px sans-serif";
  context.textAlign = "end";
  context.fillStyle = "#000";
  context.fillText(clicks, 790, 170);
  context.fillText(Math.trunc((60 * clicks) / (apm.length - 1)), 790, 150);
  context.fillText(timeInfo, 790, 130);
  context.textAlign = "start";
  context.fillText("czas gry:", 700, 130);
  context.fillText("kliknięcia:", 700, 170);
  context.fillText("APM:", 700, 150);
  context.fillText("zdrowi", 735, 220);
  context.fillText("chorzy", 735, 240);
  context.fillText("APS", 735, 260);
  context.fillText("infekcje", 2, 14);
  context.fillText("czas", 735, 395);

  context.beginPath();
  context.moveTo(15, 190);
  context.setLineDash([10, 10]);
  context.lineTo(790, 190);
  context.moveTo(15, 95);
  context.lineTo(790, 95);
  context.moveTo(15, 285);
  context.lineTo(790, 285);
  context.stroke();
  context.closePath();

  context.font = "bold 10px sans-serif";
  context.fillText(Math.round((allObj.length * 3) / 4), 2, 98);
  context.fillText(Math.round(allObj.length / 2), 2, 193);
  context.fillText(Math.round(allObj.length / 4), 2, 288);

  context.beginPath();
  context.strokeStyle = colorHealthy;
  context.moveTo(710, 216);
  context.lineTo(730, 216);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.strokeStyle = colorInfected;
  context.moveTo(710, 236);
  context.lineTo(730, 236);
  context.stroke();
  context.closePath();

  context.beginPath();
  context.strokeStyle = "#000";
  context.moveTo(710, 256);
  context.lineTo(730, 256);
  context.stroke();
  context.closePath();
};

// DATA CHART
const drawChartData = (context, allChart) => {
  const unitX = (canvasChart.width * 0.9) / allChart.length;
  const unitY = (canvasChart.height * 0.9) / allObj.length;

  const startInfX = 30;
  const startInfY = 380 - unitY * allChart[0].infected;
  // INFECTED PATCH
  context.beginPath();
  context.strokeStyle = colorInfected;
  context.setLineDash([]);
  context.moveTo(startInfX, startInfY);
  allChart.forEach((e) => {
    context.lineTo(startInfX + e.time * unitX, 380 - unitY * e.infected);
  });
  context.stroke();
  context.closePath();

  const startHealX = 30;
  const startHealY = 380 - unitY * allChart[0].healthy;
  // HEALTHY PATCH
  context.beginPath();
  context.strokeStyle = colorHealthy;
  context.setLineDash([]);
  context.moveTo(startHealX, startHealY);
  allChart.forEach((e) => {
    context.lineTo(startHealX + e.time * unitX, 380 - unitY * e.healthy);
  });
  context.stroke();
  context.closePath();

  // APS PATH
  context.beginPath();
  context.strokeStyle = "#000";
  context.moveTo(20, 380);
  apm.forEach((e, i) => {
    context.lineTo(20 + i * unitX, 380 - e * unitY);
  });
  context.stroke();
  context.closePath();
};

// TIMER
let goTime;
const timer = () => {
  let sec = 0;
  apm.push(0);
  goTime = setInterval(() => {
    sec++;
    let min =
      Math.floor(sec / 60) < 10
        ? `0${Math.floor(sec / 60)}`
        : `${Math.floor(sec / 60)}`;
    timeInfo =
      sec >= 6000
        ? `${"Time is over!"}`
        : sec % 60 < 10
        ? `${min}:0${sec % 60}`
        : `${min}:${sec % 60}`;
    // APM
    apm.push(clicks - apm.reduce((a, c) => a + c));
  }, 1000);
};
