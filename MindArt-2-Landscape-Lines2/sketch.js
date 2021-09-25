  // images
  let bg;

  //p5 graphics, including a resized version
  let pg = [];
  let pgResize = [];

  // array of Brushes, perhaps only 1 used, but can vary?
  let brush = [];

  // COLOUR VARAIABLES
  let red = 0;
  let green = 0;
  let blue = 0;
  const drift = 25;
  const rotateDrift = 0.1;

  //graphics controller
  const numOfGraphics = 50;
  const numOfLayers = 5;
  let currentLayer = 1;
  let currentGraphic = 0;
  let randomInt = 0; // divides brush array

  //ImageMask
  let maskImg = [];
  let layer = [];
  var randWidth = [];
  var randHeight = [];
  const strokeSize = 50;

  let arrow = [];

  let colSwitch = 0;

let maskDiff = 100;

  let swatch = [
    [223, 234, 166, 117, 174, 67, 173, 209, 57, 20, 110, 56, 29, 53, 27],
    [172, 224, 186, 114, 155, 123, 67, 114, 95, 27, 61, 45, 20, 44, 31],
    [231, 201, 139, 174, 133, 79, 127, 94, 59, 55, 42, 26, 34, 26, 23],
    [229, 205, 176, 176, 148, 110, 103, 92, 83, 30, 29, 33,  11, 11, 14]
  ];
// note that all the above colours are in RGB sequence. ie. R,G,B,R,G,B,R,G,B,R,G,B,R,G,B

  let scalar = 0;

  let title, interTextCurrent;

  let fader = 1000;


  let introState = 1,
    intermissionState = 0,
    endState = 0;
  let tempMillis;
  let timer = 0; // ignore intro text for now

  let introTitle = "Welcome to the ‘Echo’ drawing digital application";
  let introSub = "Echo definition: (noun) to repeat; (verb) to come back, to reaffirm";
  let introText = "This programme uses a 5 step process to explore repetitive gesture, breathing and sound to create textural watercolour landscapes. \n Slowing us down ‘to bring us back’ to nature, the joy of painting, body awareness and ultimately our inner selves. \n Please touch to continue.";

  let inter1title = "Let’s start here.";
  let inter1text = "1) Slowly draw a line from one dot to the other while exhaling and inhaling (there will be prompts to help).\n You will do this 10 times to create your first landscape texture.";

  let inter2title = "";
  let inter2text = "2) Now imagine a line in the wind. \n Draw a line from one dot to the other while exhaling and inhaling (there will be prompts to help). \n You will do this 10 times to create your second landscape texture"

  let inter3title = "";
  let inter3text = "3) This time we will connect four dots. \n Remember to exhale and inhale as you draw. \n You will do this 10 times to create your 3rd landscape texture.";

  let inter4title = "";
  let inter4text = "4) This time you have three dots to draw lines to. You can go in any direction but remember to inhale and exhale as you draw. \n You will do this 10 times to create your 4th landscape texture";

  let inter5title = "";
  let inter5text = "5) For the 5th step you have 5 dots to draw lines to. You can go in any direction but remember to inhale and exhale as you draw. \n You will do this 10 times to create your 5th  landscape texture";

  let confirmationText = "Congratulations, this is your ‘Echo’ landscape";

  let wmax, hmax;

  let restartAvailable = 0;

  let dotDimen = [
    [50, 10, 50, 90],
    [80, 10, 30, 90],
    [50, 10, 50, 90, 28, 50, 72, 50],
    [20, 10, 80, 10, 50, 90],
    [10, 50, 30, 10, 70, 10, 50, 90, 90, 50],
  ] // dots are defined by X then Y coordinates. If 2 dots, then X,Y,X,Y, etc.

let arrowDimen = [
  [1, 55, 10],
  [2, 35, 90],
  [3, 45, 10, 4, 55, 90],
  [1, 110,110],
  [1, 110,110]
] // for now, last two are false dimensions, until v.02. ALSO, first value is always which version of arrow. Again, a cheat for now.

  let dotTempArray = [];

  let dotLayer;

  let layerState = 1;

  let brushSize = 8;

  let breathState = 0;

  let maskVer = 1; // tracks which landscape version

  let breath;



  function preload() {
    bg = loadImage('assets/paper.jpg'); // background paper

    for (let i = 1; i < 4; i++){
      maskImg[i] = [];
      for (let j = 1; j < 6; j++) {
      maskImg[i][j] = loadImage('assets/m'+ i + '-' + j + '.png') // mask loader
      }
    }
    // brush set
    for (let i = 1; i < 26; i++) {
      brush[i] = loadImage('assets/br-' + i + '.png') // brush loader
    }

    for (let i = 1; i < 5; i++) {
      arrow[i] = loadImage('assets/arrow' + i + '.png') // arrow loader
    }

   audio = loadSound('assets/audio.mp3');

  }

  function setup() {
    createCanvas(windowWidth, windowHeight);
    pixelDensity(1); // Ignores retina displays

    blendMode(BLEND);
    colorMode(RGB, 255, 255, 255, 1);
    // Set initial colour
    red = swatch[0][0];
    green = swatch[0][1];
    blue = swatch[0][2];

    breathLayer = createGraphics(width, height);

    dotLayer = createGraphics(width, height);

    // create the layers to store landscape figures
    for (let i = 0; i < numOfLayers; i++) {
      layer[i + 1] = createGraphics(width, height);
    }

    // createGraphics
    for (let i = 0; i < numOfGraphics; i++) {

      pgResize[i] = createGraphics(int(width / 20), int(height / 20));
    }

    pg = createGraphics(width, height); // only need one of these, to store current brush, later cleared.


    wmax = width / 100;
    hmax = height / 100;
    brushSize = wmax * 7;
    title = inter5title;
    interTextCurrent = inter5text;
    rectMode(CENTER);
    randomCoord();
    backdrop();
    findLongEdge();
    textAlign(CENTER, CENTER);


  }

  function makeDots() {
    dotLayer.fill(80, 80, 200);
    dotLayer.noStroke();
    dotTempArray = dotDimen[layerState];
    for (let i = 0; i < dotDimen[layerState].length; i += 2) {
      dotLayer.circle(int(wmax * dotDimen[layerState][i]), int(hmax * dotDimen[layerState][i + 1]), wmax * 1.5);
    }

dotLayer.image(arrow[arrowDimen[layerState][0]], int(wmax * arrowDimen[layerState][1]), int(hmax * arrowDimen[layerState][2]), wmax*2, wmax*4);

if(arrowDimen[layerState].length > 3 ){
  dotLayer.image(arrow[arrowDimen[layerState][3]], int(wmax * arrowDimen[layerState][4]), int(hmax * arrowDimen[layerState][5]), wmax*2, wmax*4);

}



    image(dotLayer, 0, 0);

  }

  function endText(){


    textSize(lmax*2);
        fill(50, 50, 50, 1);
        textStyle(NORMAL);
        text(confirmationText, width / 2, hmax * 50, width * 0.8, height);
  }



  function draw() {

    if (introState) {
  textSize(lmax*2.5);
      fill(50, 50, 50, 0.01);
      //textAlign(CENTER, CENTER); - WTF?
      textStyle(BOLD);
      text(introTitle, windowWidth / 2, hmax * 20, width * 0.8, height);
      textStyle(ITALIC);
      text(introSub, width / 2, hmax * 35, width * 0.8, height);
      textStyle(NORMAL);
      text(introText, width / 2, hmax * 55, width * 0.8, height);

    }
    if (intermissionState) {

      timer = millis() - tempMillis;


      textSize(lmax*2.5);
      fill(40, 35, 30, 0.01);
      textStyle(BOLD);
      text(title, windowWidth / 2, hmax*20, width * 0.5, height);
      textStyle(NORMAL);
      text(interTextCurrent, width / 2, hmax*60, width * 0.8, height);


    }

  }

  function breathe(breath) {

    breathLayer.fill(150);
    breathLayer.textStyle(NORMAL);
    breathLayer.textAlign(RIGHT);
    breathLayer.textSize(lmax*2.5);

if (breath === "exhale"){
    breathLayer.text(breath, width-wmax*20, height / 1.9);
}

else if (breath === "inhale"){
    breathLayer.text(breath, width-wmax*20, height / 2.1);
}
image(breathLayer, 0, 0, width, height);


  }


  function findLongEdge() {
    if (width > height) {
      longEdge = width;
      lmax = width/100;
    } else {
      longEdge = height;
      lmax = height/100;
    }
  }

  function randomCoord() {
    for (let i = 0; i < 100000; i++) {
      randWidth[i] = int(randomGaussian(-300, width));
      randHeight[i] = int(randomGaussian(-300, height));
    }
  }

  function backdrop() {
    blendMode(BLEND);


    image(bg, 0, 0, width, height); // display backgrond
  }

  function mousePressed() {



    if (introState === 1) {
      backdrop();
      tempMillis = millis();
      stateChanger();
      introState = 0;
      audio.loop();

    } else if (timer > 999 && endState === 0) {

        backdrop();
        breathLayer.clear();

      if (layerState <2){breathe("exhale");}

        intermissionState = 0;
        image(dotLayer, 0, 0, width, height);
      }

    else if (restartAvailable === 1) {
      restart();
    }


  }

  function touchMoved() {

    if (timer > 999 && endState === 0) {


      intermissionState = 0;
      if (currentGraphic < numOfGraphics + 2) {

        let randDrift = random(-drift, drift);

        pg.tint(red + randDrift, green + randDrift, blue + randDrift); // Display at half opacity

        pg.push();
        let scalarsmoother = scalar;
        scalar = (scalarsmoother + (constrain(100 * (random(3, abs(winMouseX - pwinMouseX)) / windowWidth), 0.3, 3))) / 2;


        pg.translate(winMouseX, winMouseY);

        pg.rotate(random(-rotateDrift, rotateDrift));

      //  pg.image(brush[9], 0 - (scalar * brushSize / 2), 0 - (scalar * brushSize / 2), scalar * brushSize, scalar * brushSize);
      pg.image(brush[9], 0-brushSize / 2, 0-brushSize / 2, brushSize, brushSize);

        pg.pop();

        image(pg, 0, 0, width, height);



      }
    }

    return false;
  }

  function touchEnded() {


    if (timer > 999 && endState === 0) {
      // need to include - https://stackoverflow.com/questions/47363844/how-do-i-resize-a-p5-graphic-object
      noTint();
      if (currentGraphic === numOfGraphics - 2) {
        updateGraphics();
          endState = 1;
        backdrop();
        blendMode(DARKEST);
        endText();

        setTimeout(makeLandscape, 3000);
      //  writeTextUI(); not working
      setTimeout(createEnd, 6000);




      } else {

        updateGraphics();

      }
    }

    return false;
  }

  function createEnd(){
    restartAvailable = 1;
    textSize(lmax*4);
        fill(40, 40, 55);
        textStyle(NORMAL);

        text("Touch to restart", wmax*75, hmax * 90, width, height);

  }

  function makeLandscape(){

  backdrop();
    blendMode(DARKEST);


    layer[5].fill(red, green, blue, maskDiff);
    layer[5].rect(0,0,width,height);

    for (let i = 0; i < 25000; i++) {
      randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
      layer[5].image(pgResize[randomInt + 40], randWidth[i], randHeight[i], lmax*7, lmax*7); // replace with scalar
    }

    layer[1].image(maskImg[maskVer][1], 0, 0, width, height);
    image(layer[1], 0, 0);
    layer[2].image(maskImg[maskVer][2], 0, 0, width, height);
    image(layer[2], 0, 0);
    layer[3].image(maskImg[maskVer][3], 0, 0, width, height);
    image(layer[3], 0, 0);
    layer[4].image(maskImg[maskVer][4], 0, 0, width, height);
    image(layer[4], 0, 0);
    layer[5].image(maskImg[maskVer][5], 0, 0, width, height);
    image(layer[5], 0, 0);
    randomCoord();

  }

  function updateGraphics() {
    pgResize[currentGraphic].copy(pg, 0, 0, windowWidth, windowHeight, 0, 0, int(width / 20), int(height / 20));
    currentGraphic++ // save the image
    pg.clear();

    backdrop(); // display backgrond
breathLayer.clear();

    tempMillis = millis();

    stateChanger();

    textSize(lmax * 3);
    fill(80);
    image(dotLayer, 0, 0, width, height);
  }

  function stateChanger() {



    if (currentGraphic === 0) {
      dotLayer.clear();
      title = inter1title;
      layerState = 0;
      interTextCurrent = inter1text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 7;
      red = swatch[colSwitch][0];
      green = swatch[colSwitch][1];
      blue = swatch[colSwitch][2];
    }

    else if (currentGraphic === 10) {
      dotLayer.clear();
      title = inter2title;
      layerState = 1;
      interTextCurrent = inter2text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 6.5;
      layer[1].fill(red, green, blue, maskDiff);
      layer[1].rect(0,0,width,height);
      red = swatch[colSwitch][3];
      green = swatch[colSwitch][4];
      blue = swatch[colSwitch][5];
      for (let i = 0; i < 80000; i++) {
        randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
        layer[1].image(pgResize[randomInt], randWidth[i], randHeight[i], lmax*4, lmax*4); // replace with scalar
      }
    }
    else if (currentGraphic === 20) {
      dotLayer.clear();
      title = inter3title;
      layerState = 2;
      interTextCurrent = inter3text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 6;
      layer[2].fill(red, green, blue, maskDiff);
      layer[2].rect(0,0,width,height);
      red = swatch[colSwitch][6];
      green = swatch[colSwitch][7];
      blue = swatch[colSwitch][8];
      for (let i = 0; i < 40000; i++) {
        randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
        layer[2].image(pgResize[randomInt + 10], randWidth[i], randHeight[i], lmax*5, lmax*5); // replace with scalar
      }
    }
  else if (currentGraphic === 30) {
      dotLayer.clear();
      title = inter4title;
      layerState = 3;
      interTextCurrent = inter4text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 5.5;
      layer[3].fill(red, green, blue, maskDiff);
      layer[3].rect(0,0,width,height);
      red = swatch[colSwitch][9];
      green = swatch[colSwitch][10];
      blue = swatch[colSwitch][11];
      for (let i = 0; i < 30000; i++) {
        randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
        layer[3].image(pgResize[randomInt + 20], randWidth[i], randHeight[i], lmax*6, lmax*6); // replace with scalar
      }
    }
    else if (currentGraphic === 40) {
      dotLayer.clear();
      title = inter5title;
      layerState = 4;
      interTextCurrent = inter5text;
      intermissionState = 1;
          makeDots();
      brushSize = wmax * 5;
      layer[4].fill(red, green, blue, maskDiff);
      layer[4].rect(0,0,width,height);
      red = swatch[colSwitch][12];
      green = swatch[colSwitch][13];
      blue = swatch[colSwitch][14];
      for (let i = 0; i < 25000; i++) {
        randomInt = int(random(0, (numOfGraphics / numOfLayers) - 1)); // ((25 / 5)*1)-1
        layer[4].image(pgResize[randomInt + 30], randWidth[i], randHeight[i], lmax*7, lmax*7); // replace with scalar
      }
    }

else{
      if (layerState <2){breathe("inhale");}
}

    image(dotLayer, 0, 0, width, height);


  }


  function fadeText() {
    noLoop();
    setTimeout(releaseText, 10000);
  }

  function releaseText() {
    loop();
  }


  // function writeTextUI() {
  //   textSize(longEdge / 50);
  //   fill(0);
  //   noStroke();
  //
  //   let vmax = longEdge / 100; // suspect we may have issue here with IOS in terms of rotation and measuring height, etc
  //   let textMargin = longEdge / 100; // consolidate into above - no point having 2
  //
  //   button3 = createButton('Restart');
  //   button3.position(windowWidth - (10 * vmax) - (textMargin * 5), windowHeight - vmax * 6);
  //   colH3 = color(355, 87, 74);
  //
  //   button3.style('background-color', colH3);
  //   button3.style('font-size', '2.1vmax');
  //   button3.style('color', 'white');
  //   button3.style('border-radius', '0.5vmax')
  //   button3.style('width', '14vmax')
  //   button3.mousePressed(restart);
  // }


  function restart() {
    restartAvailable = 0;
    currentGraphic = 0;
    introState = 0;
    intermissionState = 1;
    endState = 0;
    for (let i = 0; i < numOfGraphics; i++) {
      pgResize[i].clear();
    }
    for (let i = 0; i < numOfLayers; i++) {
      layer[i + 1].clear();
    }
    maskVer++;
    if (maskVer === 4){
      maskVer = 1;
    }

    backdrop();
    stateChanger();

    colourSwitcher();

  }

  function colourSwitcher(){
    colSwitch++;
    if (colSwitch === 4){
      colSwitch = 0;
    }
  }

  function windowResized() {
    setup(); // need to rewrite this to ensure image is saved
  }
