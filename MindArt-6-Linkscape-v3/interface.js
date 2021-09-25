let newButton, saveButton, fsButton;
let appBg = '#1f2b45';

let button1, button2;
var node;

let vW, vMax, vMin;
let multiselectable = 1;

let dotsActive = 0;


function calcDimensions() {
  vW = width / 100;

  if (width > height) {
    vMax = width / 100;
    vMin = height / 100;
  } else {
    vMax = height / 100;
    vMin = width / 100;
  }

      lineCanv.strokeWeight(2.2*vMax);
}


function writeTextUI(){

  $(".select").remove();
    $(".select2").remove();

  newButton = createButton("New")
  newButton.class("select");
  newButton.style('font-size', '1.7vmax');
  newButton.style('height', '5vmax');
  newButton.style('backgroundColor', '#e3a19d');
  newButton.style('color', 'black');
  newButton.position(width - (16 * vMax), height - (7 * vMax));
  newButton.mousePressed(reset);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);


  pinButton = createButton("  Turn pins on")
  pinButton.class("select2");
  pinButton.id("pin");
  pinButton.style('font-size', '1.7vmax');
  pinButton.style('height', '5vmax');
  pinButton.style('width', '18vmax');
  pinButton.position((3 * vMax), height - (7 * vMax));
  pinButton.mousePressed(dotsToggle);
  node = document.createElement("LI")
  node.classList.add("fa");
  node.classList.add("fa-map-pin");
  $('#pin').prepend(node);

  addButton = createButton("  Add a string")
  addButton.class("select2");
    addButton.id("add");
  addButton.style('font-size', '1.7vmax');
  addButton.style('width', '20vmax');
  addButton.style('height', '5vmax');
  addButton.position(22 * vMax, height - (7 * vMax));
  addButton.mousePressed(addLine);

  var node2 = document.createElement("LI")
  node2.classList.add("fa");
  node2.classList.add("fa-plus");
  $('#add').prepend(node2);



}



function dotsToggle(){
  dotsActive = !dotsActive;

  if (dotsActive){
  $('#pin').html("  Turn pins off");
  $('#pin').removeClass("select2");
  $('#pin').addClass("selectActive");
} else {
  $('#pin').html("  Turn pins on");
  $('#pin').addClass("select2");
  $('#pin').removeClass("selectActive");
}

$('#pin').prepend(node);



 render();
}

function addLine(){
initialiseLine(x.length); // init new line, new array
if (x.length > 3){
  $("#add").remove();
}
render();
}



function saveImg() {
  click.play();

save('stringscape' + month() + day() + hour() + second() + '.jpg');
}


function checkFS(){
  if (!fullscreen()){
  addFS();
}
}

function addFS(){
  $('.fsButton').remove();
  fsButton = createImg('assets/enterFS.png', "FULLSCREEN");
  fsButton.style('height', '4.5vMax');
  fsButton.class("fsButton");
  fsButton.position(width - (7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);
}

function fs(){
  fullscreen(1);
  $('.fsButton').remove();
}
