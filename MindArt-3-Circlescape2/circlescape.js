// images
let bg; // background image
let brush = []; // array of Brushes, perhaps only 1 used, but can vary?

// split colour variables
let red = 0;
let green = 0;
let blue = 0;
let colSwitch = 0;

const drift = 25; // how much the colours drift
const rotateDrift = 0.1; // rotate drift

//graphics controller
const numOfScenes = 3;
let currentScene = 0; // 0 because counting intro as a scene
const objectsPerScene = 5;
let objectState = 0;

//ImageMask
let bgLayer;
let bowlbacklayer = [];
let uiLayer;
let maskImg = []; // will load all masks into a 2d array
let maskInvert = [];
let objectLayer = [];

let maskDiff = 100;

let rectangle = [];



let foreCol = [
  [],
  [],
  []
]

let brushColours = [239, 51, 64, 168, 199, 0, 255, 215, 0, 241, 230, 178, 0, 107, 56];
let hexColours = ["#EF3340", "#A8C700", "#FFD700", "#F1E6B2", "#007236"]
// Raspberry 032C = 239, 51, 64
//Grapes 3570C = 168, 199, 0
// Sweetcorn 012C = 255, 215, 0
//Cauliflower 7499C = 241, 230, 178
//Brocolli 3500C = 0, 107, 56

// note that all the above colours are in RGB sequence. ie. R,G,B,R,G,B,R,G,B,R,G,B,R,G,B
// each line is new layers brushColours

let fruitPosX = [70, 55, 30, 75, 50]; // in percentage units
let fruitPosY = [70, 60, 50, 45, 40]; // in percentage units
let fruitSize = [40, 55, 75, 65, 65]; // in percentage units
let fruitRotate = [0, 60, -60, -20, 0];

let introState = 1,
  intermissionState = 0,
  endState = 0;
let tempMillis;
let timer = 0; // ignore intro text for now

// text
let introTitle = "Temp";
let introSub = "";

let inter1title = "";
let inter1text = "";
let inter2title = "";
let inter2text = "";
let inter3title = "";
let inter3text = "";
let inter4title = "";
let inter4text = "";
let inter5title = "";
let inter5text = "";
let confirmationText = "";
let title, interTextCurrent;
let fader = 1000;

let wmax, hmax;
let restartAvailable = 0;
let brushSize = 8;

let bgcol;
let bowlCol;
let bowl;

let delayTime = 10000;

let slide = 0;

let pickedCol;

let colBut = [];

let rectWidth;

let maskVer = 1; // tracks which landscape version

let introText = ["Touch screen to begin", "Blue, surrounding us.", "What can you hear?", "Take a moment to listen, to relax, to remember", "Let’s imagine ourselves in summer", "Trace you finger slowly around the yellow circle a few times", "Relaxing…", "Today we are going to draw circles inside the  silhouettes of summer fruit and vegetables to relax.", "These circles can be any size, as many as you  want, drawn with the colour you have selected", "When you have finished push the ‘finish’ button to continue.  There are 5 silhouettes to complete before you see your summer still life."]

let introCol = ['#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF'];


function preload() {

  bg = loadImage('assets/paper.jpg'); // background paper

  bowl = loadImage('assets/bowl.png');

  for (let i = 1; i < 2; i++) {
    maskImg[i] = [];
    for (let j = 1; j < 6; j++) {
      maskImg[i][j] = loadImage('assets/m' + i + '-' + j + '.png') // mask loader
    }
  }

  for (let i = 1; i < 2; i++) {
    maskInvert[i] = [];
    for (let j = 1; j < 6; j++) {
      maskInvert[i][j] = loadImage('assets/m' + i + '-' + j + 'i.png') // mask loader
    }
  }

  // brush set
  for (let i = 1; i < 26; i++) {
    brush[i] = loadImage('assets/br-' + i + '.png') // brush loader
  }
  audio = loadSound('assets/audio.mp3');
}


function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1); // Ignores retina displays
  // colour initialisation
  blendMode(BLEND); // CHECK USE
  colorMode(RGB, 255, 255, 255, 1); // NOTE EACH LAYER IS SEPARATE
  angleMode(DEGREES);
  bgCol = color(74, 201, 227);
  bowlCol = color(254, 143, 29);



  red = brushColours[0][0];
  green = brushColours[0][1];
  blue = brushColours[0][2];

  // create the layers to store landscape figures
  for (let i = 0; i < objectsPerScene; i++) {
    objectLayer[i + 1] = createGraphics(width, height);
  }

  for (let j = 1; j < 6; j++) {
   bowlbacklayer[j] = createGraphics(width, height);// mask loader
  }

  bgLayer = createGraphics(width, height);
  uiLayer = createGraphics(width, height);
  title = inter5title;
  interTextCurrent = inter5text;
  //rectMode(CENTER);
  backdrop();
  findLongEdge();
  textAlign(CENTER, CENTER);

  brushSize = wmax * 30;

  slideShow();

}

function backdrop() {
  blendMode(BLEND);
  image(bg, 0, 0, width, height); // display backgrond

}

// function draw() {
//   if (introState) {
//     backdrop();
//     textSize(lmax * 2.5);
//     fill(50, 50, 50, 0.01);
//     //textAlign(CENTER, CENTER); - WTF?
//     textStyle(BOLD);
//     text(introTitle, windowWidth / 2, hmax * 20, width * 0.8, height);
//     textStyle(ITALIC);
//     text(introSub, width / 2, hmax * 35, width * 0.8, height);
//     textStyle(NORMAL);
//     text(introText, width / 2, hmax * 55, width * 0.8, height);
//   }
//
//   if (intermissionState) {
//     backdrop();
//     timer = millis() - tempMillis;
//     textSize(lmax * 2.5);
//     fill(40, 35, 30, 0.01);
//     textStyle(BOLD);
//     text(title, windowWidth / 2, hmax * 20, width * 0.5, height);
//     textStyle(NORMAL);
//     text(interTextCurrent, width / 2, hmax * 60, width * 0.8, height);
//   }
// }

function writeTextUI() {
  textSize(longEdge / 50);
  fill(0);
  noStroke();

  let vmax = longEdge / 100; // suspect we may have issue here with IOS in terms of rotation and measuring height, etc
  let textMargin = longEdge / 100; // consolidate into above - no point having 2

  button3 = createButton('Next');
  button3.position(windowWidth - (10 * vmax) - (textMargin * 10), windowHeight - vmax * 6);
  colH3 = color(355, 87, 74);

  button3.style('background-color', colH3);
  button3.style('font-size', '2.1vmax');
  button3.style('color', 'white');
  button3.style('border-radius', '0.5vmax')
  button3.style('width', '14vmax')
  button3.mousePressed(moveNext);


  for (let i = 1; i < 6; i++) {
    uiLayer.fill(color(hexColours[i - 1]));
    uiLayer.noStroke();
    uiLayer.rect(0, (rectWidth * i) - rectWidth, rectWidth/2, rectWidth * i);
    image(uiLayer, 0, 0);

  }

}

function endText() {
  textSize(lmax * 2);
  fill(50, 50, 50, 1);
  textStyle(NORMAL);
  text(confirmationText, width / 2, hmax * 50, width * 0.8, height);
}

function findLongEdge() {
  wmax = width / 100;
  hmax = height / 100;
  if (width > height) {
    longEdge = width;
    shortEdge = height;
    lmax = width / 100;
  } else {
    longEdge = height;
    shortEdge = width;
    lmax = height / 100;
  }
  rectWidth = height / 5;
}


function moveNext() {
  objectState++;
  sceneChanger();
  blendMode(DARKEST);
  objectLayer[objectState].stroke(color(red, green, blue));
    objectLayer[objectState].fill(color(red*1.3, green*1.3, blue*1.3));

  objectLayer[objectState].strokeWeight(hmax * 0.5);

  if (objectState === 5) {
    button3.html("Finish");
    button3.mousePressed(makeFruitBowl);
  }

  blendMode(BLEND);
  objectLayer[objectState].rect(0,0,width,height);
  if (width > height) {
    objectLayer[objectState].image(maskImg[1][objectState], 0, -(longEdge - shortEdge) / 2, longEdge, longEdge);
  } else if (width < height) {
    objectLayer[objectState].image(maskImg[1][objectState], -(longEdge - shortEdge) / 2, 0, longEdge, longEdge);
  }



  backdrop();
  bgLayer.clear();
  bgLayer.tint(bgCol); // Display at half opacity

  if (width > height) {
    bgLayer.image(maskImg[1][objectState], 0, -(longEdge - shortEdge) / 2, longEdge, longEdge);
  }
  if (width < height) {
    bgLayer.image(maskImg[1][objectState], -(longEdge - shortEdge) / 2, 0, longEdge, longEdge);
  }

    image(objectLayer[objectState], 0, 0);
  image(bgLayer, 0, 0);
      image(uiLayer, 0, 0);


// below is a hack to resize the backdrop used in the final fruit bowl ouput

if (width > height) {
  bowlbacklayer[objectState].image(maskInvert[1][objectState], 0, -(longEdge - shortEdge) / 2, longEdge, longEdge);
}
if (width < height) {
  bowlbacklayer[objectState].image(maskInvert[1][objectState], -(longEdge - shortEdge) / 2, 0, longEdge, longEdge);
}



}

function mousePressed() {

if (slide === 0){
  slide++;
  setTimeout(slideShow, 100);
}

  if (mouseX < rectWidth/2) {
    if (mouseY < rectWidth) {
      pickedCol = 1;
      changeColour();
    } else if (mouseY > rectWidth && mouseY < rectWidth * 2) {
      pickedCol = 2;
      changeColour();
    } else if (mouseY > rectWidth * 2 && mouseY < rectWidth * 3) {
      pickedCol = 3;
      changeColour();
    } else if (mouseY > rectWidth * 3 && mouseY < rectWidth * 4) {
      pickedCol = 4;
      changeColour();
    } else if (mouseY > rectWidth * 4) {
      pickedCol = 5;
      changeColour();
    }

    return false;

  }
}

function touchMoved() {

  if (introState === 0 && endState === 0 && objectState < 6) {
    blendMode(BLEND);
    objectLayer[objectState].line(mouseX, mouseY, pmouseX, pmouseY);
    if (width > height) {
      objectLayer[objectState].image(maskImg[1][objectState], 0, -(longEdge - shortEdge) / 2, longEdge, longEdge);
    } else if (width < height) {
      objectLayer[objectState].image(maskImg[1][objectState], -(longEdge - shortEdge) / 2, 0, longEdge, longEdge);
    }
    image(objectLayer[objectState], 0, 0);
      image(bgLayer, 0, 0);
      image(uiLayer, 0, 0);
  } else if (objectState === 6) {
    makeFruitBowl();
  }


  return false;
}



function slideShow() {

  audio.loop();

  if (slide === 10) {
    introState = 0;
    backdrop();
    tempMillis = millis();

    moveNext();
    sceneChanger();
    writeTextUI();
  }





  if (slide < 10) {



    blendMode(BLEND)
    fill(bgCol);
    rectMode(CORNER);
    rect(0, 0, width, height);

    if (slide > 4 && slide < 8) {
      noStroke();
      fill(hexColours[2]);
      circle(width / 2, height / 3, lmax * 30, lmax * 30);
    }

    fill(color(introCol[slide]));
    textSize(lmax * 4);
    textAlign(CENTER, CENTER);
    rectMode(CENTER);
    text(introText[slide], width / 2, hmax * 80, width*0.8, height);
    console.log(slide);

    if (slide > 0){
    slide++;
    setTimeout(slideShow, delayTime);
  }
  }
}

function makeFruitBowl() {
  endState = 1;
fill(bgCol);
rectMode(CORNER)
  rect(0,0,width,height);


  let lmaxTemp, lmaxTemp2, t, t2;

  for (let i = 5; i > 2; i--) {
    lmaxTemp = lmax * fruitSize[i - 1];
    t = lmaxTemp / 2;
    lmaxTemp2 = (lmaxTemp / width) * height;
    t2 = lmaxTemp2 / 2;
    push();
    blendMode(BLEND);
    imageMode(CENTER);
     translate(wmax*fruitPosX[i-1], hmax*fruitPosY[i-1]);
    rotate(fruitRotate[i - 1]);

    image(bowlbacklayer[i], 0, 0, lmaxTemp, lmaxTemp2);
    blendMode(DARKEST);
    image(objectLayer[i], 0, 0, lmaxTemp, lmaxTemp2);

    pop();
  }

  tint(bowlCol);
  imageMode(CENTER);

if (width > height){
    image(bowl, width/2, (height/2)+(int(height*0.3)), height, height);
}
if (height > width){
  image(bowl, width/2, (height/2)+(int(height*0.15)), height, height);
}

  noTint();

  for (let i = 2; i > 0; i--) {
    lmaxTemp = lmax * fruitSize[i - 1];
    t = lmaxTemp / 2;
    lmaxTemp2 = (lmaxTemp / wmax) * hmax;
    t2 = lmaxTemp2 / 2;
    push();
    blendMode(BLEND);
    imageMode(CENTER);
       translate(wmax*fruitPosX[i-1], hmax*fruitPosY[i-1]);
    rotate(fruitRotate[i - 1]);

    image(bowlbacklayer[i], 0, 0, lmaxTemp, lmaxTemp2);
    blendMode(DARKEST);
    image(objectLayer[i], 0, 0, lmaxTemp, lmaxTemp2);

    pop();
  }

  button3.html("restart");
  button3.mousePressed(restart);

imageMode(CORNER);


}

function updateGraphics() {
  // brushLayerResize[currentGraphic].copy(brushLayer, 0, 0, windowWidth, windowHeight, 0, 0, int(width / 20), int(height / 20));
  // currentGraphic++ // save the image
  // brushLayer.clear();
  // backdrop(); // display backgrond
  // tempMillis = millis();
  // sceneChanger();
  // textSize(lmax * 3);
  // fill(80);
}

function layerChanger() {

  // if last layer then sceneChanger?
}

function sceneChanger() {
  if (objectState === 0) {
    red = brushColours[0];
    green = brushColours[1];
    blue = brushColours[2];
  } else if (objectState === 1) {
    red = brushColours[0];
    green = brushColours[1];
    blue = brushColours[2];
  } else if (objectState === 2) {
    red = brushColours[3];
    green = brushColours[4];
    blue = brushColours[5];
  } else if (objectState === 3) {
    red = brushColours[6];
    green = brushColours[7];
    blue = brushColours[8];
  } else if (objectState === 4) {
    red = brushColours[9];
    green = brushColours[10];
    blue = brushColours[11];
  } else if (objectState === 5) {
    red = brushColours[12];
    green = brushColours[13];
    blue = brushColours[14];
  }
}

function changeColour() {
  if (pickedCol === 1) {
    red = brushColours[0];
    green = brushColours[1];
    blue = brushColours[2];
  } else if (pickedCol === 2) {
    red = brushColours[3];
    green = brushColours[4];
    blue = brushColours[5];
  } else if (pickedCol === 3) {
    red = brushColours[6];
    green = brushColours[7];
    blue = brushColours[8];
  } else if (pickedCol === 4) {
    red = brushColours[9];
    green = brushColours[10];
    blue = brushColours[11];
  } else if (pickedCol === 5) {
    red = brushColours[12];
    green = brushColours[13];
    blue = brushColours[14];
  }

  objectLayer[objectState].stroke(color(red, green, blue));
}


function fadeText() {
  noLoop();
  setTimeout(releaseText, 10000);
}

function releaseText() {
  loop();
}

function restart() {

  for (let i = 0; i < objectsPerScene; i++) {
    objectLayer[i + 1].clear();
  }

  objectState = 0;
  moveNext();
  button3.html("Next");
  button3.mousePressed(moveNext);
  endState = 0;


}

function createEnd() {
  restartAvailable = 1;
  textSize(lmax * 4);
  fill(40, 40, 55);
  textStyle(NORMAL);
  text("Touch to restart", wmax * 75, hmax * 90, width, height);

}

function windowResized() {
  setup(); // need to rewrite this to ensure image is saved
}
