'use strict'

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
// require('./example')

const test = require('./test')
const store = require('./store')

const SCALE = 1;
const WIDTH = 60;
const HEIGHT = 60;
const SCALED_WIDTH = SCALE * WIDTH;
const SCALED_HEIGHT = SCALE * HEIGHT;
const CYCLE_LOOP = [0, 1, 0, 2];
const FACING_DOWN = 0;
const FACING_UP = 1;
const FACING_LEFT = 2;
const FACING_RIGHT = 3;
const FRAME_LIMIT = 12;
const MOVEMENT_SPEED = 1;

const characterSprites = ['https://i.imgur.com/UXlqiz6.png', 'https://i.imgur.com/NFU0D5v.png']

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let keyPresses = {};
let currentDirection = FACING_DOWN;
let currentLoopIndex = 0;
let frameCount = 0;
window.positionX = 0
window.positionY = 0
window.user_name = ''
let img = new Image();

test.onGetCharacters()

window.addEventListener('keydown', keyDownListener);
function keyDownListener(event) {
    keyPresses[event.key] = true;
}

window.addEventListener('keyup', keyUpListener);
function keyUpListener(event) {
    keyPresses[event.key] = false
}

function loadImage() {
  img.src = 'https://i.imgur.com/UXlqiz6.png';
  img.onload = function() {
    window.requestAnimationFrame(gameLoop);
  };
}

function drawFrame(frameX, frameY, canvasX, canvasY) {
  ctx.drawImage(img,
                frameX * WIDTH, frameY * HEIGHT, WIDTH, HEIGHT,
                canvasX, canvasY, SCALED_WIDTH, SCALED_HEIGHT);
}

loadImage();

function gameLoop() {
//  console.log(positionX, positionY)
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let hasMoved = false;

  if (keyPresses.w) {
    moveCharacter(0, -MOVEMENT_SPEED, FACING_UP);
    hasMoved = true;
  } else if (keyPresses.s) {
    moveCharacter(0, MOVEMENT_SPEED, FACING_DOWN);
    hasMoved = true;
  }

  if (keyPresses.a) {
    moveCharacter(-MOVEMENT_SPEED, 0, FACING_LEFT);
    hasMoved = true;
  } else if (keyPresses.d) {
    moveCharacter(MOVEMENT_SPEED, 0, FACING_RIGHT);
    hasMoved = true;
  }

  if (hasMoved) {
    frameCount++
    if (frameCount >= FRAME_LIMIT) {
      frameCount = 0;
      currentLoopIndex++;
      if (currentLoopIndex >= CYCLE_LOOP.length) {
        currentLoopIndex = 0;
      }
    }
  }

  if (!hasMoved) {
    currentLoopIndex = 0;
  }
  ctx.fillText(window.user_name, window.positionX + 21.5, window.positionY - 10)
  drawFrame(CYCLE_LOOP[0], FACING_DOWN, store.otherCharacters.characters[0].x, store.otherCharacters.characters[0].y)
  drawFrame(CYCLE_LOOP[0], FACING_RIGHT, store.otherCharacters.characters[1].x, store.otherCharacters.characters[1].y)
  drawFrame(CYCLE_LOOP[currentLoopIndex], currentDirection, positionX, positionY);
  window.requestAnimationFrame(gameLoop);
}

function moveCharacter(deltaX, deltaY, direction) {
  if (positionX + deltaX > 0 && positionX + SCALED_WIDTH + deltaX < canvas.width) {
    positionX += deltaX;
    console.log(positionX, positionY)
  }
  if (positionY + deltaY > 0 && positionY + SCALED_HEIGHT + deltaY < canvas.height && ((positionY < 35 || positionX > 35) || (positionY > 150 || positionX > 35))) {
    console.log(positionX, positionY)
    positionY += deltaY;
  }
  currentDirection = direction;
}

$(() => {
  $('#create-character').on('click', test.onCreateCharacter)
  $('#sign-in').on('submit', test.onSignIn)
})

module.exports = {
  characterSprites
}
