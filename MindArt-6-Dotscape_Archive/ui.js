let button1, button2, button3, button4;
let colH1, colH2, colH3;


function writeTextUI() {
  textSize(longEdge / 50);
  fill(0);
  noStroke();

  button2 = createButton('Next');
  button2.position(windowWidth - (15 * lmax) - (lmax * 3), windowHeight - lmax * 6);
  colH2 = color(130, 0, 20);
  colH3 = color(240, 0, 50);
  colH1 = color(355, 0, 20);
  button2.style('background-color', colH2);
  button2.style('font-size', '2.5vmax');
  button2.style('color', 'white');
  button2.style('border-radius', '2.5vmax')
  button2.style('width', '15vmax')
  button2.mousePressed(nextGrid);
  button4 = createButton('Save');
  button4.position(windowWidth - (15 * lmax) - (lmax * 3), windowHeight - lmax * 11.5);
  button4.style('background-color', colH3);
  button4.style('font-size', '2.5vmax');
  button4.style('color', 'white');
  button4.style('border-radius', '2.5vmax')
  button4.style('width', '15vmax')
  button4.mousePressed(saveImage);
}

function writeRestartUI() {


  textSize(longEdge / 50);
  fill(0);
  noStroke();

  button2.remove();
  button2 = createButton('Restart');
  button2.position(windowWidth - (15 * lmax) - (lmax * 3), windowHeight - lmax * 6);
  colH2 = color(355, 70, 80);
  button2.style('background-color', colH2);
  button2.style('font-size', '2.5vmax');
  button2.style('color', 'white');
  button2.style('border-radius', '2.5vmax')
  button2.style('width', '15vmax')
  button2.mousePressed(restart);
}


function restart() {
  stage = 0;
  introState = 0;
  dimensionCalc();
  writeTextUI();
  nextGrid();

}

function saveImage() {
  save('dotscape' + month() + day() + hour() + second() + '.jpg');
}


function colToggleUI() {
  textSize(longEdge / 50);
  fill(0);
  noStroke();


  button1 = createButton('White');
  button1.position((lmax * 3), windowHeight - lmax * 5);
  colH1 = color(355, 70, 80);
  button1.style('background-color', colH1);
  button1.style('font-size', '2.5vmax');
  button1.style('color', 'white');
  button1.style('border-radius', '0.5vmax')
  button1.style('width', '20vmax')
  button1.mousePressed(toggleColour);
}

function toggleColour() {
  colSwitch = !colSwitch;
  changeColour(colSwitch);

}

function changeColour(tmp) {

  if (tmp) {
    colSat = 80;
    colBri = 100;

    if (stage >= 7) {
      button1.html("Colour")
    }

  } else {
    colSat = 0;
    colBri = 85;
    if (stage >= 7) {
      button1.html("White")
    }
  }

}
