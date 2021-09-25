var r, a, aprev;
var centerX;
var centerY;
var rotationTotal = 0;
var aprev;



function setup() {
createCanvas(windowWidth, windowHeight);
background(245);
strokeWeight(1);
stroke(0);
fill(0);
centerX = width/2;
centerY = height/2;
}

function touchStarted() {
  r = dist(mouseX, mouseY, centerX, centerY); 
}

function touchMoved() {
 background(240);
 

 a = atan2(mouseY-centerY, mouseX - centerX);
  if (!aprev){ // if aprev is undefined
  aprev = a;
 }
 
  var x = r * cos(a);
  var y = r * sin(a);
  ellipse(centerX+x, centerY+y, 10, 10);
  line(centerX+x, centerY+y, centerX, centerY);
    
  mX = mouseX;
  mY = mouseY;
  
  var c = aprev - a;
  console.log("cp: " + c);
    if (abs(c) > PI){
    c = a - aprev - (2*PI);
  }
  aprev = a;
    rotationTotal = rotationTotal + c;
  
console.log("rot: " + rotationTotal);
console.log("c: " + c);
}
