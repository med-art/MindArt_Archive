var bool;
var colBool;
var x = 0;
var y = 0;

var ydiff;
var xdiff;

var button;
var slider;
var restart;

var qty;


function setup() {
  createCanvas(windowWidth, windowHeight);
  lay = createGraphics(windowWidth, windowHeight);

  strokeWeight(qty);
  stroke(255);
  lay.strokeWeight(qty);
  lay.stroke(255);
  strokeCap(SQUARE);
  lay.strokeCap(SQUARE);

  background(30)

    button = createButton('invert');
  button.position(10, 10);
  button.mousePressed(changeCol);

  slider = createSlider(1, 150, 10, 1);
  slider.position(10, 50);
  
      restart = createButton('restart');
  restart.position(10, 90);
  restart.mousePressed(rest);
}

function draw() {
    qty = slider.value();
}

function mousePressed() {

  x = mouseX;
  y = mouseY;
}

function mouseDragged() {

  background(30)



    image(lay, 0, 0, width, height);

  if (bool) {

    ydiff = (y-mouseY) / qty;
    var sw = abs(ydiff/2);
    strokeWeight(sw);
    lay.strokeWeight(sw);
    for (var i = 0; i < qty; i++) {    
      line(x, y-(ydiff*i), mouseX, y-(ydiff*i));
    }
  } else {

    xdiff = (x-mouseX) / qty;
    var sw = abs(xdiff/2);
    strokeWeight(sw);
    lay.strokeWeight(sw);
    for (var i = 0; i < qty; i++) {    
      line(x-(xdiff*i), y, x-(xdiff*i), mouseY);
    }
  }
}

function mouseReleased() {

  if (bool) {

    ydiff = (y-mouseY) / qty;
    for (var i = 0; i < qty; i++) {    
      lay.line(x, y-(ydiff*i), mouseX, y-(ydiff*i));
    }
  } else {

    xdiff = (x-mouseX) / qty;
    for (var i = 0; i < qty; i++) {    
      lay.line(x-(xdiff*i), y, x-(xdiff*i), mouseY);
    }
  }


  bool = !bool;
}



function changeCol() {
  colBool = !colBool;
  if (!colBool) {
    stroke(255);
    lay.stroke(255);
  } else {
    stroke(30);
    lay.stroke(30);
  }
}

function rest(){
 lay.clear(); 
 clear();
 background(30);
}
