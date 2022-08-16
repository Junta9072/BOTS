//CANVAS

import { StaticCopyUsage } from "three";

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
let stapGrootte = 0.4;

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
    protPos.x = protPos.x + stapGrootte;
  } else {
    protPos.x = protPos.x - stapGrootte;
  }
}

function antiPosCalc() {
  //stapCooldown = true;
  //setTimeout(function () {
  stapCooldown = false;
  //}, 50);
  if (position.x >= antiPos.x + antiPos.width / 2) {
    antiPos.x = antiPos.x + stapGrootte;
  } else {
    antiPos.x = antiPos.x - stapGrootte;
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
function swing(msg) {
  if (swingCooldown == false) {
    swingCooldown = true;
    console.log("player " + msg.src + " has swung his racket");
    setColour("--primary", "var(--error)");
    setTimeout(function () {
      setColour("--primary", "white");
      swingCooldown = false;
    }, 1000);
  } else {
    console.log("player " + msg.src + " is still on cooldown");
  }
}

//variables for player ball tracking
let playerSpd = canvasW / 50;

function setup() {
  //86 vw breed & 120 vw hoog

  const canvas = createCanvas(canvasW, canvasH);
  canvas.id("tennisCourt");
  canvas.parent("stadium");

  fill(128);

  //start ellipse at middle top of screen
  position = createVector(width / 2, 0);

  //calculate initial random velocity
  velocity = createVector(Math.random() / chaos, 1, 0);
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
  ctx.drawImage(
    document.querySelector(".canvasIMG"),
    position.x - r,
    position.y - r,
    r * 2,
    r * 2
  );
  ellipse(position.x, position.y, r * 2, r * 2);

  //deze achterhouden tot er opgeslagen wordt
  function serve() {
    served = true;
    //move ellipse
    position.add(velocity);
  }

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
}

window.setup = setup;
window.draw = draw;

export { swing, serve };
