let arr = [];
function setup() {

  createCanvas(window.innerWidth, window.innerHeight);




for (let i = 0; i < 10000; i++){
  let th = random(0, 2*PI);
  let x = 200 * cos(th);
  let y = 200 * sin(th);
  let tmpV = createVector(x, y);
  arr.push(tmpV);
}
pop();


}

function draw() {
  background(255);
  noFill();
  strokeWeight(1);
  stroke(20, 10);

  push();
   translate(width/2, height/2);

for (let i = 0; i < arr.length; i++){
line(0, 0, arr[i].x, arr[i].y);
}
pop();

}
