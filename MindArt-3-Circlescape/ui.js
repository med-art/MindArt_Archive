let swatchCol = ['#004da7', "#d54288", '#fce302', '#004ea9', '#fce300', '#007c40', '#479fdf', '#92328c', '#ef6301', '#007b3d', '#fe8f1c', '#fce300'];
// cols in sets of 3
// let swatchCol = ['#BF1736',
//   '#0D1440',
//   '#1455D9',
//   '#FFC432',
//   '#0D212C',
//   '#079BAB',
//   '#BF343F',
//   '#F2BB9B',
//   '#D94F30',
//   '#382A04',
//   '#F7BB14',
//   '#B88B0F'
// ]



let appBg = 250;
let stage = 0;
let eraseBoolean = 0;
let lE;
let swatches = [];

function calcDimensions() {
  vW = width / 100;
  hMax = height / 100;

  if (width > height) {
    vMax = width / 100;
    vMin = height / 100;
    lE = width;
  } else {
    vMax = height / 100;
    vMin = width / 100;
    lE = height;
  }
}

function makeUI() {
  button = createImg('assets/eraseOn.png');
  button.remove();
  button = createImg('assets/eraseOff.png');
  button.position(1.5 * vMax, height - (14 * vMax));
  button.size(14 * vMax, 14 * vMax);
  button.mousePressed(makeErase);

  fsButton = createImg('assets/enterFS.png');
  fsButton.style('height', '4.5vMax');
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);




}

function makeSwatch() {


  for (let i = 0; i < 3; i++) {
    swatches[i] = createButton("");
    swatches[i].position((15 * vMax) + (8 * i * vMax), height - (13 * vMax));
    swatches[i].size(8 * vMax, 10.5 * vMax);
    swatches[i].style("background-color", swatchCol[((stage * 3) + i)]);
    swatches[i].class("box");
    swatches[i].mousePressed(function() {
      changeBrush(i);
    });
  }

  selColour = createImg('assets/colSelected.png');
  selColour.position(15 * vMax, height - (16 * vMax));
  selColour.size(8 * vMax, 16 * vMax);
  selColour.mousePressed();
  saveNext();


}



function saveNext() {
  newButton = createButton("Suivant")
  newButton.class("select");
  newButton.position(width - (16 * vMax), height - (7 * vMax));
  newButton.style('font-size', '1.7vmax');
  newButton.style('height', '5vmax');
  newButton.mousePressed(nextStep);

  saveButton = createButton("Sauvegardez")
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);
}

function nextStep() {
  click.play();
  for (swatch of swatches) {
    swatch.remove();
  }

  selColour.remove();
  drawingIsActive = !drawingIsActive;
  if (!drawingIsActive) {
    introLayer.blendMode(DARKEST);
    for (layer of subLayers) {
      introLayer.image(layer, 0, 0, width, height);
    }
    makeSlider();

  } else {
    stage++;
    if (stage === 4) {
      stage = 0;
    }

    for (let i = 0; i < 3; i++) {
      bgLayers[i].background(250, 250, 250);
      subLayers[i].background(appBg);
      fgLayers[i] = loadImage('assets/s' + (stage + 1) + '-' + (i + 1) + '.png')
      bgLayers[i].stroke(swatchCol[(stage * 3) + i]);
      bgLayers[i].fill(swatchCol[(stage * 3) + i]);
      console.log(swatchCol[(stage * 3) + i]);
    }
    introLayer.clear();
    clear();

    makeSwatch();
    saveButton.remove();
    newButton.remove();
    currentLayer = 0;
    eraseBoolean = 0;
    blendMode(BLEND);
    background(255);
  }
}

function changeBrush(layerSelected) {
  click.play();
  currentLayer = layerSelected;

  selColour.remove();
  selColour = createImg('assets/colSelected.png');
  selColour.position((15 + (8 * (layerSelected))) * vMax, height - (16 * vMax));
  selColour.size(8 * vMax, 16 * vMax);
  selColour.mousePressed();

  button.remove();
  button = createImg('assets/eraseOff.png');
  button.position(1.5 * vMax, height - (14 * vMax));
  button.size(14 * vMax, 14 * vMax);
  button.mousePressed(makeErase);
  eraseBoolean = 0;

}

function makeSlider() {
  sliderImg.clear();
  sliderImg.stroke(255);
  sliderImg.strokeWeight(9 * hMax);
  sliderImg.line(8 * hMax, 8 * hMax, 8 * hMax, height - (8 * hMax));
  sliderImg.stroke("#5cf22c");
  sliderImg.strokeWeight(9 * hMax);
  sliderImg.line(8 * hMax, 8 * hMax, 8 * hMax, constrain(mouseY, 8 * hMax, height - (8 * hMax)));
  sliderImg.imageMode(CENTER);
  sliderImg.image(sliderIcon, 8 * hMax, constrain(mouseY, 8 * hMax, height - (8 * hMax)), 8.5 * hMax, 8.5 * hMax);
}

function saveImg() {
  click.play();
  blendMode(BLEND);
  save('linescape' + month() + day() + hour() + second() + '.jpg');
}

function fs() {
  if (!fullscreen()) {
    fullscreen(1);
  } else {
    fullscreen(0);
  }
}

function makeErase() {
  click.play();
  selColour.remove();
  button.remove();
  button = createImg('assets/eraseOn.png');
  button.position(1.5 * vMax, height - (14 * vMax));
  button.size(14 * vMax, 14 * vMax);
  button.mousePressed(makeErase);
  eraseBoolean = 1;

  for (layer of bgLayers) {
    layer.stroke(255, 90);
    layer.strokeWeight(100);
  }


}
