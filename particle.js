class Particle {
    constructor(mass, position, velocity) {
      this.mass = mass;
      this.position = position;
      this.velocity = velocity;
    }
    getKineticEnergy() {
      var v = this.getVelocity();
      return 0.5 * this.getMass() * (v.x * v.x + v.y * v.y);
    }
    getPotentialEnergy(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getMechanicalEnergy(reference) {
      return this.getKineticEnergy() + this.getPotentialEnergy(reference);
    }
    getMomentum() {
      var v = this.getVelocity();
      var m = this.getMass();
      return { x: m * v.x, y: m * v.y };
    }
    getImpulse() {
      var p = this.getMomentum();
      var t = 1;
      return { x: p.x / t, y: p.y / t };
    }
    getForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return { x: 0, y: m * g * h };
    }
    getWeight(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getNormalForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getFrictionForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getTensionForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getSpringForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getDragForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getCentripetalForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getCentrifugalForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getLorentzForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getGravitationalForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
    getElectrostaticForce(reference) {
      var m = this.getMass();
      var g = 9.81;
      var h = this.getPosition().y - reference.y;
      return m * g * h;
    }
  }