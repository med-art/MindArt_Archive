// TODO:
// add screen rotation functionality
// map the scale value to max out at 1x1

let colArray = ["#e02027", "#d64389", "#943390", "#0b52a0", "#499ed7", "#16ac84", "#0b7c40", "#135741", "#f8e400", "#f0b51d", "#f78f26", "#ed6623", "#ffffff", "#ddcba5", "#b05938", "#050606"];
//red, magenta, purple, darkblue, lightblue, bluegreen, green, darkgreen, yellow, mustard, wax, orange, white, sand, brown, black
let orderTemp;
// increment from

let faderStart = 0;
let button, newButton, saveButton;
let swatch1, swatch2, swatch3, swatch4;
let eraseBool = 0;
let vW, vMin, vMax;
let horizCount = 1,
  vertCount = 3;
let pixelCount
let brushSelected = 1;
let colSelected = "#ffffff";
let colArrayNum = 8;

let selColour;

let colShift = 0;

let gridLineSize = 17;

let stage = 0;

let gridVStextureBool = 0;
let tileNum = 1;
let driftY;
let inverter = 1;
let audio;
let ellipseSize;
let sliderIcon;
let alphaTemp;

let fc2;


function preload() {
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
  sliderIcon = loadImage('assets/slider.png');
  thumbprint = loadImage('assets/thumbprint.png');
}

function setup() {
  createCanvas(windowWidth - 6, windowHeight - 6);
  calcDimensions();
  background(51);

  bg = loadImage('assets/paper.jpg');
  backdrop = createGraphics(width, height);
  backdrop.colorMode(RGB, 255, 255, 255, 1000);
  paint = createGraphics(width, height);
  paint.colorMode(RGB, 255, 255, 255, 1000);
  foreground = createGraphics(width, height);
  foreground.colorMode(RGB, 255, 255, 255, 1000);
  sliderImg = createGraphics(width, height);
  backdrop.noStroke();
  paint.noStroke();

  paint2 = createGraphics(width, height);
  paint2.colorMode(RGB, 255, 255, 255, 1000);
  foreground2 = createGraphics(width, height);
  foreground2.colorMode(RGB, 255, 255, 255, 1000);
  paint2.noStroke();






  textLayer = createGraphics(windowWidth, windowHeight);
    slide = 0;
  slideShow();
  driftY = height/3;
  ellipseSize = vMax * 10;
  fill(70, 158, 222);
}



function newGrid() {
  stage++;
  if (stage === 8) {
    vertCount = 3;
    horizCount = 2;
    stage = 1;
    gridLineSize = 17;
  }


  vertCount += 2;
  horizCount += 1;
  gridLineSize -= 2;
  colShift++;
  if (colShift === 4) {
    colShift = 0;
  }


  colSelected = colArray[12];
  brushSelected = 1;

  removeElements();
  eraseBool = 0;
  makeSwatch();



  backdrop.clear();
  backdrop.fill(colArray[(colShift * 4) + 1]);
  backdrop.rect(-10, -10, width+60, height+60);

  paint.clear();
    paint2.clear();
  // paint.fill(colArray[(colShift * 4) + 1]);
  // paint.rect(-10, -10, width + 60, height + 60); // reason for extra width = strange paint layer on boundary.

  foreground.clear();
    foreground2.clear();

  let temp = colArray[(colShift * 4) + 1];
  let fc = color(temp);
  let fc2 = color('rgba(0,0,0,0.05)');
  let fc3 = color(temp);
  fc3.setBlue(fc._getBlue()*.98);
  fc3.setRed(fc._getRed()*.98);
  fc3.setGreen(fc._getGreen()*.98);

  foreground.stroke(fc2);
  let sw = (gridLineSize * 2);
  let sh = sw/4;
  console.log("stroke: "+sw);
  console.log("gridSize: "+gridLineSize);
  console.log("stage: "+stage);
  //shadow
  foreground.strokeWeight(sw);
  for (let i = 0; i < vertCount; i++) {
    foreground.line(((width / vertCount) * i)+sh, 0, ((width / vertCount) * i)+sh, height);
  }
  for (let i = 0; i < horizCount; i++) {
    foreground.line(0, ((height / horizCount) * i)+sh, width, ((height / horizCount) * i)+sh);
  }
  //shadow
  foreground.stroke(fc3);
  for (let i = 0; i < vertCount; i++) {
    foreground.line((width / vertCount) * i, 0, (width / vertCount) * i, height);
  }
  for (let i = 0; i < horizCount; i++) {
    foreground.line(0, (height / horizCount) * i, width, (height / horizCount) * i);
  }

    vertCount2 = vertCount - 1;
    horizCount2 = horizCount - 1;
    foreground2.stroke(fc2);
    //shadow
    foreground2.strokeWeight(sw);
    for (let i = 0; i < vertCount2; i++) {
      foreground2.line(((width / vertCount2) * i)+sh, 0, ((width / vertCount2) * i)+sh, height);
    }
    for (let i = 0; i < horizCount2; i++) {
      foreground2.line(0, ((height / horizCount2) * i)+sh, width, ((height / horizCount2) * i)+sh);
    }
    //shadow
    foreground2.stroke(fc3);
    for (let i = 0; i < vertCount2; i++) {
      foreground2.line((width / vertCount2) * i, 0, (width / vertCount2) * i, height);
    }
    for (let i = 0; i < horizCount2; i++) {
      foreground2.line(0, (height / horizCount2) * i, width, (height / horizCount2) * i);
    }



}

function draw() {

  // none of this needs to be in draw - move to a static function.

  if (introState === 3) {


    blendMode(BLEND);
    if (gridVStextureBool) {

      for (let i = 0; i < tileNum; i++) {
        for (let j = 0; j < tileNum; j++) {
          image(backdrop, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
          image(paint, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
          image(foreground, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
          image(paint2, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
          image(foreground2, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
        }
      }

      image(sliderImg, 0, 0, width, height);

    } else {
      image(backdrop, 0, 0, width, height);
      image(paint, 0, 0, width, height);
      image(foreground, 0, 0, width, height);
      image(paint2, 0, 0, width, height);
      image(foreground2, 0, 0, width, height);
      //blendMode(MULTIPLY);
      image(bg,0,0,width,height);
    }
  } else {


    blendMode(BLEND);
    background(124, 206, 108, alphaTemp);




    if (slide > 0) {

    blendMode(BLEND);
    ellipse(width/2, driftY, ellipseSize, ellipseSize);
    driftY = driftY + (2 * inverter);

      if (driftY <= 100 || driftY >= height- 100) {
        inverter = -inverter;
        //driftY = driftX + (30 * inverter);
      }
    }
// can remove the below, combine
    if (slide === 0) {
    } else {
      textLayer.text(introText[slide - 1], width / 2, (height / 6) * (slide));
    } // this if else statgement needs to be replaced with a better system. The current state tracking is not working
    image(textLayer, 0, 0, width, height);

  }

}

function touchEnded(){
strokeWeight(10);
  stroke("#469ede");
  fill(255,255,255,50);
  alphaTemp = 100;
}


function touchMoved() {
  if (introState === 3) {
    if (gridVStextureBool) {
      tileNum = constrain(((height / (mouseY + 20))), 1, 20);
      makeSlider(winMouseX);
    } else {
      if (eraseBool === 0) {
        brushIt(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
      } else {
        eraser(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
      }
    }
  } else {
    if (slide > 0) {
      if (dist(width/2,driftY,winMouseX,winMouseY) < ellipseSize/2){
    fill("#469ede");
    noStroke();
    alphaTemp = 5;
        ellipseSize+=0.55;
      }
    }
  }
  return false;
}


function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function eraser(_x, _y, _px, _py) {
  paint.strokeWeight(80);
  paint.stroke(colorAlpha(colArray[(colShift * 4) + 1], 0.5));
  paint.line(_x, _y, _px, _py);
}

function brushIt(_x, _y, pX, pY) {

  if (brushSelected === 0) {
    paint.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 1, 4)); // for line work
    paint.stroke(colorAlpha(colSelected, .9));
    paint.strokeCap(SQUARE);
    paint.line(_x, _y, pX, pY);

  } else if (brushSelected === 1) {
    paint.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 4, 20)); // for line work
    paint.stroke(colorAlpha(colSelected, .8));
    paint.strokeCap(PROJECT);
    paint.line(_x, _y, pX, pY);

  } else if (brushSelected === 2) {
    paint2.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 0.1, 2.2)); // for line work
    paint2.stroke(colorAlpha(colSelected, 0.7));
    for (i = 0; i < 30; i++) {
      let randX = randomGaussian(-15, 15);
      let randY = randomGaussian(-15, 15);
      paint2.line(_x + randX, _y + randY, pX + randX, pY + randY);
    }

  } else if (brushSelected === 3) {
    paint2.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 50, 60)); // for line work
    if (faderStart <= 0) {
      brushBool = 0;
    }
    if (faderStart >= 1000) {
      brushBool = 1;
    }
    if (brushBool === 0) {
      paint2.stroke(colorAlpha(colSelected, .2));

      //  paint.stroke(100, 100, 100, (faderStart += 20) / 5);
    }
    if (brushBool === 1) {
      paint2.stroke(colorAlpha(colSelected, .2));
      //  paint.stroke(100, 100, 100, (faderStart -= 20) / 5);
    }
    paint2.line(_x, _y, pX, pY);

  } else if (brushSelected === 4) {
    paint.strokeWeight(abs(random(4, 20)));
    for (i = 0; i < 30; i++) {
      paint.stroke(colorAlpha(colSelected, 0.8));
      paint.point(_x + randomGaussian(-10, 10), _y + randomGaussian(-10, 10));
    }

  } else if (brushSelected === 5) {
    paint2.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 10, 25)); // for line work
    paint2.stroke(colorAlpha(colSelected, .7));
    paint2.strokeCap(PROJECT);
    paint2.line(_x, _y, pX, pY);

  } else if (brushSelected === 6) {
    paint.loadPixels();
    for (let y = (_y - 60); y < (_y + 60); y++) {
      for (let x = (_x - 60); x < (_x + 60); x++) {
        if (dist(x, y, _x, _y) < 30) {
          paint.set(x, y, color(0, 0));
        }
      }
    }
    paint.updatePixels();
  }
}

function saveImg() {

  click.play();

  blendMode(BLEND);
  if (gridVStextureBool) {

    for (let i = 0; i < tileNum; i++) {
      for (let j = 0; j < tileNum; j++) {
        image(backdrop, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
        image(paint, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
        image(foreground, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
      }
    }



  } else {
    image(backdrop, 0, 0, width, height);
    image(paint, 0, 0, width, height);
    image(foreground, 0, 0, width, height);
  }
  save('linescape' + month() + day() + hour() + second() + '.jpg');
}


function windowResized() {

  resizeCanvas(windowWidth, windowHeight);
      textLayer.resizeCanvas(windowWidth, windowHeight);

  if (introState === 3){
    let paintNew = createGraphics(windowWidth, windowHeight);
    paintNew.image(paint,0,0,windowWidth, windowHeight);
    paint.resizeCanvas(windowWidth, windowHeight);
    paint = paintNew;

    let foregroundNew = createGraphics(windowWidth, windowHeight);
    foregroundNew.image(foreground,0,0,windowWidth, windowHeight);
    foreground.resizeCanvas(windowWidth, windowHeight);
    foreground = foregroundNew;

    let backdropNew = createGraphics(windowWidth, windowHeight);
    backdropNew.image(backdrop,0,0,windowWidth, windowHeight);
    backdrop.resizeCanvas(windowWidth, windowHeight);
    backdrop = backdropNew;

    textLayer.resizeCanvas(windowWidth, windowHeight);
    sliderImg.resizeCanvas(windowWidth, windowHeight);
    calcDimensions();
    removeElements();

    saveNext();

    if (!gridVStextureBool){
        makeSwatch();
    }
  }


}
