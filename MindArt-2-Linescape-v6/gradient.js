// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;

let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];


var colQty = 1;
var colWidth;
var colYtrack = [];
var drawActive = false;

var lineVersion = 0;
var vMax;
var div = 1;

var c1, c2, c3, c4;

var fg;

var restart;
var sel = 0;
let drawLayer;

let maskChoice = 0;

var colours = [
  ['#0D0A07', '#D9D0C7', '#F20C1F', '#BF1515'],
  ['#345573', '#223240', '#F2913D', '#F24B0F'],
  ['#172426', '#455559', '#D9C3B0', '#F2DFCE'],
  ['#3C5E73','#F2BBBB','#F24968','#F24444'],
  ['#3FA663','#2D7345','#3391A6','#262626'],
  ['#A60321','#D9043D','#F29F05','#D8BA7A'],
  ['#3C2D73','#131A40','#D97E6A','#BF7396'],
  ['#81edf7','#00a4c0','#f70110','#6e0516'],
  ['#192819','#2c4928','#719b25','#cbe368'],
  ['#314035','#5E7348','#A4BF69','#E0F2A0'],
  ['#a4fba6','#4ae54a', '#0f9200', '#006203'],
  ['#2d3157','#34c1bb','#badccc','#ffda4d'],
  ['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
  ['#CCCCCC','#F2F2F2','#B3B3B3','#E6E6E6']
];

var numPattern = [1, 2, 4, 8, 16, 32, 64, 128];

var cc = 0; // currentColour
var toggle = 1;

var touchDownY;

var currentOrientation, storedOrientation, storedOrientationDegrees, rotateDirection;

var mask = [];
var display = [];

function preload() {
  paper = loadImage('assets/paper1.jpg');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');

  for (let i = 0; i < 11; i++){
    mask[i] = loadImage('assets/images/Boom/brush-'+(i+1)+'.png')
  }
  for (let i = 0; i < 11; i++){
    display[i] = loadImage('assets/images/Boom2/brush-'+(i+1)+'.png')
  }
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity(1);

  drawLayer = createGraphics(width,height);
  drawLayer.background(255);
  drawLayer.noStroke();
  drawLayer.fill(0);

  transferLayer = createGraphics(width, height);
  renderLayer = createGraphics(width, height);

    var stbtn = $("<div />").appendTo("body");
    stbtn.addClass('startBtn');
    $('<p>Touch here to begin</p>').appendTo(stbtn);
    stbtn.mousedown(start);
    stbtn.mousemove(start);

}


function start() {
  $(".startBtn").remove();
//  fullscreen(1);

  //todo, consider pausing audio context
  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }

  sizeWindow();
  writeTextUI();
  restart();

}


function touchStarted() {
  touchDownY = mouseY;
}

function touchMoved() {


    calcDynamics();
  //brush_scatter1(mouseX, mouseY, 100, velocity/30, 12, 0); // mouseX, mouseY, qty, spread, particleSize, colourRandom
      brush_lineScatter(mouseX, mouseY, pmouseX, pmouseY, 100, velocity, (0.5*velocity)+4, 0); // mouseX, mouseY, qty, spread, particleSize, colorRandom
  //  brush_rake(x, y, x2, y2, angle1, 50, 100, 100, velocity/100); // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
  //    brush_pencil(mouseX, mouseY, pmouseX, pmouseY, 50, velocity);
    // brush_pencil2(mouseX, mouseY, pmouseX, pmouseY, 50, velocity*3);


    render();


  return false;
}

function restart(){
clear();
transferLayer.clear();
drawLayer.clear();
renderLayer.clear();
render();
}

function shift(){
maskChoice++;
if (maskChoice > 11){
  maskChoice = 1;
}

transferLayer.image(renderLayer, 0, 0, width, height);
drawLayer.clear();
renderLayer.clear();
render();
}


function render() {

background(255);
renderLayer.blendMode(BLEND);
renderLayer.background(255);
renderLayer.image(display[maskChoice], 0, 0, windowWidth, windowHeight)
renderLayer.background(255, 255);
renderLayer.blendMode(DARKEST);
renderLayer.image(drawLayer,0,0,width,height);
renderLayer.blendMode(LIGHTEST)
renderLayer.image(mask[maskChoice], 0, 0, width, height);
renderLayer.blendMode(DARKEST);
renderLayer.image(transferLayer, 0, 0, width, height);

image(renderLayer, 0, 0, width, height);
image(display[maskChoice], 0, 0, windowWidth, windowHeight)


}

function touchEnded() {
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function checkFS(){
  if (!fullscreen()){
  addFS();
}
}

//
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//   sizeWindow();
//
//   // removeElements();
//   writeTextUI();
//   render();
//   checkFS();
//
//     fg.strokeWeight(2);
//     fg.strokeCap(SQUARE);
// }
//
//
//
//
function sizeWindow() {
  // if (width < height) {
  //   currentOrientation = "portrait";
  // } else {
  //   currentOrientation = "landscape";
  // }
  // if (currentOrientation === storedOrientation) {
  //   stretchWindow();
  // } else {
  //   if (window.orientation < storedOrientationDegrees) {
  //     direction = 1;
  //   } else {
  //     direction = -1;
  //   }
  //
  //   if (abs(window.orientation - storedOrientationDegrees) == 270){
  //     direction = -direction;
  //   }
  //   rotateWindow(direction);
  //   storedOrientationDegrees = window.orientation;
  // }
  // storedOrientation = currentOrientation;
  calcDimensions();
}

// function stretchWindow() {
//   var newfg = createGraphics(windowWidth, windowHeight);
//   newfg.image(fg, 0, 0, windowWidth, windowHeight);
//   fg.resizeCanvas(windowWidth, windowHeight);
//   fg = newfg;
//   newfg.remove();
//
//   var newintermedia = createGraphics(windowWidth, windowHeight);
//   newintermedia.image(intermedia, 0, 0, windowWidth, windowHeight);
//   intermedia.resizeCanvas(windowWidth, windowHeight);
//   intermedia = newintermedia;
//   newintermedia.remove();
//
//
// }
//
// function rotateWindow(direction) {
//   var newfg = createGraphics(windowWidth, windowHeight);
//   newfg.push();
//   newfg.translate(width / 2, height / 2);
//   newfg.rotate((PI / 2) * direction);
//   newfg.translate(-height / 2, -width / 2);
//   newfg.image(fg, 0, 0, windowHeight, windowWidth);
//   newfg.pop()
//   fg.resizeCanvas(windowWidth, windowHeight);
//   fg = newfg;
//   newfg.remove();
//
//   var newintermedia = createGraphics(windowWidth, windowHeight);
//   newintermedia.push();
//   newintermedia.translate(width / 2, height / 2);
//   newintermedia.rotate((PI / 2) * direction);
//   newintermedia.translate(-height / 2, -width / 2);
//   newintermedia.image(intermedia, 0, 0, windowHeight, windowWidth);
//   newintermedia.pop()
//   intermedia.resizeCanvas(windowWidth, windowHeight);
//   intermedia = newintermedia;
//   newintermedia.remove();
//
//
//
//   // TODO: properly detect the orientation
//   rotateDirection = rotateDirection * -1;
// }
//
// //startSimulation and pauseSimulation defined elsewhere
// function handleVisibilityChange() {
//   if (document.hidden) {
//     audio.stop();
//   } else {
//     audio.loop(1);
//   }
// }
//
// document.addEventListener("visibilitychange", handleVisibilityChange, false);


function calcDynamics() {

  // calculate the distance between mouse position, and previous position. Average the previous
  let d = dist(mouseX, mouseY, pmouseX, pmouseY);
  smoothDist.shift();
  smoothDist.push(d);
  velocity = smoothDist.reduce(reducer) / smoothDist.length;


  // calculate mouseDirection
  let dx = mouseX - x;
  let dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = (mouseX) - cos(angle1) * dragLength;
  x2 = (100) - cos(PI / 2) * 1;
  y = (mouseY) - sin(angle1) * dragLength;
  y2 = (100) - sin(PI / 2) * 1;

}



function brush_pencil(_x, _y, pX, pY, t, v) {
   v = constrain(v, 3, 10);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  drawLayer.stroke(0, 50);
  drawLayer.strokeWeight(1);
  for (let i = 0; i < 200; i++) {
     let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + (noise(_x+i)*v), v3.y + (noise(_y+i)*v));
  }
  drawLayer.stroke(255, 180);
  drawLayer.strokeWeight(2);
  for (let i = 0; i < 1; i++) {
   let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + random(-v, v), v3.y + random(-v, v));
  }
}

function brush_pencil2(_x, _y, pX, pY, t, v) {
   v = constrain(v, 50, 50);
  let v0 = createVector(_x, _y);
  let v1 = createVector(pX, pY);
  drawLayer.stroke(0, 10);
  drawLayer.strokeWeight(1);
  for (let i = 0; i < 100; i++) {
    drawLayer.line(v0.x + (noise(_x+i)*v), v0.y + (noise(_y+i)*v), v1.x + (noise(_x+i)*v), v1.y + (noise(_y+i)*v));
  }
  drawLayer.stroke(255);
  drawLayer.strokeWeight(random(1, 3));
  for (let i = 0; i < 10; i++) {
   let v3 = p5.Vector.lerp(v0, v1, random(0, 1));
    drawLayer.point(v3.x + (noise(pX-i)*v*2), v3.y + (noise(pY-i)*v*2));
  }
}


function brush_scatter1(_x, _y, qty, spread, pSize, colRand) {
  spread = spread * random(0.5, 1);
  drawLayer.fill(0, 10);
  drawLayer.noStroke();
  spread = spread * 20;
  qty = qty * random(0, 1);
  pSize = pSize * random(0.2, 1);
  for (let i = 0; i < qty; i++) {
    let rX = randomGaussian(-spread, spread);
    let rY = randomGaussian(-spread, spread);
    // let rX = spread*noise(i+_x);
    // let rY = spread*noise(i+_y);
    drawLayer.ellipse(_x + (rX), _y + (rY), pSize, pSize);
  }
}

function brush_lineScatter(_x, _y, pX, pY, qty, spread, pSize, colRand) {
  drawLayer.strokeWeight(pSize); // for line work
  drawLayer.stroke(0, 2);
  for (i = 0; i < qty; i++) {

    let rX = randomGaussian(-spread, spread);
    let rY = randomGaussian(-spread, spread);
    drawLayer.line(_x + rX, _y + rY, pX + rX, pY + rY);
  }
}

function brush_rake(x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise) {

  strokeW = ceil(brushWidth / qtyOfLines);
  drawLayer.strokeWeight(strokeW);

  var a = createVector(x, y);
  var b = createVector(0, brushWidth / 2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {
    // cool
    // d = p5.Vector.lerp(a, c, (i/qtyOfLines)*random(0,1));

    d = p5.Vector.lerp(a, c, (i / (qtyOfLines + 1)) + randomGaussian(0, (1 / qtyOfLines) * noise));


    if (i === 0 || i === vec.length - 1 || (i % 3) === 2) { // if first line, last line or every 3rd line, then thin, else fat
      drawLayer.strokeWeight(strokeW / 2);
    } else {
      drawLayer.strokeWeight(strokeW);
    }

    var n = vec[i];
    if (i % 3 === 0) {
      drawLayer.stroke(40, opacity);
    } else if (i % 3 === 1) {
      drawLayer.stroke(200, opacity);
    } else if (i % 3 === 2) {
      drawLayer.stroke(40, opacity);
    }

    drawLayer.line(vec[i].x, vec[i].y, d.x, d.y);
    vec[i] = d;
  }
  // display();
}
