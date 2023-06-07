function setup() {
    createCanvas(1024,512);
    // frameRate(10);
}

function draw() {
    background(100, 200, 50);
    fill(0);
    ellipse(900, 256, 30,30);
    P.drawPopulation();
    P.update();
    if (!P.alive && P.fitness > 5) { // 
        P.reset();
    }
}