// orientation and direction for resizing the image
let storedOrientation, currentOrientation, rotateDirection = -1;

// mouse Tracking
let isMousedown = 0;
let vMax;
let introText = ["Touch and Listen", "Look", "Draw"];
let appCol = "#469ede"; // 70, 158, 222

//data storage - not currently in use
let pointStore;
let lineStore;

// new variables below
var x = 100,
  y = 100,
  vec = [],
  px = [],
  py = [],
  pA = [];
angle1 = 0.0,
  dragLength = 30;

var r = 0;
var qtyOfLines = 40;
var brushWidth = 200;
var strokeW = (brushWidth / qtyOfLines);
var opacity = 200;

var gui_img = [];
var pebble = [];

var randomScalar = [];
var tempID = [];
var tempX = [];
var tempY = [];

var storedOrientationDegrees = 0;

function preload() {
  //load all brush assets and background
  background = loadImage('assets/sand_01.jpg');
  audio = loadSound('assets/audio_01.mp3');
  click = loadSound('assets/click.mp3');
  for (let i = 1; i < 3; i++) {
    gui_img[i] = loadImage('assets/gui' + i + '.png');
  }
  //Load all pebble assets
  for (let i = 1; i < 8; i++) {
    pebble[i] = loadImage('assets/wpebble' + i + '.png');
  }

}

function setup() {

  createCanvas(window.innerWidth, window.innerHeight);
  // NOTE: UInsure if these should be in setup, or declared globally an put into restart
  fg = createGraphics(width, height);
  pLayer = createGraphics(width, height);
  textLayer = createGraphics(width, height);
  introLayer = createGraphics(width, height);

  fg.strokeWeight(strokeW);
  fg.noFill();
  fg.stroke(20, 100);

  colorMode(HSB, 360, 100, 100, 1.0);

  introLayer.fill(255, 30);
  introLayer.blendMode(BLEND);
  introLayer.noStroke();

  pixelDensity(1); // effectively ignores retina displays

  var stbtn = $("<div />").appendTo("body");
  stbtn.addClass('startBtn');
  $('<p>Touch Here</p>').appendTo(stbtn);
  stbtn.mousedown(start);
  stbtn.mousemove(start);




}

function start() {
  // NOTE: what is redraw();
  $(".startBtn").remove();
  fullscreen(1);
  click.play();
  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }
  change();

  calcDimensions();
  sizeWindow();

  textLayer.clear();
  introComplete = 1;
  sizeWindow();
  writeTextUI();
  rake(1);
  reset();
  counter = 0;


  // all event listeners
  canvas.addEventListener('touchmove', moved);
  canvas.addEventListener('mousemove', moved);
  canvas.addEventListener('touchstart', touchdown);
  canvas.addEventListener('mousedown', touchdown);
  canvas.addEventListener('touchend', touchstop);
  canvas.addEventListener('touchleave', touchstop);
  canvas.addEventListener('mouseup', touchstop);

  //DATA
  pointStore = [];
  lineStore = [];

  // window.addEventListener("orientationchange", function() {
  //   alert(window.orientation);
  // }, false);

}

function change(qty, width, opac) {
  qtyOfLines = qty;
  brushWidth = width;
  opacity = opac;
  vec = [];
  for (i = 0; i < qtyOfLines; i++) {
    vec[i] = [];
  }
  strokeW = ceil(brushWidth / qtyOfLines);
  fg.strokeWeight(strokeW);
}

function touchdown(ev) {
  isMousedown = 1;
  return false;
}

function touchstop(ev) {
  isMousedown = 0;
  for (i = 0; i < qtyOfLines; i++) {
    vec[i] = [];
  }
}

function moved(ev) {
  if (!isMousedown) return;
  ev.preventDefault();

  dx = mouseX - x;
  dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = (mouseX) - cos(angle1) * dragLength;
  x2 = (100) - cos(PI / 2) * 1;
  y = (mouseY) - sin(angle1) * dragLength;
  y2 = (100) - sin(PI / 2) * 1;

  makeArray(x, y, x2, y2, angle1);
  display();



  return false;
}

function makeArray(x, y, x2, y2, angle) {

  var a = createVector(x, y);
  var b = createVector(0, brushWidth / 2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {
    // cool
    // d = p5.Vector.lerp(a, c, (i/qtyOfLines)*random(0,1));
    d = p5.Vector.lerp(a, c, (i / (qtyOfLines + 1)) + random(0, (1 / qtyOfLines) * 0.2));
    point(d.x, d.y);

    vec[i].push(d);
  }
}

function display() {
  var bool = 0;
  if (vec[0].length > 1) {
    for (var i = 0; i < vec.length; i++) {
      if (i === 0 || i === vec.length - 1 || (i % 3) === 2) { // if first line, last line or every 3rd line, then thin, else fat
        fg.strokeWeight(strokeW / 2);
      } else {
        fg.strokeWeight(strokeW);
      }

      var n = vec[i];
      if (i % 3 === 0) {
        fg.stroke(40);
      } else if (i % 3 === 1) {
        fg.stroke(200);
      } else if (i % 3 === 2) {
        fg.stroke(0);
      }

      if (eraseActive) {
        fg.noStroke();
        fg.fill(127, 80);
        fg.ellipse(mouseX, mouseY, vMax * 13, vMax * 13);
      } else {


        bool++;
        fg.line(n[n.length - 1].x, n[n.length - 1].y, n[n.length - 2].x, n[n.length - 2].y);
      }
    }
  }
  blendMode(BLEND);
  image(background, 0, 0, width, height);
  blendMode(OVERLAY);

  image(fg, 0, 0, width, height);
  blendMode(BLEND);
  noTint();
  image(pLayer, 0, 0, width, height);
}



function resetTimeout() {
  setTimeout(reset, 50);

  getPressure = function(ev) {
    return ((ev.touches && ev.touches[0] && typeof ev.touches[0]["force"] !== "undefined") ? ev.touches[0]["force"] : 1.0);
  }
}

function reset() {
  click.play();
  blendMode(REPLACE);
  image(background, 0, 0, width, height);
  fg.clear();
  pLayer.clear();
  change(qtyOfLines, brushWidth, opacity); // sort of circular


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

  display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sizeWindow();

  // removeElements();
  writeTextUI();
  display();
}


function sizeWindow() {
  // canvas.width = window.innerWidth;
  // canvas.height =  window.innerHeight;
  image(background, 0, 0, width, height);
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
  segLength = width / 15;
  calcDimensions();
  textLayer.resizeCanvas(windowWidth, windowHeight);
  //bLayer.tint(255, 190);
  driftX = width / 2;
  driftY = 0;



}



function stretchWindow() {
  var newfg = createGraphics(windowWidth, windowHeight);
  newfg.image(fg, 0, 0, windowWidth, windowHeight);
  fg.resizeCanvas(windowWidth, windowHeight);
  fg = newfg;

  var newpLayer = createGraphics(windowWidth, windowHeight);
  newpLayer.image(pLayer, 0, 0, windowWidth, windowHeight);
  pLayer.resizeCanvas(windowWidth, windowHeight);
  pLayer = newpLayer;
}

function rotateWindow(direction) {
  var newfg = createGraphics(windowWidth, windowHeight);
  newfg.push();
  newfg.translate(width / 2, height / 2);
  newfg.rotate((PI / 2) * direction);
  newfg.translate(-height / 2, -width / 2);
  newfg.image(fg, 0, 0, windowHeight, windowWidth);
  newfg.pop()
  fg.resizeCanvas(windowWidth, windowHeight);
  fg = newfg;

  var newpLayer = createGraphics(windowWidth, windowHeight);
  newpLayer.push();
  newpLayer.translate(width / 2, height / 2);
  newpLayer.rotate((PI / 2) * direction);
  newpLayer.translate(-height / 2, -width / 2);
  newpLayer.image(pLayer, 0, 0, windowHeight, windowWidth);
  newpLayer.pop()
  pLayer.resizeCanvas(windowWidth, windowHeight);
  pLayer = newpLayer;

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
