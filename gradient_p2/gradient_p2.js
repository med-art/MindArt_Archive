var colQty = 1;
var colWidth;
var colYtrack = [];
var drawActive = false;

var div = 1;

var c1, c2, c3, c4;

var restart;

var colours = [
['#363ED9', '#04B2D9', '#05DBF2', '#0CF2DB'],
['#F20C1F', '#0D0A07', '#D9D0C7', '#BF1515'],
['#2B402B', '#D9AE79', '#BF2604', '#A68080'],
['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
['#7E6167', '#B4356B', '#06CF90', '#17EEB2']
];

var currentColSet = 0;

function preload() {
   paper = loadImage('data/paper1.jpg');

}

function setup() {


  createCanvas(windowWidth, windowHeight);

  slider1 = createSlider(1, 100, 10);
  slider2 = createSlider(10, 30, 15);
  slider3 = createSlider(0, 100, 50);
  slider1.position(10,10);
  slider2.position(10,30);
  slider3.position(10,50);
  slider1.style('width', '300px');
    slider2.style('width', '300px');
      slider3.style('width', '300px');

  colQty = floor(random(1,10));
  newLayer = createGraphics(windowWidth, windowHeight);
  intermedia = createGraphics(windowWidth, windowHeight);
  //newLayer.blendMode(BLEND);

  var cc = floor(random(0, colours.length));

  c1 = colours[cc][0];
  c2 = colours[cc][1];
  c3 = colours[cc][2];
  c4 = colours[cc][3];

  strokeWeight(1);
  newLayer.strokeWeight(1);

  // make solid gradient, add smaller gradients

    from = color(c1);
    to = color(c2);

    for (var j = 0; j < height; j++) {
      intermedia.stroke(lerpColor(from, to, j/height));
      intermedia.line(0, j, width, j);
    }

}

function touchMoved() {

  colQty = slider1.value();
  div = slider2.value()/10;

  colWidth = width/colQty;



  var sel = floor(mouseX/(colWidth));
  drawActive = true;

  if (drawActive) {

    colYtrack[sel] = mouseY;



    from = color(c1);
    to = color(c2);

    for (var j = 0; j < mouseY; j++) {
      newLayer.stroke(lerpColor(from, to, j/mouseY));
      newLayer.line(sel*colWidth, j, (sel*colWidth)+colWidth/div, j);
    }

    from = color(c3);
    to = color(c4);

    for (var j = mouseY; j < height; j++) {
      newLayer.stroke(lerpColor(from, to, j/(height-mouseY)));
      newLayer.line(sel*colWidth, j, (sel*colWidth)+colWidth/div, j);
    }







  }



     intermedia.image(newLayer, 0, 0, width, height);




         blendMode(BLEND);
     image(paper, 0, 0, width, height);
     blendMode(MULTIPLY);
    image(intermedia, 0, 0, width, height);




}

function touchEnded() {
  drawActive = false;
}
