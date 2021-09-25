let fsBool = 0;
let fsButton;

function calcDimensions() {
  vW = width / 100;
  hMax = height/100;

  if (width > height) {
    vMax = width / 100;
    vMin = height / 100;
  } else {
    vMax = height / 100;
    vMin = width / 100;
  }
}

function removeElements(){
    button.remove();
    swatch1.remove();
    swatch2.remove();
    swatch3.remove();
    swatch4.remove();
    fsButton.remove();
    selColour.remove();
    newButton.remove();
    saveButton.remove();

  };

function makeSwatch() {

  button = createImg('assets/eraseOn.png');
  button.remove();
  button = createImg('assets/eraseOff.png');
  button.position(1.5 * vMax, height - (14 * vMax));
  button.size(14 * vMax, 14 * vMax);
  button.mousePressed(invertButton);



  swatch1 = createButton("");
  swatch1.position(15 * vMax, height - (13 * vMax));
  swatch1.size(8 * vMax, 10.5 * vMax);
  swatch1.style("background-color", "White");
  swatch1.class("box");
  swatch1.mousePressed(function() {
    changeBrush(1, 12, 0)
  });

  swatch2 = createButton("");
  swatch2.position(23 * vMax, height - (13 * vMax));
  swatch2.size(8 * vMax, 10.5 * vMax);
  swatch2.style("background-color", "Black");
  swatch2.class("box");
  swatch2.mousePressed(function() {
    changeBrush(5, 15, 1)
  });

  swatch3 = createButton("");
  swatch3.position(31 * vMax, height - (13 * vMax));
  swatch3.size(8 * vMax, 10.5 * vMax);
  swatch3.style('background-color', colArray[(colShift * 4) + 0]);
  swatch3.class("box");
  swatch3.mousePressed(function() {
    changeBrush(4, (colShift * 4) + 0, 2)
  });

  swatch4 = createButton("");
  swatch4.position(39 * vMax, height - (13 * vMax));
  swatch4.size(8 * vMax, 10.5 * vMax);
  swatch4.style("background-color", colArray[(colShift * 4) + 3]);
  swatch4.class("box");
  swatch4.mousePressed(function() {
    changeBrush(2, (colShift * 4) + 3, 3)
  });
  console.log(colArray[(colShift * 4) + 3]);

  fsButton = createImg('assets/enterFS.png');
  fsButton.style('height', '4.5vMax');
  fsButton.position(width-(7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);


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
  newButton.mousePressed(gridVStexture);

  saveButton = createButton("Sauvegardez")
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);
}



function changeBrush(brushSel, col, order) {

  click.play();

  if (eraseBool === 1) {

    invertButton();
  }
  brushSelected = brushSel;
  colArrayNum = col;
  colSelected = colArray[colArrayNum];

  selColour.remove();
  selColour = createImg('assets/colSelected.png');
  selColour.position((15 + (order * 8)) * vMax, height - (16 * vMax));
  selColour.size(8 * vMax, 16 * vMax);
  selColour.mousePressed();

  orderTemp = order;




}




function invertButton() {



  click.play();

  if (eraseBool === 0) {
    selColour.remove();
    button.remove();
    button = createImg('assets/eraseOn.png')
    button.position(1.5 * vMax, height - (14 * vMax));
    button.size(14 * vMax, 14 * vMax);
    button.mousePressed(invertButton);
    eraseBool = 1;
  } else {
    selColour.remove();
    button.remove();
    button = createImg('assets/eraseOff.png')
    button.position(1.5 * vMax, height - (14 * vMax));
    button.size(14 * vMax, 14 * vMax);
    button.mousePressed(invertButton);
    eraseBool = 0;

    selColour.remove();
    selColour = createImg('assets/colSelected.png');
    selColour.position((15 + (orderTemp * 8)) * vMax, height - (16 * vMax));
    selColour.size(8 * vMax, 16 * vMax);
    selColour.mousePressed();

  }



}

function removeElements() {
  button.remove();
  swatch1.remove();
  swatch2.remove();
  swatch3.remove();
  swatch4.remove();
  selColour.remove();
}

function gridVStexture() {
      click.play();

  gridVStextureBool = !gridVStextureBool;


  if (gridVStextureBool) {
    removeElements();
    saveNext();
    makeSlider(width / 2);
    newButton.html("Suivant");
  } else {
    newGrid();
    newButton.html("Suivant");
  }

}

function makeSlider(_mouseX) {


  sliderImg.clear();
  sliderImg.stroke(255);
  sliderImg.strokeWeight(9*hMax);
  sliderImg.line(8 * hMax, 8 * hMax, 8*hMax, height - (8 * hMax));
  sliderImg.stroke("#5cf22c");
  sliderImg.strokeWeight(9*hMax);
  sliderImg.line(8 * hMax, 8 * hMax, 8*hMax, constrain(mouseY, 8*hMax, height - (8 * hMax)));
  sliderImg.imageMode(CENTER);
  sliderImg.image(sliderIcon, 8*hMax, constrain(mouseY, 8*hMax, height - (8 * hMax)), 8.5*hMax, 8.5*hMax);


}

function fs(){

  click.play();

 if (!fsBool){
   fullscreen(1);
   fsBool = 1;
 }

 else{

   fullscreen(0);
   fsBool = 0;

 }
}
