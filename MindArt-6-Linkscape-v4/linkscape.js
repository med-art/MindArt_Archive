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

let colArray = [
['#D97398','#A65398','#263F73','#5679A6'], // 5
// ['#192819','#2c4928','#719b25','#cbe368'], // 5
['#345573', '#223240', '#F2913D', '#F24B0F'], // 5
['#080926','#162040','#364C59','#8DA69F'], // 5
['#345573', '#F2913D', '#223240', '#F24B0F'], // I think ill be fine after eating ice cream // 4
['#a4fba6','#4ae54a', '#0f9200', '#006203'], // 5
['#6D808C','#FFFFFF','#D9AA8F','#F2CAB3'], // 4
['#172426', '#455559', '#D9C3B0', '#F2DFCE'], // 5
['#3C5E73','#F2BBBB','#FFFFFF','#F24444'], // 4
['#F27ECA','#9726A6','#8F49F2','#6C2EF2'], // 5
['#BF4B8B', '#3981BF', '#1F628C', '#D92929'], // adidas-Telstar-50-anniversary // 4
['#F2B705','#F27EA9', '#05AFF2', '#F29F05', '#F2541B'], // Lettering-Series-XXII-1 // 5
['#A60321','#D9043D','#F29F05','#D8BA7A'], // 4
['#F24452', '#5CE3F2', '#F2E205', '#F2CB05', '#F29D35'], // People-of-The-Internet // 5
['#2d3157','#34c1bb','#badccc','#ffda4d'], // 4
['#CCCCCC','#F2F2F2','#B3B3B3','#E6E6E6'], // 5
['#3FA663','#2D7345','#3391A6','#262626'], // 5
['#F2F2F2', '#A6A6A6', '#737373', '#0D0D0D', '#404040'] // Unchained// 5
]



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

function start(){

  $(".startBtn").remove();
  fullscreen(1);

  // note currently everything resets on windowResized. Unsure if this is logical yet

  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }

  reset();

    lineCanv.strokeWeight(1*vMax);
}


function reset(){
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
    } else if (levelVersion >= gridLevels.length && levelVersion < (gridLevels.length+radialLevels.length)){
      makeRadial();
    } else {
      scatterPoints();
    }
initialiseLine(0);
drawActive = 1;
writeTextUI();
render();
}

function initialiseLine(l) {
  // in  this function, each time a new drawing is started
  x[l] = [];
  y[l] = [];

  for (let i = 0; i < segNum; i++) {
    x[l][i] = random(0, width);
    y[l][i] = (height / segNum) * i;
    // y[l][i] = random(0, height);
  }

  selected = [l, 0];
  if (dotsActive){
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
    for (let i = 0; i < x.length; i++) {

      // if
      if (dist(winMouseX, winMouseY, x[i][0], y[i][0]) < 45){
        selected[0] = i;
        selected[1] = 0;
        drawActive = true;
      } else if (dist(winMouseX, winMouseY, x[i][segNum-1], y[i][segNum-1]) < 45){
        selected[0] = i;
        selected[1] = segNum-1;
        drawActive = true;
      } else { // otherwise find nearest point
      for (let j = 0; j < x[i].length; j++) {
        if (dist(winMouseX, winMouseY, x[i][j], y[i][j]) < 45) {
          selected[0] = i;
          if (j < 30){
            selected[1] = 1
          } else if (j > x[i].length - 30){
            selected[1] = segNum-1;
          } else {
          selected[1] = j;
        }
          drawActive = true;
          break;
        }
      }
      }


    }
  }
  //return false;

}

function touchMoved() {

  vtStored = [];

  if (dotsActive){
    for (let i = 0; i < vt.length; i++){
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
if (dotsActive){
  for (var k = 0; k < vt.length; k++) {
        // creat a vector for currently referenced dot
    let v1 = createVector(x[i][j], y[i][j]);
    let gate = 1;
    for (elt of vtStored[k]){
      if (abs(elt - j) < 20 && abs(elt - j) > 6){
        gate = 0;
      }
    }
    if (gate){
    var d = p5.Vector.dist(v1, vt[k]);
    if (d < distGravity){
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
  //let colours = [0, 90, 150, 200, 200, 250];
  let colours = ['#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a', '#1a1a1a'];
  lineCanv.clear();
  //lineCanv.blendMode(DIFFERENCE);


  for (let i = 0; i < x.length; i++) {
    lineCanv.strokeWeight(0.2*vMax);

  let cc = colorAlpha(colArray[6][i % colArray[6].length], 0.7);
    lineCanv.stroke(cc);
    lineCanv.fill(cc);
    lineCanv.beginShape();
    for (let j = 0; j < x[i].length - 1 - cutSeg; j++) {
      lineCanv.curveVertex(x[i][j], y[i][j]);
    }

        lineCanv.curveVertex(x[i][0], y[i][0]);
            lineCanv.endShape(CLOSE);

    // lineCanv.strokeWeight(1.4*vMax);
    //   lineCanv.stroke(colours[(i+4) % colours.length], 190);
    //   lineCanv.point(x[i][0], y[i][0]);
    //   lineCanv.point(x[i][segNum-1], y[i][segNum-1]);

}

  let s = vMax*8;


    background(0);
    for (let i = 5; i > 0; i--) {
      image(lineCanv,4 + (i * i), 4 + (i * i), width, height);
      image(texture, 0, 0, width, height);
    }



    image(lineCanv, 0, 0, width, height);

    if (dotsActive){

      for (var i = 0; i < vt.length; i++) {

      image(pin, vt[i].x-(s/2), vt[i].y-(s/1.8), s, s);
      }}



}





function makeGrid() {

  let xQty = gridLevels[levelVersion][0];
  let yQty = gridLevels[levelVersion][1];
  for (let i = 0; i < xQty; i++) {
    for (let j = 0; j < yQty; j++) {
      // vectors.push(createVector(random(0,width), random(0, height)));
      vt.push(createVector((((width*1.4) / (xQty + 1)) * (i + 1))-width*0.2, (((height*1.4) / (yQty + 1)) * (j + 1))-height*0.2));
    }
  }
}

function makeRadial(){

// update the level version to start from 0 (after gridLevels)
var level = levelVersion - (gridLevels.length);

// radius of the circular array
let tran = vMin*40;


for (let i = 0; i < radialLevels[level]; i++){

  rotateVal = (360/radialLevels[level])*i;

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
    let v = createVector(random(width*0.1, width*0.9), random(height*.1, height*0.8));
    var bool = 1;

    for (let j = 0; j < vt.length; j++){
      if (v.dist(vt[j]) < vMax*20){
        bool = 0;
      }
    }

    if (bool){
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

    if (abs(window.orientation - storedOrientationDegrees) == 270){
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
  for (var i = 0; i < vt.length; i++){
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

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}
