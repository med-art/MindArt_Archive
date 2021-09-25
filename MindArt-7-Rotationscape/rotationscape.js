let leaf = [];
let leafStroke = [];
let leafFill = [];
let leafLayer;
let hueDrift, brightDrift, satDrift;
let alphatest;
let longEdge, shortEdge, circleRad, vMax, vMin, wmax, hmax;
let rot = 0;
let rotStart = 0;
let rotEnd = 0;
let drawState = 1;
let getCol = "#EF3340";
let leafSelector = 0;
let _r, _b, _g, _a;
let click;
let introLayer, introLayer2;
let sliderImg, sliderIcon, sliderIcon2;
let sliderPressed = 0;
let rotIntro = 0;
let rotScale;
let introActive = 0;
let introColour = 0;
let prevX, prevY; // used in intro (layer2)
let rotateFrom = 0;
let storedPosition = 0;

function preload() {
  bg = loadImage('assets/paper.jpg');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3')
  for (i = 0; i < 6; i++) {
    leaf[i] = loadImage('assets/l' + [i] + '_shadow.png');
    leafStroke[i] = loadImage('assets/l' + [i] + '_stroke.png');
    leafFill[i] = loadImage('assets/l' + [i] + '_fill.png');
  }
  alphatest = loadImage('assets/alpha.png');
  sliderIcon = loadImage('assets/slider.png');
  sliderIcon2 = loadImage('assets/slider2.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  pixelDensity(1); // Ignores retina displays
  // Create all layers for this sketch, and set their colourModes.
  // to Store main leaves
  leafLayer = createGraphics(width, height);
  leafLayer.colorMode(HSB, 360, 100, 100, 100);
  strokeLayer = createGraphics(width, height);
  permaLayer = createGraphics(width, height);
  permaLayer.background(127);
  //Visible draw Layer
  drawLayer = createGraphics(width, height);
  drawLayer.colorMode(RGB, 255, 255, 255, 100);
  drawLayer.stroke(0, 0, 0, 0);
  drawLayer.fill(0, 0, 0, 0);
  // Hidden layer, used to create a wider line to read Pixel values from
  hiddenLayer = createGraphics(width, height);
  hiddenLayer.colorMode(RGB, 255, 255, 255, 100);
  hiddenLayer.stroke(0, 0, 0, 0);
  hiddenLayer.fill(0, 0, 0, 0);
  textLayer = createGraphics(width, height);
  introLayer = createGraphics(width, height);
  introLayer.noStroke();
  introLayer.fill(255, 100);
  introLayer2 = createGraphics(width, height);
  introLayer2.noStroke();
  leafChoice = createGraphics(width, height);
  sliderImg = createGraphics(width, height);
  scalarImg = createGraphics(width, height);
  polarUIimg = createGraphics(width,height);
  dimensionCalc();
  slideShow();
}

function dimensionCalc() {
  wmax = width / 100;
  hmax = height / 100;
  if (width > height) {
    longEdge = width;
    shortEdge = height;
    circleRad = shortEdge * 0.45;
    vMax = width / 100;
    vMin = height / 100;
  } else {
    longEdge = height;
    shortEdge = width;
    vMax = height / 100;
    vMin = width / 100;
    circleRad = shortEdge * 0.45;
  }
  rotScale = 0;
}

function mouseReleased() {
  drawLayer.stroke(0, 0, 0, 0);
  drawLayer.fill(0, 0, 0, 0);
  hiddenLayer.stroke(0, 0, 0, 0);
  hiddenLayer.fill(0, 0, 0, 0);
  sliderTouch = 0;
  clockTouch = 0;
  introColour = int(random(0, colArray.length));
  if (introState < 3) {
    introActive = 0;
  }
}

function touchStarted() {

  if (mouseX < 12 * hmax && mouseY > (4 * hmax) && mouseY < height - (4 * hmax)) {
    sliderTouch = 1;

  }


  if (dist(mouseX, mouseY, width/2, height/2) >  vMin*45) {

    clockTouch = 1;

        push();
        translate(width / 2, height / 2);
        rotateFrom = atan2(mouseY - height / 2, mouseX - width / 2);
        storedPosition = rot;

        pop();
  }

  if (introState < 3) {
    if (audio.isPlaying()) {} else {
      //audio.loop(5);

    }
    introActive = 1;

  }
  if (slide === 0) {
    click.play();
    startButton.remove();
    slide++;
    slideShow();
  }





}

function touchMoved() {
  if (introState === 3) {
    if (drawState === 0) {
  //    rotateLeaf(mouseX, mouseY);
    } else if (drawState === 1) {
      makeDrawing(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
    }

    if (clockTouch === 1){
      rotateLeaf(mouseX, mouseY);
    }

    if (sliderTouch === 1) {
      if (mouseX > (4 * hmax) && mouseX < (12 * hmax) && mouseY > (4 * hmax) && mouseY < height / 2 - (4 * hmax)) {
        makeSlider(mouseY);
        rotateLeaf(mouseX, mouseY);
      }
      if (mouseX > (4 * hmax) && mouseX < (13 * hmax) && mouseY > (height / 2) + (4 * hmax) && mouseY < height - (4 * hmax)) {
        makeScaler(mouseY);
        scalar = (mouseY / (height / 3)) - 1;
        leafLayer.push();
        leafLayer.clear();
        leafLayer.imageMode(CENTER);
        leafLayer.translate(width / 2, height / 2);
        leafLayer.rotate(rot);
        leafLayer.translate(0, -height / 6);
        leafLayer.image(leaf[leafSelector], 0, 0, (shortEdge / 0.5) * scalar, (shortEdge / .5) * scalar);
        leafLayer.pop();
        strokeLayer.push();
        strokeLayer.clear();
        strokeLayer.imageMode(CENTER);
        strokeLayer.translate(width / 2, height / 2);
        strokeLayer.rotate(rot);
        strokeLayer.translate(0, -height / 6);
        strokeLayer.image(leafFill[leafSelector], 0, 0, (shortEdge / .5) * scalar, (shortEdge / .5) * scalar);
        strokeLayer.pop();
          }
    }
  }
  return false;
}

function rotateLeaf(_x, _y) {

  push();
  translate(width / 2, height / 2);
  let rotateTo = atan2(mouseY - height / 2, mouseX - width / 2);
  pop();

  rot = (rotateTo-rotateFrom)+storedPosition;
    console.log("rotateTo"+rotateTo);


scalar = (abs(rot)/20) + 1;

  drawLeaves();
}

function drawLeaves() {
  leafLayer.push();
  leafLayer.clear();
  leafLayer.imageMode(CENTER);
  leafLayer.translate(width / 2, height / 2);
  leafLayer.rotate(rot);
  leafLayer.translate(0, -height / 6);
  leafLayer.image(leaf[leafSelector], 0, 0, (shortEdge / 0.5) * scalar, (shortEdge / .5) * scalar);
  leafLayer.pop();
  strokeLayer.push();
  strokeLayer.clear();
  strokeLayer.imageMode(CENTER);
  strokeLayer.translate(width / 2, height / 2);
  strokeLayer.rotate(rot);
  strokeLayer.translate(0, -height / 6);
  strokeLayer.image(leafFill[leafSelector], 0, 0, (shortEdge / .5) * scalar, (shortEdge / .5) * scalar);
  strokeLayer.pop();
}

function makeDrawing(_x, _y, pX, pY) {
  if (sliderTouch === 0) {
    drawLayer.blendMode(BLEND);
    drawLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), 40, 60)); // for line work
    drawLayer.stroke(colorChange(colArray[brushSelected], 0.2));
    for (let i = 0; i < 3; i++) {
      let driftX = random(-30, 30);
      let driftY = random(-30, 30);
      drawLayer.line(_x + driftX, _y + driftY, pX + driftX, pY + driftY);
    }
    drawLayer.blendMode(REMOVE)
    drawLayer.image(strokeLayer, 0, 0, width, height);
    permaLayer.image(drawLayer, 0, 0, width, height);
  }
}

function colorChange(aColor, alpha) {
  var c = color(aColor);
  let rand = random(0.5, 1.5);
  return color('rgba(' + [int(red(c) * rand), green(c), blue(c), alpha].join(',') + ')');
}


function draw() {
  if (introState === 3) {
    if (interrupt) {
      image(bg, 0, 0, width, height);
      image(leafChoice, 0, 0, width, height);
    } else {
      image(bg, 0, 0, width, height);
      image(leafLayer, 0, 0, width, height);
      blendMode(HARD_LIGHT);
      image(permaLayer, 0, 0, width, height);
      blendMode(BLEND);
      image(sliderImg, 0, 0, width, height);
      image(scalarImg, 0, 0, width, height);
      image(polarUIimg, 0, 0, width, height);
    }
  } else {
    blendMode(BLEND);
    background(color("#ef6500"));
    if (slide > 0) {
      stroke(150);
      strokeWeight(7);
      if (introActive) {
        let randX = randomGaussian(-40, 40);
        let randY = randomGaussian(-10, 10);
        introLayer2.push();
        introLayer2.imageMode(CENTER);
        introLayer2.translate(width / 2, height / 2);
        introLayer2.rotate(rotIntro / 120);
        introLayer2.translate(randX, (rotScale / 5) + 100);
        for (let i = 0; i < 100; i++) {
          introLayer2.fill(colorChange(colArray[introColour], .02));
          introLayer2.ellipse(0, randY, 35, 90);
        }
        introLayer2.pop();
      }
      rotIntro--;
      introLayer.push();
      introLayer.clear();
      introLayer.imageMode(CENTER);
      introLayer.translate(width / 2, height / 2);
      introLayer.rotate(rotIntro / 120);
      introLayer.translate(0, (rotScale++/5)+100);
          introLayer.ellipse(0, 0, 40, 100); introLayer.pop(); image(introLayer2, 0, 0, width, height); image(introLayer, 0, 0, width, height);
        }
        if (slide === 0) {} else {
          textLayer.text(introText[slide - 1], width / 2, (height / 6) * (slide));
        } // this if else statgement needs to be replaced with a better system. The current state tracking is not working
        image(textLayer, 0, 0, width, height);
      }
    }

    function windowResized() {
      resizeCanvas(windowWidth, windowHeight);
      dimensionCalc();
      textLayer.resizeCanvas(windowWidth, windowHeight);
      uiLayer = createGraphics(width, height);
      lineLayer = createGraphics(width, height);
      introLayer.resizeCanvas(width, height);
      sliderImg.resizeCanvas(width, height);
      scalarImg.resizeCanvas(width, height);

      introLayer2.resizeCanvas(width,height);

      if (introState === 3) {


        image(bg, 0, 0, width, height);


        leafLayer.resizeCanvas(width, height);
        strokeLayer.resizeCanvas(width,height);
        drawLayer.resizeCanvas(width, height);


        blendMode(HARD_LIGHT);
        let permaLayer2 = createGraphics(width,height);
        permaLayer2.image(permaLayer,0,0,width,height);
        permaLayer.resizeCanvas(width,height);
        permaLayer = permaLayer2;
        permaLayer2.remove();





        blendMode(BLEND);
    ;

        removeElements();
        writeTextUI();
        rotateLeaf(mouseX, mouseY);
        makeSlider(mouseY);
        makeScaler(mouseY);
      }
    }
