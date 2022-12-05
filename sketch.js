function setup() {
    createCanvas(1024, 717)
    // frameRate(3);
    // for (var i = 0; i < 2; ++i) {
    //     balls[i] = new ball(5,random(0,1024), random(0,500),random(-5,5), random(-5,5));
    //   }
    balls[0] = new ball(100,  600, 250, 0,0);
    // balls[1] = new ball(50, 900, 400, -2.1, 0.1);
    // timeFrame(3);
    hx.head.x = hx.x;
    hx.head.y = hx.y;

}

function draw() {
    // text("Frame Count with frameRate " + 
    // int(getFrameRate()), 250, 0);
    background(100, 200, 50);
    noStroke();
    text(`${balls.length}`, 70, 70);

    fill(0,100,0);
    rect(0,520,1024,717);
    fill(0);
    text("WASD to change ball1 speed -- ", 5, 540);
    text("X to remove ball, Mouse click to add ball, Space to slow balls", 5, 570);
    // text(balls[0].vy, 5, 580);
    // //////////

    
    for (var i=0;i<balls.length;i++) {
        drawBall(balls[i]);
        balls[i].move();
        balls[i].bounceWall();
        fill(0);
        textSize(20);
        // 
        // text(`${balls[i].vy}`, balls[i].x+10, balls[i].y+10);

        for (var j=0; j<balls.length && j != i; j++) {
            balls[i].bounce(balls[j]);
        }
    // console.log(balls[0].count);
    if (balls[i].count > 50) {
        // balls[0].vx = 0;
        // balls[0].vy = 0;
        balls[i].count = 0;
        balls[i].r = balls[i].r/2;
        balls.push(new ball(balls[i].r/2, balls[i].x+50, balls[i].y+50, 5,5));
        // balls[0].color = (random(10,250), 0 , 0);
        console.log("stopped")
    }

    }
}

function keyPressed() {
    if (keyCode == 65) {
        balls[0].vx += -10;
    }
    if (keyCode == 68) {
        balls[0].vx += 10;
    }
    if (keyCode == 87) {
        balls[0].vy += -10;
    }
    if (keyCode == 83) {
        balls[0].vy += 10;
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
    console.log("keyPressed: " + keyCode)
}

function mousePressed() {
    balls[balls.length] = new ball(50, mouseX, mouseY, 5,0)
    // balls[balls.length].g = -1;
}