
// reach

var numSegments = 5,
  x = [],
  y = [],
  angle = [],
  segLength = 4,
  targetX,
  targetY;

for (var i = 0; i < numSegments; i++) {
  x[i] = 0;
  y[i] = 0;
  angle[i] = 0;
}
 
 // drag
var x2 = [],
  y2 = [],
  segNum2 = 30,
  segLength2 = 18;

for (var i = 0; i < segNum2; i++) {
  x2[i] = 0;
  y2[i] = 0;
}

var active = false;
  
  
  


function setup() {
  createCanvas(windowWidth, windowHeight);
  strokeWeight(20);
  stroke(255);

  x[x.length - 1] = width / 2; // Set base x-coordinate
  y[x.length - 1] = height/2; // Set base y-coordinate
}

function touchMoved() {
  background(0);
  
  ellipse(width/2, height/2, 30, 30);
  
  ellipse(mouseX, mouseY, 20, 20);
  
  
  if (dist(mouseX, mouseY, width/2, height/2) < 10){
   active = true; 
  }
  
  if (active){

 
  reachSegment(0, mouseX, mouseY);
  for (var i = 1; i < numSegments; i++) {
    reachSegment(i, targetX, targetY);
  }
  for (var j = x.length - 1; j >= 1; j--) {
    positionSegment(j, j - 1);
  }
  for (var k = 0; k < x.length; k++) {
    segment(x[k], y[k], angle[k], (k + 1) * 2);
  }
    

  setTimeout(addone, 500);
  

  
  
  // drag
  var split = 10;
  
 
  
  // drag
    dragSegment(split, mouseX, mouseY);
  for (var i = split; i < x2.length - 1; i++) {
    dragSegment(i + 1, x2[i], y2[i]);
  }
  }
}

function addone(){
    if(dist(mouseX, mouseY, width/2, height/2) >= (segLength*numSegments)){
    console.log("boom");
    x.push(width/2);
    y.push(height/2);
        numSegments++;
    }

}

function positionSegment(a, b) {
  x[b] = x[a] + cos(angle[a]) * segLength;
  y[b] = y[a] + sin(angle[a]) * segLength;
}

function reachSegment(i, xin, yin) {
  var dx = xin - x[i];
  var dy = yin - y[i];
  angle[i] = atan2(dy, dx);
  targetX = xin - cos(angle[i]) * segLength;
  targetY = yin - sin(angle[i]) * segLength;
}

function segment(x, y, a, sw) {
  strokeWeight(10);
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}


// drag

function dragSegment(i, xin, yin) {
  var dx = xin - x2[i];
  var dy = yin - y2[i];
  var angle = atan2(dy, dx);
  x2[i] = xin - cos(angle) * segLength2;
  y2[i] = yin - sin(angle) * segLength2;
  segment2(x2[i], y2[i], angle);
}
 
 function segment2(x, y, a) {
  //push();
  //translate(x, y);
  //rotate(a);
  //line(0, 0, segLength, 0);
  //pop();
}
  
