class Person {
    constructor() {
      this.x = 0; 
      this.y = 0; 
      this.v = {x: 0, y: 0};
      this.a = {x: 0, y: 0};
      this.m = 1;
      this.status = "happy";
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
      this.a.x += force.x;
      this.a.y += force.y;
      this.m -= Math.sqrt(force.x**2 + force.y**2);

      }

    bounce(width, height) {
        if (this.x + this.v.x > width || this.x + this.v.x < 0) {
          this.v.x = -this.v.x;
        }
        if (this.y + this.v.y > height || this.y + this.v.y < 0) {
          this.v.y = -this.v.y;
        }
    }

    vision(angle) {

      const velocityAngle = Math.atan2(this.v.y, this.v.x);
      
      // x,y point that directly infront of the person
      let dX = 10* this.m * Math.cos(velocityAngle);
      let dY = 10* this.m * Math.sin(velocityAngle);

      // translate dX dY to the angle
      let visX = dX*Math.cos(angle) - dY*Math.sin(angle);
      let visY = dX*Math.sin(angle) + dY*Math.cos(angle);

      let visX2 = dX*Math.cos(angle)+ dY*Math.sin(angle);
      let visY2 = -dX*Math.sin(angle) + dY*Math.cos(angle);

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
      else {this.applyForce({x:fx, y:fy});}
      p.applyForce({x:-fx, y:-fy});
   }

    detect(other) {
      var angle = 0.64;
      const velocityAngle = Math.atan2(this.v.y, this.v.x);
      var detect = false;

      var otherAngle = Math.atan2(other.y-this.y, other.x-this.x);
      var inZone = (Math.abs(otherAngle-velocityAngle) <= angle);


      var vis = this.vision(angle);
      var zoneX = [vis[0],vis[2],vis[4],this.x];
      var zoneY = [vis[1],vis[3],vis[5],this.y];
      if (other.x < Math.max(...zoneX) && other.x > Math.min(...zoneX) && other.y > Math.min(...zoneY) && other.y < Math.max(...zoneY) && inZone)  {
          detect = true;
          console.log(`${this.id} detect ${other.id}`);
          // console.log(detect);
          // console.log(`${otherAngle/Math.PI*180}`);
          return detect;
      }
      // console.log(detect);
      return detect;
    }

    eat(other) {
      const distance = this.getDistance(other);
      if (distance <= this.m && this.detect(other)) {
        this.m += other.m;
        other.status = "dead";
        console.log(`${this.id} eat ${other.id}`);
        }
      // else {console.log('not detect')}
      }

    update() {
        let kE = this.getKineticEnergy();
        this.m -= 0.0001*kE/ Math.sqrt(this.v.x**2 + this.v.y**2);
        if (this.m > this.o_m) {
          this.status = "happy"
        }
        // else if (this.m <= this.o_m-3) {
        //   this.status = "hungry";
        //   var velocityAngle = Math.atan2(this.v.y, this.v.x);
      
        //   // x,y point that directly infront of the person
        //   let dX = 0.0001*Math.cos(velocityAngle);
        //   let dY = 0.0001*Math.sin(velocityAngle);

        //   this.exertForce({x: dX,y: dY});
    
        // }
        // else if (this.m < 1) {
        //   this.status = "dead"
        // };

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