var NUMSINES = 2; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var r; // an initial radius value for the central sine
var i; // a counter variable

// play with these to get a sense of what's going on:
var fund = 0.1; // the speed of the central sine
var ratio = 1.65; // what multiplier for speed is each additional sine?
var alpha = 50; // how opaque is the tracing system

var xPrev = [];
var yPrev = [];
var rn = [];

var lineQty = 1000;  // set to max

var drawing;

// rotation tracking variables.
var a, aprev;
var centerX;
var centerY;
var rotationTotal = 0;
var aprev;

var sW = 1;

var desiredPos;
var increment;



var randomness, ration, lineQty;

var cols = ['#025949','#038C65','#D9A679','#BF4226','#F2F2F2'];


function setup() {
  createCanvas(windowWidth, windowHeight);


  drawing = createGraphics(width, height);
  ui = createGraphics(width, height);
  ui.stroke(120, 50);
  ui.strokeWeight(10);
    ui.noFill();


  b1 = createButton('erase');
  b1.mousePressed(clearIt);
    b2 = createButton('change colour');
  b2.mousePressed(colChange);
  slider2 = createSlider(1, 300, 240); // density
  slider3 = createSlider(1, 1000, 10); // brush randomLines
  slider4 = createSlider(0, 100, 1); // random

  b1.position(10, 50);
    b2.position(10, 100);
  text('ratio', 10, 130);
  slider2.position(10, 150);
  text('lineDensity', 10, 230);
  slider3.position(10, 250);
  text('lineSpread', 10, 330);
  slider4.position(10, 350);
  text('lineWidth', 10, 430);


  slider2.style('width', '300px');
  slider3.style('width', '300px');
  slider4.style('width', '300px');


  rad = height / 10; // compute radius for central circle
  background(30, 60, 60); // clear the screen

  for (var i = 0; i<sines.length; i++) {
    sines[i] = PI; // start EVERYBODY facing NORTH
  }

  for (var i = 0; i < lineQty; i++) {
    xPrev[i] = 0;
    yPrev[i] = 0;
    rn[i] = randomGaussian(-1, 1);
  }

  centerX = width/2;
  centerY = height/2;
  
    drawing.strokeWeight(sW);
  drawing.noFill(); // don't fill
}

function touchMoved() {
  
  
  // calc rotations
  
  a = atan2(mouseY-centerY, mouseX - centerX);
   if (!aprev){ // if aprev is undefined
  aprev = a;
 }
 
  var x = r * cos(a);
  var y = r * sin(a);
  
  ellipse(centerX+x, centerY+y, 10, 10);
  line(centerX+x, centerY+y, centerX, centerY);
    
  var c = a - aprev;
    if (c > PI){
    c =  a - aprev - (2*PI);
  }
  if (c < -PI){
    c =  aprev - a - (2*PI);
  }
  aprev = a;
  
   rotationTotal = rotationTotal + c;
   
   
  
// draw







  var largeTheta = rotationTotal;

  var largeRadius = r;
  


  //sines[0] = (sines[0] + (fund + (fund * 0 * ratio))) % TWO_PI; // update angle based on fundamental

  var x0 = x;
  var y0 = y;

  ellipse(x0, y0, 10, 10);


  // polar to cartesian verion

  var i = 1;
  var radius = r / (i + 1); // radius for circle itself
  var theta = sines[i];


  for (var j = 0; j < lineQty; j++) {

    var x1 = ((radius+(randomness*rn[j]))*cos(theta))+x0;
    var y1 = ((radius+(randomness*rn[j]))*sin(theta))+y0;


    drawing.line(x1+width/2, y1+height/2, xPrev[j]+width/2, yPrev[j]+height/2);

    xPrev[j] = x1;
    yPrev[j] = y1;
  }


  sines[i] = (-rotationTotal) * ratio;

 // sines[i] = (sines[i] + (fund + (fund * i * ratio))) % TWO_PI; // update angle based on fundamental


  // ui
  ui.clear();
  ui.line(width/2, height/2, x0+width/2, y0+height/2);
  ui.ellipse(width/2+x0, height/2+y0, 5, 5);

  ui.ellipse(width/2, height/2, r*2, r*2);

  background(cols[2]);
  image(drawing, 0, 0, width, height);
  image(ui, 0, 0, width, height);
  text(rotationTotal, 10, 1000);
}

function touchStarted() {
  
    ratio = slider2.value()/100;
  lineQty = slider3.value();
  
  
  randomness = slider4.value();

  r = dist(mouseX, mouseY, centerX, centerY); 

  //drawing.clear();
  noStroke();
  fill(255);
  push();
  translate(-width/2, -height/2);
  text('speed', 10, 30);

  text('ratio', 10, 130);

  text('lineDensity', 10, 230);

  text('lineSpread', 10, 330);

  text('lineWidth', 10, 430);
  pop();
}

function touchEnded(){
  aPrev = null;
}

function clearIt(){
  drawing.clear();
  background(cols[2]);
}

function colChange(){
  col =  colorAlpha(cols[floor(random(0,cols.length))], 0.1);
 
    drawing.stroke(col);
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}
