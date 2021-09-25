let img_background, img_brush, img_rake, bLayer, pLayer; // all images
let bool_button1 = 0; // bool_button1ean toggle
let gui_img = [];
let pebble = [];
let pebbleu = [];
let tempX = [];
let tempY = [];
let tempcount = 0;
let randomScalar = [];
let tempID = [];
let colourBool = 0;
let storedOrientation;
let currentOrientation;
let rotateDirection = -1;

// declare all brush variables
let rakeX = 0,
  rakeY = 0,
  rake2X = 0,
  rake2Y = 0,
  rake3X = 0,
  rake3Y = 0,
  angle1, segLength;

//button spacing
let longEdge;
let audio;
let hMax, lMax;
let driftX, driftY;
let inverter = 1;

function preload() {
  //load all brush assets and background
  img_brush = loadImage('assets/brushA.png');
  img_rake = loadImage('assets/rake1a.png');
  img_rake2 = loadImage('assets/rake2b.png');
  img_background = loadImage('assets/sand_01.jpg')
  //load all GUI assets
  for (let i = 1; i < 3; i++) {
    gui_img[i] = loadImage('assets/gui' + i + '.png');
  }
  //Load all pebble assets
  for (let i = 1; i < 8; i++) {
    pebble[i] = loadImage('assets/wpebble' + i + '.png');
  }
  //Load all pebble shadow assets
  for (let i = 1; i < 8; i++) {
    pebbleu[i] = loadImage('assets/wpebbleu' + i + '.png');
  }
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bLayer = createGraphics(windowWidth, windowHeight);
  pLayer = createGraphics(windowWidth, windowHeight);
  textLayer = createGraphics(windowWidth, windowHeight);
  introLayer = createGraphics(windowWidth, windowHeight);
  //pixelDensity(1); // effectively ignores retina displays
  colorMode(HSB, 360, 100, 100, 1.0);
  calcDimensions();
  sizeWindow();
  slide = 0;
  slideShow();

  if (width < height) {
    storedOrientation = "portrait";
  } else {
    storedOrientation = "landscape";
  }


}

function rotateWindow() {
  var newbLayer = createGraphics(windowWidth, windowHeight);
  newbLayer.push();
  newbLayer.translate(width / 2, height / 2);
  newbLayer.rotate((PI / 2) * rotateDirection);
  newbLayer.translate(-height / 2, -width / 2);
  newbLayer.image(bLayer, 0, 0, windowHeight, windowWidth);
  newbLayer.pop()
  bLayer.resizeCanvas(windowWidth, windowHeight);
  bLayer = newbLayer;

  var newpLayer = createGraphics(windowWidth, windowHeight);
  newpLayer.push();
  newpLayer.translate(width / 2, height / 2);
  newpLayer.rotate((PI / 2) * rotateDirection);
  newpLayer.translate(-height / 2, -width / 2);
  newpLayer.image(pLayer, 0, 0, windowHeight, windowWidth);
  newpLayer.pop()
  pLayer.resizeCanvas(windowWidth, windowHeight);
  pLayer = newpLayer;

  rotateDirection = rotateDirection * -1;
}

function stretchWindow() {
  var newbLayer = createGraphics(windowWidth, windowHeight);
  newbLayer.image(bLayer, 0, 0, windowWidth, windowHeight);
  bLayer.resizeCanvas(windowWidth, windowHeight);
  bLayer = newbLayer;

  var newpLayer = createGraphics(windowWidth, windowHeight);
  newpLayer.image(pLayer, 0, 0, windowWidth, windowHeight);
  pLayer.resizeCanvas(windowWidth, windowHeight);
  pLayer = newpLayer;
}

function sizeWindow() {

  resizeCanvas(windowWidth, windowHeight);
  image(img_background, 0, 0, width, height);

  if (width < height) {
    currentOrientation = "portrait";
  } else {
    currentOrientation = "landscape";
  }

  if (currentOrientation === storedOrientation) {
    stretchWindow();
  } else {
    rotateWindow();
  }

  storedOrientation = currentOrientation;

  segLength = width / 15;
  findLongEdge();
  // set brush sizes relative to width, must be below findLongEdge
  img_brush.resize(longEdge / 35, longEdge / 20);
  img_rake.resize(longEdge / 40, longEdge / 10);
  img_rake2.resize(longEdge / 30, longEdge / 9);
  textLayer.resizeCanvas(windowWidth, windowHeight);

  //writeTextUI();
  bLayer.tint(255, 190);
  driftX = width / 2;
  driftY = 0;
}

function findLongEdge() {
  if (width > height) {
    longEdge = width;
    lMax = width / 100;
  } else {
    longEdge = height;
    hMax = height / 100;
  }
  vMax = longEdge / 100;
}

function draw() {
  if (introState === 3) {
    imageMode(CORNER);
    blendMode(BLEND);
    image(img_background, 0, 0, width, height);
    blendMode(OVERLAY);
    image(bLayer, 0, 0, windowWidth, windowHeight);
    blendMode(BLEND);
    image(pLayer, 0, 0, windowWidth, windowHeight);
  } else {
    //introLayer.image(textLayer, 0, 0, width, height);
    blendMode(BLEND);
    image(img_background, 0, 0, width, height);
    blendMode(MULTIPLY);
    image(introLayer, 0, 0, width, height);
    blendMode(BLEND);
    if (slide === 0) {
      //textLayer.text(introText[slide], width/2, (height/8)*(slide+2));
    } else {
      textLayer.text(introText[slide - 1], width / 2, (height / 6) * (slide));
    } // this if else statgement needs to be replaced with a better system. The current state tracking is not working
    image(textLayer, 0, 0, width, height);

    if (slide > 0) {

      introLayer.blendMode(BLEND);
      introLayer.fill(255, 5);
      introLayer.noStroke();
      introLayer.ellipse(driftX, driftY, vMax * 15, vMax * 15);
      driftX = driftX + (random(0, 10)) * inverter;
      if (driftX <= 40 || driftX >= width - 40) {
        inverter = -inverter;
        driftX = driftX + (30 * inverter);
      }
      driftY = driftY + (random(-1, 2));
    }
  }
}

function touchMoved() {
  if (introState === 3) {
    bLayer.blendMode(BLEND);
    if (bool_button1 === 0) {
      dx = winMouseX - rake3X;
      dy = winMouseY - rake3Y;
      angle1 = atan2(dy, dx);
      rake3X = winMouseX - (cos(angle1) * (segLength / 2));
      rake3Y = winMouseY - (sin(angle1) * (segLength / 2));
      segment(rake3X, rake3Y, angle1, img_brush)
      // reference for brush offset at https://p5js.org/examples/interaction-follow-1.html
    }

    if (bool_button1 === 1) {
      dx = winMouseX - rakeX;
      dy = winMouseY - rakeY;
      angle1 = atan2(dy, dx);
      rakeX = winMouseX - (cos(angle1) * segLength);
      rakeY = winMouseY - (sin(angle1) * segLength);
      segment(rakeX, rakeY, angle1, img_rake)
    }

    if (bool_button1 === 2) {
      dx = winMouseX - rake2X;
      dy = winMouseY - rake2Y;
      angle1 = atan2(dy, dx);
      rake2X = winMouseX - (cos(angle1) * segLength);
      rake2Y = winMouseY - (sin(angle1) * segLength);
      segment(rake2X, rake2Y, angle1, img_rake2)
    }
    if (bool_button1 === 3) {
      bLayer.fill(127, 90);
      bLayer.noStroke();
      bLayer.ellipse(mouseX, mouseY, vMax * 9, vMax * 9);
    }
  } else {
    if (slide === 0) {
      slide++;
      slideShow();
    } else if (slide > 0) {
      introLayer.blendMode(BLEND);
      introLayer.fill(255, 18);
      introLayer.noStroke();
      introLayer.ellipse(winMouseX, winMouseY, vMax * 15, vMax * 15);
    }
  }
  return false;
}

function segment(rakeX, rakeY, a, rake) {
  bLayer.imageMode(CENTER);
  bLayer.push();
  bLayer.translate(rakeX, rakeY);
  bLayer.rotate(a);
  bLayer.image(rake, 0, 0, 0, 0);
  bLayer.pop();
}

function resetTimeout() {
  setTimeout(reset, 50);
}

function reset() {
  click.play();
  blendMode(REPLACE);
  image(img_background, 0, 0, width, height);
  bLayer.clear();
  pLayer.clear();

  // basic random counter to determine how many pebbles will be present on the screen;
  tempcount = int(random(0.7, 3));
  // now a loop based on that random number, to place the pebbles on screen
  for (let k = 0; k < tempcount; k++) {
    randomScalar[k] = int(random(120, 180)); // scale
    tempID[k] = int(random(1, 7)); // which pebble iteration
    tempX[k] = int(random(0, width - randomScalar[k]));
    tempY[k] = int(random(0, height - randomScalar[k]));
    pLayer.image(pebble[tempID[k]], tempX[k], tempY[k], randomScalar[k], randomScalar[k]);
  }
}

function windowResized() {
  if (introState != 3) {
    sizeWindow();
  }
  if (introState === 3) {
    removeElements();
    sizeWindow();
    writeTextUI();
  }
}
