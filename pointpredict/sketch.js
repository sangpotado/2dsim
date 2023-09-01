
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
    if (keyIsDown(80)) {predict();} //key P
}

function keyPressed() {
    if (keyCode == 65) {    //key A, create neural network with 2 layers and generate X and Y and dataset
        
        // n_inputs = P.Actualpoints.length -2;

        nn = new Dann(n_inputs, 2);
        // nn.addHiddenLayer(100, 'softsign');  //softsign
        // nn.addHiddenLayer(100, 'none');
        // nn.addHiddenLayer(100, 'softsign');
        // nn.addHiddenLayer(100, 'none');
        nn.outputActivation('none');
        nn.makeWeights();
        nn.lr = 0.0001;
        nn.log({details:true});

        x = getXValues(P.Actualpoints);
        y = getYValues(P.Actualpoints);

        dataset = generateDataset(x,y, n_inputs);

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
    if (keyCode == 78) {    //key N
        P.generatePoints(width, height, 20);
    }
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

    let sum = 0;
    for (data of dataset) {
        nn.backpropagate(data.input,data.target);
        sum += nn.loss;
        // if (nn.loss >5) {
        //     console.log(nn.loss);
        // }
    }
    avgLoss = sum/dataset.length;
    // console.log('avg loss: ', avgLoss);
    gen ++; //epoch
}

function predict() {
    x = getXValues(P.Actualpoints); //update x as new points were added
    var xx = x.slice(x.length- n_inputs - 1, x.length -1);
    var actual_predict = nn.feedForward(xx,{log:true, decimals: 1});
    var screen_predict = convertActualToScreen(actual_predict[0], actual_predict[1], 1024, 512, 20);
    P.addPoints(screen_predict.x, screen_predict.y);
    console.log(xx, actual_predict );
}