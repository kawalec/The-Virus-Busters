const canvas = document.querySelector(".myCanvas");
const ctx = canvas.getContext("2d");
let cw = (canvas.width = 900);
let ch = (canvas.height = 450);
let allObj = [];
let ballSize = 20;
let animationID;
const population = 100;
let globetrotters = 50;
const wrapper = document.querySelector(".wrapper");
const menu = document.querySelector(".menu");
const difficult = document.querySelector('input[type="range"]');
const diffInfo = document.querySelector(".diff-info");
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
          if (allObj[i].color == "red") {
            this.color = "red";
          } else if (this.color == "red") {
            allObj[i].color = "red";
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
  // changeColor(color) {
  //   this.color = color;
  // }
}

class Chart {
  constructor(time, healthy, infected) {
    this.time = time;
    this.healthy = healthy;
    this.infected = infected;
  }
  drawChart(context) {}
}

const intRandom = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const updateGameArea = (allObj) => {
  cw = canvas.width = innerWidth > 900 ? 900 : innerWidth * 0.95;
  ch = canvas.height = innerHeight > 450 ? 450 : innerHeight * 0.7;
  menu.style.width = `${cw - 65}px`;
  ballSize = innerWidth > 900 ? 20 : 10;
  allObj.map((e) => {
    e.size = innerWidth > 900 ? 20 : 10;
  });
};

const updatePosition = (element, t, l) => {
  const top = canvas.offsetTop;
  const left = canvas.offsetLeft;

  element.style.top = `${top + t}px`;
  element.style.left = `${left + l}px`;
};

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
  // allObj[0].color = "red";
};

const infected = (arr, n, p) => {
  const c = Math.floor((n * p) / 100) < 1 ? 1 : Math.floor((n * p) / 100);
  for (let i = 0; i < c; i++) {
    arr[i].color = "red";
  }
};

const delAllObj = (arr) => arr.splice(0, arr.length);

const drawAllObj = (allObj, context) => {
  allObj.forEach((e) => {
    context.fillStyle = e.color;
    e.drawBall(context);
    e.moveBall(allObj);
  });
};

const clearCanvas = (canvas, context) => context.clearRect(0, 0, cw, ch);

const animationLoop = () => {
  animationID = requestAnimationFrame(animationLoop);
  clearCanvas(canvas, ctx);
  drawAllObj(allObj, ctx);
};

canvas.addEventListener("click", (event) => {
  const radius = 40;
  const mouseX = event.clientX - canvas.offsetLeft;
  const mouseY = event.clientY - canvas.offsetTop;
  allObj.forEach((e) => {
    let distanse = Math.sqrt(
      Math.pow(mouseX - e.x, 2) + Math.pow(mouseY - e.y, 2)
    );
    if (distanse < radius) {
      e.color = "green";
    }
  });
});

difficult.addEventListener(
  "change",
  (e) => {
    diffInfo.innerHTML = `${difficult.value}% of people in quarantine!`;
    globetrotters = (population * (100 - difficult.value)) / 100;
  },
  false
);

updateGameArea(allObj);

window.addEventListener(
  "resize",
  () => {
    updateGameArea(allObj);
  },
  false
);

start.addEventListener("click", () => {
  updateGameArea(allObj);
  cancelAnimationFrame(animationID);
  delAllObj(allObj);
  addObj(globetrotters);
  animationLoop();
});

const audio = document.querySelector("#myAudio");
const playAudio = () => audio.play();
const pauseAudio = () => audio.pause();

const togglePlay = () => {
  console.log("foo");
  if (audio.paused) {
    music.innerHTML = '<i class="fas fa-volume-mute"></i>';
    audio.play();
  } else {
    music.innerHTML = '<i class="fas fa-volume-up"></i>';
    audio.pause();
  }
};

music.addEventListener("click", togglePlay, false);

const removeWindow = (window) => {
  wrapper.contains(window) ? window.remove() : null;
  // window.remove()
};

// ABOUT
const aboutWindow = document.createElement("div");
const addAboutWindow = () => {
  aboutWindow.classList.add("about");
  // aboutWindow.style.top = `${innerHeight / 2 - 200}px`;
  // aboutWindow.style.left = `${innerWidth / 2 - 350}px`;
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
    <div class="bubbles">
    <div class="bubble bubbleRed"></div>
    <div class="bubble bubbleBlue"></div>
    </div>
    <p>Suwak w menu, domyślmnie ustawiony na 50%, pozwoli Ci na decyzję, jaki procent populacji bąbelków zostanie wysłany na kwarantannę. <u>Sprawdz jaki to ma wpływ na grę!</u></p>
    <p>Przycisk <i class="fas fa-volume-up"></i> w każdej chwili pozwoli Ci włączyć / wyłączyć muzykę w tle.</p>
    <P>Korzystając z przycisku <i class="fas fa-power-off"></i> możesz uruchomić nową grę. Po jej uruchomieniu populacja bąbelków, których nie wysłałeś na kwarantannę, zacznie siać zarazę wśród pozostałych.</p>
    <p>Po zakończeniu gry, podsumowanie Twoich osiągnięć zostanie zaprezentowane na wykresie.</p>
    <p>W ramach <b>nagrody</b> niespodzianki, dostaniesz ważne informacje, które mogą być dla Ciebie bardzo cenne, dlatego przeczytaj uważnie wyskakujący po ukończeniu gry komunikat.</p>
    </div>
    `;
  updatePosition(howPlay, 20, 20);
  wrapper.appendChild(howPlay);
};

help.addEventListener("click", () => {
  addHowPlayWindow();
});
