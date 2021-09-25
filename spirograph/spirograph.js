var NUMSINES = 2; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var rad; // an initial radius value for the central sine
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

function setup() {
  createCanvas(windowWidth, windowHeight);

  
  drawing = createGraphics(width, height);
  ui = createGraphics(width, height);
    ui.fill(0);


  slider1 = createSlider(1, 10, 1); // speed
  slider2 = createSlider(1, 300, 240); // density
  slider3 = createSlider(1, 1000, 10); // brush randomLines
  slider4 = createSlider(0, 100, 1); // random
  slider5 = createSlider(10, 300, 1); // random
  text('speed', 10, 30);
  slider1.position(10, 50);
  text('ratio', 10, 130);
  slider2.position(10, 150);
  text('lineDensity', 10, 230);
  slider3.position(10, 250);
  text('lineSpread', 10, 330);
  slider4.position(10, 350);
  text('lineWidth', 10, 430);
  slider5.position(10, 450);
  slider1.style('width', '300px');
  slider2.style('width', '300px');
  slider3.style('width', '300px');
  slider4.style('width', '300px');
  slider5.style('width', '300px');

  rad = height / 10; // compute radius for central circle
  background(204); // clear the screen

  for (var i = 0; i<sines.length; i++) {
    sines[i] = PI; // start EVERYBODY facing NORTH
  }

  for (var i = 0; i < lineQty; i++) {
    xPrev[i] = 0;
    yPrev[i] = 0;
    rn[i] = randomGaussian(-1, 1);
  }
}

function draw() {

  fund = slider1.value()/100;
  ratio = slider2.value()/100;
  lineQty = slider3.value();
  var randomness = slider4.value();
  var sW = slider5.value()/10;



  rad = dist(mouseX, mouseY, width/2, height/2);

  //background(204); // clear screen if showing geometry
  drawing.stroke(150, 150, 255, 10); // black pen
  //strokeCap(PROJECT);
  drawing.strokeWeight(sW);
  drawing.noFill(); // don't fill



//  translate(width/2, height/2);
 //drawing.translate(width/2, height/2);

  // large circle



  var largeTheta = sines[0];

  var largeRadius = rad;

  sines[0] = (sines[0] + (fund + (fund * 0 * ratio))) % TWO_PI; // update angle based on fundamental

  var x0 = largeRadius*cos(largeTheta);
  var y0 = largeRadius*sin(largeTheta);
  
  ellipse(x0, y0, 10, 10);


  // polar to cartesian verion

  var i = 1;

  var radius = rad / (i + 1); // radius for circle itself



  var theta = sines[i];



  for (var j = 0; j < lineQty; j++) {



    var x1 = ((radius+(randomness*rn[j]))*cos(theta))+x0;
    var y1 = ((radius+(randomness*rn[j]))*sin(theta))+y0;


    drawing.line(x1+width/2, y1+height/2, xPrev[j]+width/2, yPrev[j]+height/2);

    xPrev[j] = x1;
    yPrev[j] = y1;
  }




  sines[i] = (sines[i] + (fund + (fund * i * ratio))) % TWO_PI; // update angle based on fundamental
  
  
    // ui
    ui.clear();
     ui.line(width/2, height/2, x0+width/2, y0+height/2);
      ui.ellipse(x0+width/2, y0+height/2, 50, 50);
  
  
  background(30, 60, 60);
  
    image(drawing,0,0,width,height);
    image(ui, 0, 0, width, height);
    
   

}

function mousePressed() {

drawing.clear();
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
