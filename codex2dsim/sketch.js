function setup() {
    createCanvas(1024, 717)
    // frameRate(20);
    for (let i = 0; i < 2; i++) {
        balls[i] = new Particle(random(0, screen1.x), random(0, screen1.y), random(-1, 1), random(-1,1), 3);
    }
    balls[0] = new Particle(400,300,0,0, 20);
}

function draw() {
    background(100, 200, 50);
    noStroke();
    text(`${balls.length}`, 70, 70);

    fill(0,100,0);
    rect(0,520,1024,717);
    fill(0);
    text("WASD to change ball1 speed -- ", 5, 540);
    text("X to remove ball, Mouse click to add ball, Space to slow balls", 5, 570);
    text("G to activate Gravity " + G, 5, 590);
    // text(balls[0].vy, 5, 580);
    // //////////

    
    for (var i=0;i<balls.length;i++) {
        drawBall(balls[i]);
        balls[i].move(3);
        balls[i].bounceWall(screen1.x,screen1.y);
        fill(0);
        textSize(20);
        // 
        // text(`${balls[i].vy}`, balls[i].x+10, balls[i].y+10);

        for (var j=0; j<balls.length && j != i; j++) {
            balls[i].bounce(balls[j]);
            if (G==true) {balls[i].gravity(balls[j])};
        }
        // if (balls[i].count > 20) {
        //         // balls[0].vx = 0;
        //         // balls[0].vy = 0;
        //         balls[i].count = 0;
        //         balls[i].mass = balls[i].mass/2;
        //         balls.push(new Particle(balls[i].x+100, balls[i].y+100, 0, 0, balls[i].mass/2));
        //         // balls[0].color = (random(10,250), 0 , 0);
        //         console.log("stopped")
    
        // }
    // console.log(balls[0].count)

    }
}

var G = false;

function keyPressed() {
    if (keyCode == 65) {
        balls[0].applyForce({x:-1,y:0})
    }
    if (keyCode == 68) {
        balls[0].applyForce({x:1,y:0});
    }
    if (keyCode == 87) {
        balls[0].applyForce({x:0,y:-1});
    }
    if (keyCode == 83) {
        balls[0].applyForce({x:0,y:1});
    }
    if (keyCode == 32) {
        for (var j=0; j<balls.length; j++) {
            balls[j].vx = balls[j].vx/10;
            balls[j].vy = balls[j].vy/10;
        }
    }
    if (keyCode == 67) {
        console.log(balls[0].count);
    }
    if (keyCode == 88) {
        balls.pop();
    }
    if (keyCode == 71)  {
        if (G==true) {G=false}
        else {G=true}
    
    }
    console.log("keyPressed: " + keyCode)
}

function mousePressed() {
    balls[balls.length] = new Particle(mouseX, mouseY, 0,0,3)
    // balls[balls.length].g = -1;
}