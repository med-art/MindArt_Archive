let x = [],
  y = [],
  segNum = 150,
  segLength = 18;
let xintro = [0, 0],
  yintro = [0, 0],
  segLengthintro = 10;
introStrokeWeight = 5;
let introLayer;
let selectedArray = [];
let lineCanv, // lineLayer
  shadow, // shadowLayer
  texture,
  beginning;
let bgCol, stringCol;
let driftVal = 0,
  selected = [0, 0];
drawActive = 1;
let audio;
let constraintActive = false;
let cutSeg = 0;

function preload() {
  texture = loadImage('assets/texture.png');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
}

function setup() {
  stringCol = color('#a1a1a1');
  bgCol = color('#e5e5e5');
  createCanvas(windowWidth, windowHeight);

  lineCanv = createGraphics(windowWidth, windowHeight);
  lineCanv.strokeWeight(30);
  lineCanv.stroke(100);

  introLayer = createGraphics(width, height);
  introLayer.strokeWeight(introStrokeWeight);
  introLayer.stroke(255, 100);

  initialiseLine(0);
  calcDimensions();
  textLayer = createGraphics(windowWidth, windowHeight);
  slide = 0;
  slideShow();
}

function initialiseLine(l) {
  // in  this function, each time a new drawing is started
  x[l] = [];
  y[l] = [];

  for (let i = 0; i < segNum; i++) {
    x[l][i] = random(0, width);
    y[l][i] = (height / segNum) * i;
    // y[l][i] = random(0, height);
  }

  selected = [l, 0];
  dragCalc(selected, width / 2, height / 2);
  displayCurrent();
}

function displayCurrent() {
  beginning = 1;
  touchMoved();
}

function touchEnded() {
  drawActive = 0;
}

function touchStarted() {

  if (introState < 3) {
    if (audio.isPlaying()) {} else {
      audio.loop(5);
    }
  }
  if (slide === 0) {
    click.play();
    startButton.remove();
    slide++;
    slideShow();
  }


  if (!drawActive) {

    // for initial touch state, detect if a position is crossed.
    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x[i].length; j++) {
        if (dist(winMouseX, winMouseY, x[i][j], y[i][j]) < 45) {
          selected[0] = i;
          selected[1] = j;
          drawActive = true;
          break;
        }
      }
    }
    if (!drawActive && x.length < 7 && multiselectable) {
      initialiseLine(x.length); // init new line, new array
    }
  }
  return false;

}

function touchMoved() {
  if (introState === 3) {
    if (multiselectable) {
      if (drawActive) {
        // do we really need these Layers? // or do we need double the calculation of Lines
        if (beginning) {
          dragCalc(selected, width / 2, height / 2);
          beginning = 0;
        } else {
          dragCalc(selected, winMouseX, winMouseY);
        }
      }
    } else {

      // find distance to pin
      let pinDist = dist(mouseX, mouseY, width/1.5, height/1.5)
      if (pinDist < 30){
        constraintActive = true;
      }
      if (constraintActive){
      console.log(pinDist);
        cutSeg = floor(pinDist/segLength);
      console.log(cutSeg);

      }

      // do we really need these Layers? // or do we need double the calculation of Lines
      if (beginning) {
        dragCalc(selected, width / 2, height / 2);
        beginning = 0;
      } else {
        let t = [0, 0]
        if (constraintActive){
          dragCalc(t, width/1.5, height/1.5);

        } else {
        dragCalc(t, winMouseX, winMouseY);
      }
      }
    }
  } else {
    introLayer.background(31, 43, 69, 25);
    dragSegmentIntro(0, mouseX, mouseY);
    dragSegmentIntro(1, xintro[0], yintro[0]);
    segLengthintro = segLengthintro + 0.1;
    introStrokeWeight = introStrokeWeight + 0.04;
    introLayer.strokeWeight(introStrokeWeight);
  }
  return false;
}

function dragSegmentIntro(i, xin, yin) {
  const dx = xin - xintro[i];
  const dy = yin - yintro[i];
  const angle = atan2(dy, dx);
  xintro[i] = xin - cos(angle) * segLengthintro;
  yintro[i] = yin - sin(angle) * segLengthintro;
  segmentIntro(xintro[i], yintro[i], angle);
}

function segmentIntro(x, y, a) {
  introLayer.push();
  introLayer.translate(x, y);
  introLayer.rotate(a);
  introLayer.line(0, 0, segLengthintro, 0);
  introLayer.pop();
}

function dragCalc(_sel, _mouseX, _mouseY) {
  dragSegment(_sel, _mouseX, _mouseY);
  let i2 = _sel[0];
  let j2 = _sel[1];
  for (let j = j2; j < x[i2].length - 1; j++) {
    let t = [i2, j + 1];
    dragSegment(t, x[i2][j], y[i2][j]);
  }
  for (let j = j2; j > 0; j--) {
    let t = [i2, j - 1];
    dragSegment(t, x[i2][j], y[i2][j]);
  }
}

function dragSegment(_sel, xin, yin) {
  i = _sel[0];
  j = _sel[1];
  const dx = xin - x[i][j];
  const dy = yin - y[i][j];
  const angle = (atan2(dy, dx));
  x[i][j] = xin - cos(angle) * segLength;
  y[i][j] = yin - sin(angle) * segLength;
}

function draw() {



  if (introState === 3) {
    // blendMode(BLEND);

    // blendMode(MULTIPLY);
    let colours = ['#025373', '#F2C063', '#F29472', '#04ADBF', '#66CDD9'];
    // let colours = ['#1a1a1a'];
    lineCanv.clear();
    for (let i = 0; i < x.length; i++) {
      //let colour = colors[floor(random(0,colors.length))];
      lineCanv.stroke(colours[i % colours.length]);
      for (let j = 0; j < x[i].length - 1 - cutSeg; j++) {
        lineCanv.line(x[i][j], y[i][j], x[i][j + 1], y[i][j + 1])
      }

      if (constraintActive){
          lineCanv.line(mouseX, mouseY, width/1.5, height/1.5);
      }

      background(0);


      for (let i = 5; i > 0; i--){
      image(lineCanv, 0, i*10, width, height);
      image(texture, 0, 0, width, height);
     }
     image(lineCanv, 0, 0, width, height);
     ellipse(width/2, height/2, 40, 40);





    }








  } else {
    blendMode(BLEND);
    background(31, 43, 69, 100);
    if (slide > 0) {
      blendMode(BLEND);
      fill('#469ede');
      noStroke();
    }
    if (slide === 0) {} else {
      textLayer.text(introText[slide - 1], width / 2, (height / 6) * (slide));
    } // this if else statgement needs to be replaced with a better system. The current state tracking is not working
    image(introLayer, 0, 0, width, height);
    image(textLayer, 0, 0, width, height);
  }





}


function windowResized() {

  resizeCanvas(windowWidth, windowHeight);
  introLayer.resizeCanvas(windowWidth, windowHeight);
  textLayer.resizeCanvas(windowWidth, windowHeight);
  lineCanv.resizeCanvas(windowWidth, windowHeight);
  touchMoved();

  // need to switch the arrays around....

  calcDimensions();
  if (introState === 3) {
    removeElements();
    saveNext();

  }
}
