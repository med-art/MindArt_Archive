var a2, w, h;
var aprev = 0;
var mX = 0;
var mY = 0;
var tX, tY;
var counter = 0; 
var r, a;
var c;
var toggle = 0;
var button;
var lineQty = 0;

var cols = ['#0D5766', '#6B9C93', '#FFFDDD', '#FFBE2C'];
var colSel;

function setup() {
  createCanvas(windowWidth, windowHeight);
  button = createButton('toggle ArcFill');
  button.position(10,10);
  button.mousePressed(changeArc);
  temp = createGraphics(windowWidth, windowHeight);
  perm = createGraphics(windowWidth, windowHeight);
  background(245);
  stroke(80, 24, 200, 100);
  strokeWeight(25);
  strokeCap(SQUARE);
  temp.strokeCap(SQUARE);
  perm.strokeCap(SQUARE);

  noFill();
  perm.stroke(80, 24, 200, 100);
  perm.strokeWeight(25);
  perm.noFill();
  temp.stroke(80, 24, 200, 100);
  temp.strokeWeight(2);
  temp.noFill();
}

function touchStarted() {
  r = 2*dist(mouseX, mouseY, width/2, height/2);



  c = cols[floor(random(0, cols.length))];
  colSel = colorAlpha(c, 0.1);

  temp.stroke(colSel);

  w = abs(width/2-mouseX)+100;
  h = abs(height/2-mouseY)+100;

  mX = mouseX;
  mY = mouseY;
  tX = mouseX;
  tY = mouseY;
}

function touchMoved() {
  
  if (!toggle){
           temp.stroke(colSel);
    temp.noFill();
    lineQty = 120;
    vertRand = 40;
    angRand = 10;
  }  else {
    lineQty = 10;
    temp.noStroke();
    temp.fill(colSel);
        vertRand = 5;
    angRand = 10;
  }

  background('#CBE8CD');
  image(temp, 0, 0, windowWidth, windowHeight);
  image(perm, 0, 0, windowWidth, windowHeight);


  a = atan2(mouseY-height/2, mouseX - width/2);
  a2 = atan2(mY-height/2, mX - width/2);

  var diff = a2-a;

  if (abs(diff) > 5) {
    diff = a-a2
  }




  for (var i = 0; i < lineQty; i++) {
    var nR = randomGaussian(-angRand, angRand);
    a2 = atan2(nR+mY-height/2, nR+mX - width/2);
    a = atan2(nR+mouseY-height/2, nR+mouseX - width/2);



    var n = random(-vertRand, vertRand);


    if (diff <= 0) {
      temp.arc(width/2, height/2, r+n, r+n, a2, a);
      counter ++;
    } else {
      temp.arc(width/2, height/2, r+n, r+n, a, a2);
      counter--;
    }
  }




  if (dist(mouseX, mouseY, tX, tY) < 100 && abs(counter) > 2000) {
    temp.noStroke();
    temp.fill(colorAlpha(c, 0.05)); 


    
    for (var i = 0; i < 4; i++){
         var rn = random(r*0.88, r);
    temp.ellipse(width/2, height/2,rn,rn);
    
    }
    
    counter = counter / 2;
  
  }
 


    


  mX = mouseX;
  mY = mouseY;
}

function touchEnded() {
  counter = 0;

}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function changeArc(){
toggle = !toggle;
}
