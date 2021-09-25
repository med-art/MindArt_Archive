function setup() {
  createCanvas(window.innerWidth, window.innerHeight);

  canvas.addEventListener('touchmove', moved);
  canvas.addEventListener('mousemove', moved);
  canvas.addEventListener('touchstart', touchdown);
  canvas.addEventListener('mousedown', touchdown);
  canvas.addEventListener('touchend', touchstop);
  canvas.addEventListener('touchleave', touchstop);
  canvas.addEventListener('mouseup', touchstop);
}

function moved(){
  ellipse(mouseX,mouseY,100,100);
}
