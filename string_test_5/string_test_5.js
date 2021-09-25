var instances = 3000;
var segLength = 300;
var numSegments = 3;
var margin = 500;

var x = [], 
  y = [], 
  angle = [], 
  targetX = [], 
  targetY = [];

for (var i = 0; i < instances; i++) {
  x[i] = [];
  y[i] = [];
  angle[i] = [];

  for (var j = 0; j < numSegments; j++) {
    x[i][j] = 0;
    y[i][j] = 0;
    angle[i][j] = 0;
    
  }
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(1);
  stroke(200, 10);
  strokeCap(SQUARE);

  for (var i = 0; i < x.length; i++){
    
    var rx = random(margin, width-margin);
    var ry = random(margin, height-margin);
    
  x[i][x[i].length - 1] = rx; // Set base x-coordinate
  y[i][y[i].length - 1] = ry; // Set base y-coordinate
    
  }

}

function draw() {
  background(125);

  for (var n = 0; n < x.length; n++){ 

  reachSegment(n, 0, mouseX, mouseY);
  
  for (var i = 1; i < numSegments; i++) {
    reachSegment(n, i, targetX[n], targetY[n]);
  }
  for (var j = x[n].length - 1; j >= 1; j--) {
    positionSegment(j, j - 1, n);
  }
  for (var k = 0; k < x[n].length; k++) {
    segment(x[n][k], y[n][k], angle[n][k], (k + 1) * 2);
  }
}
}

function positionSegment(a, b, n) {
  x[n][b] = x[n][a] + cos(angle[n][a]) * segLength;
  y[n][b] = y[n][a] + sin(angle[n][a]) * segLength;
}

function reachSegment(n, i, xin, yin) {
  var dx = xin - x[n][i];
  var dy = yin - y[n][i];
  angle[n][i] = atan2(dy, dx);
  targetX[n] = xin - cos(angle[n][i]) * segLength;
  targetY[n] = yin - sin(angle[n][i]) * segLength;
}

function segment(x, y, a, sw) {

  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}
