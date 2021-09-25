var segLength = 20,
  initialSegments = 100;

// Constrained String Variables;
var numSegments = 2,
  x = [],
  y = [],
  angle = [],
  targetX,
  targetY;
for (var i = 0; i < numSegments; i++) {
  x[i] = 0;
  y[i] = 0;
  angle[i] = 0;
}

// Unconstrained String variables (i.e either loose, or at the end);
var x2 = [],
  y2 = [];
for (var i = 0; i < initialSegments; i++) {
  x2[i] = 0;
  y2[i] = 0;
}

// state tracking
var active = 0; // 0 = no constraints, 1= 1 constraint, 2=2constraints(momentarilty), 3=2constrains(ongoing);
var splitX = 1;

// create two dots on screen. currently the first dot will be constraint one. Dots have to be done in order.
var dots = [];
var numOfDots = 2;
var dotMargin = 100;

var constraints = [];

function setup() {


  createCanvas(windowWidth, windowHeight);
  strokeWeight(20);
  stroke(20);
  noFill();

  // creates coordinates for two dots.
  for (var i = 0; i < numOfDots; i++) {
    var rx = random(dotMargin, width-dotMargin);
    var ry = random(dotMargin, height-dotMargin);
    dots[i] = [rx, ry];
  }

  // this sets the base coorindates of the constrained string
  // at the time of this setup, this string is only 2 seg long, and has not yet been moved;
  x[x.length - 1] = dots[0][0]; // Set base x-coordinate
  y[x.length - 1] = dots[0][1]; // Set base y-coordinate
}

function draw() {
  background(200);

  for (var i = 0; i < numOfDots; i++) {
    ellipse(dots[i][0], dots[i][1], 30, 30);

    // if the dot is near the mouse && is not currently present in the list, then a) add to list
    if (dist(mouseX, mouseY, dots[i][0], dots[i][1]) < 30 && !(constraints.includes(i))){
      constraints.push(i);
    }


  }

    console.log(constraints);

  // // track the states
  // if (dist(mouseX, mouseY, dots[0][0], dots[0][1]) < 30 && (active === 0)) {
  //   active = 1;
  // }
  // if (dist(mouseX, mouseY, dots[1][0], dots[1][1]) < 30 && active === 1) {
  //   active = 2;
  // }

  // UNCONSTRAINED/END
  // if 1 constraint, then constrain a point to the first dot.
  // else use the mouseX, mouseY positioner
  // the run dragSegment to calculate those positions
  if (active >= 1) {
    dragSegment(0, dots[0][0], dots[0][1]);
  } else {
    dragSegment(0, mouseX, mouseY);
  }
  for (var i = 0; i < x2.length - splitX; i++) {
    dragSegment(i + 1, x2[i], y2[i]);
  }

// run the constraint for the constrained (front) peice of the string
  if (active === 1 || active === 3) {
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
    if (active === 1) {
      addone(0);
      setTimeout(addone, 5);
    }
    if (active === 3) {
      addone(1);
      line(dots[0][0], dots[0][1], dots[1][0], dots[1][1]);
    }
  }

  if (active === 2) {
    x = [];
    y = [];
    for (var i = 0; i < 2; i++) {
      x2[i] = 0;
      y2[i] = 0;
    }
    numSegments = 2;
    active = 3;
  }
}

function addone(i) {
  // i is either 0 or 1, for first or second dot, depending on constraints (1 or 2(3));
  if (dist(mouseX, mouseY, dots[i][0], dots[i][1]) >= (segLength*numSegments)) {
    x.push(dots[i][0]);
    y.push(dots[i][1]);
    numSegments++;
    splitX++;
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
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}

function dragSegment(i, xin, yin) {
  var dx = xin - x2[i];
  var dy = yin - y2[i];
  var angle = atan2(dy, dx);
  x2[i] = xin - cos(angle) * segLength;
  y2[i] = yin - sin(angle) * segLength;
  segment2(x2[i], y2[i], angle);
}

function segment2(x, y, a) {
  push();
  translate(x, y);
  rotate(a);
  line(0, 0, segLength, 0);
  pop();
}
