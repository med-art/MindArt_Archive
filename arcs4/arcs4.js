var a2, w, h;
var aprev = 0;
var mX = 0;
var mY = 0;
var tX, tY;
var counter = 0;
var r, a;
var c;
var toggle = 0;
var button;
var lineQty = 0;

var centerW;
var centerY;

var vectors = [];
let aC = 0;

let colVersion = 0;
let levelVersion = 0;
let levelMax = 9;
let gridLevels = [
  [1, 1],
  [2, 1],
  [3, 1],
  [2, 2],
  [3, 4]
];

var colSel = 0;
var colours = [
  // ['#363ED9', '#04B2D9', '#05DBF2', '#0CF2DB'],
  // // ['#F20C1F', '#0D0A07', '#D9D0C7', '#BF1515'],
  // ['#2B402B', '#D9AE79', '#BF2604', '#A68080'],
  // ['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
  // ['#7E6167', '#B4356B', '#06CF90', '#17EEB2'],
  ['#345573', '#F2913D', '#223240', '#F24B0F'], // I think ill be fine after eating ice cream
  // ['#0388A6','#F299B1', '#020659', '#80BF90', '#F28705'] // Handelsblatt---All-about-money,-the-costs-of-education-1
  ['#F2F2F2', '#A6A6A6', '#737373', '#0D0D0D', '#404040'], // Unchained
  ['#A6886D', '#F2E0D0', '#402E27', '#F29D52', '#221F26'], // the Planets
  ['#BF4B8B', '#3981BF', '#1F628C', '#590808', '#D92929'], // adidas-Telstar-50-anniversary
  ['#A64456', '#422A59', '#F2B366', '#D9BBA0', '#D96D55'], // Lettering-Love
  ['#F24452', '#5CE3F2', '#F2E205', '#F2CB05', '#F29D35'], // People-of-The-Internet
  ['#D9A74A', '#BF6E3F', '#A67563', '#BFA095', '#BF4141'], // Sparkling-Botanicals-1'
  ['#F27EA9', '#05AFF2', '#F2B705', '#F29F05', '#F2541B'] // Lettering-Series-XXII-1
  // new colours

];

function setup() {
  createCanvas(windowWidth, windowHeight);
  dimensionCalc();
  button = createButton('Arc');
  button.position(40, height-(6.5*vMax));
  button.mousePressed(changeArc);
  button.class("select");
  button.id("toggle");
  button.style('font-size', '2.6vmax');
  button.style('height', '4.5vmax');

  restartBtn = createButton('Restart');
  restartBtn.position(width - (14*vMax), height-(6.5*vMax));
  restartBtn.mousePressed(reset);
  restartBtn.class("select");
  restartBtn.style('font-size', '2.6vmax');
  restartBtn.style('height', '4.5vmax');

  createSwatch();

  temp = createGraphics(windowWidth, windowHeight);
  perm = createGraphics(windowWidth, windowHeight);
  background(245);
  fill(0);
  strokeCap(SQUARE);
  temp.strokeCap(SQUARE);
  perm.strokeCap(SQUARE);

  perm.stroke(80, 24, 200, 100);
  perm.strokeWeight(25);
  perm.noFill();
  temp.stroke(80, 24, 200, 100);
  temp.strokeWeight(2);
  temp.noFill();


  colVersion = colours.length; // set to max, as this will cause reset to 0;
  levelVersion = levelMax;
  reset();




}

function createSwatch() {
  swatch = [];
  for (let i = 0; i < colours[colVersion].length; i++) {
    swatch[i] = createButton("");
    swatch[i].position((((i + 1) * 7) + 20) * vMax, height - (6 * vMax));
    swatch[i].size(7 * vMax, 10.5 * vMax);
    swatch[i].style("background-color", colours[colVersion][i]);
    swatch[i].class("box");
    swatch[i].id("swatch" + i);
    swatch[i].mousePressed(function() {
      changeCol(i)
    });
  }
        changeCol(2)
}

function changeCol(cc){
  // let bC = floor(random(1, colours[colVersion].length));
  c = colours[colVersion][cc];
  colSel = colorAlpha(c, 0.1);

  for (let i = 0; i < colours[colVersion].length; i++) {
        swatch[i].position((((i + 1) * 7) + 20) * vMax, height - (6 * vMax));
        swatch[i].size(7 * vMax, 6 * vMax);
  }

  swatch[cc].position((((cc + 1) * 7) + 20) * vMax, height - (10.5 * vMax));
      swatch[cc].size(7 * vMax, 10.5 * vMax);
}

function dimensionCalc() {

  if (width > height) {
    longEdge = width;
    shortEdge = height;
    circleRad = shortEdge * 0.45;
    vMax = width / 100;
  } else {
    longEdge = height;
    shortEdge = width;
    vMax = height / 100;
    circleRad = shortEdge * 0.45;
  }
}

function reset() {

  colVersion++;
  if (colVersion >= colours.length) {
    colVersion = 0;
  }

  levelVersion++;
  if (levelVersion >= levelMax) {
    levelVersion = 0;
  }

  temp.clear();
  perm.clear();
  clear();
  vectors = [];

  if (levelVersion < gridLevels.length) {
    makeGrid();
  } else {
    scatterPoints();
  }
$(".box").remove();
createSwatch();
touchMoved();
}

function makeGrid() {

  let xQty = gridLevels[levelVersion][0];
  let yQty = gridLevels[levelVersion][1];


  for (let i = 0; i < xQty; i++) {
    for (let j = 0; j < yQty; j++) {
      noStroke();
      fill(0, 100);
      // vectors.push(createVector(random(0,width), random(0, height)));
      vectors.push(createVector((width / (xQty + 1)) * (i + 1), (height / (yQty + 1)) * (j + 1)));
      ellipse(vectors[vectors.length - 1].x, vectors[vectors.length - 1].y, width / 50, width / 50);
    }
  }
}

function scatterPoints() {

  let n = levelVersion - gridLevels.length;
  let qty = 1 + (n * n);

  for (let i = 0; i < qty; i++) {

    let m = height / 10; // margin
    vectors.push(createVector(randomGaussian(width / 2, width / 4), randomGaussian(height / 2, height / 4)));

    // make dots (consider delete)
    noStroke();
    fill(0, 100);
    ellipse(vectors[vectors.length - 1].x, vectors[vectors.length - 1].y, width / 50, width / 50);

  }
}

function touchStarted() {

  let tempHigh = 1000;
  let selected = 0;

  for (let i = 0; i < vectors.length; i++) {
    let temp = dist(mouseX, mouseY, vectors[i].x, vectors[i].y);
    if (temp < tempHigh) {
      tempHigh = temp;
      selected = i;
    }
  }

  centerW = vectors[selected].x;
  centerY = vectors[selected].y;






  r = 2 * dist(mouseX, mouseY, centerW, centerY);





  temp.stroke(colSel);

  w = abs(centerW - mouseX) + 100;
  h = abs(centerY - mouseY) + 100;

  mX = mouseX;
  mY = mouseY;
  tX = mouseX;
  tY = mouseY;
}

function touchMoved() {

  if (!toggle) {
    temp.stroke(colSel);
    temp.noFill();
    lineQty = 120;
    vertRand = 20;
    angRand = 10;
  } else {
    lineQty = 10;
    temp.noStroke();
    temp.fill(colSel);
    vertRand = 5;
    angRand = 10;
  }

  background(colours[colVersion][0]);
  fill(0, 100);
  for (let i = 0; i < vectors.length; i++) {
    ellipse(vectors[i].x, vectors[i].y, width / 60, width / 60);
  }

  image(temp, 0, 0, windowWidth, windowHeight);
  image(perm, 0, 0, windowWidth, windowHeight);
  fill(255);
  blendMode(DIFFERENCE);
  textSize(width / 50);
  text("colour set " + colVersion, width - (width / 5), height / 10);
  blendMode(BLEND);

  a = atan2(mouseY - centerY, mouseX - centerW);
  a2 = atan2(mY - centerY, mX - centerW);

  var diff = a2 - a;

  if (abs(diff) > 5) {
    diff = a - a2
  }

  // experimental option below, updates radius constantly
  //r = 2*dist(mouseX, mouseY, centerW, centerY);

  for (var i = 0; i < lineQty; i++) {
    var nR = randomGaussian(-angRand, angRand);
    a2 = atan2(nR + mY - centerY, nR + mX - centerW);
    a = atan2(nR + mouseY - centerY, nR + mouseX - centerW);



    var n = randomGaussian(-vertRand, vertRand);


    if (diff <= 0) {
      temp.arc(centerW, centerY, r + n, r + n, a2, a);
      counter++;
    } else {
      temp.arc(centerW, centerY, r + n, r + n, a, a2);
      counter--;
    }
  }




  if (dist(centerW, centerY, tX, tY) < 100 && abs(counter) > 2000) {
    // temp.noStroke();
    // temp.fill(colorAlpha(c, 0.05));
    //
    // for (var i = 0; i < 4; i++) {
    //   var rn = random(r * 0.88, r);
    //   temp.ellipse(centerW, centerY, rn, rn);
    //
    // }
    //
    // counter = counter / 2;

  }






  mX = mouseX;
  mY = mouseY;
}

function touchEnded() {
  counter = 0;

}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}

function changeArc() {
  toggle = !toggle;

  if (toggle){
  $('#toggle').html("Slice");
} else {
    $('#toggle').html("Arc");
}
}
