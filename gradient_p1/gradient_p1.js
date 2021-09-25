var colQty = 100;
var colWidth;
var colYtrack = [];
var drawActive = false;

var c1, c2, c3, c4;

var restart;

var colours = [
['#F21D2F', '#2CBF60', '#F2A516', '#F2E9D8'],
['#174FBF', '#163E8C', '#9BA7BF', '#0D0D0D'],
['#F25C84', '#B629F2', '#391DF2', '#4AD95F'],
['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
['#7E6167', '#B4356B', '#06CF90', '#17EEB2']
];

var currentColSet = 0;

function setup() {

  createCanvas(windowWidth, windowHeight);
  newLayer = createGraphics(windowWidth, windowHeight);
  newLayer.blendMode(BLEND);
  
  var cc = floor(random(0, colours.length));
  
  c1 = colours[cc][0];
  c2 = colours[cc][1];
  c3 = colours[cc][2];
  c4 = colours[cc][3];

  strokeWeight(1);
  newLayer.strokeWeight(1);


  colWidth = width/colQty;

  var from = color(255, 0, 50);
  var to = color(255, 150, 100);
  for (var i = 0; i < colQty; i++) {

    for (var j = 0; j < height; j++) {
      stroke(lerpColor(from, to, j/height));
      line(i*colWidth, j, (i*colWidth)+colWidth, j);

      colYtrack[i] = height/2;
    }
  }
}

function touchMoved() {

  var sel = floor(mouseX/(colWidth));
  drawActive = true;
  
  if (drawActive) {
    
    colYtrack[sel] = mouseY;
    blendMode(BLEND);
    
    var from = color(255, 0, 50);
    var to = color(255, 150, 100);

    for (var j = 0; j < height; j++) {
      stroke(lerpColor(from, to, j/height));
      line(sel*colWidth, j, (sel*colWidth)+colWidth/2+1, j);
    }

    blendMode(BLEND);

    from = color(50, 0, 250);
    to = color(100, 150, 255);

    for (var j = 0; j < mouseY; j++) {
      newLayer.stroke(lerpColor(from, to, j/mouseY));
      newLayer.line(sel*colWidth, j, (sel*colWidth)+colWidth/2+1, j);
    }

    from = color(255, 0, 50);
    to = color(255, 150, 100);

    for (var j = mouseY; j < height; j++) {
      newLayer.stroke(lerpColor(from, to, j/(height-mouseY)));
      newLayer.line(sel*colWidth, j, (sel*colWidth)+colWidth/2+1, j);
    }

    image(newLayer, 0, 0, width, height);
  }
}

function touchEnded() {
  drawActive = false;
}
