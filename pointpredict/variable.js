// draw the grid line, take width, height, and number of units
var drawgrid = function(w, h, u) {
    let unit = w/u;
    
    let center = {x:w/2, y: h/2};
    let x = 0;
    let y = 0;

    stroke(150,200,150);
    ellipse(center.x, center.y, 5);
    for (let i=0; i<u/2; i++) {
        x1 = center.x + i*unit;
        y1 = center.y + i*unit;
        line(x1, 0, x1, h);
        line(0, y1, w, y1);

        x2 = center.x - i*unit;
        y2 = center.y - i*unit;
        line(x2, 0, x2, h);
        line(0, y2, w, y2);
    }
}

//convert position on screen to a new coordinate
var convertScreenToActual = function(x, y, w, h, u) {
    let unit = w/u;
    let center = {x:w/2, y:h/2};
    let newX = (x - center.x)/unit;
    let newY = -(y - center.y)/unit;
    return {x:newX, y:newY}
}

var convertActualToScreen = function(x, y, w, h, u) {
    let unit = w/u;
    let center = {x:w/2, y:h/2};
    let newX = x*unit + center.x;
    let newY = -y*unit + center.y;
    return {x:newX, y: newY}
}

var findSlope = function(x1, y1, x2, y2) {
    let slope = (y2-y1)/(x2-x1);
    let c = y1 - x1*slope;
    return {m: slope, c: c}
}

//draw a function
var drawTangent = function(P, w,h, u) {

    fill(200);

    for (let i=0; i< P.Screenpoints.length-1; i++) {
        // ellipse(P.Screenpoints[i].x, P.Screenpoints[i].y, 5);

        if (Math.abs(mouseX - P.Screenpoints[i].x) < 0.5) {
    
            let tangentLine = findSlope(P.Actualpoints[i].x,P.Actualpoints[i].y,P.Actualpoints[i+1].x,P.Actualpoints[i+1].y);
       
            let x1 = P.Actualpoints[i].x - 3;
            let y1 = x1*tangentLine.m + tangentLine.c;
            let p1 = convertActualToScreen(x1,y1,w,h,u);


            let x2 = P.Actualpoints[i].x + 3;
            let y2 = x2*tangentLine.m + tangentLine.c;
            let p2 = convertActualToScreen(x2,y2,w,h,u);

             //draw tangent line with pointsActuall
            push();
            strokeWeight(3);
            stroke(0,100,200);
            line(p1.x, p1.y, p2.x, p2.y);
            text(`${tangentLine.m.toFixed(2)}`, mouseX, P.Screenpoints[i].y - 10);
            pop();
        }
     };
}
   
//draw Learn point
var drawLearn = function(x,y) {
    fill(150,50,20);
    for (let i=0; i< x.length; i++) {
        ellipse(x[i],y[i],10);
    }
}
//find index for Actualpoints x
var findIndex = function(value, a) {
    for (let i=0;i<a.length;i++) {
        if (Math.abs(a[i].x- value) <=0.1) {
            // console.log(`find index i = ${i}`)
            return i
        }
    }
}


// drag mouse to add points and draw this
var drawPoints = function(points, color) {
    push();
    fill(color[0], color[1], color[2],70);
    points.forEach(function(p) {
        ellipse(p.x, p.y, 5)
        });
    pop();
}

//show location of the mouse, according to the actual coordinate
var drawMouse = function(w, h,u) {
    let p = convertScreenToActual(mouseX, mouseY, w,h, u);
    ellipse(mouseX, mouseY, 10);
    text(`${p.x.toFixed(2)}  ${p.y.toFixed(2)}`, mouseX -h/u, mouseY +h/u)
}


function getXValues(points) {
    return points.map(point => point.x);
}
function getYValues(points) {
    return points.map(point => point.y);
}

class Points {
    constructor() {
        this.Screenpoints = [];
        this.Actualpoints = [];
        this.learnX = -5 + Math.random()*10;
        this.learnP = {x:0, y:0};
    }

    addPoints(xx, yy) {
        let p = {x:xx, y:yy};
        this.Screenpoints.push(p);
        let p2 = convertScreenToActual(p.x, p.y, width, height, 20);
        this.Actualpoints.push(p2);
    }

    generatePoints(w,h,u) {
        for (let x=-5; x<0; x+= 0.02) {   //edit this to change the number of points drawn
            let y = Math.sin(x*3);   //edit this to change the function
            this.Actualpoints.push({x:x,y:y});
        
            let point = convertActualToScreen(x,y,w,h,u);
            this.Screenpoints.push(point);

        }
    }
}

function drawInfo() {
    push();
    fill(50,240,80);
    
    if (nn.loss<0.0001) {TRAIN=false;}

    text(`generation: ${gen}  // loss: ${avgLoss}`, 5, 450);
}

var P = new Points;

var DRAW = false;
var TRAIN = false;
// var PREDICT_MODE = false;
var nn; //neural net
var dataset;
var n_inputs = 1; //number of inputs to nn
var x;
var y;
var gen = 0;
var avgLoss = 0

Add.activation('none',
  (x) => {
    return x;
  },
  (x) => {
    return 1;
  }
);

function generateDataset(x, y, u) {
    // x = [], y = [], u is how many x read per data
    var dataset = [];
  
    // Iterate until x.length - (u+1) to ensure enough elements for input and target
    for (var i = 0; i <= x.length - (u+1); i++) {
      var input = x.slice(i, i + u); // Get the next 10 elements from x
      var target = [x[i + u], y[i + u]]; // Get the corresponding elements from x and y as an array
  
      dataset.push({ input: input, target: target });
    }
  
    return dataset;
  }
  