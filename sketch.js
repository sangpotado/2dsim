function setup() {
    createCanvas(1024, 517)
    for (var i = 0; i < 50; ++i) {
        balls[i] = new ball(5,random(0,1024), random(0,500),random(-5,5), random(-5,5));
      }
    balls[0] = new ball(100,  110, 400, 10,0);
    // balls[1] = new ball(50, 900, 400, -2.1, 0.1);

}

function draw() {

    background(100, 200, 50);
    noStroke();

    for (var i=0;i<balls.length;i++) {
        drawBall(balls[i]);
        balls[i].move();
        balls[i].bounceWall();
        fill(0);
        textSize(20);
        // text(`${balls[i].vx}`, balls[i].x-5, balls[i].y-5);
        // text(`${balls[i].vy}`, balls[i].x+10, balls[i].y+10);

        for (var j=0; j<balls.length && j != i; j++) {
            balls[i].bounce(balls[j]);
        }
    // console.log(balls[0].count);
    if (balls[0].count > 50) {
        // balls[0].vx = 0;
        // balls[0].vy = 0;
        balls[0].count = 0;
        balls[0].r = balls[0].r/2;
        balls.push(new ball(balls[0].r/2, balls[0].x+50, balls[0].y+50, 5,5));
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
        balls[0].vy += -10;
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
    // console.log("keyPressed: " + keyCode)
}
function mousePressed() {
    balls[balls.length] = new ball(20, mouseX, mouseY, 0,0)
}