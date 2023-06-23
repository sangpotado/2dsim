
function setup() {
    var width = 1024;
    var height = 512;
    createCanvas(width, height)

}

function draw() {
    background(0);

    drawgrid(width, height, 20)

    drawMouse(width,height, 20)

    // drawTangent(P, width, height, 20);

    drawPoints(P.Screenpoints, [250,40,150]);


    if (TRAIN) { 
        train();
    }
    if (DRAW) {
        drawInfo();
    }

    // if (keyIsDown(76)) { /// key L, learn manually
    //     train();
    // }
}

function keyPressed() {
    if (keyCode == 65) {    //key A, create neural network with 2 layers and generate X and Y and dataset
        
        nn = new Dann(10, 2);
        nn.addHiddenLayer(20, 'softsign');
        nn.addHiddenLayer(20, 'none');
        nn.outputActivation('none');
        nn.makeWeights();
        nn.lr = 0.0001;
        nn.log({details:true});

        x = getXValues(P.Actualpoints);
        y = getYValues(P.Actualpoints);

        dataset = generateDataset(x,y);

    }
    if (keyCode == 68) {    //key D
        if (TRAIN) {TRAIN=false;}   //stop training
    }
    if (keyCode == 80) {    //key P
        predict();
    }
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
        train();

    }
    console.log("keyPressed: " + keyCode)
}


function mousePressed() {
    P.addPoints(mouseX, mouseY);
}    
function mouseDragged() {
    P.addPoints(mouseX, mouseY);
}
function train() {
    for (data of dataset) {
        nn.backpropagate(data.input,data.target);
        if (nn.loss < 1) {break;}
        console.log(nn.loss);
    }

    // y = nn.feedForward(data.input,{log:true, decimals: 1}); //update y
    gen ++; //epoch
}

function predict() {
    x = getXValues(P.Actualpoints);
    var xx = x.slice(x.length-11, x.length-1);
    var actual_predict = nn.feedForward(xx,{log:false, decimals: 1});
    var screen_predict = convertActualToScreen(actual_predict[0], actual_predict[1], 1024, 512, 20);
    P.addPoints(screen_predict.x, screen_predict.y);
    console.log(xx, screen_predict, actual_predict );
}