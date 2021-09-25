let button1, button2, button3, button4, resetButton, saveButton, fsButton;
let fsBool = 0;

function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
}

function writeTextUI() {
  col = color(0, 0, 0, 0.1);
  colSelect = color(0, 0, 0, 1);
  colH2 = color(230, 20, 74);
  colH3 = color(355, 87, 74);
  textSize(vMax * 2);
  fill(0);
  noStroke();

  col = color(0, 0, 0, 0.1);
  colSelect = color(0, 0, 0, 1);
  colH2 = color(230, 20, 74);
  colH3 = color(355, 87, 74);
  textSize(vMax*50);
  fill(0);
  noStroke();

  button1 = createImg('assets/icon1-0_eng.png');
  button1.style('width', '13vMax');
  button1.mousePressed(rake1);
  button1.position(0, windowHeight - vMax * 13);

  button2 = createImg('assets/icon2-0.png');
  button2.style('width', '13vMax');
  button2.mousePressed(rake2);
  button2.position(vMax * 11, windowHeight - vMax * 13);

  button3 = createImg('assets/icon3-0.png');
  button3.style('width', '13vMax');
  button3.mousePressed(rake3);
  button3.position(vMax * 22, windowHeight - vMax * 13);

  button4 = createImg('assets/icon4-0.png');
  button4.style('width', '13vMax');
  button4.mousePressed(rake4);
  button4.position(vMax * 33, windowHeight - vMax * 13);

  selector = createImg('assets/selector.png');
  selector.style('width', '13vMax');
  selector.position(vMax * 11, windowHeight - vMax * 13);

  resetButton = createButton('New');
  resetButton.position(windowWidth - (10 * vMax) - (vMax * 5), windowHeight - vMax * 6);
  resetButton.class("select");
  resetButton.position(width - (16 * vMax), height - (7 * vMax));
  resetButton.mousePressed(resetTimeout);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);

  fsButton = createImg('assets/enterFS.png');
  fsButton.style('height', '4.5vMax');
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}
// // this is currently under the main sketch
// function switchSound() {
//   if (audio.isPlaying()) {
//     audio.stop();
//   } else {
//     audio.loop();
//   }
//   return false; // is this needed
// }

function slideShow() {
  if (slide === 0) {
    introLayer.background(appCol);
    startButton = createButton(introText[0]);
    startButton.class("startButton");
    startButton.position((width / 2) - (20 * vMax), (height / 2) - (4 * vMax));
    startButton.mousePressed(startUp);
  }
  if (slide === introText.length) {
    textLayer.clear();
    introComplete = 1;
    sizeWindow();
    writeTextUI();
    rake2();
    reset();
    counter = 0;
  } else if (slide < introText.length && slide > 0) {
    textLayer.clear();
    textLayer.fill(255, 5);
    textLayer.textSize(vMax * 7);
    textLayer.textAlign(CENTER, CENTER);
    textLayer.rectMode(CENTER);
    if (slide > 0) {
      if (slide === introText.length - 1) {
        delayTime = delayTime + 3000;
      }
      slide++;
      setTimeout(slideShow, delayTime);
    }
  }
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

function rake1() {
  change(1,200,1);
  eraseActive = 1;
  selector.position(0, windowHeight - vMax * 13);
  click.play();
}
function rake2() {
  change(5,60,100);
    eraseActive = 0;
  selector.position(vMax * 11, windowHeight - vMax * 13);
  click.play();
}
function rake3() {
  change(15,100,100);
    eraseActive = 0;
  selector.position(vMax * 22, windowHeight - vMax * 13);
  click.play();
}
function rake4() {
  change(60,150,100);
    eraseActive = 0;
  selector.position(vMax * 33, windowHeight - vMax * 13);
  click.play();
}
function saveImg() {
  click.play();
  save('touchscape' + month() + day() + hour() + second() + '.jpg');
}
