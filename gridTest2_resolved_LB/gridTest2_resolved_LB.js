var layerQty = 6;
var layers = [];
var cols = 200;
var rows = 100;

var col = ['#C5D4E3', '#BF8275', '#400803'];

var bool = false;

function setup() {

  createCanvas(windowWidth, windowHeight);

  for (var i = 0; i < layerQty; i++) {
    layers[i] = createGraphics(width, height);
  }



  var colWidth = (width/cols/2);
  var rowWidth = (height/rows/2);

 // draw back
  layers[1].fill(255);
  layers[1].noStroke();
  for (var i = 0; i < cols+1; i++) {
    for (var j = 0; j < rows+1; j++) {
      var x1 = i*colWidth*2;
      var y1 = j*rowWidth*2;
      layers[1].rect(x1, y1, colWidth*1.5, rowWidth*1.5)
    }
  }

  //draw front
  layers[2].fill(255);
  layers[2].noStroke();
  for (var i = 0; i < cols+1; i++) {
    layers[2].rect((i*colWidth*2)-colWidth/2, 0, colWidth/2, height);
  }

  for (var j = 0; j < rows+1; j++) {
    layers[2].rect(0, (j*rowWidth*2)-rowWidth/2, width, rowWidth/2);
  }
}

function draw() {

  
  
  layers[4].image(layers[0], 0, 0, width, height);
  layers[4].image(layers[1], 0, 0, width, height);
  
  layers[5].image(layers[3], 0, 0, width, height);
  layers[5].image(layers[2], 0, 0, width, height);
  
  blendMode(BLEND);
  background(col[0]);  
  blendMode(DARKEST);
  image(layers[4], 0, 0, width, height);
  image(layers[5], 0, 0, width, height);
  
}

function touchMoved() {


  if (bool) {  
    layers[0].noStroke();
    layers[0].fill(col[1]);

    for (var i = 0; i < 1100; i++){
      var rx = randomGaussian(-20,20);
      var ry = randomGaussian(-20,20);
    layers[0].ellipse(mouseX+rx, mouseY+ry, 10, 12);
    }
  } else {
    layers[3].noStroke();
    layers[3].fill(col[2]);
        for (var i = 0; i < 1100; i++){
      var rx = randomGaussian(-25,25);
      var ry = randomGaussian(-25,25);
    layers[3].ellipse(mouseX+rx, mouseY+ry, 12, 10);
        }
  }
}

function touchEnded() {
  bool = !bool;
}
