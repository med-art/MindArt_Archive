  // images
  let bg;
  let brush = [];
  // brush mechanics
  let angle1, segLength;
  let scalar = 30;
  let tempwinMouseX = 0;
  let tempwinMouseY = 0;
  let tempX = 100;
  let tempY = 100;
  let dx, dy;
  // VARIABLES FOR TIME DELAY ON BRUSH
  let milliCounter;
  let milliTrack = 0;
  //BRUSH CHARACTERISTICS
  let milliComp = 5;
  let scatterAmount = 2;
  // COLOUR VARAIABLES
  let colHue;
  const colHueMin = 0;
  const colHueMax = 360;
  let colSat;
  const colSatMin = 0;
  const colSatMax = 255;
  let colBri;
  const colBriMin = 0;
  const colBriMax = 255;
  let colOpacity = 0.4;
  let colourBool = 0;
  let introLayer;
  let cloudHSB = [
    [180, 47, 25],
    [178, 23, 55],
    [170, 15, 75],
    [164, 12, 95],
    [176, 45, 19]
  ];
  let sunsetHSB = [
    [11, 53, 96],
    [13, 83, 91],
    [2, 90, 100],
    [334, 81, 91],
    [300, 67, 99]
  ];
  const hueDrift = 3;
  const satDrift = 3;
  const rotateDrift = 0.2;
  let bool = 1;
  let brushTemp = 0;
  let buttonText1state = 0;
  let buttonText2state = 0;
  let wmax, hmax, vMax;
  let audio;
  let startState = 0;
  let alphaErase;
  let eraseState = 0;
  let saveState = 1;
  let buttonTEST;
  let autoX = 0,
    autoY = 0,
    pautoX = 0,
    pautoY = 0; // automated drawing mouse states
  let textLayer, paintLayer, traceLayer;

  function preload() {
    bg = loadImage('assets/paper.jpg'); // background paper
    for (let i = 1; i < 21; i++) {
      brush[i] = loadImage('assets/br-' + i + '.png') // brush loader
    }
    audio = loadSound('assets/audio.mp3');
    click = loadSound('assets/click.mp3');
  }

  function setup() {
    createCanvas(windowWidth, windowHeight);
    textLayer = createGraphics(width, height);
    paintLayer = createGraphics(width, height);
    traceLayer = createGraphics(width, height);
    calcDimensions();
    pixelDensity(1); // Ignores retina displays
    imageMode(CENTER); // centers loaded brushes
    blendMode(BLEND); // consider overlay and multiply
    traceLayer.blendMode(LIGHTEST); // consider overlay and multiply
    colorMode(HSB, 360, 100, 100, 1);
    paintLayer.colorMode(HSB, 360, 100, 100, 1);
    traceLayer.colorMode(HSB, 360, 100, 100, 1);
    colHue = random(colHueMin, colHueMax);
    colSat = random(colSatMin, colSatMax);
    backdrop();
    segLength = windowWidth / 40; // length of delay between touch and paint or line // 15 is a good value
    strokeWeight(4); // for line work
    stroke(255, 0, 255); // for line work
    setProperties(0, 0);
    autoSetProperties();
    introLayer = createGraphics(width, height);
    introLayer.blendMode(BLEND);
    textLayer = createGraphics(windowWidth, windowHeight);
    slide = 0;
    slideShow();
  }

  function backdrop() {
    noTint();
    image(bg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight); // display backgrond
  }

  function touchStarted() {
    if (introState === 3) {
      setProperties(winMouseX, winMouseY);
    } else {
      // do something related to slideshow
    }
  }

  function setProperties(_x, _y) {
    tempwinMouseX = ((windowWidth / 2) - _x); // record position on downpress
    tempwinMouseY = ((windowHeight / 2) - _y); // record position on downpress
    brushTemp = int(random(1, 20));
    if (bool) {
      //image(bg, windowWidth / 2, windowHeight / 2, windowWidth, windowHeight);
      let swatchTemp = int(random(0, 5));
      if (colourBool) {
        colHue = cloudHSB[swatchTemp][0];
        colSat = cloudHSB[swatchTemp][1];
        colBri = cloudHSB[swatchTemp][2];
      } else {
        colHue = sunsetHSB[swatchTemp][0];
        colSat = sunsetHSB[swatchTemp][1];
        colBri = sunsetHSB[swatchTemp][2];
      }
    }
  }

  function draw() {
    if (introState === 3) {
      backdrop();
      blendMode(DARKEST);
      image(paintLayer, width / 2, height / 2);
      blendMode(LIGHTEST);
      image(traceLayer, width / 2, height / 2);
      blendMode(BLEND);
      image(textLayer, width / 2, height / 2);
    } else {
      blendMode(BLEND);
      background(352, 68, 89, 100);
      if (slide > 0) {
        autoDraw();
      }
      if (slide === 0) {
        //textLayer.text(introText[slide], width / 2, (height / 8) * (slide + 2));
      } else {
        textLayer.text(introText[slide - 1], width / 2, (height / 6) * (slide));
      } // this if else statgement needs to be replaced with a better system. The current state tracking is not working
      imageMode(CORNER)
      image(paintLayer, 0, 0, width, height);
      image(textLayer, 0, 0, width, height);
    }
  }

  function autoSetProperties() {
    setProperties();
    setTimeout(autoSetProperties, 5000);
  }

  function touchMoved() {
    if (introState === 3) {
      if (eraseState === 0) {
        makeDrawing(winMouseX, winMouseY, pwinMouseX, pwinMouseY);
      } else {
        eraseDrawing();
      }
    } else {
      paintLayer.fill(352, 68, 89, 0.1);
      paintLayer.noStroke();
      paintLayer.circle(winMouseX, winMouseY, vMax * 10, vMax * 10);
    }
    return false;
  }

  function autoDraw() {
    pautoX = autoX;
    pautoY = autoY;
    autoX = autoX + (random(-50, 55));
    autoY = autoY + (random(-20, 22));
    makeDrawing(autoX % width, autoY % height, pautoX % width, pautoY % height);
  }

  function makeDrawing(_x, _y, pX, pY) {
    milliCounter = millis();
    if (bool) {
      if (milliCounter > milliTrack + milliComp) {
        if (colSat < 10) {
          colSat += 30
        }
        dx = _x - tempX;
        dy = _y - tempY;
        angle1 = atan2(dy, dx) + (random(-rotateDrift, rotateDrift)); // https://p5js.org/reference/#/p5/atan2
        tempX = _x - (cos(angle1) * segLength / 2); // https://p5js.org/examples/interaction-follow-1.html
        tempY = _y - (sin(angle1) * segLength / 2);
        scalar = constrain(70 * (random(3, abs(_x - pX)) / windowWidth), 0.2, 1.2);
        segment(tempX, tempY, angle1, brush[brushTemp], scalar)
        milliTrack = milliCounter;
      }
    } else {
      for (let i = 0; i < 5; i++) {
        traceLayer.strokeWeight(constrain(abs((_y + _x) - (pX + pY)), .8, 3.5)); // for line work
        traceLayer.stroke(255, 0, 255, 0.4); // for line work
        traceLayer.line(_x + random(-3, 3), _y + random(-3, 3), pX + random(-3, 3), pY + random(-3, 3));
      }
    }
  }

  function segment(rakeX, rakeY, a, rake, scalar) {
    paintLayer.tint((colHue += random(-hueDrift, hueDrift)), (colSat += random(-satDrift, satDrift)), colBri, colOpacity); // Display at half opacity
    paintLayer.push();
    paintLayer.imageMode(CENTER); // centers loaded brushes
    paintLayer.translate(rakeX + (randomGaussian(-scatterAmount * (0.1 * scalar), scatterAmount * (0.1 * scalar))), rakeY + (randomGaussian(-scatterAmount * (0.1 * scalar), scatterAmount * (0.1 * scalar))));
    paintLayer.scale(scalar);
    paintLayer.rotate(a);
    paintLayer.image(rake, 0, 0, 0, 0);
    paintLayer.imageMode(CORNER); // centers loaded brushes
    paintLayer.pop();
  }

  function reset() {
    paintLayer.clear();
    traceLayer.clear();
    if (!bool) invertTracing();
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    textLayer.resizeCanvas(windowWidth, windowHeight);
    paintLayer.resizeCanvas(windowWidth, windowHeight);
    traceLayer.resizeCanvas(windowWidth, windowHeight);
    calcDimensions();
    if (introState === 3) {
      removeElements();
      writeTextUI();
    }
  }
