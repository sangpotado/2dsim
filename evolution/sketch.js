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
    
    
    textSize(20);
    fill(0, 102, 153);
    text(`fitness: ${P.fitness}`, 10, 450);
    text(`gen:${P.generation}`, 10,475);

}

function mousePressed() {
    if (add_ob == 0) {
        ob_x = mouseX;
        ob_y = mouseY;
        add_ob += 1
    }
    else if (add_ob == 1) {
        obs.push(new Obstacle(ob_x, ob_y, mouseX-ob_x, mouseY - ob_y));
        add_ob = 0;
    }
    // console.log("mousepress: ", mouseX, mouseY);
  }

function keyPressed() {
    // console.log('keypress', keyCode);
}