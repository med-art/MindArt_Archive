let newButton, saveButton, fsButton;
let appBg = '#1f2b45';

let button1, button2;

let vW, vMax, vMin;
let multiselectable = 0;


function calcDimensions() {
  vW = width / 100;

  if (width > height) {
    vMax = width / 100;
    vMin = height / 100;
  } else {
    vMax = height / 100;
    vMin = width / 100;
  }
}


function saveNext(){

  newButton = createButton("Remettre")
  newButton.class("select");
  newButton.style('font-size', '1.7vmax');
  newButton.style('height', '5vmax');
  newButton.position(width - (16 * vMax), height - (7 * vMax));
  newButton.mousePressed(reset);

  saveButton = createButton("Sauvegardez")
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);





  fsButton = createImg('assets/enterFS.png');
  fsButton.style('height', '4.5vMax');
  fsButton.position(width-(7.5 * vMax), 1.5 * vMax);
  fsButton.mousePressed(fs);

  button1 = createImg('assets/icon1.0.png');
  button1.remove();
  button1 = createImg('assets/icon1.1.png');
  button1.style('width', '16vmax');
  button1.position(3 * vMax, height - (10 * vMax));
  button1.mousePressed(switcher);

  button2 = createImg('assets/icon2.1.png');
  button2.remove();
  button2 = createImg('assets/icon2.0.png');
  button2.style('width', '16vmax');
  button2.position(19 * vMax, height - (10 * vMax));
  button2.mousePressed(switcher);



}

function switcher(){
  click.play();
  multiselectable = !multiselectable;


  if (!multiselectable){

    button1.remove();
    button1 = createImg('assets/icon1.1.png');
    button1.style('width', '16vmax');
    button1.position(3 * vMax, height - (10 * vMax));
    button1.mousePressed(switcher);


    button2.remove();
    button2 = createImg('assets/icon2.0.png');
    button2.style('width', '16vmax');
    button2.position(19 * vMax, height - (10 * vMax));
    button2.mousePressed(switcher);

      segLength =7;

  }

  else {

    button1.remove();
    button1 = createImg('assets/icon1.0.png');
    button1.style('width', '16vmax');
    button1.position(3 * vMax, height - (10 * vMax));
    button1.mousePressed(switcher);


    button2.remove();
    button2 = createImg('assets/icon2.1.png');
    button2.style('width', '16vmax');
    button2.position(19 * vMax, height - (10 * vMax));
    button2.mousePressed(switcher);

      segLength = 10;

  }




}

function fs(){
  click.play();
  let fs = fullscreen();
 fullscreen(!fs);
}

function reset(){
  click.play();


initialiseLine();
drawActive = 1;
displayCurrent();

}


function saveImg() {
  click.play();

save('stringscape' + month() + day() + hour() + second() + '.jpg');
}
