let button1, button2, button3;
let colH1, colH2, colH3;
let rectWidth;
let colChoice = 0;
let counter = 0;
let scalar = 1.0;
let interrupt = 0;
let brushColours = [239, 51, 64, 168, 199, 0, 255, 215, 0, 241, 230, 178, 0, 107, 56];
let hexColours = ["#EF3340", "#f7f7f7", "#FFD700", "#FA6122", "#007236", "#4166f5"];
let colArray = ["#EF3340", "#f7f7f7", "#FFD700", "#FA6122", "#007236", "#4166f5"]
let leafCount = 0;
let brushSelected = 0;


let fsBool = 0;
let fsButton;


function updateButtons(){
  button.position(0 * vMax, height - (14 * vMax));
  button.size(14 * vMax, 14 * vMax);
  button.mousePressed(drawImg);

  button0.position(11 * vMax, height - (14 * vMax));
  button0.size(14 * vMax, 14 * vMax);
  button0.mousePressed(rotateImg);
}

function writeTextUI() {
  colH2 = color(130, 0, 20);
  colH3 = color(240, 0, 50);
  colH1 = color(355, 0, 20);
  textSize(longEdge / 50);
  fill(0);
  noStroke();

  saveButton = createButton("Sauvegardez");
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (15 * vMax), height - (14 * vMax));
  saveButton.mousePressed(saveImg);
  resetButton = createButton("Suivant");
  resetButton.class("select");
  resetButton.style('font-size', '1.7vmax');
  resetButton.style('height', '5vmax');
  resetButton.position(width - (15 * vMax), height - (8 * vMax));
  resetButton.mousePressed(restart);


  polarUIimg.strokeWeight(5);
  polarUIimg.stroke(255);
  polarUIimg.noFill();
  polarUIimg.ellipse(width/2, height/2, vMin*90, vMin*90);

  for (let i = 0; i < 12; i++){
    polarUIimg.push();
    polarUIimg.translate(width/2, height/2);
    polarUIimg.rotate(i*(PI/6));
    polarUIimg.translate(0, - vMin*45);
    polarUIimg.ellipse(0, 0, 10, 10);
    polarUIimg.line(0,0,0,-60)
    polarUIimg.pop();
  }


      swatch1 = createButton("");
      swatch1.position(12 * vMax, height - (13 * vMax));
      swatch1.size(6 * vMax, 10.5 * vMax);
      swatch1.style("background-color", colArray[0]);
      swatch1.class("box");
      swatch1.mousePressed(function() {
        changeBrush(1)
      });

      swatch2 = createButton("");
      swatch2.position(18 * vMax, height - (13 * vMax));
      swatch2.size(6 * vMax, 10.5 * vMax);
      swatch2.style("background-color", colArray[1]);
      swatch2.class("box");
      swatch2.mousePressed(function() {
        changeBrush(2)
      });

      swatch3 = createButton("");
      swatch3.position(24* vMax, height - (13 * vMax));
      swatch3.size(6 * vMax, 10.5 * vMax);
      swatch3.style('background-color', colArray[2]);
      swatch3.class("box");
      swatch3.mousePressed(function() {
        changeBrush(3)
      });

      swatch4 = createButton("");
      swatch4.position(30 * vMax, height - (13 * vMax));
      swatch4.size(6 * vMax, 10.5 * vMax);
      swatch4.style("background-color", colArray[3]);
      swatch4.class("box");
      swatch4.mousePressed(function() {
        changeBrush(4)
      });

      swatch5 = createButton("");
      swatch5.position(36 * vMax, height - (13 * vMax));
      swatch5.size(6 * vMax, 10.5 * vMax);
      swatch5.style("background-color", colArray[4]);
      swatch5.class("box");
      swatch5.mousePressed(function() {
        changeBrush(5)
      });

      swatch6 = createButton("");
      swatch6.position(42 * vMax, height - (13 * vMax));
      swatch6.size(6 * vMax, 10.5 * vMax);
      swatch6.style("background-color", colArray[5]);
      swatch6.class("box");
      swatch6.mousePressed(function() {
        changeBrush(6)
      });


        selColour = createImg('assets/colSelected.png');
        selColour.position((11.5+ ((brushSelected) * 6)) * vMax, height - (16 * vMax));
        selColour.size(7 * vMax, 16 * vMax);
        selColour.mousePressed();

        fsButton = createImg('assets/enterFS.png');
        fsButton.style('height', '4.5vMax');
        fsButton.position(width-(7.5 * vMax), 1.5 * vMax);
        fsButton.mousePressed(fs);





}

function changeBrush(brushSel) {
  click.play();

  drawState = 1;
  rot = 1;

  brushSelected = brushSel-1;

 selColour.remove();
  selColour = createImg('assets/colSelected.png');
  selColour.position((11.5 + ((brushSel-1) * 6)) * vMax, height - (16 * vMax));
  selColour.size(7 * vMax, 16 * vMax);
  selColour.mousePressed();

}




function writeStageUI() {
  textSize(longEdge / 50);
  fill(0);
  noStroke();
  button6 = createButton('New leaf');
  button6.class('restart');
  button6.mousePressed(leafChooser);
  if (width > height) {
    rectWidth = height / 6;
    button6.position(rectWidth / 2, windowHeight - vMax * 8);
  } else if (width <= height) {
    button6.position(windowWidth - (18 * vMax) - (vMax * 1.5), windowHeight - rectWidth / 2 - (8 * vMax));
  }
}





function restart() {
  // counter++;
  // if (counter === 5) {
  //   writeStageUI();
  // }
  // if (counter === 10) {
  //   writeScaleUI();
  // }
  drawLayer.clear();
  hiddenLayer.clear();
  permaLayer.clear();
  drawLayer.fill(255);
  hiddenLayer.fill(255);
  // drawLayer.rect(0,0, width, height);
  // hiddenLayer.rect(0,0, width, height);
  leafSelector = int(random(0, 6));
  drawState = 1;
//  rotateImg();
leafLayer.clear();
strokeLayer.clear();
  touchStarted();
  touchMoved();
  drawLeaves();

}

function saveImg() {
  image(bg, 0, 0, width, height);
  image(drawLayer, 0, 0, width, height);
  image(permaLayer,0,0,width,height);
  save('dotscape' + month() + day() + hour() + second() + '.jpg');
}

function makeSlider(_y) {
  sliderImg.clear();
  sliderImg.stroke(255);
  sliderImg.strokeWeight(7*hmax);
  sliderImg.line(6 * hmax, 8 * hmax, 6*hmax, height/2 - (4 * hmax));
  sliderImg.stroke("#5cf22c");
  sliderImg.strokeWeight(7*hmax);
  sliderImg.line(6 * hmax, 8 * hmax, 6*hmax, constrain(_y, 8*hmax, height/2 - (4 * hmax)));
  sliderImg.imageMode(CENTER);
  sliderImg.image(sliderIcon, 6*hmax, constrain(_y, 8*hmax, height/2 - (4 * hmax)), 6.5*hmax, 6.5*hmax);
}

function makeScaler(_y) {
  scalarImg.clear();
  scalarImg.stroke(255);
  scalarImg.strokeWeight(7*hmax);
  scalarImg.line(6 * hmax, height/2+(4 * hmax), 6*hmax, height - (8 * hmax));
  scalarImg.stroke("#ef6500");
  scalarImg.strokeWeight(7*hmax);
  scalarImg.line(6 * hmax, height/2+(4 * hmax), 6 * hmax, constrain(_y, height/2+(4 * hmax), height - (8 * hmax)));
  scalarImg.imageMode(CENTER);
  scalarImg.image(sliderIcon2, 6 * hmax, constrain(_y, height/2+(4 * hmax), height-8*hmax), 6.5*hmax, 6.5*hmax);
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
