// orientation and direction for resizing the image
let storedOrientation, currentOrientation, rotateDirection = -1;

// declare all brush variables
let inverter = 1,
driftX, driftY;

// mouse Tracking
let isMousedown = 0;
let vMax, selector;
let introText = ["Touch and Listen", "Look", "Draw"];
let appCol = "#469ede"; // 70, 158, 222
let slide = 4; // current app is starting at 4 to prevent any behaviour before first button press.
let delayTime = 12000; // this is the for each slide change
let introComplete = 0;

//DATA
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
var strokeW = (brushWidth/qtyOfLines);
var opacity = 200;



var gui_img = [];
var pebble = [];
var pebbleu = [];
var randomScalar = [];
var tempID = [];
var tempX = [];
var tempY = [];

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

  //Load all pebble shadow assets
  for (let i = 1; i < 8; i++) {
    pebbleu[i] = loadImage('assets/wpebbleu' + i + '.png');
  }

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  fg = createGraphics(windowWidth, windowHeight);
  fg.strokeWeight(strokeW);
  //strokeCap(PROJECT);
  fg.noFill();
  fg.stroke(20, 100);
  //background(200);


  pLayer= createGraphics(windowWidth, windowHeight);

  change();



  textLayer = createGraphics(width, height);
  introLayer = createGraphics(width, height);
  colorMode(HSB, 360, 100, 100, 1.0);

  introLayer.fill(255, 30);
  introLayer.blendMode(BLEND);
  introLayer.noStroke();

  pixelDensity(1); // effectively ignores retina displays

  calcDimensions();
  sizeWindow();
  slide = 0;
  slideShow();

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

}

function draw() {
  if (!introComplete) {
    blendMode(BLEND);
    image(background, 0, 0, width, height);
    blendMode(MULTIPLY);
    image(introLayer, 0, 0, width, height);
    blendMode(BLEND);
    if (slide > 0) {
      textLayer.text(introText[slide - 1], width / 2, (height / 3) * (slide - 1));
    }
    image(textLayer, 0, 0, width, height);
    introBrush(driftX, driftY);
    driftX = driftX + (random(0, 3)) * inverter;
    if (driftX <= -40 || driftX >= width+40) {
      inverter = -inverter;
      driftX = driftX + (30 * inverter);
    }
    driftY = driftY + (random(-0.5, 1.5));
  }
}

  function change(qty, width, opac) {
    qtyOfLines = qty;
    brushWidth = width;
    opacity = opac;

    vec = [];

    for (i = 0; i < qtyOfLines; i++) {
      vec[i] = [];
    }

    strokeW = ceil(brushWidth/qtyOfLines);
     fg.strokeWeight(strokeW);
  }



function touchdown(ev) {
  isMousedown = 1;
  if (slide === 0) {
    startUp();
  }
  return false;
}

function touchstop(ev) {
  isMousedown = 0;

  //DATA
  // if (introComplete === 1) {
  //   lineStore.push(pointStore);
  //   pointStore = [];
  // }

  // empty array
  for (i = 0; i < qtyOfLines; i++) {
    vec[i] = [];
  }

}

function startUp() {
  click.play();
  startButton.remove();
  slide++;
  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }
  slideShow();
}

function moved(ev) {
  if (!isMousedown) return;
  ev.preventDefault();
  if (introComplete === 1) {

    //DATA
    // pressure = getPressure(ev);
    // pointStore.push({
    //   time: new Date().getTime(),
    //   x: rakeX,
    //   y: rakeY,
    //   pressure: pressure
    // });

    dx = mouseX - x;
    dy = mouseY - y;

    angle1 = atan2(dy, dx);
    x = (mouseX) - cos(angle1) * dragLength;
    x2 = (100) - cos(PI/2) * 1;
    y = (mouseY) - sin(angle1) * dragLength;
    y2 = (100) - sin(PI/2) * 1;

    makeArray(x, y, x2, y2, angle1);
    display();

  } else {
    if (slide === 0) {
      slide++;
      slideShow();
    } else if (slide > 0) {
      introBrush(mouseX, mouseY);
    }
  }
  return false;
}

function introBrush(_x, _y) {
  let randX = int(randomGaussian(-1, 1));
  let randY = int(randomGaussian(-1, 1));
  let randR = int(random(vMax * 16, vMax * 20))
  introLayer.ellipse(_x + randX, _y + randY, randR);
}

function makeArray(x, y, x2, y2, angle) {

  var a = createVector(x, y);
  var b = createVector(0, brushWidth/2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {
    // cool
        // d = p5.Vector.lerp(a, c, (i/qtyOfLines)*random(0,1));
    d = p5.Vector.lerp(a, c, (i/(qtyOfLines+1))+random(0,(1/qtyOfLines)*0.2));
    point(d.x, d.y);

    vec[i].push(d);
  }
}

function display() {
  var bool = 0;
  if (vec[0].length > 1){
    for (var i = 0; i < vec.length; i++) {
      if (i === 0 || i === vec.length-1 || (i % 3) === 2){  // if first line, last line or every 3rd line, then thin, else fat
         fg.strokeWeight(strokeW/2);
      } else {
         fg.strokeWeight(strokeW);
      }

    var n = vec[i];
    if (i % 3 === 0){
          fg.stroke(40);
    } else if (i % 3 === 1){
            fg.stroke(200);
      } else if (i % 3 === 2){
              fg.stroke(0);
        }

    if (eraseActive){
      fg.noStroke();
      fg.fill(127,80);
    fg.ellipse(mouseX,mouseY,vMax*13,vMax*13);
    }

    else {


    bool++;
      fg.line(n[n.length-1].x, n[n.length-1].y, n[n.length-2].x, n[n.length-2].y);
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

getPressure = function (ev) {
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

  if (introComplete === 1) {
    removeElements();
    writeTextUI();
  }
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
    rotateWindow();
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
}

function rotateWindow() {
  var newfg = createGraphics(windowWidth, windowHeight);
  newfg.push();
  newfg.translate(width / 2, height / 2);
  newfg.rotate((PI / 2) * rotateDirection);
  newfg.translate(-height / 2, -width / 2);
  newfg.image(fg, 0, 0, windowHeight, windowWidth);
  newfg.pop()
  fg.resizeCanvas(windowWidth, windowHeight);
  fg = newfg;
  rotateDirection = rotateDirection * -1;
}
