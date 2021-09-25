var colQty = 1;
var colWidth;
var colYtrack = [];
var drawActive = false;

var lineVersion = 0;
var vMax;
var div = 1;

var c1, c2, c3, c4;

var fg;

var restart;
var sel = 0;

var colours = [
  ['#0D0A07', '#D9D0C7', '#F20C1F', '#BF1515'],
  ['#345573', '#223240', '#F2913D', '#F24B0F'],
  ['#172426', '#455559', '#D9C3B0', '#F2DFCE'],
  ['#3C5E73','#F2BBBB','#F24968','#F24444'],
  ['#3FA663','#2D7345','#3391A6','#262626'],
  ['#A60321','#D9043D','#F29F05','#D8BA7A'],
  ['#3C2D73','#131A40','#D97E6A','#BF7396'],
  ['#81edf7','#00a4c0','#f70110','#6e0516'],
  ['#192819','#2c4928','#719b25','#cbe368'],
  ['#314035','#5E7348','#A4BF69','#E0F2A0'],
  ['#a4fba6','#4ae54a', '#0f9200', '#006203'],
  ['#2d3157','#34c1bb','#badccc','#ffda4d'],
  ['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
  ['#CCCCCC','#F2F2F2','#B3B3B3','#E6E6E6']
];

var numPattern = [1, 2, 4, 8, 16, 32, 64, 128];

var cc = 0; // currentColour
var toggle = 1;

var touchDownY;

var currentOrientation, storedOrientation, storedOrientationDegrees, rotateDirection;

function preload() {
  paper = loadImage('assets/paper1.jpg');
  audio = loadSound('assets/audio.mp3');
  click = loadSound('assets/click.mp3');
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

    // TODO: Instigate resizes for both of these
    fg = createGraphics(windowWidth, windowHeight);
    intermedia = createGraphics(windowWidth, windowHeight);

    fg.noFill();
    pixelDensity(1);

    var stbtn = $("<div />").appendTo("body");
    stbtn.addClass('startBtn');
    $('<p>Touch here to begin</p>').appendTo(stbtn);
    stbtn.mousedown(start);
    stbtn.mousemove(start);

}


function start() {
  $(".startBtn").remove();
  fullscreen(1);

  //todo, consider pausing audio context
  if (audio.isPlaying()) {} else {
    audio.loop(1);
  }

  sizeWindow();
  writeTextUI();
  restart();

}
//
// function windowResized() {
//   resizeCanvas(windowWidth, windowHeight);
//
//   calcDimensions();
//
//
//   writeTextUI();
//
//
//
//   // cc = floor(random(0, colours.length));
//   restart();
//   lineVersion = 0
// }


function toggleIt() {
  toggle = !toggle;
  for (let i = 0; i < 2; i++) {
        swatch[i].position(((i * 9)+3) * vMax, height - (11 * vMax));
        swatch[i].size(9 * vMax, 8 * vMax);
  }
var n = 0;
if (toggle){
  n = 1;
}
  swatch[n].position(((toggle * 9)+3) * vMax, height - (15.5 * vMax));
  swatch[n].size(9 * vMax, 12.5 * vMax);
}

function restart() {
  cc++;
  if (cc >= colours.length) {
    cc = 0;
  }
  lineVersion++;
  if (lineVersion >= numPattern.length) {
    lineVersion = 0;
  }

  // clear both layers
  fg.clear();
  intermedia.clear();
  colQty = floor(random(1, 10));

  c1 = colours[cc][0];
  c2 = colours[cc][1];
  c3 = colours[cc][2];
  c4 = colours[cc][3];

  // make solid gradient, add smaller gradients
  from = color(c1);
  to = color(c2);

  for (var j = 0; j < height; j++) {
    intermedia.stroke(lerpColor(from, to, j / height));
    intermedia.line(0, j, width, j);
  }
  render();
  createSwatch();

}

function touchStarted() {
  touchDownY = mouseY;
}

function touchMoved() {

  colQty = numPattern[lineVersion];
  colWidth = width / colQty;

  var tempSel = floor(mouseX / colWidth);
  if (sel != tempSel) {
    sel = floor(mouseX / colWidth)
  }
    colYtrack[sel] = mouseY;
    if (toggle) {
      from = color(c3);
      to = color(c4);
    } else {
      from = color(c1);
      to = color(c2);
    }
      if (mouseY >= touchDownY) {
        for (var j = touchDownY; j < mouseY; j++) {
          fg.stroke(lerpColor(to, from, j / mouseY));
          fg.line((sel * colWidth), j, (sel * colWidth) + colWidth, j);
        }
      } else {``
          for (var j = touchDownY; j > mouseY; j--) {
          fg.stroke(lerpColor(to, from, mouseY / j));
          fg.line((sel * colWidth), j, (sel * colWidth) + colWidth, j);
        }
      }
  render();

  return false;
}


function render() {
  intermedia.image(fg, 0, 0, width, height);
  blendMode(BLEND);
  image(paper, 0, 0, width, height);
  blendMode(MULTIPLY);
  image(intermedia, 0, 0, width, height);
  // fill(255);
  // blendMode(DIFFERENCE);
  // textSize(width / 50);
  // text(colours[cc][0], width - width / 5, height / 10);

}

function touchEnded() {
  drawActive = false;
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function checkFS(){

  if (!fullscreen()){
  addFS();
}
}


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  sizeWindow();

  // removeElements();
  writeTextUI();
  render();
  checkFS();

    fg.strokeWeight(2);
    fg.strokeCap(SQUARE);
}




function sizeWindow() {
  if (width < height) {
    currentOrientation = "portrait";
  } else {
    currentOrientation = "landscape";
  }
  if (currentOrientation === storedOrientation) {
    stretchWindow();
  } else {
    if (window.orientation < storedOrientationDegrees) {
      direction = 1;
    } else {
      direction = -1;
    }

    if (abs(window.orientation - storedOrientationDegrees) == 270){
      direction = -direction;
    }
    rotateWindow(direction);
    storedOrientationDegrees = window.orientation;
  }
  storedOrientation = currentOrientation;
  calcDimensions();
}

function stretchWindow() {
  var newfg = createGraphics(windowWidth, windowHeight);
  newfg.image(fg, 0, 0, windowWidth, windowHeight);
  fg.resizeCanvas(windowWidth, windowHeight);
  fg = newfg;
  newfg.remove();

  var newintermedia = createGraphics(windowWidth, windowHeight);
  newintermedia.image(intermedia, 0, 0, windowWidth, windowHeight);
  intermedia.resizeCanvas(windowWidth, windowHeight);
  intermedia = newintermedia;
  newintermedia.remove();


}

function rotateWindow(direction) {
  var newfg = createGraphics(windowWidth, windowHeight);
  newfg.push();
  newfg.translate(width / 2, height / 2);
  newfg.rotate((PI / 2) * direction);
  newfg.translate(-height / 2, -width / 2);
  newfg.image(fg, 0, 0, windowHeight, windowWidth);
  newfg.pop()
  fg.resizeCanvas(windowWidth, windowHeight);
  fg = newfg;
  newfg.remove();

  var newintermedia = createGraphics(windowWidth, windowHeight);
  newintermedia.push();
  newintermedia.translate(width / 2, height / 2);
  newintermedia.rotate((PI / 2) * direction);
  newintermedia.translate(-height / 2, -width / 2);
  newintermedia.image(intermedia, 0, 0, windowHeight, windowWidth);
  newintermedia.pop()
  intermedia.resizeCanvas(windowWidth, windowHeight);
  intermedia = newintermedia;
  newintermedia.remove();



  // TODO: properly detect the orientation
  rotateDirection = rotateDirection * -1;
}

//startSimulation and pauseSimulation defined elsewhere
function handleVisibilityChange() {
  if (document.hidden) {
    audio.stop();
  } else {
    audio.loop(1);
  }
}

document.addEventListener("visibilitychange", handleVisibilityChange, false);
