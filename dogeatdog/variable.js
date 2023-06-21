var width = 1024;
var height = 512;

const people = [];
for (let i = 0; i < 10; i++) {
  const person = new Person();
  person.x = Math.random() * width; // random x coordinate between 0 and 100
  person.y = Math.random() * height; // random y coordinate between 0 and 100
  person.v.x = Math.random() + 0.5; // random x velocity between 0.5 and 1
  person.v.y = Math.random()+ 0.5; // random y velocity between 0.5 and 1
  person.a.x = 0;
  person.a.y = 0;
  person.m = Math.random() *100;
  person.o_m = person.m;
  person.status = "hungry";
  person.id = i;
  people.push(person);
}
// for (let i = 0; i < 1; i++) {
//   const person = new Person();
//   person.x = Math.random() * width; // random x coordinate between 0 and 100
//   person.y = Math.random() * height; // random y coordinate between 0 and 100
//   person.v.x = 5; // random x velocity between 0.5 and 1
//   person.v.y = 4; // random y velocity between 0.5 and 1
//   person.a.x = 1;
//   person.a.y = 1;
//   person.m = 30;
//   person.orign_m = person.m;
//   person.status = "hungry";
//   people.push(person);
// }


const dead_people = [];

function drawPerson(p) {
    fill(0);
    ellipse(p.x,p.y,p.m);
    // ellipse(p.vision()[0], p.vision()[1],p.m)
    stroke(126);
    strokeWeight(3) 
    line(p.x,p.y, p.vision()[0], p.vision()[1]);
    line(p.x,p.y, p.vision()[2], p.vision()[3]);
    line(p.x,p.y, p.vision()[4], p.vision()[5]);
    fill(255);
    textSize(this.m*2);
    text(`${p.id}`, p.x, p.y)

}
function update(p) {
  for (var i=0;i<p.length;i++) {
    if (p[i].status === "dead") {
      const index = p.indexOf(p);
      p.splice(i, 1);
      dead_people.push(p[i]);
    }
  }
}

function drawInfo(p) {
  fill(15);
  textSize(30);
  text('ball', 15, 600);
  text('status', 15, 630);
  text('mass', 15, 660);
  p.forEach(function(person) {
    text(`${person.id}`, 100 + 100* person.id, 600);
    text(`${person.status}`, 100 + 100*person.id, 630);
    text(`${round(person.m,2)}`, 100 + 100*person.id, 660);

  })
}

function drawBackground() {
  const color1 = color(255, 0, 0);  // Starting color (red)
  const color2 = color(0, 0, 255);  // Ending color (blue)
  const blendingFactor = 0.005;  // Blending factor for smooth transition

  for (let y = 0; y < height; y++) {
    const blendedColor = lerpColor(color1, color2, y / height);
    stroke(blendedColor);
    line(0, y, width, y);
  }

  // Optional: Add blending effect for dynamic color change
  const blendedColor = lerpColor(color1, color2, frameCount * blendingFactor);
  fill(blendedColor);
  noStroke();
  rect(0, 0, width, height);


}
