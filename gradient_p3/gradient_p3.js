var colQty = 1;
var colWidth;
var colYtrack = [];
var drawActive = false;

var lineVersion = 0;
var vMax;
var div = 1;

var c1, c2, c3, c4;

var restart;
var sel = 0;
var colours = [
  // ['#363ED9', '#04B2D9', '#05DBF2', '#0CF2DB'],
  // ['#F20C1F', '#0D0A07', '#D9D0C7', '#BF1515'],
  ['#2B402B', '#D9AE79', '#BF2604', '#A68080'],
  ['#030A8C', '#4ED98A', '#F2B705', '#D93E30'],
  ['#7E6167', '#B4356B', '#06CF90', '#17EEB2'],
  ['#345573', '#F2913D', '#223240', '#F24B0F'], // I think ill be fine after eating ice cream
  // ['#0388A6','#F299B1', '#020659', '#80BF90', '#F28705'] // Handelsblatt---All-about-money,-the-costs-of-education-1
  ['#F2F2F2', '#A6A6A6', '#737373', '#0D0D0D', '#404040'], // Unchained
  // ['#A6886D', '#F2E0D0', '#402E27', '#F29D52', '#221F26'], // the Planets
  // ['#BF4B8B', '#3981BF', '#1F628C', '#590808', '#D92929'], // adidas-Telstar-50-anniversary
  ['#A64456', '#422A59', '#F2B366', '#D9BBA0', '#D96D55'], // Lettering-Love
  // ['#F24452', '#5CE3F2', '#F2E205', '#F2CB05', '#F29D35'], // People-of-The-Internet
  ['#D9A74A', '#BF6E3F', '#A67563', '#BFA095', '#BF4141'], // Sparkling-Botanicals-1'
  // ['#F27EA9', '#05AFF2', '#F2B705', '#F29F05', '#F2541B'] // Lettering-Series-XXII-1
];

var numPattern = [1,2,4,8,16,32,64,128,256];
var numPattern2 = [1,2,3,5,8,13,21];

var sliderWords = ["none", "small", "medium", "large"]

var cc = 0; // currentColour
var toggle = 1;

var touchDownY;

function preload() {
  paper = loadImage('data/paper1.jpg');

}

function setup() {


  createCanvas(windowWidth, windowHeight);
  dimensionCalc();

      fullscreen(1);


  slider1 = createSlider(0, 8, 4);
  slider2 = createSlider(0, 3, 0);

  newButton = createButton('new');
  newButton.mousePressed(restart);
  newButton.class("select");
  newButton.position(width - (14*vMax), height-(6.5*vMax));
  newButton.style('font-size', '2.6vmax');
  newButton.style('height', '4.5vmax');

  toggleBut = createButton('toggle');
  toggleBut.mousePressed(toggleIt);
  toggleBut.class("select");
  toggleBut.position(40, height-(6.5*vMax));
  toggleBut.style('font-size', '2.6vmax');
  toggleBut.style('height', '4.5vmax');


  slider1.position(10, 40);
  slider2.position(10, 90);

  slider1.style('width', '300px');
  slider2.style('width', '300px');
  cc = floor(random(0, colours.length));
  restart();
    lineVersion = 0
}

function toggleIt(){
  toggle = !toggle;
}

function restart() {
  cc++;
  if (cc >= colours.length) {
    cc = 0;
  }
  lineVersion++;
  if (lineVersion >= numPattern.length){
    lineVersion = 0;
  }

  colQty = floor(random(1, 10));
  newLayer = createGraphics(windowWidth, windowHeight);
  intermedia = createGraphics(windowWidth, windowHeight);
  //newLayer.blendMode(BLEND);



  c1 = colours[cc][0];
  c2 = colours[cc][1];
  c3 = colours[cc][2];
  c4 = colours[cc][3];

  strokeWeight(1);
  newLayer.strokeWeight(1);

  // make solid gradient, add smaller gradients



  from = color(c1);
  to = color(c2);

  for (var j = 0; j < height; j++) {
    intermedia.stroke(lerpColor(from, to, j / height));
    intermedia.line(0, j, width, j);
  }


  touchMoved();
}

function dimensionCalc() {

  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
}

function touchStarted() {
  touchDownY = mouseY;
}

function touchMoved() {


  // colQty = numPattern[slider1.value()];
  colQty = numPattern[lineVersion];

  gap = slider2.value();

  colWidth = width / colQty;
  gap = (colWidth/10)*slider2.value();


  var tempSel = floor(mouseX / colWidth);
  if (sel != tempSel) {
    sel = floor(mouseX / colWidth)
    // OPTIONAL, essentially records mouseY again each time we move ot a new column.
    // touchDownY = mouseY;
  };

  drawActive = true;

  if (drawActive) {

    colYtrack[sel] = mouseY;



    from = color(c3);
    to = color(c4);

    if (toggle){

      from = color(c3);
      to = color(c4);

      if (mouseY >= touchDownY) {
        for (var j = touchDownY; j < mouseY; j++) {
          newLayer.stroke(lerpColor(to, from, j / mouseY));
                  console.log(j/mouseY);
        //  newLayer.line(sel * colWidth, j, (sel * colWidth) + colWidth / div, j);
          newLayer.line((sel*colWidth)+gap, j, (sel*colWidth)+colWidth-gap, j);
        }
      } else {
        // CURRENTLY WORKING ON THIS!
        for (var j = touchDownY; j > mouseY; j--) {
          newLayer.stroke(lerpColor(from, to, mouseY / j));
          console.log(j/mouseY);
          // newLayer.line(sel * colWidth, j, (sel * colWidth) + colWidth / div, j);
          newLayer.line((sel*colWidth)+gap, j, (sel*colWidth)+colWidth-gap, j);
        }
      }
}else {
  from = color(c1);
  to = color(c2);

  if (mouseY >= touchDownY) {
    for (var j = touchDownY; j < mouseY; j++) {
      newLayer.stroke(lerpColor(to, from, j / mouseY));
      // newLayer.line(sel * colWidth, j, (sel * colWidth) + colWidth / div, j);
      newLayer.line((sel*colWidth)+gap, j, (sel*colWidth)+colWidth-gap, j);

    }
  } else {
    for (var j = touchDownY; j > mouseY; j--) {
  newLayer.stroke(lerpColor(from, to, mouseY / j));
      // newLayer.line(sel * colWidth, j, (sel * colWidth) + colWidth / div, j);
      newLayer.line((sel*colWidth)+gap, j, (sel*colWidth)+colWidth-gap, j);


    }
  }
}









  }



  intermedia.image(newLayer, 0, 0, width, height);


  blendMode(BLEND);
  image(paper, 0, 0, width, height);
  blendMode(MULTIPLY);
  image(intermedia, 0, 0, width, height);
  fill(255);
  blendMode(DIFFERENCE);
  textSize(width / 50);
  text("colour set " + cc, width - width / 5, height / 10);
  text("line multiplier = " + slider1.value() + "x", 10, 30);

  text("gap = " + sliderWords[slider2.value()], 10, 80);



}

function touchEnded() {
  drawActive = false;
}

function colorAlpha(aColor, alpha) {
  var c = color(aColor);
  return color('rgba(' + [red(c), green(c), blue(c), alpha].join(',') + ')');
}
