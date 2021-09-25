var layerQty = 5;
var layers = [];
var cols = 20;
var rows = 20;

var bool = false;

function setup() {

  createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < layerQty; i++) {
    layers[i] = createGraphics(width, height);
  }

  background(100);

  var colWidth = floor(width/cols/2);
  var rowWidth = floor(height/rows/2);

  //layers[0].background(40);

  for (var i = 0; i < cols; i++) {

    for (var j = 0; j < rows; j++) {
      layers[2].fill(0);
      layers[2].noStroke();
            layers[1].fill(125);
      layers[1].noStroke();
     //cols
      var x1 = i*colWidth*2;
      var x2 = (i*colWidth*2)+colWidth;
      ////rows
      var y1 = j*rowWidth*2;
      var y2 = (j*rowWidth)+rowWidth

        layers[1].rect(x1, y1, colWidth*1.5, rowWidth*1.5);
        layers[2].rect(x1, y1, colWidth*1.5, rowWidth*1.5);
   
    }
  }
}

function draw() {
}

function touchMoved() {

  // create a layer, fill with white, then black squares
  layers[4].blendMode(BLEND);
  layers[4].fill(200);
  layers[4].rect(0,0,width,height);
  layers[4].image(layers[1], 0, 0, width, height);
  layers[4].blendMode(DARKEST);
  layers[4].image(layers[3], 0, 0, width, height);



  blendMode(BLEND);
  background(125);
  image(layers[0], 0, 0, width, height); // background
  
  blendMode(LIGHTEST);
  layers[2].image(layers[1], 0, 0, width, height);
  image(layers[2], 0, 0, width, height);
  blendMode(DARKEST);
  image(layers[4], 0, 0, width, height);

  if (bool) {  
    layers[0].noStroke();
    layers[0].fill(180, 100, 100, 250);

    for (var i = 0; i < 1100; i++){
      var rx = randomGaussian(-20,20);
      var ry = randomGaussian(-20,20);
    layers[0].ellipse(mouseX+rx, mouseY+ry, 10, 10);
    }
  } else {
    layers[3].noStroke();
    layers[3].fill(255,100, 200);
        for (var i = 0; i < 1100; i++){
      var rx = randomGaussian(-5,5);
      var ry = randomGaussian(-5,5);
    layers[3].ellipse(mouseX+rx, mouseY+ry, 20, 20);
        }
  }
}

function touchEnded() {
  bool = !bool;
}
