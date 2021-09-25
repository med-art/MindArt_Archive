let introText = ["Touchez", "Regardez", "Ecoutez", "Touchez"];
let appCol = "#7cce6c";
let slide = 4;
let delayTime = 500;
let introState = 0;
let startButton;
function mousePressed() {
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
  return false;
}

function slideShow() {
  if (slide === 0) {

    startButton = createButton(introText[0]);
    startButton.class("startButton");
    startButton.position((width / 2) - (12 * vMax), (height / 2) - (4 * vMax));
  }
  if (slide === introText.length) {
    textLayer.clear();
    introState = 3;
    windowResized();
    makeSwatch();
    newGrid();
    //restart();
    counter = 0;
  } else if (slide < introText.length && slide > 0) {
    textLayer.clear();
    textLayer.fill(255, 5);
    textLayer.textSize(vMax * 8);
    textLayer.textAlign(CENTER, CENTER);
    textLayer.rectMode(CENTER);
    if (slide > 0) {
      if (slide === introText.length - 1) {
        delayTime = 500;
      }
      slide++;

      setTimeout(slideShow, delayTime);
    }
  }
}
