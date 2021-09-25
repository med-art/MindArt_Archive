var x = 100, 
  y = 100, 
  vec = [], 
  px = [], 
  py = [], 
  pA = [];
angle1 = 0.0, 
  dragLength = 80;

var r = 0;

var qtyOfLines = 40;
var brushWidth = 200;
var strokeW = (brushWidth/qtyOfLines);
var opactity = 200;

var slider1;
var slider2;
var slider3;


function setup() {
  createCanvas(windowWidth, windowHeight);
  background = loadImage('sand_01.jpg');
  fg = createGraphics(windowWidth, windowHeight);
  fg.strokeWeight(strokeW);
  //strokeCap(PROJECT);
  fg.noFill();
  fg.stroke(20, 100);
  //background(200); 
  
  slider1 = createSlider(0, 200, 100);
  slider2 = createSlider(0, 400, 100);
  slider3 = createSlider(0, 255, 255);
  slider1.position(10, 10);
  slider2.position(10, 40);
  slider3.position(10, 70);
  slider1.input(change);
  slider2.input(change);
  slider3.input(change);

  change();
}

function change() {
  console.log("yup");

  qtyOfLines = slider1.value();
  brushWidth = slider2.value();
  opacity = slider3.value();

  vec = [];

  for (i = 0; i < qtyOfLines; i++) {
    vec[i] = [];
  }

  strokeW = ceil(brushWidth/qtyOfLines);
   fg.strokeWeight(strokeW);
}

function touchMoved() {
  //background(0);

  dx = mouseX - x;
  dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = (mouseX) - cos(angle1) * dragLength;
  x2 = (100) - cos(PI/2) * 1;
  y = (mouseY) - sin(angle1) * dragLength;
  y2 = (100) - sin(PI/2) * 1;

  makeArray(x, y, x2, y2, angle1);

  display();
}


function makeArray(x, y, x2, y2, angle) {

  var a = createVector(x, y);
  var b = createVector(0, brushWidth/2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {
    d = p5.Vector.lerp(a, c, i/qtyOfLines);
    point(d.x, d.y);
    vec[i].push(d);
  }
}

function display() {
  var bool = 0;
  if (vec[0].length > 1){
    for (var i = 0; i < vec.length; i++) {
    var n = vec[i];
    fg.stroke(255*bool, opacity);
    bool = !bool
      fg.line(n[n.length-1].x, n[n.length-1].y, n[n.length-2].x, n[n.length-2].y);
  }
}
 blendMode(BLEND);
  image(background, 0, 0, width, height);
  blendMode(OVERLAY);
  image(fg, 0, 0, width, height);
}

function touchEnded() {

  for (i = 0; i < qtyOfLines; i++) {
    vec[i] = [];
  }
}
