function setup() {
    var height = 512;
    var width = 1400;
    createCanvas(width, 800)
}

function draw() {
    // text("Frame Count with frameRate " + 
    // int(getFrameRate()), 250, 0);
    background(100, 200, 50);
    fill(100);
    rect(0, 512, width, 300);
    drawInfo(people);

    noStroke();
    
    people.forEach(function(person) {
        drawPerson(person);
        person.move();
        person.bounce(width,512);
        person.update();
        if (person.status == "hungry") {
                person.exertForce({x:0.11,y:0.11})
            };
        people.forEach(function(p) {
            if (!Object.is(person, p)) {
                person.eat(p);
                update(people);
            }
        });
        
    });
}

function keyPressed() {
    if (keyCode == 65) {
        people[0].vx += -10;
    }
    if (keyCode == 68) {
        people[0].vx += 10;
    }
    if (keyCode == 87) {
        people[0].vy += -10;
    }
    if (keyCode == 83) {
        people[0].vy += 10;
    }
    if (keyCode == 32) {
        for (var j=0; j<people.length; j++) {
            people[j].vx = people[j].vx/10;
            people[j].vy = people[j].vy/10;
        }
    }
    if (keyCode == 67) {
        console.log(people[0].count);
    }
    if (keyCode == 88) {
        people.pop();
    }
    console.log("keyPressed: " + keyCode)
}

// function mousePressed() {
//     people[people.length] = new ball(50, mouseX, mouseY, 5,0)
//     // people[people.length].g = -1;
// }