let x = [],
  y = [],
  segNum = 650,
  segLength = 4,
  distGravity = 50;

let selectedArray = [];
let lineCanv, // lineLayer
  shadow, // shadowLayer
  texture,
  beginning;
let bgCol, stringCol;
let driftVal = 0,
  selected = [0, 0];
drawActive = 1;
let audio;

let cutSeg = 0;

// constraint paramaters
let vt = [];
let vtCount = [];
let vtStored = [];

let levelVersion = 0;
let levelMax = 9;
let gridLevels = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2],
];
let radialLevels = [3, 5];

let storedOrientation, rotateDirection, storedOrientationDegrees;

function preload() {
  texture = loadImage('assets/texture.png');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
  pin = loadImage('assets/pin.png')
}

function setup() {
  stringCol = color('#a1a1a1');
  bgCol = color('#e5e5e5');
  createCanvas(windowWidth, windowHeight);

  lineCanv = createGraphics(windowWidth, windowHeight);
  lineCanv.stroke(55, 55, 65);



  var stbtn = $("<div />").appendTo("body");
  stbtn.addClass('startBtn');
  $('<p>Touch here to begin</p>').appendTo(stbtn);
  stbtn.mousedown(start);
  stbtn.mousemove(start);

}

function start() {

  $(".startBtn").remove();
  fullscreen(1);

  // note currently everything resets on windowResized. Unsure if this is logical yet

  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }

  reset();

  lineCanv.strokeWeight(2.2 * vMax);
}


function reset() {
  click.play();
  x = [];
  y = [];

  levelVersion++;
  if (levelVersion >= levelMax) {
    levelVersion = 0;
  }

  vt = [];
  vtCount = [];

  if (levelVersion < gridLevels.length) {
    makeGrid();
  } else if (levelVersion >= gridLevels.length && levelVersion < (gridLevels.length + radialLevels.length)) {
    makeRadial();
  } else {
    scatterPoints();
  }

  for (let i = 0; i < 10; i++){
    initialiseLine(i);
  }
  drawActive = 1;
  writeTextUI();
  render();

}

function initialiseLine(l) {
  // in  this function, each time a new drawing is started
  x[l] = [];
  y[l] = [];

  for (let i = 0; i < segNum; i++) {
    x[l][i] = (width / 10) * l;
    y[l][i] = (height / segNum) * i;
  }

  selected = [l, 0];
  if (dotsActive) {
    dotsActive = 0;
    dragCalc(selected, width / 2, height / 2);
    dotsActive = 1;
  } else {
    dragCalc(selected, width / 2, height / 2);
  }

  beginning = 1;
}


function touchEnded() {
  drawActive = 0;
}

function touchStarted() {
  if (!drawActive) {
    // for initial touch state, detect if a position is crossed. Then save that
    // position as currently selected
    // i in x[i] is the amount of strings
    for (let i = 0; i < x.length; i++) {
    // j in x[i][j] references the point on a string
      for (let j = 0; j < x[i].length; j++) {
        if (dist(winMouseX, winMouseY, x[i][j], y[i][j]) < 45) {
          selected[0] = i;
          drawActive = true;
          break;
        }
      }
    }
  }
}

function touchMoved() {

  vtStored = [];

  if (dotsActive) {
    for (let i = 0; i < vt.length; i++) {
      vtCount[i] = 0;
      vtStored[i] = [];
    }
  }


  if (drawActive) {
    // do we really need these Layers? // or do we need double the calculation of Lines
    if (beginning) {
      dragCalc(selected, width / 2, height / 2);
      beginning = 0;
    } else {
      dragCalc(selected, winMouseX, winMouseY);
    }
  }


  render();

  return false;
}




function dragCalc(_sel, _mouseX, _mouseY) {
  dragSegment(_sel, _mouseX, _mouseY);
  let i2 = _sel[0];
  let j2 = _sel[1];
  for (let j = j2; j < x[i2].length - 1; j++) {
    let t = [i2, j + 1];
    dragSegment(t, x[i2][j], y[i2][j]);
  }
  for (let j = j2; j > 0; j--) {
    let t = [i2, j - 1];
    dragSegment(t, x[i2][j], y[i2][j]);
  }
}

function dragSegment(_sel, xin, yin) {


  i = _sel[0];
  j = _sel[1];
  const dx = xin - x[i][j];
  const dy = yin - y[i][j];
  const angle = (atan2(dy, dx));
  x[i][j] = xin - cos(angle) * segLength;
  y[i][j] = yin - sin(angle) * segLength;

  //gravitational affector
  if (dotsActive) {
    for (var k = 0; k < vt.length; k++) {


      // creat a vector for currently referenced dot
      let v1 = createVector(x[i][j], y[i][j]);

      let gate = 1;

      for (elt of vtStored[k]) {
        if (abs(elt - j) < 20 && abs(elt - j) > 6) {
          gate = 0;
        }
      }

      if (gate) {





        var d = p5.Vector.dist(v1, vt[k]);
        if (d < distGravity) {
          vtStored[k].push(j);
          // this is effectively a smoother


          x[i][j] = vt[k].x;
          y[i][j] = vt[k].y;

          vtCount[k]++;
        }

      }
    }
  }
}

function render() {
  let colours = [0, 90, 150, 200, 200, 250];
  // let colours = ['#1a1a1a'];
  lineCanv.clear();



  for (let i = 0; i < x.length; i++) {
    lineCanv.strokeWeight(1.9 * vMax);
    lineCanv.stroke(colours[i % colours.length], 200);
    for (let j = 0; j < x[i].length - 1 - cutSeg; j++) {
      lineCanv.line(x[i][j], y[i][j], x[i][j + 1], y[i][j + 1])
    }
    lineCanv.strokeWeight(1.4 * vMax);
    lineCanv.stroke(colours[(i + 4) % colours.length], 190);
    lineCanv.point(x[i][0], y[i][0]);
    lineCanv.point(x[i][segNum - 1], y[i][segNum - 1]);

  }

  let s = vMax * 8;


  background(0);
  for (let i = 5; i > 0; i--) {
    image(lineCanv, 4 + (i * i), 4 + (i * i), width, height);
    image(texture, 0, 0, width, height);
  }



  image(lineCanv, 0, 0, width, height);

  if (dotsActive) {

    for (var i = 0; i < vt.length; i++) {

      image(pin, vt[i].x - (s / 2), vt[i].y - (s / 1.8), s, s);
    }
  }



}





function makeGrid() {

  let xQty = gridLevels[levelVersion][0];
  let yQty = gridLevels[levelVersion][1];
  for (let i = 0; i < xQty; i++) {
    for (let j = 0; j < yQty; j++) {
      // vectors.push(createVector(random(0,width), random(0, height)));
      vt.push(createVector((((width * 1.4) / (xQty + 1)) * (i + 1)) - width * 0.2, (((height * 1.4) / (yQty + 1)) * (j + 1)) - height * 0.2));
    }
  }
}

function makeRadial() {

  // update the level version to start from 0 (after gridLevels)
  var level = levelVersion - (gridLevels.length);

  // radius of the circular array
  let tran = vMin * 40;


  for (let i = 0; i < radialLevels[level]; i++) {

    rotateVal = (360 / radialLevels[level]) * i;

    let tempX = (tran * cos(radians(rotateVal))) + width / 2;
    let tempY = (tran * sin(radians(rotateVal))) + height / 2;

    vt.push(createVector(tempX, tempY));

  }
}

function scatterPoints() {

  let n = levelVersion - gridLevels.length - radialLevels.length;
  // let qty = 5 + (n * n);

  for (let i = 0; i < 50; i++) {

    let m = height / 10; // margin
    let v = createVector(random(width * 0.1, width * 0.9), random(height * .1, height * 0.8));
    var bool = 1;

    for (let j = 0; j < vt.length; j++) {
      if (v.dist(vt[j]) < vMax * 20) {
        bool = 0;
      }
    }

    if (bool) {
      vt.push(v);

      // make dots (consider delete)

    }


  }
}


function windowResized() {


  resizeCanvas(windowWidth, windowHeight);
  sizeWindow();
  calcDimensions();
  removeElements();
  writeTextUI();
  checkFS();
  touchMoved();
}


function sizeWindow() {
  if (width < height) {
    currentOrientation = "portrait";
  } else {
    currentOrientation = "landscape";
  }
  if (currentOrientation === storedOrientation) {
    stretchWindow();
  } else {
    if (window.orientation < storedOrientationDegrees) {
      direction = 1;
    } else {
      direction = -1;
    }

    if (abs(window.orientation - storedOrientationDegrees) == 270) {
      direction = -direction;
    }
    rotateWindow(direction);
    storedOrientationDegrees = window.orientation;
  }
  storedOrientation = currentOrientation;
}

function stretchWindow() {
  var newlineCanv = createGraphics(windowWidth, windowHeight);
  newlineCanv.image(lineCanv, 0, 0, windowWidth, windowHeight);
  lineCanv.resizeCanvas(windowWidth, windowHeight);
  lineCanv = newlineCanv;
  newlineCanv.remove();
}

function rotateWindow(direction) {
  var newlineCanv = createGraphics(windowWidth, windowHeight);
  newlineCanv.push();
  newlineCanv.translate(width / 2, height / 2);
  newlineCanv.rotate((PI / 2) * direction);
  newlineCanv.translate(-height / 2, -width / 2);
  newlineCanv.image(lineCanv, 0, 0, windowHeight, windowWidth);
  newlineCanv.pop()
  lineCanv.resizeCanvas(windowWidth, windowHeight);
  lineCanv = newlineCanv;
  newlineCanv.remove();

  // switch the grid around )
  for (var i = 0; i < vt.length; i++) {
    var y_ = vt[i].y;
    var x_ = vt[i].x;
    vt[i].y = x_;
    vt[i].x = y_;
  }

  // TODO: properly detect the orientation
  rotateDirection = rotateDirection * -1;
}

//startSimulation and pauseSimulation defined elsewhere
function handleVisibilityChange() {
  if (document.hidden) {
    audio.stop();
  } else {
    audio.loop(1);
  }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);
