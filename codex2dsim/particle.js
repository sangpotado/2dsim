class Particle {
    constructor(x, y, vx, vy, mass) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.mass = mass;
      this.r = mass*10;
      this.count = 0;
    }

    move(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    //   this.applyForce({x:0,y:0.1});
    }
    accelerate(dt, ax, ay) {
      this.vx += ax * dt;
      this.vy += ay * dt;
    }
    distanceTo(p) {
      var dx = p.x - this.x;
      var dy = p.y - this.y;
      return Math.sqrt(dx * dx + dy * dy);
    }

    applyForce(f) {
      this.vx += f.x / this.mass;
      this.vy += f.y / this.mass;
    }

    bounceWall(sx,sy) {
        if (this.x > sx-this.r/2) {
            this.x = sx-this.r/2;
            this.vx = -this.vx*0.9;
        }
        else if (this.x < this.r/2) {
            this.x = this.r/2;
            this.vx = -this.vx*0.9;
        }
        if (this.y < 0+this.r/2) {
            this.y = this.r/2;
            this.vy = -this.vy*0.9;
        }
        else if (this.y > sy-this.r/2) {
            this.y = sy-this.r/2;
            this.vy = -this.vy*0.90;
        }
      }
    
    gravity(p) {
        let d = this.distanceTo(p);
        let F = 75*(this.mass* p.mass)/(d*d);
        let dx = p.x - this.x;
        let dy = p.y - this.y;
        let fx = F* Math.cos(Math.atan2(dy,dx));
        let fy = F* Math.sin(Math.atan2(dy,dx));
        if (d< this.r*5) {
            this.applyForce({x:-fx,y:-fy});
            p.applyForce({x:fx, y:fy});
        }
        else {this.applyForce({x:fx, y:fy});}
        p.applyForce({x:-fx, y:-fy});

    }

    bounce(other_ball) {
        // momentum formula
        if ((Math.abs(this.x - other_ball.x) <= this.r && (Math.abs(this.y - other_ball.y) <= this.r) || (Math.abs(this.x - other_ball.x) <= other_ball.r/2 && (Math.abs(this.y - other_ball.y) <= other_ball.r/2) ))) {
            let temp_x = this.vx;
            this.vx = ((this.mass - other_ball.mass)/(this.mass + other_ball.mass)*this.vx + (2*other_ball.mass)/(this.mass+ other_ball.mass)*  other_ball.vx) ;
            other_ball.vx = ((other_ball.mass -this.mass)/(this.mass + other_ball.mass)*other_ball.vx + (2*this.mass)/(this.mass+ other_ball.mass)* temp_x) ;
            // this.count += 1;

            // console.log("bounce ", this.count);

            let temp_y = this.vy;
            this.vy = ((this.mass - other_ball.mass)/(this.mass + other_ball.mass)*this.vy + (2*other_ball.mass)/(this.mass+ other_ball.mass)*  other_ball.vy );
            other_ball.vy = ((other_ball.mass - this.mass)/(this.mass + other_ball.mass)*other_ball.vy + (2*this.mass)/(this.mass+ other_ball.mass)*temp_y );
            // other_ball.count += 1;
            // this.color = (Math.random()*255,Math.random()*255,Math.random()*255);
            // this.vy += this.g;
        }
    }
    }

  /* 
//   }
  /* add Wall class that are rectangle and allow Particle to be bounced from */
class Wall {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
    // draw(ctx) {
    //     ctx.fillStyle = '#000000';
    //     ctx.fillRect(this.x, this.y, this.width, this.height);
}

var screen1 = {x: 1024, y:517};
var balls = [];

function drawBall(b) {
    noStroke();
    ellipse(b.x, b.y, b.r);
}