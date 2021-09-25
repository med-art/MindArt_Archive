// BRUSHES
// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;

// brush orientation
let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];
let d = 0; // distance

let brushLib = [];
let brush = 1;

// let sl1, sl2, sl3, sl4, sl5, sl6, sl7, sl8;

//LANDSCAPE


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
  ['#3C5E73', '#F2BBBB', '#F24968', '#F24444'],
  ['#3FA663', '#2D7345', '#3391A6', '#262626'],
  ['#A60321', '#D9043D', '#F29F05', '#D8BA7A'],
  ['#3C2D73', '#131A40', '#D97E6A', '#BF7396'],
  ['#81edf7', '#00a4c0', '#f70110', '#6e0516'],
  ['#192819', '#2c4928', '#719b25', '#cbe368'],
  ['#314035', '#5E7348', '#A4BF69', '#E0F2A0'],
  ['#a4fba6', '#4ae54a', '#0f9200', '#006203'],
  ['#2d3157', '#34c1bb', '#badccc', '#ffda4d'],
  ['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
  ['#CCCCCC', '#F2F2F2', '#B3B3B3', '#E6E6E6']
];

var numPattern = [1, 2, 4, 8, 16, 32, 64, 128];

var cc = 0; // currentColour
var toggle = 1;

var touchDownY;

var currentOrientation, storedOrientation, storedOrientationDegrees, rotateDirection;

var mask = [];
var display = [];

let maskBool = 1;
let textureBool = 1;

function preload() {
  paper = loadImage('assets/paper1.jpg');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');

  for (let i = 0; i < 11; i++) {
    mask[i] = loadImage('assets/images/Boom/brush-' + (i + 1) + '.png')
  }
  for (let i = 0; i < 11; i++) {
    display[i] = loadImage('assets/images/Boom2/brush-' + (i + 1) + '.png')
  }

  for (let i = 1; i < 50; i++) {
    brushLib[i] = loadImage('assets/brushes/brush-' + i + '.png');
  }

}





function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  pixelDensity(1);

  colorMode(HSB, 360, 100, 100, 100);

  drawLayer = createGraphics(width, height);
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

  createUI();

  // vector array used to store points, this will max out at 100
  brushLayer = createGraphics(width, height);
  brushLayer.tint(0, 0, 0, 10);
  brushLayer.image(brushLib[41], 0, 0, width, height);

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
  //brush_rake(x, y, x2, y2, angle1, 200, 100, 25, 10); // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise
  let size = slider.value()*constrain(velocity/10, 0, 1);
  let sizeJitter = slider2.value() / 100; // float between 0 and 1.0 (Max);
  let angleJitter = slider3.value() / 100; // float between 0 and 1.0 (Max);
  let scatter = slider4.value() / 100; // float between 0 and 2.0 (Max);
  let density = slider5.value() / 100;
  // let rotateActive = 1;
  // if (!rotateActive) {
  //   angle1 = 0;
  // }
  brushImg2(mouseX, mouseY, pmouseX, pmouseY, angle1, angleJitter, size, sizeJitter, scatter, density, d);
  render();



  return false;
}

function restart() {
  clear();
  transferLayer.clear();
  drawLayer.clear();
  renderLayer.clear();
  render();

}

function renderTextUI(){
  textSize(20);
  fill(20);
  text('size', 130, 25);
  text('sizeJitter', 130, 45);
  text('angleJitter', 130, 65);
  text('scatter', 130, 85);
  text('density', 130, 105);
  text('Opacity', 130, 145);
  text(brush, 110, 125);
}

function shift() {
  maskChoice++;
  if (maskChoice > 11) {
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
  renderLayer.image(drawLayer, 0, 0, width, height);
  if (maskBool){
  renderLayer.blendMode(LIGHTEST)
  renderLayer.image(mask[maskChoice], 0, 0, width, height);
}
  renderLayer.blendMode(DARKEST);
  renderLayer.image(transferLayer, 0, 0, width, height);

  image(renderLayer, 0, 0, width, height);

 if (textureBool){
  image(display[maskChoice], 0, 0, windowWidth, windowHeight)
}
  renderTextUI();

}

function touchEnded() {}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function checkFS() {
  if (!fullscreen()) {
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


function createUI() {


  slider = createSlider(2, 100, 10);
  slider.position(10, 10);
  slider.style('width', '120px');


  slider2 = createSlider(0, 100, 1);
  slider2.position(10, 30);
  slider2.style('width', '120px');


  slider3 = createSlider(0, 100, 1);
  slider3.position(10, 50);
  slider3.style('width', '120px');


  slider4 = createSlider(0, 100, 1);
  slider4.position(10, 70);
  slider4.style('width', '120px');


  slider5 = createSlider(0, 200, 100);
  slider5.position(10, 90);
  slider5.style('width', '120px');



  button = createButton('nextBrush');
  button.position(10, 110);
  button.mousePressed(change);

  slider6 = createSlider(0, 255, 100);
  slider6.position(10, 130);
  slider6.style('width', '120px');

  slider6.input(change2)

    checkboxMasked = createCheckbox('Mask Active?', true);
   checkboxMasked.changed(maskToggle);
   checkboxMasked.position(10, 150);

   checkboxTexture = createCheckbox('Texture Visible?', true);
  checkboxTexture.changed(textureToggle);
  checkboxTexture.position(10, 170);


  }

  function maskToggle(){
    if (this.checked()) {
 maskBool = 1;
    } else {
   maskBool = 0;
    }
  }

  function textureToggle(){
    if (this.checked()) {
  textureBool = 1;
    } else {
textureBool = 0;
    }
  }




function change() {

  brush++;
  if (brush > 40) {
    brush = 1;
  }

  change2();

}

function change2() {



  brushLayer = createGraphics(width, height);
  brushLayer.tint(0, 0, 0, slider6.value());
  brushLayer.image(brushLib[brush], 0, 0, width, height);

  text(brush, 110, 125);

}







function calcDynamics() {
  // calculate the distance between mouse position, and previous position. Average the previous
  d = dist(mouseX, mouseY, pmouseX, pmouseY);
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

function brushImg2(_x, _y, x2, y2, a, aJ, s, sJ, sC, dens, dist) {
  dist = dist * dens;
  let v1 = createVector(_x, _y);
  let v2 = createVector(x2, y2);
  for (let i = 1; i < int(dist); i++) {
    dist = constrain(dist, 1, 1000);
    let v3 = p5.Vector.lerp(v1, v2, i / (int(dist)));
    let _s = s * (1 - (randomGaussian(sJ)));
    let _a = a + (2 * PI * random(aJ));
    let sCx = random(-sC, sC) * s;
    let sCy = random(-sC, sC) * s;
    v3.x = v3.x + sCx;
    v3.y = v3.y + sCy;

    push();
    translate(v3.x, v3.y);
    rotate(_a);
    translate(-v3.x, -v3.y);
    drawLayer.image(brushLayer, v3.x - (_s / 2), v3.y - (_s / 2), _s, _s);
    pop();
  }
  render();
}
