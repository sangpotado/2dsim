class ball {
    constructor(r, x, y, vx, vy) {
      this.r = r;
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.mass = this.r/10;
      this.color = (20,220,100);
      this.count = 0;
    }

    move() {
        this.x += this.vx;
        this.y += this.vy;
    }
    bounce(other_ball) {
        // momentum formula
        if ((Math.abs(this.x - other_ball.x) <= this.r && (Math.abs(this.y - other_ball.y) <= this.r) || (Math.abs(this.x - other_ball.x) <= other_ball.r/2 && (Math.abs(this.y - other_ball.y) <= other_ball.r/2) ))) {
            let temp_x = this.vx;
            this.vx = (this.mass - other_ball.mass)/(this.mass + other_ball.mass)*this.vx + (2*other_ball.mass)/(this.mass+ other_ball.mass)*  other_ball.vx ;
            other_ball.vx = (other_ball.mass -this.mass)/(this.mass + other_ball.mass)*other_ball.vx + (2*this.mass)/(this.mass+ other_ball.mass)* temp_x ;
            this.count += 1;

            // console.log("bounce ", this.count);

            let temp_y = this.vy;
            this.vy = (this.mass - other_ball.mass)/(this.mass + other_ball.mass)*this.vy + (2*other_ball.mass)/(this.mass+ other_ball.mass)*  other_ball.vy ;
            other_ball.vy = (other_ball.mass - this.mass)/(this.mass + other_ball.mass)*other_ball.vy + (2*this.mass)/(this.mass+ other_ball.mass)*temp_y;
            other_ball.count += 1;
            this.color = (Math.random()*255,Math.random()*255,Math.random()*255);
        }
    }

    bounceWall() {
        if (this.x >= 1024 || this.x <= 0) {
            this.vx = -this.vx;
        }
        if (this.y >= 510 || this.y <= 0) {
            this.vy = -this.vy;
        }
    }

    split() {
        if (this.count > 100) {
            ball_1 = constructor(this.r/2, this.x+15, this.y+15, 1,1);
            // ball_2 = new ball (this.r/2, this.x+15, this.y+15, 1,1);
            return ball1;
        }
        else {return this}
    }
  }

// function makeBalls(n) {
//     var Balls = new Array(n)
//     for (var i = 0; i < n; ++i) {
//       Balls[i] = new ball(Math.random(-20,20), Math.random(0,1024), Math.random(0,500),Math.random(-5,5), Math.random(-5,5));
//     }
//     return Balls
// }
var balls = [];

let drawBall = function(b) {
    noStroke;
    fill(b.color);
    ellipse(b.x, b.y, b.r);
}
