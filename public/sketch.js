//CANVAS

import { StaticCopyUsage } from "three";
import { host, pullCanvas, canvasImports } from "./three.js";

//css variables get function
var root = document.querySelector(":root");
function setColour(key, value) {
  root.style.setProperty(key, value);
}
function getColour(key) {
  var rs = getComputedStyle(root);
  return rs.getPropertyValue(key);
}

//variables related to score & game progression
let protScore = 0;
let antScore = 0;
let antText = document.querySelector(".scoreProt");
let protText = document.querySelector(".scoreAnt");
antText.textContent = antScore;
protText.textContent = protScore;

function gameScore(input) {
  switch (input) {
    case 0:
      antScore++;
      //classList add animation en na duration terug nemen
      //score color zetten
      setColour("--score", "#2e38ed");
      antText.classList.toggle("hoera");
      setTimeout(function () {
        antText.classList.toggle("hoera");
      }, 750);
      break;
    case 1:
      protScore++;
      setColour("--score", "#e81840");
      protText.classList.toggle("hoera");
      setTimeout(function () {
        protText.classList.toggle("hoera");
      }, 750);
      break;

    default:
      break;
  }
  antText.textContent = antScore;
  protText.textContent = protScore;
}

//variables related to serving the ball
let served = false;

// Variables related to moving ball
let chaos = 0.5;
let position;
let velocity;
let r = 12;
let speed = 10;

//variables related to setup & draw functions
let canvasW;
let canvasH;
let field = document.querySelector(".field");
canvasH = field.offsetHeight;
canvasW = field.offsetWidth;
document.body.onresize = function () {
  canvasH = field.offsetHeight;
  canvasW = field.offsetWidth;
};

let playerW = canvasW / 8;
let playerH = canvasH / 8;
//bepaald hoe snel een speler kan bewegen
let stapCooldown = false;
let controleWaarde = 0.4;
let stapGrootteProt = 0.4;
let stapGrootteAnti = 0.4;

let protagonistSprite = ".tennisPlayerLeft";
let protPos = {
  x: canvasW / 2 - playerW / 2,
  y: canvasW / 5,
  width: playerW,
  height: playerH,
};

let antagonistSprite = ".antagonistLeft";
let antiPos = {
  x: canvasW / 2 - playerW / 2,
  y: canvasH - playerH - canvasH / 6,
  width: playerW,
  height: playerH,
};

function protPosCalc() {
  //stapCooldown = true;
  //setTimeout(function () {
  stapCooldown = false;
  //}, 50);
  if (position.x >= protPos.x + protPos.width / 2) {
    protPos.x = protPos.x + stapGrootteProt;
    if (position.x - protPos.x + protPos.width / 2 > 100) {
      protagonistSprite = ".antagonistRight";
    } else {
      protagonistSprite = ".antagonistLeft";
    }
  } else {
    protPos.x = protPos.x - stapGrootteProt;
    if (position.x - protPos.x + protPos.width / 2 > -100) {
      protagonistSprite = ".antagonistLeft";
    } else {
      protagonistSprite = ".antagonistRight";
    }
  }
}

function antiPosCalc() {
  //stapCooldown = true;
  //setTimeout(function () {
  stapCooldown = false;
  //}, 50);
  if (position.x >= antiPos.x + antiPos.width / 2) {
    antiPos.x = antiPos.x + stapGrootteAnti;
    if (position.x - antiPos.x + antiPos.width / 2 > 100) {
      antagonistSprite = ".tennisPlayerRight";
    } else {
      antagonistSprite = ".tennisPlayerLeft";
    }
  } else {
    antiPos.x = antiPos.x - stapGrootteAnti;
    if (position.x - antiPos.x + antiPos.width / 2 > -100) {
      antagonistSprite = ".tennisPlayerLeft";
    } else {
      antagonistSprite = ".tennisPlayerRight";
    }
  }
}

let swingCooldown = false;
let protSwing = false;
let protCooldown = false;
let antiSwing = false;
let antiCooldown = false;
function swing(meOrYou) {
  if (swingCooldown == false) {
    //stukje voor opslag
    if (served == false) {
      velocity = createVector(Math.random() / chaos, 2, 0);
      position.add(velocity);
      served = true;
    }

    swingCooldown = true;
    //speed boost na slag

    switch (meOrYou) {
      case 0:
        protSwing = true;
        stapGrootteProt = stapGrootteProt * 4;
        setTimeout(() => {
          stapGrootteProt = stapGrootteProt * 0;
          stapGrootteProt = 0;
          setTimeout(function () {
            stapGrootteProt = controleWaarde;
            protSwing = false;
          }, 1000);
        }, 1000);
        break;
      case 1:
        antiSwing = true;
        stapGrootteAnti = stapGrootteAnti * 4;
        setTimeout(() => {
          stapGrootteAnti = stapGrootteAnti * 0;
          stapGrootteAnti = 0;
          setTimeout(function () {
            stapGrootteAnti = controleWaarde;
            antiSwing = false;
          }, 2000);
        }, 1000);
        break;

      default:
        break;
    }

    setColour("--primary", "var(--error)");
    setTimeout(function () {
      setColour("--primary", "white");
      swingCooldown = false;
    }, 1000);
  }
}

let canvasExports = [protPos, antiPos, position];
function putCanvas(msg) {
  //console.log(canvasImports);
}

function setup() {
  //86 vw breed & 120 vw hoog

  const canvas = createCanvas(field.offsetWidth, field.offsetHeight);
  canvas.id("tennisCourt");
  canvas.parent("stadium");

  fill(128);

  //start ellipse at middle top of screen
  //Deze veranderen voor de speler dat moet opslagen
  position = createVector(protPos.x + playerW / 2, playerH + canvasW / 4);
  canvasExports[2] = position;

  //calculate initial random velocity
  velocity = createVector(/*Math.random() / chaos*/ 0, 0, 0);
  velocity.mult(speed);
}

function draw() {
  let ctx = canvas.getContext("2d");
  //draw background
  clear();
  fill("rgba(0, 0, 0, 0)");
  noStroke();
  rect(0, 0, width, height);

  //draw ellipse
  noStroke();
  if (host == true) {
    ctx.drawImage(
      document.querySelector(".canvasIMG"),
      position.x - r,
      position.y - r,
      r * 2,
      r * 2
    );
    ellipse(position.x, position.y, r * 2, r * 2);

    //move ellipse
    position.add(velocity);
    //}

    // detect boundary collision
    // right
    if (position.x > width - r) {
      position.x = width - r;
      velocity.x *= -1;
    }
    // left
    if (position.x < r) {
      position.x = r;
      velocity.x *= -1;
    }
    // top
    if (position.y < r) {
      position.y = r;
      velocity.y *= -1;
      velocity.x = Math.random() / chaos - 0.5 / chaos;
      console.log("bots boven");
      gameScore(0);
    }

    // top
    if (position.y > height - r) {
      position.y = height - r;
      velocity.y *= -1;
      velocity.x = Math.random() / chaos - 0.5 / chaos;
      console.log("bots bottom");
      gameScore(1);
    }

    //Hier player collision zetten
    if (
      position.y <= protPos.y &&
      position.y >= protPos.y + playerH &&
      protSwing == true
    ) {
      console.log("prot HIT");
      if (protCooldown == false) {
        velocity.y *= -1;
        protCooldown = true;
        setTimeout(function () {
          protCooldown = false;
        }, 1000);
      }
    }

    //Hier player collision zetten
    if (
      position.y >= antiPos.y &&
      position.y <= antiPos.y + playerH &&
      antiSwing == true
    ) {
      console.log("anti HIT");
      if (antiCooldown == false) {
        velocity.y *= -1;
        protCooldown = true;
        setTimeout(function () {
          antiCooldown = false;
        }, 1000);
      }
    }

    if (stapCooldown == false) {
      protPosCalc();
      antiPosCalc();
    }

    ctx.drawImage(
      document.querySelector(protagonistSprite),
      protPos.x,
      protPos.y,
      protPos.width,
      protPos.height
    );
    rect(protPos.x, protPos.y, protPos.width, protPos.height);

    ctx.drawImage(
      document.querySelector(antagonistSprite),
      antiPos.x,
      antiPos.y,
      antiPos.width,
      antiPos.height
    );
    rect(antiPos.x, antiPos.y, antiPos.width, antiPos.height);
    canvasExports[2] = position;
  } else {
    if (!canvasImports) {
    } else {
      console.log(canvasImports);
      //hier niet hostend canvas script tekenen
      //ball

      console.log(canvasImports);
      ctx.drawImage(
        document.querySelector(".canvasIMG"),
        canvasImports[2].x - r,
        canvasImports[2].y - r,
        r * 2,
        r * 2
      );
      ellipse(canvasImports[2].x, canvasImports[2].y, r * 2, r * 2);

      //protPos
      ctx.drawImage(
        document.querySelector(antagonistSprite),
        canvasImports[0].x,
        canvasImports[0].y,
        canvasImports[0].width,
        canvasImports[0].height
      );
      rect(
        canvasImports[0].x,
        canvasImports[0].y,
        canvasImports[0].width,
        canvasImports[0].height
      );

      //antiPos
      ctx.drawImage(
        document.querySelector(protagonistSprite),
        canvasImports[1].x,
        canvasImports[1].y,
        canvasImports[1].width,
        canvasImports[1].height
      );
      rect(
        canvasImports[1].x,
        canvasImports[1].y,
        canvasImports[1].width,
        canvasImports[1].height
      );
    }
  }

  //playerposition, antiposition & ball position overzetten naar variables en dan exporteren
  //console.log(canvasExports);
  pullCanvas(canvasExports);
}

window.setup = setup;
window.draw = draw;

export { swing, canvasExports, putCanvas };
