// import * as math from 'mathjs';
// const { complex } = require(['mathjs'


function setup()
{

  createCanvas(2000,1000);
  noStroke();
  // noLoop();

}

function draw()
{
  frameRate(10);
  background(0);
  // for (var i=1; i<data.length-1;i++) {
  //   fill(data[i][2]);
  //   ellipse(data[i][0], data[i][1], 1);
  // }
  // draw_mandel(sett);
  // ni+=1;
  // sett = mandelbrot_set(-2,1,-1.5,1.5,500,500, ni)
  for (var i=0; i<=hex1.length-1;i++) {
    fill(0,200,100);
    ellipse(hex1[i][0], hex1[i][1], 20)
    // var vertex1 = hex[i];
    // var vertex2 = hex[(i+1) % hex1.length];
    // line(vertex1[0],vertex2[0], vertex1[1],vertex2[1]);
  }
  hex1 = rotateHexagon(hex1, angle);
  hex1 = scaleHexagon(hex1, scl);
  
  if (scl <0.990) {
    rot = true}
  else if (scl >1.01) {rot = false};
  if (rot) {scl+=0.0005} else {scl-=0.0005};
  // console.log(scl);
  angle+=0.000001;
  if (angle > 3) {angle = 0.1;};

}