var x = 100,
  y = 100,
  vec = [],
px = [],
py = [],
pA = [];
  angle1 = 0.0,
  dragLength = 80;

 var r = 0;
 
var qtyOfLines = 50;

function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(5);
  strokeCap(SQUARE);
  noFill();
  stroke(20, 100);
  background(255); 
  
    for (i = 0; i < qtyOfLines; i++){
    vec[i] = [];
  }
}

function touchMoved() {
  //background(0);

  dx = mouseX - x;
  dy = mouseY - y;
  
  angle1 = atan2(dy, dx);
  x = (mouseX) - cos(angle1) * dragLength;
  x2 = (100) - cos(PI/2) * 1;
  y = (mouseY) - sin(angle1) * dragLength;
  y2 = (100) - sin(PI/2) * 1;

  makeArray(x, y, x2, y2, angle1);
  
  display();

}


function makeArray(x, y, x2, y2, angle){
 
var a = createVector(x, y);
var b = createVector(0, 100);
b.rotate(angle);
var c = p5.Vector.add(a, b);
a.sub(b);

for (var i = 0; i < qtyOfLines; i++){
d = p5.Vector.lerp(a, c, i/qtyOfLines);
point(d.x, d.y);
vec[i].push(d);
}

}

function display(){
  for (var i = 0; i < vec.length; i++){
      var n = vec[i];
 
  line(n[n.length-1].x, n[n.length-1].y ,n[n.length-2].x ,n[n.length-2].y);
    }
}
