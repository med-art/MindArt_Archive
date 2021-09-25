var a2, w, h;

var mX = 0;
var mY = 0;
var counter = 0;
var r, a;
var c;
var toggle = 0;
var button;
var lineQty = 0;

var centerW;
var centerY;

var vectors = [];
let aC = 0;

let filterRecorder = [0, 0, 0];

let colVersion = 0;
let levelVersion = 0;
let levelMax = 9;
let gridLevels = [
  [1, 1],
  [2, 1],
  [1, 2],
  [2, 2],
];
let radialLevels = [3, 5];
var selectedVertice = 0;

var colSel = 0;
var currentC = 0;
var colours = [
  ['#D97398','#A65398','#263F73','#5679A6'], // 5
  ['#192819','#2c4928','#719b25','#cbe368'], // 5
  ['#345573', '#223240', '#F2913D', '#F24B0F'], // 5
  ['#080926','#162040','#364C59','#8DA69F'], // 5
  ['#345573', '#F2913D', '#223240', '#F24B0F'], // I think ill be fine after eating ice cream // 4
  ['#a4fba6','#4ae54a', '#0f9200', '#006203'], // 5
  ['#6D808C','#FFFFFF','#D9AA8F','#F2CAB3'], // 4
  ['#172426', '#455559', '#D9C3B0', '#F2DFCE'], // 5
  ['#3C5E73','#F2BBBB','#444444','#F24444'], // 4
  ['#F27ECA','#9726A6','#8F49F2','#6C2EF2'], // 5
  ['#BF4B8B', '#3981BF', '#1F628C', '#D92929'], // adidas-Telstar-50-anniversary // 4
  ['#F2B705','#F27EA9', '#05AFF2', '#F29F05', '#F2541B'], // Lettering-Series-XXII-1 // 5
  ['#A60321','#D9043D','#F29F05','#D8BA7A'], // 4
  ['#F24452', '#5CE3F2', '#F2E205', '#F2CB05', '#F29D35'], // People-of-The-Internet // 5
  ['#2d3157','#34c1bb','#badccc','#ffda4d'], // 4
  ['#CCCCCC','#F2F2F2','#B3B3B3','#E6E6E6'], // 5
  ['#3FA663','#2D7345','#3391A6','#262626'], // 5
  ['#F2F2F2', '#A6A6A6', '#737373', '#0D0D0D', '#404040'] // Unchained// 5
  // new colours
];

var storedOrientation, storedOrientationDegrees, rotateDirection;

function preload() {
  paper = loadImage('assets/texture.jpg');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
}


function start() {
  $(".startBtn").remove();
  fullscreen(1);
  // note currently everything resets on windowResized. Unsure if this is logical yet

  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }
  sizeWindow();
  writeTextUI();
  reset();
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  colVersion = floor(random(0, colours.length));
  temp = createGraphics(windowWidth, windowHeight);
  gridLay = createGraphics(windowWidth, windowHeight);

  background(245);
  fill(0);
  strokeCap(SQUARE);




  //colVersion = colours.length; // set to max, as this will cause reset to 0;
  levelVersion = levelMax;

  pixelDensity(1);

  var stbtn = $("<div />").appendTo("body");
  stbtn.addClass('startBtn');
  $('<p>Touch here to begin</p>').appendTo(stbtn);
  stbtn.mousedown(start);
  stbtn.mousemove(start);

}



function changeCol(cc){

  if (cc >= 3){cc = 0;}
  if (cc <= 1){toggle = 0;} else {toggle = 1;}
  currentC = cc;
  c = colours[colVersion][cc];

  for (let i = 0; i < 3; i++) {
        swatch[i].position((((i) * 7)+3) * vMax, height - (10 * vMax));
        swatch[i].size(7 * vMax, 8 * vMax);
  }

  swatch[cc].position((((cc) * 7)+3) * vMax, height - (15 * vMax));
      swatch[cc].size(7 * vMax, 13 * vMax);
}

function reset(){



    colVersion++;
    if (colVersion >= colours.length) {
      colVersion = 0;
    }

    levelVersion++;
    if (levelVersion >= levelMax) {
      levelVersion = 0;
    }


    vectors = [];

    if (levelVersion < gridLevels.length) {
      makeGrid();
    } else if (levelVersion >= gridLevels.length && levelVersion < (gridLevels.length+radialLevels.length)){
      makeRadial();
    } else {
      scatterPoints();
    }
  $(".box").remove();
  createSwatch();

  clear();
  gridLay.clear();
      temp.clear();
  render();
    temp.clear();

}

function makeGrid() {

  let xQty = gridLevels[levelVersion][0];
  let yQty = gridLevels[levelVersion][1];

  for (let i = 0; i < xQty; i++) {
    for (let j = 0; j < yQty; j++) {
      gridLay.noStroke();
      gridLay.fill(0, 100);
      // vectors.push(createVector(random(0,width), random(0, height)));
      vectors.push(createVector((((width*1.4) / (xQty + 1)) * (i + 1))-width*0.2, (((height*1.4) / (yQty + 1)) * (j + 1))-height*0.2));
      gridLay.ellipse(vectors[vectors.length - 1].x, vectors[vectors.length - 1].y, width / 50, width / 50);
    }
  }
}

function makeRadial(){

// update the level version to start from 0 (after gridLevels)
var level = levelVersion - (gridLevels.length);

// radius of the circular array
let tran = vMin*40;


for (let i = 0; i < radialLevels[level]; i++){
  gridLay.noStroke();
  gridLay.fill(0, 100);
  rotateVal = (360/radialLevels[level])*i;

  let tempX = (tran * cos(radians(rotateVal))) + width / 2;
  let tempY = (tran * sin(radians(rotateVal))) + height / 2;

  vectors.push(createVector(tempX, tempY));
  gridLay.ellipse(tempX, tempY, width / 50, width / 50);
}
}

function scatterPoints() {

  let n = levelVersion - gridLevels.length - radialLevels.length;
  // let qty = 5 + (n * n);

  for (let i = 0; i < 50; i++) {

    let m = height / 10; // margin
    let v = createVector(random(width*0.1, width*0.9), random(height*.1, height*0.8));
    var bool = 1;

    for (let j = 0; j < vectors.length; j++){
      if (v.dist(vectors[j]) < vMax*20){
        bool = 0;
      }
    }

    if (bool){
      vectors.push(v);

        // make dots (consider delete)
      gridLay.noStroke();
      gridLay.fill(0, 100);
      gridLay.ellipse(vectors[vectors.length - 1].x, vectors[vectors.length - 1].y, width / 50, width / 50);

    }


  }
}

function touchStarted() {

  // determine which brush selected, load charactertistics
  if (currentC == 0) {
        colSel = colorAlpha(c, 0.4);
    temp.stroke(colSel);
    temp.noFill();
    lineQty = 60;
    vertRand =16;
    angRand = 8;


  } else if (currentC ==1) {
        colSel = colorAlpha(c, .1);
    temp.stroke(colSel);
    temp.noFill();
    lineQty = 450;
    vertRand = 80;
    angRand = 15;


  } else {
    lineQty = 10;
    temp.noStroke();
    colSel = colorAlpha(c, 0.05);
    temp.fill(colSel, 255);
    vertRand = 5;
    angRand = 10;


  }

  let tempHigh = 1000;
  selectedVertice = 0;

  // select closest point
  for (let i = 0; i < vectors.length; i++) {
    let temp = dist(mouseX, mouseY, vectors[i].x, vectors[i].y);
    if (temp < tempHigh) {
      tempHigh = temp;
      selectedVertice = i;
    }
  }

  // extract that points center
  centerW = vectors[selectedVertice].x;
  centerY = vectors[selectedVertice].y;
  // calculate Radius
  r = 2 * dist(mouseX, mouseY, centerW, centerY);
  // set currnet colour (place elsewhere?)
  temp.stroke(colSel);
  // SUSPECT OBSOLETE
  // w = abs(centerW - mouseX) + 100;
  // h = abs(centerY - mouseY) + 100;

  // store starting mouse position
  mX = mouseX;
  mY = mouseY;

}

function touchMoved() {
render();

//
a = atan2(mouseY - centerY, mouseX - centerW);
a2 = atan2(mY - centerY, mX - centerW);

var diff = (a2 - a);




// filter out any big ones & small ones
if (!((abs(diff) > 0.3) || (abs(diff) < 0.01))){

// determine if left or right.
var chooser = 0;
if (diff < 0){
  chooser = 1;
}



  if (currentC == 0) {temp.strokeWeight(constrain(1*abs(diff),0.5,4));}
  if (currentC == 1) {temp.strokeWeight(constrain(10*abs(diff),1,1000));}

for (var i = 0; i < lineQty; i++) {
  var nR = randomGaussian(-angRand, angRand);
  a2 = atan2(nR + mY - centerY, nR + mX - centerW);
  a = atan2(nR + mouseY - centerY, nR + mouseX - centerW);

  var n = random(-vertRand, vertRand);

  if (chooser) {
    temp.arc(centerW, centerY, r + n, r + n, a2, a);
    counter++;
  } else {
    temp.arc(centerW, centerY, r + n, r + n, a, a2);
    counter--;
  }
}


}


mX = mouseX;
mY = mouseY;

// draw the current selectedVertice bigger;
noStroke();
fill(colours[colVersion][1]);
ellipse(vectors[selectedVertice].x, vectors[selectedVertice].y, vMax*4, vMax*4);



return false;
}

function render(){



  // set background and paper textures
  blendMode(BLEND);
  background(colours[colVersion][3]);
  blendMode(MULTIPLY);
  image(paper, 0, 0, width, height);
  blendMode(BLEND);

  // draw ellipses for each point using the vertices
  fill(colours[colVersion][0]);
  for (let i = 0; i < vectors.length; i++) {
    ellipse(vectors[i].x, vectors[i].y, vMax*2, vMax*2);
  }

  image(temp, 0, 0, windowWidth, windowHeight);
  image(gridLay, 0, 0, windowWidth, windowHeight);



}

function touchEnded() {
  counter = 0;
  a = 0;
  a2 = 0;
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function dimensionCalc() {

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


function checkFS(){
  if (!fullscreen()){
  addFS();
}
}

function windowResized(){


  resizeCanvas(windowWidth, windowHeight);
  sizeWindow();

  writeTextUI();

  checkFS();

  temp.strokeCap(SQUARE);
  temp.noFill();
  render();


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
  calcDimensions();
}

function stretchWindow() {
  var newtemp = createGraphics(windowWidth, windowHeight);
  newtemp.image(temp, 0, 0, windowWidth, windowHeight);
  temp.resizeCanvas(windowWidth, windowHeight);
  temp = newtemp;
  newtemp.remove();

  var newgridLay = createGraphics(windowWidth, windowHeight);
  newgridLay.image(gridLay, 0, 0, windowWidth, windowHeight);
  gridLay.resizeCanvas(windowWidth, windowHeight);
  gridLay = newgridLay;
  newgridLay.remove();


}

function rotateWindow(direction) {
  var newtemp = createGraphics(windowWidth, windowHeight);
  newtemp.push();
  newtemp.translate(width / 2, height / 2);
  newtemp.rotate((PI / 2) * direction);
  newtemp.translate(-height / 2, -width / 2);
  newtemp.image(temp, 0, 0, windowHeight, windowWidth);
  newtemp.pop()
  temp.resizeCanvas(windowWidth, windowHeight);
  temp = newtemp;
  newtemp.remove();

  var newgridLay = createGraphics(windowWidth, windowHeight);
  newgridLay.push();
  newgridLay.translate(width / 2, height / 2);
  newgridLay.rotate((PI / 2) * direction);
  newgridLay.translate(-height / 2, -width / 2);
  newgridLay.image(gridLay, 0, 0, windowHeight, windowWidth);
  newgridLay.pop()
  gridLay.resizeCanvas(windowWidth, windowHeight);
  gridLay = newgridLay;
  newgridLay.remove();

  // switch the grid around )
  for (var i = 0; i < vectors.length; i++){
    var y_ = vectors[i].y;
    var x_ = vectors[i].x;
    vectors[i].y = x_;
    vectors[i].x = y_;

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
