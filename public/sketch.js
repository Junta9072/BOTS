//CANVAS

import { StaticCopyUsage } from "three";
import { host } from "./three.js";
//imported host: 1 = position , 2 = velocity , 3 = protpos , 4 = antipos

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
    console.log(stapGrootteAnti);
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

function setup() {
  //86 vw breed & 120 vw hoog

  const canvas = createCanvas(canvasW, canvasH);
  canvas.id("tennisCourt");
  canvas.parent("stadium");

  fill(128);

  //start ellipse at middle top of screen
  //Deze veranderen voor de speler dat moet opslagen
  position = createVector(protPos.x + playerW / 2, playerH + 10);
  console.log(position);

  //calculate initial random velocity
  velocity = createVector(/*Math.random() / chaos*/ 0, 0, 0);
  console.log(velocity);
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
      console.log(velocity.x);
      velocity.x = Math.random() / chaos - 0.5 / chaos;
    }

    // top
    if (position.y > height - r) {
      position.y = height - r;
      velocity.y *= -1;
      console.log(velocity.x);
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
  } else {
    //hier niet hostend canvas script
  }
  console.log(position);
  //deze position moet dus richting thee.js en dan naar de niet host gepasseerd worden
}

window.setup = setup;
window.draw = draw;

export { swing };
