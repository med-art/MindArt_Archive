function writeTextUI() {
  textSize(vMax*2);
  fill(0);
  noStroke
  colH1 = color(355, 0, 20);
  nextButton = createButton("New")
  nextButton.class("select");
  nextButton.position(width - (16 * vMax), height - (7 * vMax));
  nextButton.mousePressed(nextDrawing);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);


    fsButton = createImg('assets/enterFS.png');
    fsButton.style('height', '4.5vMax');
    fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
    fsButton.mousePressed(fs);
}

function writeRestartUI() {
  textSize(vMax*2);
  fill(0);
  noStroke();
  nextButton.remove();
  nextButton = createButton("Restart")
  nextButton.class("select");
  nextButton.position(width - (16 * vMax), height - (7 * vMax));
  nextButton.style('background-color', 'indianred');
  nextButton.mousePressed(restart);
}

function restart() {
  stage = 0;
  dimensionCalc();
  writeTextUI();
  nextDrawing();
}

function slideShow() {
  if (slide === 0) {
    startButton = createButton(introText[0]);
    startButton.class("startButton");
    startButton.position((width / 2) - (20 * vMax), (height / 2) - (4 * vMax));
    startButton.mousePressed(startUp);
  }
  if (slide === introText.length) {
    textLayer.clear();
    writeTextUI();
    nextDrawing();
    counter = 0;
    slide = 4;
    introComplete = 1;
  } else if (slide < introText.length && slide > 0) {
    textLayer.clear();
    textLayer.fill(255, 5);
    textLayer.textSize(vMax * 7);
    textLayer.textAlign(CENTER, CENTER);
    textLayer.rectMode(CENTER);
    if (slide === introText.length - 1) {
      delayTime = delayTime + 5000;
    }
    slide++;
    setTimeout(slideShow, delayTime);
  }
}

function introAnimation() {
  blendMode(BLEND);
  background(205, 12, 64, 100);
  if (slide > 0) {
    stroke(150);
    strokeWeight(8);
    // animated circle in the introduction
    rad = rad + expansion;
    if (rad < 50) {
      expansion = 0.1;
    } else if (rad > 70) {
      expansion = -0.1;
    }
    circle(xintro[throughDotCount], yintro[throughDotCount], rad)

    // primary introduction layers
    line(xintro[throughDotCount - 1], yintro[throughDotCount - 1], mouseX, mouseY);
    image(introLayer, 0, 0, width, height);

    // check to see if the initial line demo is complete, if not, run the demo
    if (demoStage === 0 || demoStage === 1) {
      let _d = vMax * 10;
      let _d2 = _d / 2;
      let _x1 = width * 0.3;
      let _x2 = (((finger_xEased) * width) * 0.4) + (width * 0.3);
      let __h = height * 0.5;
      circle(_x2, __h, rad);
      strokeCap(SQUARE);

      // dotted line
      for (i = 0; i < 30; i++) {
        stroke(255);
        let l = lerp(_x1, _x2, i / 30)
        let ln = (_x2 - _x1) / 60; // line length
        if (i != 0 && i % 4 === 0) { // modulo to skip every nth line
          noStroke();
          triangle(l - (ln), __h - (ln), l - (ln), __h + (ln), l + (ln), __h);
        }
      }
      fill(255);
      if (finger_x < 100) {
        finger_x += 0.32;
      } else if (finger_x > 99) {
        demoStage = 1;
      }
      finger_xEased = easing(finger_x, 0, 1, 100)
    }

    // make a demonstation drawing over the guide dots
    if (demoStage === 1 && cycle_count < 2) {
      fill(0, 30, 100);
      stroke(0, 30, 100);
      circle(width * 0.30, height * 0.5, 50, 50);
      if (intro_X > width * 0.30 && intro_X < (width * 0.70) + 25) {
        line(width * 0.30, height * 0.5, intro_X, height * 0.5);
      }
      intro_X += 1.7;

      if (intro_X > (width * 0.70) - 25) {
        circle(width * 0.70, height * 0.5, 50, 50);
        line(width * 0.30, height * 0.5, width * 0.70, height * 0.5);
      }
      if (intro_X >= (width * 0.70) + 100) {
        intro_X = (width * 0.30) - 100;
        cycle_count++;
      }
    }
    fill(255);
  }

  if (slide > 0) {
    textLayer.text(introText[slide - 1], width / 2, (height / 3) * (slide - 1));
  }
  image(textLayer, 0, 0, width, height);

}

function easing(t, b, c, d) {
t /= d / 2;
if (t < 1) return c / 2 * t * t + b;
t--;
return -c / 2 * (t * (t - 2) - 1) + b;
}

function randomIntroColour() {
introHue = primaryArray[int(random(0, 3))];
introLayer.stroke(introHue, 0, 100);
introLayer.fill(introHue, 0, 100);
}

function introSlideshow(mX, mY) {
  let c = color(introHue, 40 + (throughDotCount * 3), 100)
  introLayer.stroke(c);
  introLayer.fill(c);
  let posX = xintro[throughDotCount];
  let posY = yintro[throughDotCount];
  introLayer.ellipse(posX, posY, 50, 50);

  if (dist(mX, mY, posX, posY) < 30) {
      if (demoStage === 2) {
      let _x = constrain(randomGaussian(width / 2, width / 4), 100, width - 100);
      let _y = constrain(randomGaussian(height / 2, height / 4), 100, height - 100);
      xintro.push(_x);
      yintro.push(_y);
    } else {
      let _x = width * 0.7;
      let _y = height * 0.5;
      xintro.push(_x);
      yintro.push(_y);
    }
    if (throughDotCount > 0) {
      demoStage = 2;
    }
    throughDotCount++;

    if (throughDotCount > 1) {
      introLayer.background(appCol);
      introLayer.line(xintro[throughDotCount - 2], yintro[throughDotCount - 2], xintro[throughDotCount - 1], yintro[throughDotCount - 1]);
    }
    randomIntroColour();
  }
}

function makeintroDots() {
  if (demoStage === 2) {
    xintro[0] = int(random(width / 10, width - (width / 10)));
    yintro[0] = int(random(height / 10, height - (height / 10)));
  } else {
    xintro[0] = width * 0.3;
    yintro[0] = height * 0.5;
  }
  randomIntroColour();
  introLayer.ellipse(xintro[0], yintro[0], 50, 50);
}

function saveImg() {
  click.play();
  save('touchscape' + month() + day() + hour() + second() + '.jpg');
}

function fs() {
  if (!fsBool) {
    fullscreen(1);
    fsBool = 1;
  } else {
    fullscreen(0);
    fsBool = 0;
  }
}
