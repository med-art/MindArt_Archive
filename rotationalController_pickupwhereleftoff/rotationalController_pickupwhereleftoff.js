var r, a;
var aStart;
var centerX;
var centerY;
var diff;


function setup() {
createCanvas(windowWidth, windowHeight);
background(245);
strokeWeight(1);
stroke(0);
fill(0);
centerX = width/2;
centerY = height/2;

a = 0;

}

function touchStarted() {
  r = dist(mouseX, mouseY, centerX, centerY); 
  aStart = atan2(mouseY-centerY, mouseX - centerX);
  
}

function touchMoved() {
 background(240);
 var aCurr = atan2(mouseY-centerY, mouseX - centerX);
 diff = aCurr-aStart;
 
 aUpdate = a + diff;
 
  var x = r * cos(aUpdate);
  var y = r * sin(aUpdate);
  ellipse(centerX+x, centerY+y, 10, 10);
  line(centerX+x, centerY+y, centerX, centerY);
    
  mX = mouseX;
  mY = mouseY;
}

function touchEnded(){
  a = aUpdate;
  
}
