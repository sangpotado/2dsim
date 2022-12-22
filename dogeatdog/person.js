class Person {
    constructor() {
      this.x = 0; 
      this.y = 0; 
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
    
          return 0.5 * this.m * v * v;
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
        console.log(`${this.id} eat ${other.id}`);
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
      // const inverseAngle = 2*Math.PI - velocityAngle;
      let dX = 10* this.m * Math.cos(velocityAngle);
      let dY = 10* this.m * Math.sin(velocityAngle);

      let visX = dX*0.76 - dY*0.6496;
      let visY = dX*0.6496 + dY*0.7603;

      let visX2 = dX*0.76 + dY*0.6496;
      let visY2 = -dX*0.6496 + dY*0.76;

      return [this.x + visX, this.y + visY,this.x + visX2, this.y + visY2, this.x + dX, this.y+dY];
    }

    gravity(p) {
      // let d = this.getDistance(p);
      // let F = 75*(this.m* p.m)/(d*d);
      let dx = p.x - this.x;
      let dy = p.y - this.y;
      let fx = Math.cos(Math.atan2(dy,dx));
      let fy = Math.sin(Math.atan2(dy,dx));
      if (this.m > p.m) {
        this.a.x += fx/this.m;
        this.a.y += fy/this.m;
        console.log(`${this.id} chasings ${p.id}, a ${this.a.x}`)
      }
      else if (this.m <= p.m) {
        this.v.x -= fx;
        this.v.y -= fy;
        console.log(`${this.id} run away ${p.id}, a ${this.a.x}`)
      }
      // else {this.applyForce({x:fx, y:fy});}
      // p.applyForce({x:-fx, y:-fy});
   }

    detect(other) {
      var zoneX = [this.vision()[0],this.vision()[2],this.vision()[4]];
      var zoneY = [this.vision()[1],this.vision()[3],this.vision()[5]];
      if (other.x < Math.max(...zoneX) && other.x > Math.min(...zoneX) && other.y > Math.min(...zoneY) && other.y < Math.max(...zoneY))  {
            this.gravity(other);
          // console.log(`${this.id} detect ${other.id}`)
      }
      // else 
    }

    update() {
        let kE = this.getKineticEnergy();
        this.m -= 0.0001*kE/ Math.sqrt(this.v.x**2 + this.v.y**2);
        if (this.m > this.o_m) {
          this.status = "happy"
        }
        else if (this.m <= this.o_m) {
          this.status = "hungry"
        }
        else if (this.m < 1) {
          this.status = "dead"
        };

        if (this.status == "happy") {
          const acceleration = Math.sqrt(this.a.x **2 + this.a.y **2);
          if (acceleration > 0) {
            this.a.x *= 0.9;
            this.a.y *= 0.9;
            this.v.x *= 0.999;
            this.v.y *= 0.999;
          }
        }

      }
} 