var a2, w, h;
var aprev = 0;
var mX, mY;
var counter = 0; 
var r, a;

var cols = ['#BF7EBB','#D9D5F2','#58608C','#011526','#2E9AA6'];
var colSel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  perm = createGraphics(windowWidth, windowHeight);
  background(245);
  stroke(80, 24, 200, 100);
  strokeWeight(25);
  strokeCap(SQUARE);
  perm.strokeCap(SQUARE);

  noFill();
  perm.stroke(80, 24, 200, 100);
  perm.strokeWeight(25);
  perm.noFill();
}

function touchStarted() {
    r = 2*dist(mouseX, mouseY, width/2, height/2);
  a2 = atan2(mouseY-height/2, mouseX - width/2);
  if (a2 < 0) {
    a2 = (2*PI)+a2;
  }
  
  var c = cols[floor(random(0, cols.length))];
  colSel = colorAlpha(c, 0.3);
  

  w = abs(width/2-mouseX)+100;
  h = abs(height/2-mouseY)+100;

  mX = mouseX;
  mY = mouseY;
}

function touchMoved() {

  background(245);
  image(perm, 0, 0, windowWidth, windowHeight);



  a = atan2(mouseY-height/2, mouseX - width/2);
  if (a < 0) {
    a = (2*PI)+a;
  }

  var diff = a - a2;
  var diff2 = a-aprev;
  //strokeWeight(1);
  //text(a, width-200, height-300);
  //text(a2, width-200, height-250);
  



  //text(diff, width-200, height-200);
  //  text(dist(mouseX, mouseY, mX, mY), width-200, height-150);
  
  //strokeWeight(25);

  if (diff2 > 0) {
    counter++
  } else {
    counter--;
  }


 if (dist(mouseX, mouseY, mX, mY) < 100 && abs(counter) > 25) {
    noStroke();
    fill(colSel); 
    ellipse(width/2, height/2, r+40, r+40);
  } else {
    if (counter > 0) {
      arc(width/2, height/2, r, r, a2, a);
    } else {
      arc(width/2, height/2, r, r, a, a2);
    }
  }
  


  aprev = a;
}

function touchEnded() {

  if (dist(mouseX, mouseY, mX, mY) < 100 && abs(counter) > 25) {
    perm.noStroke();
    perm.fill(colSel); 
    perm.ellipse(width/2, height/2, r+40, r+40);
  } else {
    if (counter > 0) {
      perm.arc(width/2, height/2, r, r, a2, a);
    } else {
      perm.arc(width/2, height/2, r, r, a, a2);
    }
  }


      counter = 0; // reset to nuetral;
    perm.noFill();
        perm.stroke(colSel);
          noFill();
  stroke(colSel);

  }
  
  function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}
