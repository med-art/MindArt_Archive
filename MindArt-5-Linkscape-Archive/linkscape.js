let dots = [];
let tempwinMouseX = 0;
let tempwinMouseY = 0;
let tempwinMouseX2 = 0;
let tempwinMouseY2 = 0;
let lineLayer, permaLine;
let dotSize = 4;
let dotQtyX = 2,
  dotQtyY = 2;
let spaceX, spaceY;
let noiseAmplification = 0;
let hueDrift, brightDrift, satDrift;
let throughDotCount = 0;
let cloudHSB = [
  [225, 47, 55],
  [56, 92, 95],
  [28, 72, 95],
  [22, 59, 95],
  [11, 47, 65]
];

let introState = 1;
let primaryArray = [360, 60, 240];

let stage1array = [
  [1, 1, 4, 1, 1, 3, 4, 3, 1, 5, 4, 5, 1, 7, 4, 7],
  [1, 1, 2, 1, 3, 1, 4, 1, 1, 3, 4, 3, 1, 5, 4, 5, 1, 7, 2, 7, 3, 7, 4, 7],
  [1, 1, 3, 1, 2, 2, 4, 2, 1, 3, 3, 3, 2, 4, 4, 4, 1, 5, 3, 5, 2, 6, 4, 6, 1, 7, 3, 7, 2, 8, 4, 8]
];

// NB stage 1 array is in a 4 x 8 grid system

let colHue = 360, colSat = 80, colBri = 100;
let stage = 0;

let dotsCount = 0;
let hueCapture = 0;
let verifyX = 0;
let verifyY = 0;

function preload() {

  bg = loadImage('assets/paper.jpg');
    bg2 = loadImage('assets/paper2.jpg');

  audio = loadSound('assets/audio.mp3');

}

function setup() {


  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Ignores retina displays
  lineLayer = createGraphics(width, height);
  permaLine = createGraphics(width, height);
  colorMode(HSB, 360, 100, 100, 100);
  lineLayer.colorMode(HSB, 360, 100, 100, 100);
  permaLine.colorMode(HSB, 360, 100, 100, 100);
  dimensionCalc();
  showIntro();



}

function dimensionCalc() {
  wmax = width / 100;
  hmax = height / 100;
  if (width > height) {
    longEdge = width;
    shortEdge = height;
    lmax = width / 100;
  } else {
    longEdge = height;
    shortEdge = width;
    lmax = height / 100;
  }
}

function stage1grid() {



  dots[0] = [];
  let w = width / 5;
  let h = height / 9;
  let r = longEdge / 50;

  dotQtyX = 1;
  dotQtyY = stage1array[stage].length / 2;

  // there is a big issues with this. the way the array was written for stage 3 meant x and y coordinates stored in an array.
  // that is no longer happening with stage 1 and 2, which are stored in address 0 as (x,y,x,y,x,y etc).
  // For resolution at a later date.


  for (let i = 0; i < stage1array[stage].length; i += 2) {
    dots[0][i / 2] = new Dot(stage1array[stage][i] * w, stage1array[stage][i + 1] * h, r);
  }

}

function stage2grid() {

  if (stage === 3) {

    dotQtyX = 7;
    dotQtyY = 9;
    r = longEdge/30;
    let spaceX = width/dotQtyX+1;
    let spaceY = height/dotQtyY+1;

    for (let i = 0; i < dotQtyX; i++) {
      dots[i] = [];
      for (let j = 0; j < dotQtyY; j++) {
        dots[i][j] = new Dot((i+1)*(spaceX), (j+1)*(spaceY), 12);
      }
    }
  }

else if (stage === 4) {
    dotQtyX = 2;
    dotQtyY = 5*4;
    r = longEdge/30;
    let spaceX = width/dotQtyX+1;
    let spaceY = height/dotQtyY+1;

    for (let i = 0; i < dotQtyX; i++) {
      dots[i] = [];
      for (let j = 0; j < dotQtyY; j+=4) {
        dots[i][j] = new Dot(((i+0.5)*(spaceX))-(spaceX/6), (j+0.5)*(spaceY), 11);
        dots[i][j+1] = new Dot(((i+0.5)*(spaceX))+(spaceX/6), (j+0.5)*(spaceY), 11);

        dots[i][j+2] = new Dot(((i+0.5)*(spaceX))-(spaceX/3), (j+0.5)*(spaceY)+(spaceY*2), 11);
        dots[i][j+3] = new Dot(((i+0.5)*(spaceX))+((spaceX/6)*2), (j+0.5)*(spaceY)+(spaceY*2), 11);
      }
    }
  }

  else if (stage === 5) {
    dotQtyX = 4;
    dotQtyY = 13*4;
    r = longEdge/30;
    let spaceX = width/dotQtyX+1;
    let spaceY = height/dotQtyY+1;

    for (let i = 0; i < dotQtyX; i++) {
      dots[i] = [];
      for (let j = 0; j < dotQtyY; j+=4) {
        dots[i][j] = new Dot(((i+0.5)*(spaceX))-(spaceX/6), (j+0.5)*(spaceY), 8);
        dots[i][j+1] = new Dot(((i+0.5)*(spaceX))+(spaceX/6), (j+0.5)*(spaceY), 8);

        dots[i][j+2] = new Dot(((i+0.5)*(spaceX))-(spaceX/3), (j+0.5)*(spaceY)+(spaceY*2), 8);
        dots[i][j+3] = new Dot(((i+0.5)*(spaceX))+((spaceX/6)*2), (j+0.5)*(spaceY)+(spaceY*2), 8);
      }
    }
  }
}

function stage3grid() {

if (stage === 6){
  x = 7;
  y = 7;
  noiseAmp = 8;
  dotSize =4;
  colToggleUI();
}

else if (stage === 8){
  writeRestartUI();
}


  dotQtyX = x;
  dotQtyY = y;
  spaceX = width / (dotQtyX + 2);
  spaceY = height / (dotQtyY + 2);

  for (let i = 0; i < dotQtyX; i++) {
    dots[i] = [];
    for (let j = 0; j < dotQtyY; j++) {
      let noiseX = int((random(-width, width) * noiseAmp) / 150);
      let noiseY = int((random(-height, height) * noiseAmp) / 150);
      let r = random((lmax*(dotSize/10)), (lmax*(dotSize/10)) * 2);
      dots[i][j] = new Dot(noiseX + (spaceX * 1.5) + (spaceX * i), noiseY + (spaceY * 1.5) + (spaceY * j), r);
    }

  }
  noiseAmp+=10;
  x+=10;
  y+=10;
  dotSize--;

}

function nextGrid() {

  // note stages are 3 sets of 3. i.e. [0, 1, 2],[3, 4, 5],[6, 7, 8]
  permaLine.clear();


  if (stage < 3) {

  changeColour(1);
    stage1grid();
  } else if (stage >= 3 && stage < 6) {
    stage2grid();
  } else if (stage >= 6){

changeColour(0);




    stage3grid();

  }

  stage++;


}

function draw() {
  if (introState === 0){

  if (stage < 7){
      image(bg, 0, 0, width, height);
  }
  else if (stage >= 7){
        image(bg2, 0, 0, width, height);
      }



  image(lineLayer, 0, 0);
  image(permaLine, 0, 0);
  for (let i = 0; i < dotQtyX; i++) {
    for (let j = 0; j < dotQtyY; j++) {
      //dots[i][j].move();
      dots[i][j].show();
    }
  }
}
}

function touchStarted() {

  if (introState === 1 && textStroke === 10){
    exitIntro();
    audio.loop();
  }

  else {

  for (let i = 0; i < dotQtyX; i++) {
    for (let j = 0; j < dotQtyY; j++) {
      dots[i][j].getCol(winMouseX, winMouseY);
    }
  }
}
}


function touchMoved() {

  for (let i = 0; i < dotQtyX; i++) {
    for (let j = 0; j < dotQtyY; j++) {
      dots[i][j].clicked(winMouseX, winMouseY);
    }
  }
  hueDrift = int(random(-2, 2));
  satDrift = int(random(-2, 2));
  brightDrift = int(random(-2, 2));
  lineLayer.stroke(colHue + hueDrift, colSat + satDrift, 100, 80);
  lineLayer.strokeWeight(5);
  lineLayer.clear();
  if (throughDotCount > 0) {
    lineLayer.line(tempwinMouseX, tempwinMouseY, winMouseX, winMouseY);
  }
  return false;
}

function copyLine() {
  permaLine.stroke(colHue + hueDrift, colSat + hueDrift, 100, 80);
  permaLine.strokeWeight(6);
  if (throughDotCount > 1) {
    permaLine.line(tempwinMouseX, tempwinMouseY, tempwinMouseX2, tempwinMouseY2);
  }
}

function touchEnded() {
  lineLayer.clear();
  throughDotCount = 0;

}

class Dot {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.brightness = 150;
    this.h = primaryArray[int(random(0,3))];
    this.s = colSat;
    this.b = colBri;
  }

  move() {
    // this.x = this.x + random(-2, 2);
    // this.y = this.y + random(-2, 2);
  }

  show() {
  noStroke();


    if (colSwitch){
      this.b = 100;
    }



    fill(this.h, this.s, this.b*0.9, 100);
    ellipse(this.x, this.y, this.r * 2);
    fill(this.h, this.s, this.b*0.925, 100);
    ellipse(this.x, this.y, this.r * 1.95);
    fill(this.h, this.s, this.b*0.95, 100);
    ellipse(this.x, this.y, this.r * 1.85);
    fill(this.h, this.s, this.b*1, 100);
    ellipse(this.x, this.y, this.r * 1.60);
  }

  getCol(x, y){

    let d = dist(x, y, this.x, this.y);
    if (d < this.r * 4 && (this.x != verifyX || this.y != verifyY)) {
        colHue = this.h;
        if (colSwitch){
        this.s = 80;
      }
  }
}

  clicked(x, y) {
    let d = dist(x, y, this.x, this.y);
    if (d < this.r * 4 && (this.x != verifyX || this.y != verifyY)) {
      verifyX = this.x;
      verifyY = this.y;
      tempwinMouseX2 = tempwinMouseX;
      tempwinMouseY2 = tempwinMouseY;
      tempwinMouseX = this.x;
      tempwinMouseY = this.y;
      throughDotCount++;
      this.brightness = 250;

      if (colHue != this.h){
        if (abs(colHue - this.h) > 280){
          this.h = (((this.h + colHue)/2)-180)%360;;
        }

        else
        {
          this.h = ((this.h + colHue)/2)%360;;
        }
      }


      colHue = this.h;
      this.s = colSat;
      this.b = colBri;


      dotsCount++;



      copyLine();


    }
  }


}
