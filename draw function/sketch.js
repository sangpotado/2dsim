
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
        l1.forward(x);
        l2.forward(l1.activated_z);
        l2.backprop_last(l1.activated_z, y)
        l1.backprop(l2);
        l1.learn(0.1);
        l2.learn(0.1);

        l2.generatePoints(x);
    }
    if (DRAW) {
        drawPoints(l2.Screenpoints, [100,20,250]);
        drawInfo();
    }

    // drawLearn(fP.learnP.x,fP.learnP.y);



    if (keyIsDown(67)) {   //key C
        P.rotate(0.1);

    }
    if (keyIsDown(76)) { /// key L, learn manually
        l1.forward(x);
        l2.forward(l1.activated_z);
        l2.backprop_last(l1.activated_z, y)
        l1.backprop(l2);
        l1.learn(0.1);
        l2.learn(0.1);

        l2.generatePoints(x);
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
        // layer1.forward(X);
        // console.log(layer1.output[1]);
        // // layer1.ReLu();
        // // layer2.forward(layer1.output);
        if (TRAIN) {TRAIN=false;}
    }
//     if (keyCode == 87) {
//         balls[0].vy += -10;
//     }
    if (keyCode == 83) {     //key S
        TRAIN = true;
        DRAW = true;
    }
//     if (keyCode == 32) {

//     }
//     if (keyCode == 67) {
//         console.log(balls[0].count);
//     }
//     if (keyCode == 88) {
//         balls.pop();
//     }
//     if (keyCode == 90) {
//         if (makeArt) {makeArt = false}
//         else {makeArt = true}
//     }
    if (keyCode == 76) {   //key L
        l1.forward(x);
        l2.forward(l1.activated_z);
        l2.backprop_last(l1.activated_z, y)
        l1.backprop(l2);
        l1.learn(0.1);
        l2.learn(0.1);

        l2.generatePoints(x);
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