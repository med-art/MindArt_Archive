// distance vector calculator
let smoothDist = [0, 0, 0, 0, 0];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
let velocity = 0;

let x = 100,
  y = 100,
  dragLength = 3,
  angle1 = 0;
let vec = [];

let axis;

let dragTracker = 0;

let poleArr = [];

function preload() {


}

function setup() {

  createCanvas(window.innerWidth, window.innerHeight);


  // vector array used to store points, this will max out at 100
  resetVectorStore();

  // create Start and End vectors
  let v1 = createVector((width/2)+random(-width/4, width/4), height/2+random(-height/4, height/4));
  let v2 = createVector((width/2)+random(-width/4, width/4), height/2+random(-height/10, height/10));
  let d = (p5.Vector.dist(v1, v2))/2;

    // create equal 10 points along that measure
  for (let i = 0; i < d; i++){
    let tmp = p5.Vector.lerp(v1, v2, i/d)
    poleArr.push(tmp);
  }

  // beginShape();
  // for (let i = 0; i < poleArr.length; i++){
  // vertex(poleArr[i].x, poleArr[i].y);
  // }
  // endShape();

}

function touchEnded() {
  resetVectorStore();
}

function resetVectorStore() {
  for (let i = 0; i < 1000; i++) {
    vec[i] = 0;
  }
}

function touchStarted(){
  dragTracker = 0;
  stroke(random(0,255), random(0,255), random(0,255));
  axis = createVector(mouseX, mouseY);
}

function touchMoved() {
  // background(255);

  // push();
  // // translate(width/2, height/2);
  // translate(axis.x, axis.y)
  // rotate(dragTracker++/100);
  // translate(-axis.x, -axis.y)
  // line(poleArr[0].x, poleArr[0].y, poleArr[poleArr.length-1].x, poleArr[poleArr.length-1].y)
  // pop();
  //
  calcDynamics();

blendMode(DIFFERENCE);
   brush_rake(x, y, x2, y2, angle1, 260, 500, 100, 0.1); // x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise



  render();
}

function render() {


}

function calcDynamics() {

  // calculate the distance between mouse position, and previous position. Average the previous
  let d = dist(mouseX, mouseY, pmouseX, pmouseY);
  smoothDist.shift();
  smoothDist.push(d);
  velocity = smoothDist.reduce(reducer) / smoothDist.length;


  // calculate mouseDirection
  let dx = mouseX - x;
  let dy = mouseY - y;

  angle1 = atan2(dy, dx);
  x = (mouseX) - cos(angle1) * dragLength;
  x2 = (100) - cos(PI / 2) * 1;
  y = (mouseY) - sin(angle1) * dragLength;
  y2 = (100) - sin(PI / 2) * 1;

}








function brush_rake(x, y, x2, y2, angle, qtyOfLines, brushWidth, opacity, noise) {

  strokeW = ceil(brushWidth / qtyOfLines);
  strokeWeight(strokeW);

  var a = createVector(x, y);
  var b = createVector(0, brushWidth / 2);
  b.rotate(angle);
  var c = p5.Vector.add(a, b);
  a.sub(b);

  for (var i = 0; i < qtyOfLines; i++) {
    // cool
    // d = p5.Vector.lerp(a, c, (i/qtyOfLines)*random(0,1));

    d = p5.Vector.lerp(a, c, (i / (qtyOfLines + 1)) + randomGaussian(0, (1 / qtyOfLines) * noise));


    if (i === 0 || i === vec.length - 1 || (i % 3) === 2) { // if first line, last line or every 3rd line, then thin, else fat
      strokeWeight(strokeW / 2);
    } else {
      strokeWeight(strokeW);
    }

    var n = vec[i];





    line(vec[i].x, vec[i].y, d.x, d.y);
    vec[i] = d;
  }
  // display();
}
