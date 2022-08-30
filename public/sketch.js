//CANVAS

import { StaticCopyUsage } from "three";
import { host, pullCanvas, canvasImports } from "./three.js";

//variables related to serving the ball
let served = false;

// Variables related to moving ball
let chaos = 0.5;
let position;
let velocity;
let r = 12;
let speed = 10;

//ball trail calculator
let canvasW = (window.innerWidth / 100) * 86;
let canvasH = (window.innerWidth / 100) * 120;
let playerW = canvasW / 8;
let playerH = canvasH / 8;
//bepaald hoe snel een speler kan bewegen
let stapCooldown = false;
let controleWaarde = 0.4;
let stapGrootteProt = 0.4;
let stapGrootteAnti = 0.4;

let protPos = {
  x: canvasW / 2 - playerW / 2,
  y: 0,
  width: playerW,
  height: playerH,
};
let antiPos = {
  x: canvasW / 2 - playerW / 2,
  y: canvasH - playerH,
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
  } else {
    protPos.x = protPos.x - stapGrootteProt;
  }
}

function antiPosCalc() {
  //stapCooldown = true;
  //setTimeout(function () {
  stapCooldown = false;
  //}, 50);
  if (position.x >= antiPos.x + antiPos.width / 2) {
    antiPos.x = antiPos.x + stapGrootteAnti;
  } else {
    antiPos.x = antiPos.x - stapGrootteAnti;
  }
}

var root = document.querySelector(":root");
function setColour(key, value) {
  root.style.setProperty(key, value);
}
function getColour(key) {
  var rs = getComputedStyle(root);
  return rs.getPropertyValue(key);
}

let swingCooldown = false;
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
        stapGrootteProt = stapGrootteProt * 4;
        setTimeout(() => {
          stapGrootteProt = stapGrootteProt * 0;
          stapGrootteProt = 0;
          setTimeout(function () {
            stapGrootteProt = controleWaarde;
          }, 1000);
        }, 1000);
        break;
      case 1:
        stapGrootteAnti = stapGrootteAnti * 4;
        setTimeout(() => {
          stapGrootteAnti = stapGrootteAnti * 0;
          stapGrootteAnti = 0;
          setTimeout(function () {
            stapGrootteAnti = controleWaarde;
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
let test = null;
function putCanvas(msg) {
  test = msg;
}

function setup() {
  //86 vw breed & 120 vw hoog

  const canvas = createCanvas(canvasW, canvasH);
  canvas.id("tennisCourt");
  canvas.parent("stadium");

  fill(128);

  //start ellipse at middle top of screen
  //Deze veranderen voor de speler dat moet opslagen
  position = createVector(protPos.x + playerW / 2, playerH + 10);
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
    }

    // top
    if (position.y > height - r) {
      position.y = height - r;
      velocity.y *= -1;
      velocity.x = Math.random() / chaos - 0.5 / chaos;
    }

    if (stapCooldown == false) {
      protPosCalc();
      antiPosCalc();
    }

    fill("#ffffff");
    rect(protPos.x, protPos.y, protPos.width, protPos.height);

    fill("red");
    rect(antiPos.x, antiPos.y, antiPos.width, antiPos.height);
    canvasExports[2] = position;
  } else {
    if (!canvasImports) {
    }
    //hier niet hostend canvas script tekenen
    //ball
    /*
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
    fill("#ffffff");
    rect(
      canvasImports[0].x,
      canvasImports[0].y,
      canvasImports[0].width,
      canvasImports[0].height
    );

    //antiPos
    fill("red");
    rect(
      canvasImports[1].x,
      canvasImports[1].y,
      canvasImports[1].width,
      canvasImports[1].height
    );
    */
  }

  //playerposition, antiposition & ball position overzetten naar variables en dan exporteren
  //console.log(canvasExports);
  pullCanvas(canvasExports);
}

window.setup = setup;
window.draw = draw;

export { swing, canvasExports, putCanvas };
