let lineArrayX = [];
let lineArrayY = [];

let drawingIsActive = 1; //// TODO: this sucks..


let tileNum = 2;

let currentLayer = 0;

// introParameters
let ellipseSize;
let arcRadius;
let tempCosX, tempSinY;

// let colArray = ['#2f4fa4', '#d54489', '#fce200', '#fce300', '#007b3d', '#479fdf', '#93338d', '#f16301', '#007b3d', '#fe8f1d', '#fce300'];
let colSelected;

let bgLayers = [];
let bgLayerTemp = [];
let fgLayers = [];
let subLayers = [];

let layLength = 3;

let closeShape = false;

function preload() {
  fgLayer1 = loadImage('assets/s1-1.png');
  fgLayer2 = loadImage('assets/s1-2.png');
  fgLayer3 = loadImage('assets/s1-3.png');

  for (let i = 0; i < 3; i++) {
    fgLayers[i] = loadImage('assets/s1-' + (i + 1) + '.png');
  }


  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
  sliderIcon = loadImage('assets/slider.png')
}



function setup() {
  createCanvas(windowWidth, windowHeight);
  calcDimensions();

  textLayer = createGraphics(width, height);

  for (let i = 0; i < 3; i++) {
    bgLayers[i] = createGraphics(width, height);
    bgLayers[i].background(255);
    bgLayers[i].noStroke();
    bgLayers[i].strokeCap(SQUARE);
    bgLayers[i].noFill();
    bgLayerTemp[i] = createGraphics(width, height);
    bgLayerTemp[i].background(255);
    bgLayerTemp[i].strokeWeight(30);
    bgLayerTemp[i].strokeCap(SQUARE);
    bgLayerTemp[i].noFill();
    subLayers[i] = createGraphics(width, height);
  }

  tempLayer = createGraphics(width, height);
  tempLayer.strokeWeight(30);

  introLayer = createGraphics(width, height);
  introLayer.blendMode(BLEND);
  sliderImg = createGraphics(width, height);
  driftY = height / 3;
  strokeWeight(10);
  ellipseSize = vMax * 20;
  arcRadius = vMin * 35;
  slide = 0;
  makeSlider();
  slideShow();

}

function touchMoved() {
  if (appActive) {
    if (drawingIsActive && eraseBoolean === 0) {

      lineArrayX.push(mouseX);
      lineArrayY.push(mouseY);



      bgLayerTemp[currentLayer].beginShape();
      for (i = 0; i < lineArrayX.length; i++) {
        bgLayerTemp[currentLayer].curveVertex(lineArrayX[i], lineArrayY[i]);
      }
      bgLayerTemp[currentLayer].endShape();

      if (lineArrayX.length > 50 && dist(mouseX, mouseY, lineArrayX[0], lineArrayY[0]) < 50) {
        closeShape = true;

        bgLayers[currentLayer].fill(swatchCol[(stage * 3) + currentLayer])
        lineArrayX.push(lineArrayX[0]);
        lineArrayY.push(lineArrayY[0]);
        bgLayers[currentLayer].beginShape();
        for (i = 0; i < lineArrayX.length; i++) {
          bgLayers[currentLayer].curveVertex(lineArrayX[i], lineArrayY[i]);
        }
        bgLayers[currentLayer].curveVertex(lineArrayX[0], lineArrayY[0]);
        bgLayers[currentLayer].endShape();
      }





    } else if (drawingIsActive && eraseBoolean) {

      bgLayers[currentLayer].line(mouseX, mouseY, pmouseX, pmouseY);

      blendMode(BLEND);
      strokeWeight(60);
      stroke(255, 96);
      line(mouseX, mouseY, pmouseX, pmouseY);

    } else {
      tileNum = constrain(((height / (mouseY + 20))), 1, 10);
      makeSlider(mouseY);
    }
  } else {
    if (slide > 0) {
      if (dist(tempCosX, tempSinY, mouseX, mouseY) < ellipseSize / 2) {
        ellipseSize = ellipseSize * 0.999;
        arcRadius = arcRadius * 0.9995;

      }
    }
  }
  return false;
}

function touchEnded() {
  if (drawingIsActive) {

    // if a line is not drawn, then do this.
    if (lineArrayX.length < 30) {
      bgLayers[currentLayer].strokeWeight(80);
      bgLayers[currentLayer].point(mouseX, mouseY);
      bgLayers[currentLayer].strokeWeight(0);
    }
    bgLayers[currentLayer].noFill();


    if (!closeShape) {
      bgLayers[currentLayer].strokeWeight(40);
      bgLayers[currentLayer].beginShape();
      for (i = 0; i < lineArrayX.length; i++) {
        bgLayers[currentLayer].curveVertex(lineArrayX[i], lineArrayY[i]);
      }
      bgLayers[currentLayer].endShape();
      bgLayers[currentLayer].strokeWeight(0);
    }

    closeShape = false;

    // clear the temp arrays
    bgLayerTemp[currentLayer].background(255);

    lineArrayX = [];
    lineArrayY = [];

  }
  blendMode(DARKEST);
}

function draw() {

console.log(closeShape);

  if (appActive) {



    // temp Layer = what is active during Touch Moved... cleared every frame..
    subLayers[currentLayer].background(255);
    subLayers[currentLayer].blendMode(DARKEST);

    subLayers[currentLayer].image(bgLayers[currentLayer], 0, 0, width, height);
    subLayers[currentLayer].image(bgLayerTemp[currentLayer], 0, 0, width, height);
    subLayers[currentLayer].blendMode(BLEND);
    subLayers[currentLayer].image(fgLayers[currentLayer], 0, 0, width, height);


    blendMode(BLEND);
    background(255);
    blendMode(DARKEST);
    for (layer of subLayers) {
      image(layer, 0, 0, width, height);
    }


    if (!drawingIsActive) {
      blendMode(BLEND);
      for (let i = 0; i < tileNum; i++) {
        for (let j = 0; j < tileNum; j++) {
          image(introLayer, (width / tileNum) * i, (height / tileNum) * j, width / tileNum, height / tileNum);
        }
      }
      image(sliderImg, 0, 0, width, height);

    }
  } else {
    blendMode(BLEND);
    background(241, 181, 0);
    if (slide > 0) {
      tempCosX = (arcRadius * cos(radians(driftY / 3))) + width / 2;
      tempSinY = (arcRadius * sin(radians(driftY / 3))) + height / 2;
      fill('#469ede');
      stroke(255, 255, 255, 50);
      ellipse(width / 2, height / 2, arcRadius * 2, arcRadius * 2);
      stroke('#469ede');
      fill(255, 255, 255, 100);
      ellipse(tempCosX, tempSinY, ellipseSize, ellipseSize);
      driftY += 1.1;
      textLayer.text(introText[language][slide - 1], width / 2, (height / 6) * (slide));
    }
    image(subLayers[0], 0, 0, width, height); // TODO, this is pattern layer.
    image(textLayer, 0, 0, width, height);
  }
}

function windowResized() {

  resizeCanvas(windowWidth, windowHeight);
  calcDimensions();
  textLayer.resizeCanvas(windowWidth, windowHeight);

  let introLayerNew = createGraphics(windowWidth, windowHeight);
  introLayerNew.image(introLayer, 0, 0, windowWidth, windowHeight);
  introLayer.resizeCanvas(windowWidth, windowHeight);
  introLayer = introLayerNew;
  introLayerNew.remove();
  changeBrush(currentLayer);

  removeElements();



  if (appActive) {

    let bgLayerNew = [];
    let subLayerNew = [];

    for (let i = 0; i < 3; i++) {

      bgLayerNew[i] = createGraphics(windowWidth, windowHeight);
      bgLayerNew[i].image(bgLayers[i], 0, 0, windowWidth, windowHeight);
      bgLayers[i].resizeCanvas(windowWidth, windowHeight);
      bgLayers[i] = bgLayerNew[i];
      bgLayerNew[i].remove(); // BUG: why is this necessary??

      subLayerNew[i] = createGraphics(windowWidth, windowHeight);
      subLayerNew[i].image(subLayers[i], 0, 0, windowWidth, windowHeight);
      subLayerNew[i].resizeCanvas(windowWidth, windowHeight);
      subLayers[i] = subLayerNew[i];
      subLayerNew[i].remove();


    }


    sliderImg.resizeCanvas(windowWidth, windowHeight);
    saveNext();


    if (drawingIsActive) {

      makeSwatch();
      blendMode(BLEND);
      background(255);
      blendMode(DARKEST);
      image(subLayers[0], 0, 0, windowWidth, windowHeight);
      image(subLayers[1], 0, 0, windowWidth, windowHeight);
      image(subLayers[2], 0, 0, windowWidth, windowHeight);
      //changeBrush(currentLayer);

    } else if (!drawingIsActive) {
      blendMode(BLEND);
      background(255);
      makeSlider();


    }
  }
}
