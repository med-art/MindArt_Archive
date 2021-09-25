let img_background, img_brush, img_rake, bLayer, pLayer; // all images
let bool_button1 = 0; // bool_button1ean toggle
let gui_img = [];
let pebble = [];
let pebbleu = [];
let tempX = [];
let tempY = [];
let tempcount = 0;
let randomScalar = [];
let tempID = [];
let colourBool = 0;

// declare all brush variables
let rakeX = 0,
  rakeY = 0,
  rake2X = 0,
  rake2Y = 0,
  rake3X = 0,
  rake3Y = 0,
  angle1, segLength;
//button spacing
let longEdge;

let audio;

function preload() {
  //load all brush assets and background
  img_brush = loadImage('assets/brushA.png');
  img_rake = loadImage('assets/rake1b.png');
  img_rake2 = loadImage('assets/rake2b.png');
  img_background = loadImage('assets/sand_01.jpg')
  //load all GUI assets
  for (let i = 1; i < 3; i++) {
    gui_img[i] = loadImage('assets/gui' + i + '.png');
  }
  //Load all pebble assets
  for (let i = 1; i < 8; i++) {
    pebble[i] = loadImage('assets/wpebble' + i + '.png');
  }
  //Load all pebble shadow assets
  for (let i = 1; i < 8; i++) {
    pebbleu[i] = loadImage('assets/wpebbleu' + i + '.png');
  }


    audio = loadSound('assets/audio3.mp3');


}

function setup() {
  createCanvas(windowWidth, windowHeight);
  bLayer = createGraphics(windowWidth, windowHeight);
  pLayer = createGraphics(windowWidth, windowHeight);
  pixelDensity(1); // effectively ignores retina displays

  colorMode(HSB, 360, 100, 100, 1.0);
  sizeWindow();

}

function sizeWindow() {
  resizeCanvas(windowWidth, windowHeight);
  image(img_background, 0, 0, width, height);

  var newbLayer = createGraphics(windowWidth, windowHeight);
  newbLayer.image(bLayer, 0, 0, windowWidth, windowHeight);
  bLayer = newbLayer;

  var newpLayer = createGraphics(windowWidth, windowHeight);
  newpLayer.image(pLayer, 0, 0, windowWidth, windowHeight);
  pLayer = newpLayer;



  segLength = width / 15;
  findLongEdge();
  // set brush sizes relative to width, must be below findLongEdge
  img_brush.resize(longEdge / 35, longEdge / 20);
  img_rake.resize(longEdge / 60, longEdge / 20);
  img_rake2.resize(longEdge / 30, longEdge / 12);
    button2 = createImg('assets/gui5.png'); // really need to make this better by adding another function.
  writeTextUI();
  writeTextUIAudio();
  bLayer.tint(255, 190);
}

function findLongEdge() {
  if (width > height) {
    longEdge = width;
  } else {
    longEdge = height;
  }
}

function draw() {

  imageMode(CORNER);

  blendMode(BLEND);

  image(img_background, 0, 0, width, height);


  //   // Always draw pebbles over the top of each layer
  // for (let k = 0; k < tempcount; k++) {
  //   pLayer.image(pebbleu[tempID[k]], tempX[k], tempY[k], randomScalar[k], randomScalar[k]);
  // }

  blendMode(OVERLAY);
  image(bLayer, 0, 0, windowWidth, windowHeight);

  blendMode(BLEND);
  image(pLayer, 0, 0, windowWidth, windowHeight);

}


// need to optimize below into set styles
function rake0() {
  bool_button1 = 0;
  button1A.style('background-color', colSelect);
  button1A.style('color', 'grey');
  button1A.style('border', '3px solid white');
  button1B.style('background-color', col);
  button1B.style('color', 'white');
  button1B.style('border', '0px solid white');
  button1C.style('background-color', col);
  button1C.style('color', 'white');
  button1C.style('border', '0px solid white');
}


function rake1() {
  bool_button1 = 1;
  button1A.style('background-color', col);
  button1A.style('color', 'white');
  button1A.style('border', '0px solid white');
  button1B.style('background-color', colSelect);
  button1B.style('color', 'grey');
  button1B.style('border', '3px solid white');
  button1C.style('background-color', col);
  button1C.style('color', 'white');
  button1C.style('border', '0px solid white');
}


function rake2() {
  bool_button1 = 2;
  button1A.style('background-color', col);
  button1A.style('color', 'white');
  button1A.style('border', '0px solid white')
  button1B.style('background-color', col);
  button1B.style('color', 'grey');
  button1B.style('border', '0px solid white')
  button1C.style('background-color', colSelect);
  button1C.style('color', 'white');
  button1C.style('border', '3px solid white')
}

function writeTextUIAudio() {
  textSize(longEdge / 50);
  fill(0);
  noStroke();
  let vmax = longEdge / 100; // suspect we may have issue here with IOS in terms of rotation and measuring height, etc
  let textMargin = longEdge / 100; // consolidate into above - no point having 2
button2.position(windowWidth - (10 * vmax) - (textMargin), vmax * 1);
button2.style('background-color', colH2);
button2.style('font-size', '1.75vmax');
button2.style('color', 'black');
button2.style('border-radius', '3.5vmax')
button2.style('width', '7vmax')
button2.mousePressed(switchSound);


}


function writeTextUI() {
  textSize(longEdge / 50);
  fill(0);
  noStroke();

  let vmax = longEdge / 100; // suspect we may have issue here with IOS in terms of rotation and measuring height, etc
  let textMargin = longEdge / 100; // consolidate into above - no point having 2

  button1A = createImg('assets/gui1.png');
  button1B = createImg('assets/gui2.png');
  button1C = createImg('assets/gui3.png');

  // button2 = createButton('Full screen');
  button3 = createButton('New drawing');

  button1A.position(textMargin, windowHeight - vmax * 10);
  button1B.position((vmax * 8) + textMargin, windowHeight - vmax * 10);
  button1C.position((vmax * 16) + textMargin, windowHeight - vmax * 10);

  button3.position(windowWidth - (10 * vmax) - (textMargin * 5), windowHeight - vmax * 6);

  col = color(0, 0, 0, 0.1);
  colSelect = color(0, 0, 0, 1);
  colH2 = color(230, 20, 74);
  colH3 = color(355, 87, 74);

  button1A.style('background-color', colSelect)
  button1A.style('font-size', '1.5vmax');
  button1A.style('color', 'white');
  button1A.style('width', '7vmax');
  button1A.style('border-radius', '0.5vmax')
  button1A.style('border', '3px solid white')
  button1A.mousePressed(rake0);
  button1B.style('background-color', col)
  button1B.style('font-size', '1.5vmax');
  button1B.style('color', 'grey');
  button1B.style('width', '7vmax');
  button1B.style('border-radius', '0.5vmax')
  button1B.mousePressed(rake1);
  button1C.style('background-color', col)
  button1C.style('font-size', '1.5vmax');
  button1C.style('color', 'grey');
  button1C.style('width', '7vmax');
  button1C.style('border-radius', '0.5vmax')
  button1C.mousePressed(rake2);


  button3.style('background-color', colH3);
  button3.style('font-size', '1.75vmax');
  button3.style('color', 'white');
  button3.style('border-radius', '0.5vmax')
  button3.style('width', '12vmax')
  button3.mousePressed(resetTimeout);



}

function enterFS() {

  let fs = fullscreen();
  fullscreen(!fs);


}

function switchSound() {
  if (audio.isPlaying()) {
  audio.stop();
  button2.remove();
button2 = createImg('assets/gui5.png');

writeTextUIAudio();



} else {
audio.loop();
// button2.remove();
// button2 = createImg('assets/gui4.png');
// writeTextUIAudio();

}

return false;
}


function touchMoved() {





  bLayer.blendMode(BLEND);


  if (bool_button1 === 0) {

    ;

    dx = winMouseX - rake3X;
    dy = winMouseY - rake3Y;
    angle1 = atan2(dy, dx);
    rake3X = winMouseX - (cos(angle1) * (segLength / 2));
    rake3Y = winMouseY - (sin(angle1) * (segLength / 2));

    segment(rake3X, rake3Y, angle1, img_brush)
    // reference for brush offset at https://p5js.org/examples/interaction-follow-1.html
  }

  if (bool_button1 === 1) {



    dx = winMouseX - rakeX;
    dy = winMouseY - rakeY;
    angle1 = atan2(dy, dx);
    rakeX = winMouseX - (cos(angle1) * segLength);
    rakeY = winMouseY - (sin(angle1) * segLength);

    segment(rakeX, rakeY, angle1, img_rake)
  }

  if (bool_button1 === 2) {


    dx = winMouseX - rake2X;
    dy = winMouseY - rake2Y;
    angle1 = atan2(dy, dx);
    rake2X = winMouseX - (cos(angle1) * segLength);
    rake2Y = winMouseY - (sin(angle1) * segLength);

    segment(rake2X, rake2Y, angle1, img_rake2)
  }

  return false;
}

function segment(rakeX, rakeY, a, rake) {
  bLayer.imageMode(CENTER);
  bLayer.push();
  bLayer.translate(rakeX, rakeY);
  bLayer.rotate(a);
  bLayer.image(rake, 0, 0, 0, 0);
  bLayer.pop();
}

function resetTimeout() {
  setTimeout(reset, 50);
}

function reset() {

  blendMode(REPLACE);

  image(img_background, 0, 0, width, height);

  bLayer.clear();
  pLayer.clear();

  // basic random counter to determine how many pebbles will be present on the screen;
  tempcount = int(random(0, 3));

  // now a loop based on that random number, to place the pebbles on screen
  for (let k = 0; k < tempcount; k++) {
    randomScalar[k] = int(random(120, 180)); // scale
    tempID[k] = int(random(1, 7)); // which pebble iteration
    tempX[k] = int(random(0, width - randomScalar[k]));
    tempY[k] = int(random(0, height - randomScalar[k]));
    pLayer.image(pebble[tempID[k]], tempX[k], tempY[k], randomScalar[k], randomScalar[k]);
  }
}

function windowResized() {
  removeElements();

  sizeWindow();

  // resizeCanvas(windowWidth, windowHeight);
  //  bLayer.width = windowWidth;
  //  bLayer.height = windowHeight;
  //  pLayer.width = windowWidth;
  //  pLayer.height = windowHeight;
  //  findLongEdge();
  //  writeTextUI();
  //image(img_background, 0, 0, width, height);


}
