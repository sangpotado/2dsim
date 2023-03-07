
function setup() {
    var width = 1024;
    var height = 512;
    createCanvas(width, height)

}

function draw() {
    background(0);

    drawgrid(width, height, 20)

    drawMouse(width,height, 20)

    drawTangent(P, width, height, 20);

    drawPoints(P.Screenpoints, [250,40,150]);


    if (TRAIN) { 
        train()
    }
    if (DRAW) {
        drawPoints(l2.Screenpoints, [100,20,250]);
        drawPoints(l1.Screenpoints, [255,0,0]);
        drawInfo();
    }

    // drawLearn(fP.learnP.x,fP.learnP.y);



    if (keyIsDown(67)) {   //key C
        P.rotate(0.1);

    }
    if (keyIsDown(76)) { /// key L, learn manually
        train()
    }
}

function keyPressed() {
    if (keyCode == 65) {    //key A, create neural network with 2 layers and generate X and Y data
        l1 = new Layer(P.Actualpoints.length,100);
        l2 = new Layer(100,P.Actualpoints.length);
        x = getXValues(P.Actualpoints);
        y = getYValues(P.Actualpoints);
   
        console.log("layer1 and 2 created, collected X and Y")
    }
    if (keyCode == 68) {    //key D
        if (TRAIN) {TRAIN=false;}
    }
//     if (keyCode == 87) {

//     }
    if (keyCode == 83) {     //key S
        TRAIN = true;
        DRAW = true;
    }
//     if (keyCode == 32) {

//     }
//     if (keyCode == 67) {
//
//     }
//     if (keyCode == 88) {
//
//     }
//     if (keyCode == 90) {

//     }
    if (keyCode == 76) {   //key L

        DRAW = true;

    }
    if (keyCode == 67) {   //key C
        fP.rotate(0.5);
    }
    console.log("keyPressed: " + keyCode)
}


function mousePressed() {
    P.addPoints();
}    
function mouseDragged() {
    P.addPoints();
}
function train() {
    l1.forward(x);
    l2.forward(l1.activated_z);
    l2.backprop_last(y);
    l1.backprop(l2);
    l1.learn(0.1);
    l2.learn(0.1);

    l2.generatePoints(x);
    l1.generatePoints(x);
}