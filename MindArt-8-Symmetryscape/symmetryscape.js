let brush = [];
let longEdge, shortEdge, circleRad, vMax, wmax, hmax;
let drawLayer, textLayer, uiLayer, lineLayer, introLayer;
let brushSelected = 0;
let faderStart;
let qtyIntroDots = 50;
let xCo = [];
let yCo = [];
let velo = [];
let brushBool = 0;
let intX, intY;
let introCol;
let introSize;
let eraseAlpha;

function preload() {
  bg = loadImage('assets/paper.jpg');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
  eraseAlpha = loadImage('assets/eraseAlpha3.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Ignores retina displays
  drawLayer = createGraphics(width, height);
  drawLayer.colorMode(RGB, 255, 255, 255, 1000);
  drawLayer.strokeCap(PROJECT);
  uiLayer = createGraphics(width, height);
  textLayer = createGraphics(width, height);
  lineLayer = createGraphics(width, height);
  introLayer = createGraphics(width, height);
  // drawLayer.colorMode(RGB, 255, 255, 255, 1000);
  introCol = 250;
  introLayer.fill(250, 2);
  fill(0);
  introSize = 150;
  introLayer.strokeWeight(2);
  introLayer.stroke(200, 2);
  dimensionCalc();
  slide = 0;
  slideShow();
  for (i = 0; i < qtyIntroDots; i++) {
    xCo[i] = int(random(0, width));
    yCo[i] = 0;
    velo[i] = (random(1, 5));
  }
  intX = width / 5
  intY = height / 2;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  dimensionCalc();
  textLayer.resizeCanvas(windowWidth, windowHeight);
  uiLayer = createGraphics(width, height);

  lineLayer = createGraphics(width, height);
  introLayer = createGraphics(width, height);
  if (introComplete) {
    removeElements();
    let drawLayerNew = createGraphics(windowWidth, windowHeight);
    drawLayerNew.image(drawLayer, 0, 0, windowWidth, windowHeight);
    drawLayer.resizeCanvas(windowWidth, windowHeight);
    drawLayer = drawLayerNew;
    drawLayerNew.remove();
    writeTextUI();


  }
}

function dimensionCalc() {
  wmax = width / 100;
  hmax = height / 100;
  if (width > height) {
    longEdge = width;
    shortEdge = height;
    circleRad = shortEdge * 0.45;
    vMax = width / 100;
  } else {
    longEdge = height;
    shortEdge = width;
    vMax = height / 100;
    circleRad = shortEdge * 0.45;
  }
}

function mousePressed() {
    faderStart = 600;

    if (slide === 0){
    startUp();
    }

    return false;
  }


function startUp() {

  click.play();
  startButton.remove();
  slide++;
  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }

  introState = 1;
  slideShow();

}


function touchMoved() {
  if (introComplete) {
    makeDrawing(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
  } else {
    if (dist(intX, intY, mouseX, mouseY) < 60) {
      intX = mouseX;
      intY = mouseY;
      introCol = introCol - 0.1;
    }
    if (dist(width - intX, intY, mouseX, mouseY) < 60) {
      intX = width - mouseX;
      intY = mouseY;
      introCol = introCol - 0.1;
    }
    introLayer.fill(introCol, 50);
    introLayer.stroke(introCol - 10, 50);
    fill(255 - introCol);
    introSize = introSize - 0.03;
  }
  return false;
}

function makeDrawing(_x, _y, pX, pY) {
  drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 1, 2)); // for line work
  drawLayer.stroke(0);
  if (counter === 0) {
    brushIt(_x, _y, pX, pY);
    brushIt(width - _x, _y, width - pX, pY);
  } else if (counter === 1) {
    brushIt(_x, _y, pX, pY);
    brushIt(_x, height - _y, pX, height - pY);
  } else if (counter === 2) {
    brushIt(_x, _y, pX, pY);
    brushIt(width - _x, _y, width - pX, pY);
    brushIt(_x, height - _y, pX, height - pY);
    brushIt(width - _x, height - _y, width - pX, height - pY);
  } else if (counter === 3) {
    drawLayer.push();
    brushIt(_x, _y, pX, pY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 0.5);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(_x, _y, pX, pY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 01);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(_x, _y, pX, pY);
    drawLayer.translate(width / 2, height / 2);
    drawLayer.rotate(PI * 1.5);
    drawLayer.translate(-width / 2, -height / 2);
    brushIt(_x, _y, pX, pY);
    drawLayer.pop();
  }
}

function brushIt(_x, _y, pX, pY) {
  if (brushSelected === 3) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 2, 3)); // for line work
    drawLayer.stroke(100, 100, 100, 500);
    for (i = 0; i < 10; i++) {
      let randX = randomGaussian(-6, 6);
      let randY = randomGaussian(-6, 6);
      drawLayer.line(_x + randX, _y + randY, pX + randX, pY + randY);
    }
  }
  if (brushSelected === 1) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 3, 5)); // for line work
    drawLayer.stroke(10, 10, 10, 600);
    drawLayer.line(_x, _y, pX, pY);
  }
  if (brushSelected === 0) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 14, 15)); // for line work
    drawLayer.stroke(20, 20, 20, 500);
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 4) {
    drawLayer.strokeWeight(abs(random(0, 4)));
    for (i = 0; i < 60; i++) {
      let tempCol = abs(random(200, 255));
      drawLayer.stroke(tempCol, tempCol, tempCol, 1000);
      drawLayer.point(_x + randomGaussian(-10, 10), _y + randomGaussian(-10, 10));
    }
  } else if (brushSelected === 5) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 30, 40)); // for line work
    drawLayer.stroke(255, 255, 255, 350);
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 2) {
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 50, 60)); // for line work
    if (faderStart <= 0) {
      brushBool = 0;
    }
    if (faderStart >= 1000) {
      brushBool = 1;
    }
    if (brushBool === 0) {
      drawLayer.stroke(100, 100, 100, (faderStart += 20) / 5);
    }
    if (brushBool === 1) {
      drawLayer.stroke(100, 100, 100, (faderStart -= 20) / 5);
    }
    drawLayer.line(_x, _y, pX, pY);
  } else if (brushSelected === 6) {
    drawLayer.blendMode(REMOVE);

    drawLayer.image(eraseAlpha, _x-50, _y-50, 100, 100);
    drawLayer.blendMode(BLEND);

  }
}

function draw() {
  if (introComplete) {
    image(bg, 0, 0, width, height);
    image(drawLayer, 0, 0, width, height);
    blendMode(BLEND);
    image(lineLayer, 0, 0, width, height);
    image(uiLayer, 0, 0, width, height);
  } else {
    blendMode(BLEND);
    background(106, 175, 172, 100);
    if (slide > 0) {
      introLayer.ellipse(intX, intY, introSize);
      introLayer.ellipse(width - intX, intY, introSize);
      image(introLayer, 0, 0, width, height);
      ellipse(intX, intY, introSize * 0.8);
      ellipse(width - intX, intY, introSize * 0.8);
    }
    if (slide === 0) {} else {
      textLayer.text(introText[slide - 1], width / 2, (height / 3) * (slide-1));
    } // this if else statgement needs to be replaced with a better system. The current state tracking is not working
    image(textLayer, 0, 0, width, height);
  }
}
