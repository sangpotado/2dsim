class Person {
    constructor() {
      this.x = 0; // add x property
      this.y = 0; // add y property
      this.v = {x: 0, y: 0};
      this.a = {x: 0, y: 0};
      this.m = 1;
      this.status = "hungry";
      this.o_m = 1;
      this.id = 0;
    }

    getDistance(other) {
      const dx = other.x - this.x;
      const dy = other.y - this.y;
      const distance = Math.sqrt(dx **2 + dy **2);
      return distance
    }
    getKineticEnergy() {
          const v = Math.sqrt(this.v.x * this.v.x + this.v.y * this.v.y);
    
          return 0.5 * m * v * v;
    }

    move() {
        this.x += this.v.x;
        this.y += this.v.y;
        this.v.x += this.a.x;
        this.v.y += this.a.y;
    }

    getTotalEnergy() {
        const potentialEnergy = 1 * this.m; // assume a constant potential energy of 1 * m
        const kineticEnergy = 0.5 * this.m * Math.sqrt(this.v.x * this.v.x + this.v.y * this.v.y);
        return potentialEnergy + kineticEnergy;
    }

         
    exertForce(force) {
        const prevLoc = {x: this.x, y: this.y};
        const prevVelocity = {x: this.v.x, y: this.v.y};
        const prevAcceleration = Math.sqrt(this.a.x * this.a.x + this.a.y * this.a.y);
        const velocityAngle = Math.atan2(this.v.y, this.v.x);
        this.a.x = force.x / this.m * Math.cos(velocityAngle);
        this.a.y = force.y / this.m * Math.sin(velocityAngle);
        this.v.x += this.a.x;
        this.v.y += this.a.y;
        const newAcceleration = Math.sqrt(this.a.x * this.a.x + this.a.y * this.a.y);
        var distanceTraveled = 0;
        if (prevAcceleration < newAcceleration) {
          distanceTraveled = Math.sqrt(
                (this.x - prevLoc.x) **2 + (this.y - prevLoc.y) **2);
          this.m -= 0.1*force.x ;
        };

      }

    eat(other) {
      const distance = Math.sqrt((this.x - other.x) **2 + (this.y - other.y) **2);
      if (distance <= this.m && this.m > other.m) {
        this.m += other.m;
        other.status = "dead";
        }
      }

    bounce(width, height) {
        if (this.x + this.v.x > width || this.x + this.v.x < 0) {
          this.v.x = -this.v.x;
        }
        if (this.y + this.v.y > height || this.y + this.v.y < 0) {
          this.v.y = -this.v.y;
        }
    }

    vision() {

      const velocityAngle = Math.atan2(this.v.y, this.v.x);
      let dX = 5* this.m * Math.cos(velocityAngle);
      let dY = 5* this.m * Math.sin(velocityAngle);

      // let visX = dX/Math.cos(velocityAngle*0.4);
      // let visY = dY/Math.sin(velocityAngle*0.4);
      // const visX = this.v.x/ Math.abs(this.v.x)*this.m*2;
      // const visY = this.v.y/ Math.abs(this.v.y)*this.m*2;

      return [this.x + dX, this.y + dY];
    }
    update() {
        if (this.m > this.o_m) {
          this.status = "happy"
        }
        else if (this.m <= this.o_m) {
          this.status = "hungry"
        }
        else if (this.m < 1) {
          this.status = "dead"
        }
        if (this.status === "happy") {
          const acceleration = Math.sqrt(this.a.x * this.a.x + this.a.y * this.a.y);
          if (acceleration > 0) {
            this.a.x *= 0.9;
            this.a.y *= 0.9;
          }
        }

      }
} 