var a2, w, h;

function setup() {
createCanvas(1000, 1000);
background(120);
stroke(255);
strokeWeight(1);
noFill();
}

function touchStarted() {
   a2 = atan2(mouseY-height/2, mouseX - width/2);
   w = abs(width/2-mouseX)+100;
  h = abs(height/2-mouseY)+100;
}

function touchMoved() {
  
  background(120);
  

  var r = w+h;
  
  var a = atan2(mouseY-height/2, mouseX - width/2);
 
  
  var diff = abs(a) - abs(a2);
  strokeWeight(1);
    text(a, width-200, height-300);
      text(a2, width-200, height-250);
  text(diff, width-200, height-200);
  strokeWeight(10);
  if (a - a2 > 0){
  arc(width/2, height/2, r, r, a2, a);
  } else {
      arc(width/2, height/2, r, r, a, a2);
  }
  console.log(a - a2);
}
