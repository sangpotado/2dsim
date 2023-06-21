
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
        train();
    }
    if (DRAW) {
        drawPoints(nnPoints.Screenpoints, [100,20,250]);
        // drawPoints(l1.Screenpoints, [255,0,0]);
        drawInfo();
    }

    // 



    // if (keyIsDown(67)) {   //key C
    //     P.rotate(0.1);

    // }
    if (keyIsDown(76)) { /// key L, learn manually
        train();
    }
}

function keyPressed() {
    if (keyCode == 65) {    //key A, create neural network with 2 layers and generate X and Y data
        
        nn = new Dann(P.Actualpoints.length, P.Actualpoints.length);
        // nn.addHiddenLayer(100, 'reLU');
        // nn.addHiddenLayer(100, 'sigmoid');
        nn.outputActivation('none');
        nn.makeWeights();
        nn.lr = 0.0001;
        nn.log({details:true});

        x = getXValues(P.Actualpoints);
        y = getYValues(P.Actualpoints);

        data = {        //training data
                input: x,
                output: y
            };

    }
    if (keyCode == 68) {    //key D
        if (TRAIN) {TRAIN=false;}   //stop training
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
    // if (keyCode == 67) {   //key C
        // fP.rotate(0.5);
    // }
    console.log("keyPressed: " + keyCode)
}


function mousePressed() {
    P.addPoints();
    nnPoints.addPoints();
}    
function mouseDragged() {
    P.addPoints();
    nnPoints.addPoints();
}
function train() {
    nn.backpropagate(data.input, data.output);  //train 
    // console.log(nn.loss);

    y = nn.feedForward(data.input,{log:true, decimals: 1}); //update y
    
    
    for (let i =0; i< y.length; i++) {  //update nnPoints so they can be drawn
        nnPoints.Actualpoints[i].y = y[i];
        nnPoints.Screenpoints[i] = convertActualToScreen(x[i], y[i], width, height, 20);
    }

    gen ++; //epoch
}