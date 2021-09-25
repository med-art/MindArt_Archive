let introText = {english: ["Touch", "Look", "Listen", "Touch"], french: ["Touchez", "Regardez", "Ecoutez", "Touchez"]}
let language = "english";
let appCol = "#f1b300"; // 241, 181, 0
let slide = 4;
let delayTime = 1000;
let appActive = false;

function slideShow() {
  if (slide === 0) {
    background(appCol);
    startButton = createButton(introText[language][0]);
    startButton.class("startButton");
    startButton.position((width / 2) - (12 * vMax), (height / 2) - (4 * vMax));
  } else if (slide < introText[language].length && slide > 0) {
    textLayer.clear();
    textLayer.fill(255, 5);
    textLayer.textSize(vMax * 8);
    textLayer.textAlign(CENTER, CENTER);
    textLayer.rectMode(CENTER);
      slide++;
      console.log("c");
      setTimeout(slideShow, delayTime);
  } else if (slide === introText[language].length) {
    initApp();
  }
}

function initApp() {
  textLayer.remove();
  appActive = true;

  makeSwatch();
    makeUI();
  introLayer.clear();
  background(255);
  for (let i = 0; i < 3; i++){
  bgLayers[i].stroke(swatchCol[i]);
}
}

function mousePressed() {
  if (!appActive) {
    if (!audio.isPlaying()){
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
