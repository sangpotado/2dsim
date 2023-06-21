// Function to get a random number between min and max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  
  // Function to mutate a point by adding random values to its coordinates
  function mutatePoint([a, b]) {
    return [a + getRandomArbitrary(-10, 10), b + getRandomArbitrary(-5, 5)];
  }
  
  // Function to calculate the fitness of a ball based on its position
  function calculateFitness(x, y) {
    return Math.sqrt((x - 900) ** 2 + (y - 256) ** 2);
  }
  
  // Ball class
  class Ball {
    constructor(path) {
      this.x = 20;
      this.y = 256;
      this.path = path; // an array of (x,y)
      this.step = 0; // index for path
      this.alive = true;
      this.fitness = calculateFitness(this.x, this.y);
    }
  
    // Increment x,y based on the current step of the path
    live() {
      if (this.alive) {
        this.x += this.path[this.step][0];
        this.y += this.path[this.step][1];
        this.step += 1;
      }
    }
  
    // Update the ball's fitness and check if it should be marked as not alive
    update() {
      this.fitness = calculateFitness(this.x, this.y);
      if (this.step >= this.path.length - 1 || this.fitness < 5) {
        this.alive = false;
      } else {
        this.live();
      }
    }
  
    // Mutate the path and return a new one
    mutate() {
      return this.path.map(x => mutatePoint(x));
    }
  
    // Draw the ball on the canvas
    drawBall() {
      if (this.alive) {
        fill(0);
      } else {
        fill(250);
      }
      ellipse(this.x, this.y, 5);
    }
  }
  
  // Obstacle class
  class Obstacle {
    constructor(x, y, w, h) {
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
    }
  
    // Draw the obstacle on the canvas
    drawObstacle() {
      fill(100, 20, 250);
      rect(this.x, this.y, this.w, this.h);
    }
  }
  
  // Population class
  class Population {
    constructor(seed, size, obs) {
      this.size = size;
      this.population = [];
      for (let i = 0; i < size; i++) {
        let b = new Ball(seed.mutate());
        this.population.push(b);
      }
      this.alive = true;
      this.fitness = seed.fitness;
      this.obstacles = obs;
      this.generation = 0;
    }
  
    // Draw the population of balls and obstacles on the canvas
    drawPopulation() {
      this.obstacles.forEach(o => {
        o.drawObstacle();
      });
      this.population.forEach(ball => {
        ball.drawBall();
      });
    }
  
    // Update the population, check for collisions with obstacles, and mark balls as not alive if necessary
    update() {
      if (this.alive) {
        this.population.forEach(ball => {
          ball.update();
        });
  
        this.population.forEach(ball => {
          this.obstacles.forEach(o => {
            if (
              ball.x >= o.x &&
              ball.x <= o.x + o.w &&
              ball.y >= o.y &&
              ball.y <= o.y + o.h ||
              ball.x < -5 ||
              ball.x > 1024 ||
              ball.y < -5 ||
              ball.y > 512
            ) {
              ball.alive = false;
              ball.fitness = calculateFitness(ball.x, ball.y);
            }
          });
        });
  
        let c = 0;
        this.population.forEach(ball => {
          if (ball.alive) {
            c++;
          }
        });
  
        if (c == 0) {
          this.alive = false;
        }
      }
    }
  
    // Find the fittest ball in the population
    findFittest() {
      let fittest = this.population[0];
      for (let i = 0; i < this.population.length; i++) {
        if (fittest.fitness > this.population[i].fitness) {
          fittest = this.population[i];
        }
      }
      return fittest;
    }
  
    // Reset the population with mutated paths based on the fittest ball
    reset() {
    //   console.log(P.findFittest().fitness);
      let seed = this.findFittest();
  
      this.fitness = seed.fitness;
      this.population = [];
      for (let i = 0; i < this.size; i++) {
        let b = new Ball(seed.mutate());
        this.population.push(b);
      }
  
      this.alive = true;
      this.generation += 1;
    }
  }
  