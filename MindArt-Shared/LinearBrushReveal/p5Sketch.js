//screen bHeight 2560 1440

var img_background, brush, img_rake; // all images
var sound1, sound2; // wind, trees, etc
var bool_button1 = 0; // bool_button1ean toggle
var bool_button2 = 4; // bool_button1ean toggle
var gui_img = [];
var pebble = [];
var pebbleu = [];
var tempX = [];
var tempY = [];
var tempX2 = 0;
var tempY2 = 0;
var tempcount = 0;
var randomScalar = [];
var tempID = [];
var scalar = 0;
var tempMouseX = 0;
var tempMouseY = 0;

var scatterAmount = 10;

// declare all brush variables
var rakeX = 0,
  rakeY = 0,
  rake2X = 0,
  rake2Y = 0,
  rake3X = 0,
  rake3Y = 0,
  angle1, segLength;


//button spacing
//margin from right
var margin, buttonWidth, buttonSpacing;



function preload() {

  // brush loads


  brush = loadImage('assets/brush7.jpg');
  //  brush.size(windowWidth,windowHeight);


}

function setup() {
  // frameRate(1000);
  createCanvas(windowWidth, windowHeight);
  imageMode(CENTER);
  pixelDensity(1);

  brush.loadPixels();

  background(120);

  segLength = width / 15;
  // colorMode(RGB, 255, 255, 255, 1)


  margin = width / 11;
  buttonWidth = width / 17;
  buttonSpacing = width / 15;

}


function draw() {
    loadPixels();
}

function mousePressed() {

  tempMouseX = ((width/2)-mouseX); // record position on downpress
  tempMouseY = ((height/2)-mouseY); // record position on downpress
}


function mouseDragged() {


    for (var y = (mouseY - 100); y < (mouseY + 100); y++) {
      for (var x = (mouseX - 100); x < (mouseX + 100); x++) {
        var index = (x + y * width) * 4;
        var indexReg = ((x + y * brush.width)-(tempMouseX-tempMouseY)) * 4; // takes away
        // Below, the reason for adding the existing pixels back on is to fake a 50%
        // opacity/alpha, which I suspect is not otherwise possible with a Pixel update
        // The opacity feels too strong, consder revising to give 2/3 weight to the old values
        pixels[index + 0] = ((brush.pixels[indexReg + 0])+(pixels[index + 0])*19)/20;
        pixels[index + 1] = ((brush.pixels[indexReg + 1])+(pixels[index + 1])*19)/20;
        pixels[index + 2] = ((brush.pixels[indexReg + 2])+(pixels[index + 2])*19)/20;
      //  pixels[index + 3] = (brush.pixels[indexReg + 3]); // uncessary to add alpha from old pixel valyue
      }


  }
    updatePixels();




  // tint(255, 0, 125, 0.01); // Display at half opacity
  //
  //
  //   dx = mouseX - rake3X;
  //   dy = mouseY - rake3Y;
  //   angle1 = atan2(dy, dx);
  //   rake3X = mouseX - (cos(angle1) * (segLength/2));
  //   rake3Y = mouseY - (sin(angle1) * (segLength/2));
  //   scalar = (width-(1*abs(pmouseX-mouseX)))/width;
  //
  //   abs()
  //
  //   segment(rake3X, rake3Y, angle1, img_brush, scalar)


}

// function segment(rakeX, rakeY, a, rake, scalar) {
//   push();
//
//   translate(rakeX+(randomGaussian(-scatterAmount,scatterAmount)), rakeY+(randomGaussian(-scatterAmount,scatterAmount)));
//   rotate(a);
//     scale(1.2*pow(scalar, 30));
//
//   image(rake, 0, -50, 0, 0);
//   pop();
// }


function windowResized() {

  setup();

}
