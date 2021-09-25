var NUMSINES = 2; // how many of these things can we do at once?
var sines = new Array(NUMSINES); // an array to hold all the current angles
var r; // an initial radius value for the central sine
var i; // a counter variable

// play with these to get a sense of what's going on:
var fund = 0.33; // the speed of the central sine
var ratio = 1.65; // what multiplier for speed is each additional sine?
var alpha = 50; // how opaque is the tracing system

var xPrev = [];
var yPrev = [];
var rn = [];

var lineQty = 1000; // set to max

var drawing;

// rotation tracking variables.
var a, aprev;
var centerX;
var centerY;
var rotationTotal = 0;
var aprev;

var sW = 1;

var currentPos = 0;
var increment;
var x, y;

var counter = 0;

var colVersion = -1;

var toggle = 0;

var slider2;


var randomness, ration, lineQty;

var colours = [
  ['#363ED9', '#04B2D9', '#05DBF2', '#0CF2DB'],
  ['#F20C1F', '#0D0A07', '#D9D0C7', '#BF1515'],
  // ['#2B402B', '#D9AE79', '#BF2604', '#A68080'],
  ['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
  ['#7E6167', '#B4356B', '#06CF90', '#17EEB2'],
  ['#345573', '#F2913D', '#223240', '#F24B0F'], // I think ill be fine after eating ice cream
  ['#0388A6','#F299B1', '#020659', '#80BF90', '#F28705'], // Handelsblatt---All-about-money,-the-costs-of-education-1
  ['#F2F2F2', '#A6A6A6', '#737373', '#0D0D0D', '#404040'], // Unchained
  ['#A6886D', '#F2E0D0', '#402E27', '#F29D52', '#221F26'], // the Planets
  ['#BF4B8B', '#3981BF', '#1F628C', '#590808', '#D92929'], // adidas-Telstar-50-anniversary
  ['#A64456', '#422A59', '#F2B366', '#D9BBA0', '#D96D55'], // Lettering-Love
  ['#F24452', '#5CE3F2', '#F2E205', '#F2CB05', '#F29D35'], // People-of-The-Internet
  ['#D9A74A', '#BF6E3F', '#A67563', '#BFA095', '#BF4141'], // Sparkling-Botanicals-1'
  ['#F27EA9', '#05AFF2', '#F2B705', '#F29F05', '#F2541B'] // Lettering-Series-XXII-1
];

function start() {
  $(".startBtn").remove();
  fullscreen(1);
  // note currently everything resets on windowResized. Unsure if this is logical yet
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  drawing = createGraphics(width, height);
  ui = createGraphics(width, height);
  ui.stroke(120, 50);
  ui.strokeWeight(10);
  ui.noFill();

  drawing.blendMode(BLEND);// OVERLAY 8 // SCREEN 10, MULTIPLY 7, BLEND 9,

}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);

  dimensionCalc();

    $("#toggle").remove();
        $("#restart").remove();
            $("#slider").remove();

      button = createButton('Toggle');
      button.position(40, height-(6.5*vMax));
      button.mouseClicked(toggleStyle);
      button.class("select");
      button.id("toggle");
      button.style('font-size', '2.6vmax');
      button.style('height', '4.5vmax');

      restartBtn = createButton('Restart');
      restartBtn.position(width - (14*vMax), height-(6.5*vMax));
      restartBtn.mouseClicked(reset);
      restartBtn.class("select");
      restartBtn.id("restart");
      restartBtn.style('font-size', '2.6vmax');
      restartBtn.style('height', '4.5vmax');

      slider2 = createSlider(120, 621, 240); // density
      slider2.position(10, 150);
      slider2.style('width', '300px');
      slider2.id("slider");


  reset();

}

function reset(){


  colVersion++;
  if (colVersion == colours.length){
    colVersion = 0;

  }
  background(colours[colVersion][3]);
  $(".box").remove();
  createSwatch();
  //changeCol(2);
  drawing.clear();

  rad = height / 10; // compute radius for central circle


  for (var i = 0; i < sines.length; i++) {
    sines[i] = PI; // start EVERYBODY facing NORTH
  }

  for (var i = 0; i < lineQty; i++) {
    xPrev[i] = 0;
    yPrev[i] = 0;
    rn[i] = random(-1, 1);
  }

  centerX = width / 2;
  centerY = height / 2;

  drawing.strokeWeight(sW);
  drawing.noFill(); // don't fill
}



function toggleStyle(){
  toggle++;
  if (toggle > 2){
    toggle = 0;
  }
}
function touchMoved() {


  // calc rotations

  a = atan2(mouseY - centerY, mouseX - centerX);
  if (!aprev) { // if aprev is undefined
    aprev = a;
  }


  var c = a - aprev;

  if (c >= PI) {
    c = a - aprev - (2 * PI);
      console.log("one")
  } else if (c < -PI) {
    c = aprev - a - (2 * PI);
      console.log("two")
  } else (
    console.log("is this the issue")
  )

  aprev = a;

  rotationTotal = rotationTotal + c;



    if (currentPos < (rotationTotal - fund)) {
      currentPos += fund / 2;
      triggerNewDraw();
    } else if (currentPos > (rotationTotal + fund)) {
      currentPos -= fund / 2;
      triggerNewDraw();
    } else {
      // currentPos = rotationTotal;
      currentPos = currentPos;
    }


    background(colours[colVersion][3]);
    image(drawing, 0, 0, width, height);
    image(ui, 0, 0, width, height);
    counter++ // keeps track of how many points crossed
    fill(255);
    blendMode(DIFFERENCE);
    textSize(width / 50);
    text("colour set " + colVersion, width - (width / 5), height / 10);
    blendMode(BLEND);

}


function triggerNewDraw(){
    x = r * cos(currentPos);
    y = r * sin(currentPos);

    ellipse(centerX + x, centerY + y, 10, 10);
    line(centerX + x, centerY + y, centerX, centerY);
    // draw

    var largeTheta = currentPos;
    var largeRadius = r;

    //sines[0] = (sines[0] + (fund + (fund * 0 * ratio))) % TWO_PI; // update angle based on fundamental

    var x0 = x;
    var y0 = y;

    ellipse(x0, y0, 10, 10);

    // polar to cartesian verion

    var i = 1;
    var radius = r / (i + 1); // radius for circle itself
    var theta = sines[i];

    if (toggle == 0){
    drawingStyle1(radius, theta, i, x0, y0, 1, 1, 20);
  } else if (toggle == 1){
      drawingStyle2(radius, theta, i, x0, y0, 1, 18, 200);
  } else if (toggle ==  2) {
    drawingStyle3(radius, theta, i, x0, y0, 1, 18, 200)
  } else {
    drawingStyle4(radius, theta, i, x0, y0, 1, 4, 200)
  }


    sines[i] = (currentPos) * ratio;

    // sines[i] = (sines[i] + (fund + (fund * i * ratio))) % TWO_PI; // update angle based on fundamental


}

function drawingStyle1(radius, theta, i, x0, y0, aplha, randomness, lineQty ){
  for (var j = 0; j < lineQty; j++) {
    // rn[j] = random(-1, 1);
    var x1 = ((radius + (randomness * rn[j])) * cos(theta)) + x0;
    var y1 = ((radius + (randomness * rn[j])) * sin(theta)) + y0;
    var w2 = width / 2;
    var h2 = height / 2;
    if (counter > 1){
    drawing.line(x1 + w2, y1 + h2, (xPrev[j]) + w2, (yPrev[j]) + h2);
    drawing.strokeWeight(2);

  }
    if (xPrev[j] != x1){
    xPrev[j] = x1;
    yPrev[j] = y1;
  }
  }
  // ui
  ui.clear();
  ui.fill(255,130);
  ui.noStroke();
    ui.ellipse(x1 + w2, y1 + h2, radius/2, radius/2);
  ui.ellipse(width / 2 + x0, height / 2 + y0, radius*2, radius*2);
  ui.strokeWeight(radius*2);
  ui.stroke(255,130);
  ui.noFill();
  ui.ellipse(width / 2, height / 2, r * 2, r * 2);
}

function drawingStyle2(radius, theta, i, x0, y0, aplha, randomness, lineQty ){
  for (var j = 0; j < lineQty; j++) {
    rn[j] = randomGaussian(-1, 1);
    var x1 = ((radius + (randomness * rn[j])) * cos(theta)) + x0;
    var y1 = ((radius + (randomness * rn[j])) * sin(theta)) + y0;
    var w2 = width / 2;
    var h2 = height / 2;

    if (counter > 1){
    drawing.line(x1 + w2, y1 + h2, (xPrev[j]) + w2, (yPrev[j]) + h2);
      drawing.strokeWeight(random(0.1,0.1*sqrt(radius)));

  }
    if (xPrev[j] != x1){
    xPrev[j] = x1;
    yPrev[j] = y1;
  }
  }
  // ui
  ui.clear();
  ui.line(width / 2, height / 2, x0 + width / 2, y0 + height / 2);
  ui.line(x1 + w2, y1 + h2, x0 + w2, y0 + h2);
  ui.ellipse(width / 2 + x0, height / 2 + y0, 5, 5);
  ui.ellipse(width / 2, height / 2, r * 2, r * 2);
}


function drawingStyle3(radius, theta, i, x0, y0, aplha, randomness, lineQty ){
  for (var j = 0; j < lineQty; j++) {
    // rn[j] = random(-1, 1);
    var x1 = ((radius + (randomness * rn[j])) * cos(theta)) + x0;
    var y1 = ((radius + (randomness * rn[j])) * sin(theta)) + y0;
    var w2 = width / 2;
    var h2 = height / 2;

    if (counter > 1){
    drawing.line(x1 + w2, y1 + h2, (xPrev[j]) + w2, (yPrev[j]) + h2);
      drawing.strokeWeight(random(0.1,0.1*sqrt(radius)));

  }
    if (xPrev[j] != x1){
    xPrev[j] = x1;
    yPrev[j] = y1;
  }
  }
  // ui
  ui.clear();
  ui.line(width / 2, height / 2, x0 + width / 2, y0 + height / 2);
  ui.line(x1 + w2, y1 + h2, x0 + w2, y0 + h2);
  ui.ellipse(width / 2 + x0, height / 2 + y0, 5, 5);
  ui.ellipse(width / 2, height / 2, r * 2, r * 2);
}


function touchStarted() {

  counter = 0;

  var s = (atan2(mouseY - centerY, mouseX - centerX));
  //s = s - (s % fund);
  currentPos = s;
  rotationTotal = s;

  ratio = (slider2.value() / 100)+0.3333; // note the 0.32 is just a
  // assumed value to add uneven numbers into the equation. Consider making
  // more intentional

  //lineQty = slider3.value();


  //randomness = slider4.value();

  r = dist(mouseX, mouseY, centerX, centerY);

  //drawing.clear();
  noStroke();
  fill(255);
  push();
  translate(-width / 2, -height / 2);
  text('speed', 10, 30);

  text('ratio', 10, 130);

  text('lineDensity', 10, 230);

  text('lineSpread', 10, 330);

  text('lineWidth', 10, 430);
  pop();
}

function touchEnded() {
  aPrev = null;
  rotationTotal = currentPos;
  counter = 0;
}



function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}


function createSwatch() {
  swatch = [];
  for (let i = 0; i < colours[colVersion].length; i++) {
    swatch[i] = createButton("");
    swatch[i].position((((i + 1) * 7) + 20) * vMax, height - (6 * vMax));
    swatch[i].size(7 * vMax, 10.5 * vMax);
    swatch[i].style("background-color", colours[colVersion][i]);
    swatch[i].class("box");
    swatch[i].id("swatch" + i);
    swatch[i].mousePressed(function() {
      changeCol(i)
    });
  }
        changeCol(2)
}

function changeCol(cc){
  // let bC = floor(random(1, colours[colVersion].length));
  c = colours[colVersion][cc];
  colSel = colorAlpha(c, 0.1);

    drawing.stroke(colSel);

  for (let i = 0; i < colours[colVersion].length; i++) {
        swatch[i].position((((i + 1) * 7) + 20) * vMax, height - (6 * vMax));
        swatch[i].size(7 * vMax, 6 * vMax);
  }

  swatch[cc].position((((cc + 1) * 7) + 20) * vMax, height - (10.5 * vMax));
      swatch[cc].size(7 * vMax, 10.5 * vMax);
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

function changeDrawingStyle(){

}
