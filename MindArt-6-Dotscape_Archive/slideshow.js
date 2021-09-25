let textStroke = 80;
let textStroke2 = 0;


function showIntro() {
  image(bg, 0, 0, width, height);
  textSize(lmax * 6);
  textAlign(CENTER);
  text("Dotscape", width / 2, height * 0.4);
  textSize(lmax * 4.5);
  text("Touch the screen to begin", width / 2, height * 0.6);
  if (textStroke > 10) {
    fill(textStroke--, textStroke2++);
    setTimeout(showIntro, 50);
  }
}

function exitIntro() {
  writeTextUI();
  nextGrid();

  introState = 0;
}
