var bgcolor;

function setup()
{
createCanvas(200,200);
createP("My favourite colour is");
createElement('h1')
bgcolor = color(200);
createBurron("gogogogo");
}

function mousePressed() {
  bgcolor = color(random(255));
}

function draw()
{
background(bgcolor);
fill(255, 0, 0);
rect(100,100,50,50);
}
