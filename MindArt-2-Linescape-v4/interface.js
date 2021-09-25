let resetButton, saveButton, fsButton, toggleBut;

function calcDimensions() {
  if (width > height) {
    vMax = width / 100;
  } else {
    vMax = height / 100;
  }
}

function writeTextUI() {

  // TODO: REMOVE ELEMENTS

$(".interface").remove();
$(".select").remove();



  resetButton = createButton('New');
  resetButton.position(windowWidth - (10 * vMax) - (vMax * 5), windowHeight - vMax * 6);
  resetButton.class("select");
  resetButton.style('font-size', '1.7vmax');
  resetButton.style('height', '5vmax');
  resetButton.position(width - (16 * vMax), height - (7 * vMax));
  resetButton.mousePressed(restart);

  saveButton = createButton("Save")
  saveButton.class("select");
  saveButton.style('font-size', '1.7vmax');
  saveButton.style('height', '5vmax');
  saveButton.position(width - (16 * vMax), height - (13 * vMax));
  saveButton.mousePressed(saveImg);

createSwatch();
}

function createSwatch() {

  $(".box").remove();
  $(".toggle").remove();

  swatch = [];
  for (let i = 0; i < 2; i++) {
    swatch[i] = createButton("");
    swatch[i].position(((i * 7)) * vMax, height - (6 * vMax));
    swatch[i].size(7 * vMax, 10.5 * vMax);
    swatch[i].style("background-color", colours[cc][i*2]);
        swatch[i].style("border-width", '6px');
            swatch[i].style("border-color", colours[cc][1+(i*2)]);
    swatch[i].class("box");
    swatch[i].id("swatch" + i);
    swatch[i].mousePressed(function() {
     toggleIt();
    });


  }

  toggleBut = createButton('Change Colours');
  toggleBut.mouseClicked(toggleIt);
  toggleBut.class("toggle");
  toggleBut.id("ui4");
  toggleBut.position(3*vMax, height - (6 * vMax));
  toggleBut.style('width', '18vmax')
  toggleBut.style('font-size', '1.5vmax');
  toggleBut.style('height', '4vmax');

      toggleIt();

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

function saveImg() {
  click.play();
  save('touchscape' + month() + day() + hour() + second() + '.jpg');
}
