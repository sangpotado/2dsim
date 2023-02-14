
function setup() {
    var width = 1024;
    var height = 512;
    createCanvas(width, height)

}

function draw() {
    background(0);

    drawgrid(width, height, 20)

    drawMouse(width,height, 20)

    // drawTangent(fP, width, height, 20);

    drawPoints(P.Screenpoints, [250,40,150]);

    if (Dlayer1) { 
        layer1.forward(X);
        // layer1.sigmoid();

        // layer2.forward(layer1.output);

        // layer2.CalculateLoss(Y);
        // layer2.learn(0.1,X);

        layer1.CalculateLoss(Y);
        layer1.learn(0.05,X);

        layer1.generatePoints(X);
        drawPoints(layer1.Screenpoints, [100,20,250]);
        drawInfo();
        // if (layer1.TotalLoss <= 0.01 ) {Dlayer1 = false};
    }

    // drawLearn(fP.learnP.x,fP.learnP.y);



    if (keyIsDown(67)) {   //key C
        P.rotate(0.1);

    }
    if (keyIsDown(76)) { /// key L
        layer1.forward(X);
        // layer1.sigmoid();

        // layer2.forward(layer1.output);

        // layer2.CalculateLoss(Y);
        // layer2.learn(0.1,X);

        layer1.CalculateLoss(Y);
        layer1.learn(0.05,X);

        layer1.generatePoints(X);
        drawPoints(layer1.Screenpoints, [100,20,250]);
        drawInfo();
        // if (layer1.TotalLoss <= 0.01) {Dlayer1 = false};
    }
}

function keyPressed() {
    if (keyCode == 65) {    //key A
        layer1 = new Layer(P.Actualpoints.length,P.Actualpoints.length);
        layer2 = new Layer(P.Actualpoints.length,P.Actualpoints.length);
        X = getXValues(P.Actualpoints);
        Y = getYValues(P.Actualpoints);
        layer1.forward(X);

        // layer2 = new Layer(P.Actualpoints.length,P.Actualpoints.length);
        console.log("layer1 and 2 created, collected X and Y")
    }
    if (keyCode == 68) {    //key D
        layer1.forward(X);
        console.log(layer1.output[1]);
        // layer1.ReLu();
        // layer2.forward(layer1.output);
    }
//     if (keyCode == 87) {
//         balls[0].vy += -10;
//     }
    if (keyCode == 83) {     //key S
        layer1.generatePoints(X);
        Dlayer1 = true;
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
        layer1.forward(X);
        // layer1.ReLu();

        // layer2.forward(layer1.output);

        layer1.CalculateLoss(Y);
        layer1.learn(0.001,X);

       
        // layer2.CalculateLoss(Y);
        // layer2.learn(0.01,X);

        layer1.generatePoints(X);
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