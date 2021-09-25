var layerQty = 6;
var layers = [];
var cols = 120;
var rows = 80;

//var col = ['#0A0A0D', '#636573', '#BFBDBA']; // industrial beige
var col = ['#3F5765', '#EFEFEF', '#FF530D'];

var bool = false;

function setup() {

  createCanvas(windowWidth, windowHeight);
  paper = loadImage('paper.jpg');

  for (var i = 0; i < layerQty; i++) {
    layers[i] = createGraphics(width, height);
  }



  var colWidth = (width/cols/2);
  var rowWidth = (height/rows/2);

  // draw back
  layers[1].fill(0);
  layers[1].noStroke();
  for (var i = 0; i < cols+1; i++) {
    for (var j = 0; j < rows+1; j++) {
      var x1 = i*colWidth*2;
      var y1 = j*rowWidth*2;
      layers[1].rect(x1, y1, colWidth*1.5, rowWidth*1.5)
    }
  }

  //draw front
  layers[2].fill(0);
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
  blendMode(LIGHTEST);
  image(layers[4], 0, 0, width, height);
  image(layers[5], 0, 0, width, height);
  blendMode(MULTIPLY);
  image(paper, 0, 0, width, height);
}

function touchMoved() {


  if (bool) {  
    layers[0].noStroke();
    var c = colorAlpha(col[1], 0.1);
    layers[0].fill(c);

    for (var i = 0; i < 500; i++) {
      var rx = randomGaussian(-20, 20);
      var ry = randomGaussian(-20, 20);
      layers[0].ellipse(mouseX+rx, mouseY+ry, 10, 12);
    }
  } else {





    layers[3].strokeWeight(constrain(abs((mouseY + mouseX) - (pmouseX + pmouseY)), 0.1, 2)); // for line work
    var c = colorAlpha(col[2], 0.05);

    layers[3].stroke(c);
    for (i = 0; i < 800; i++) {
      var randX = randomGaussian(-15, 15);
      var randY = randomGaussian(-15, 15);
      layers[3].line(mouseX + randX, mouseY + randY, pmouseX + randX, pmouseY + randY);
    }
  }
}


function touchEnded() {
  bool = !bool;
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}
