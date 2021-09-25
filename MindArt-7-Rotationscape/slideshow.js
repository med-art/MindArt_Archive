let introText = ["Touchez", "Regardez", "Ecoutez", "Touchez"];
let slide = 0;
let delayTime = 1000;
let introState = 0;
let startButton;
let sliderTouch = 0;




function slideShow() {
  if (slide === 0) {

    startButton = createButton(introText[0]);
    startButton.class("startButton");
    startButton.position((width / 2) - (12 * vMax), (height / 2) - (4 * vMax));
  }
  if (slide === introText.length) {
    textLayer.clear();
    introState = 3;

    //windowResized();
    writeTextUI();
    rotateLeaf(width/1.5,height);
      makeSlider(height/4);
      makeScaler(height-height/4);


    counter = 0;
  } else if (slide < introText.length && slide > 0) {
    textLayer.clear();
    textLayer.fill(255, 5);
    textLayer.textSize(vMax * 8);
    textLayer.textAlign(CENTER, CENTER);
    textLayer.rectMode(CENTER);
    if (slide > 0) {
      if (slide === introText.length - 1) {
        delayTime = 1000;
      }
      slide++;

      setTimeout(slideShow, delayTime);
    }
  }
}
