// Sand Dollar 
// j.tarbell   March, 2004
// Albuquerque, New Mexico
// complexification.net

// Processing 0085 Beta syntax update
// j.tarbell   April, 2005

// dim is the screen dimensions of rendering window
int dim = 800;
// num is the actual number of sand dollars
int num = 0;
// maxnum is the maximum number of sand dollars
int maxnum = 50;
int time;
// gtime measures rendering time in the system
int gtime;
// maxdepth keeps the tree structures reasonable
int maxdepth = 7;
// k defines number of grid spaces (n = k * k)
int k=5;
// drag is the number of segments within a full revolution
int drag = 1024;
// drawing is the state of the system.  setting to false stops all activity
boolean drawing = true;

// sandDollars is the array of sand dollar objects
SandDollar[] sandDollars;

// maxpal is the maximum number of 'good color' palette entries
int maxpal = 512;
// numpal is the actual number of 'good color' palette entries
int numpal = 0;
// goodcolor is the array of palette entries
color[] goodcolor = new color[maxpal];


// ENVIRONMENT METHODS ---------------------------

void setup() {
  // set up drawing area
  size(800,800,P3D);
  takecolor("longFar.gif");
  background(255);
  frameRate(30);

  // create sand dollars
  sandDollars = new SandDollar[maxnum];
  
  // generate sand dollars
  genAllsandDollars();
}

void draw() {
  if (drawing) {
    for (int n=0;n<num;n++) sandDollars[n].swim();
    if (gtime++>(drag*1.1)) {
      // stop drawing
      drawing = false;
      gtime=0;
    
    }
   }
}

void mousePressed() 
{ 
  if(!drawing) {
      // make new instances
    background(255);
    genAllsandDollars();
    drawing = true;
  }
} 


// METHODS ---------------------------

void genAllsandDollars() {
  // n tracks totally number of instances
  int n=0;
  // g is calculation of grid spacing
  int g=int(dim/k);
  for (int y=0;y<k;y++) {
    for (int x=0;x<k;x++) {
      // bp is number of petals
      int bp = int(random(13)+3);
      sandDollars[n] = new SandDollar(x*g+g/2,y*g+3*g/6,0,-HALF_PI,5.55,bp);
      sandDollars[n].render();
      n++;
    }
  }
  // set number of sandDollars
  num=n;
  // set rendering clock
  gtime=0;
}


// OBJECTS ---------------------------

class SandDollar {
  // feet
  int depth;
  int limbs;
  int petals;

  float time, timev, timevv;
  float x, y;
  float ox, oy;
  float radius;
  float theta, ptheta;
  

  int numsp = 1;
  int maxsp = 13;
  SandPainter[] sp = new SandPainter[maxsp];

  SandDollar[] mysandDollars = new SandDollar[2];

  SandDollar(float X, float Y, int Depth, float Theta, float Radius, int Petals) {
    // init
    ox = x = X;
    oy = y = Y;
    ptheta = Theta;
    radius = Radius;
    depth = Depth;
    petals = Petals;

    limbs = 0;
    time = 0;
    timev = petals*TWO_PI/drag;
    if (random(100)>50) timev*=-1;

    // add sweeps
    numsp = int(2+random(depth/2.0));
    for (int n=0;n<numsp;n++) {
      sp[n] = new SandPainter();
    }
  }

  void render() {
    theta = random(-HALF_PI/3,HALF_PI/3);
    radius *= random(1.02,1.20);

    // set next radial point
    x = ox + radius*cos(theta);
    y = oy + radius*sin(theta);

    if (depth<maxdepth) {
      int lnum=1;
      if (random(100)>90-depth) lnum++;
      for (int n=0;n<lnum;n++) {
        int bp = petals * int(1+random(3));
        mysandDollars[n] = new SandDollar(x,y,depth+1,theta,radius,bp);
        mysandDollars[n].render();
        limbs++;
      }
    }
  }

  void swim() {
    // move through time
    time+=timev;

    // spin in sinusoidal waves
    if (depth==0) {
      theta += TWO_PI/drag;
    } else {
      theta += sin(time)/1640;
      if (depth%2==0) { 
        radius += sin(time)*0.22;
      } else {
        radius += cos(time)*0.22;
      }
    }

    // set next radius point
    x = ox + radius*cos(theta+ptheta);
    y = oy + radius*sin(theta+ptheta);
    
    // render sand painters
    for (int n=0;n<numsp;n++) {
      sp[n].render(x,y,ox,oy);
    }

    // draw child limbs
    for (int n=0;n<limbs;n++) {
      mysandDollars[n].setOrigin(x,y,theta+ptheta);
      mysandDollars[n].swim();
    }
  }

  void setOrigin(float X, float Y, float Theta) {
    ox = X;
    oy = Y;
    ptheta = Theta;
  }

}

class SandPainter {

  float p;
  color c;
  float g;

  SandPainter() {

    p = random(1.0);
    c = somecolor();
    g = random(0.01,0.1);
  }

  void render(float x, float y, float ox, float oy) {
    // draw painting sweeps
    stroke(red(c),green(c),blue(c),22);
    point(ox+(x-ox)*sin(p),oy+(y-oy)*sin(p));

    g+=random(-0.050,0.050);
    float maxg = 0.22;
    if (g<-maxg) g=-maxg;
    if (g>maxg) g=maxg;

    int grains = 6;
    float w = g/(grains*1.0);
    for (int i=0;i<grains+1;i++) {
      float a = 0.1-i/((grains+1)*10);
      stroke(red(c),green(c),blue(c),256*a);
      point(ox+(x-ox)*sin(p + sin(i*w)),oy+(y-oy)*sin(p + sin(i*w)));
      point(ox+(x-ox)*sin(p - sin(i*w)),oy+(y-oy)*sin(p - sin(i*w)));
    }
  }
}

// COLOR METHODS -----------------------------------------------

color somecolor() {
  // pick some random good color
  return goodcolor[int(random(numpal))];
}

void takecolor(String fn) {
  PImage b;
  b = loadImage(fn);
  image(b,0,0);

  for (int x=0;x<b.width;x++){
    for (int y=0;y<b.height;y++) {
      color c = get(x,y);
      boolean exists = false;
      for (int n=0;n<numpal;n++) {
        if (c==goodcolor[n]) {
          exists = true;
          break;
        }
      }
      if (!exists) {
        // add color to pal
        if (numpal<maxpal) {
          goodcolor[numpal] = c;
          numpal++;
        } else {
          break;
        }
      }
    }
  }
  
  // pad with whites
  for (int n=0;n<64;n++) {
    goodcolor[numpal] = #FFFFFF;
    numpal++;
  }

  // pad with blacks
  for (int n=0;n<100;n++) {
    goodcolor[numpal] = #000000;
    numpal++;
  }
}

// j.tarbell   March, 2004
// Albuquerque, New Mexico
// complexification.net
