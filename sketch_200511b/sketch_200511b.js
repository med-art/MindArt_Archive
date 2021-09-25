var colQty = 100;
var colWidth;
var colYtrack = [];
var drawActive = false;

function setup() {

  createCanvas(windowWidth, windowHeight);
  newLayer = createGraphics(windowWidth, windowHeight);
  newLayer.blendMode(BLEND);

  strokeWeight(10);
  newLayer.strokeWeight(10);
  //background(255,0,0)

  colWidth = width/colQty;
  //fill(255,200,0);





  var from = color(255, 0, 50);
  var to = color(255, 150, 100);
  for (var i = 0; i < colQty; i++) {

    for (var j = 0; j < height; j++) {
      stroke(lerpColor(from, to, j/height));
      line(i*colWidth, j, (i*colWidth)+colWidth, j);

      colYtrack[i] = height/2;
    }
  }
}

function touchMoved() {

  var sel = floor(mouseX/(colWidth));

  //for (var i = 0; i < colQty; i++ && !drawActive) {
  //  if (abs(colYtrack[i]-mouseY) < 5) {
  //    drawActive = true;
  //  }
  //}
  
  drawActive = true;

  if (drawActive) {

    colYtrack[sel] = mouseY;
    
    
    blendMode(BLEND);
    
    
    var from = color(255,0,50);
    var to = color(255,150,100);
        
        for (var j = 0; j < height; j++) {
      stroke(lerpColor(from, to, j/height));
      line(sel*colWidth, j, (sel*colWidth)+colWidth, j);
    }
    
    blendMode(BLEND);
    
       from = color(50,0,250);
       to = color(100,150,255);
    
     for (var j = 0; j < mouseY; j++){
       newLayer.stroke(lerpColor(from, to, j/mouseY));
       newLayer.line(sel*colWidth, j, (sel*colWidth)+colWidth, j);
      }
      
         from = color(255,0,50);
    to = color(255,150,100);
      
        for (var j = mouseY; j < height; j++){
       newLayer.stroke(lerpColor(from, to, j/(height-mouseY)));
       newLayer.line(sel*colWidth, j, (sel*colWidth)+colWidth, j);
      }
    
    image(newLayer, 0, 0, width, height);

  }
}

function touchEnded() {
  drawActive = false;
}
