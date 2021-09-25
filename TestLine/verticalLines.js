let arr = [];
let xCount = 0;
let yCount = 0;
let counter = 0;
let overlay;
let fromCol, toCol;
let store = [];
let newTextureButton;
bool = 1;
let brushSize = 120;

let slider1, slider2, slider3;

let vMax, hMax, wMax;

let strokeBaseline = 0;
let strokeMulti = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background(255);
  overlay = loadImage('sunset.jpg');
  dimensionCalc();
  // blendMode(DIFFERENCE);

  newTextureButton = createButton('Next');
  newTextureButton.position(width - (8 * vMax), height - (10 * vH));
  newTextureButton.class("select");
  newTextureButton.style('font-size', '1.3vmax');
  newTextureButton.style('height', '3vmax');
  newTextureButton.style('width', '6vmax');
  newTextureButton.mousePressed(next);

  slider1 = createSlider(1, 300, 50); // density

  slider1.input(updateSize);

  slider1.position(10, 150);

  slider1.style('width', '300px');




  fromCol= color(0, 0, 0);
  toCol = color(100, 100, 100);

  noFill()
  strokeWeight(10);

  let marginX = 0;
  let marginY = 0;
  // let marginX = width / 8;
  // let marginY = height / 40;

  setupDefaults();
  setupArrays();


}

function setupDefaults() {

  strokeBaseline = 1;
  yCount = 15;
  xCount = 40;
  counter = 0;
  strokeMulti = 2;
}


function setupArrays() {



  for (let x = 0; x < xCount; x++) {
    arr[x] = [];
    for (let y = 0; y < yCount; y++) {
      arr[x][y] = createVector(((width / xCount) * x), (height / yCount) * y);
    }
  }


  redrawIt();
}

function invert() {
  bool = -bool;
}

function next() {
  setTimeout(next2, 100)

}
function next2(){
  
  yCount = int(yCount *= 1.6);
  strokeBaseline *= 0.85;
  strokeMulti *= 0.4;
  counter++;
  console.log(yCount);
  if (counter > 6) {
    setupDefaults();
  }
  setupArrays();
}


function touchMoved() {
  store = [];

  // calculate all points within a distance, then sort...
  for (let x = 0; x < xCount; x++) {
    for (let y = 0; y < yCount; y++) {
      let d = (dist(mouseX, mouseY, arr[x][y].x, arr[x][y].y));
      if (d < brushSize) {
        store.push([d, x, y]);
      }
    }
  }

  store.sort(sortFunction);

  // // redrawOrganic
  for (let i = 0; i < store.length; i++) {
    let _d = store[i][0];
    let _x = store[i][1];
    let _y = store[i][2];
    let temp = createVector(mouseX, mouseY);
    _d = _d / 1.5;
    _d = random(_d / 2, _d);
    arr[_x][_y] = p5.Vector.lerp(arr[_x][_y], temp, bool * (1 / _d));
  }

  // redrawNoise
  // for (let i = 0; i < store.length; i++) {
  //   let _x = store[i][1];
  //   let _y = store[i][2];
  //   let xRand = random(-2,2);
  //   let yRand =  random(-2,2);
  //   arr[_x][_y].x =   arr[_x][_y].x + xRand;
  //   arr[_x][_y].y =   arr[_x][_y].y + yRand;
  // }

  redrawIt();




}

function updateSize() {
  brushSize = slider1.value();
}



function sortFunction(a, b) {
  if (a[0] === b[0]) {
    return b;
  } else {
    return (a[0] > b[0]) ? -1 : 1;
  }
}


function redrawIt() {
  blendMode(BLEND);
  background(30);
  blendMode(ADD); // ADD 4, ex 3 // mult dark... but noice
  for (let y = 0; y < yCount; y++) {

    strokeWeight(strokeBaseline + (y * strokeMulti));

    stroke(lerpColor(fromCol, toCol, y / yCount));
    beginShape();

    for (let x = 0; x < xCount; x++) {
      curveVertex(arr[x][y].x, arr[x][y].y)
    }
    endShape();
  }

  stroke(200, 40);
  ellipse(mouseX, mouseY, brushSize * 2, brushSize * 2);
}

function dimensionCalc() {

  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
  vW = width / 100;
  vH = height / 100;
}
