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
    // console.log(people[0].detect(people[1]));
    people.forEach(function(person) {
        drawPerson(person);
        person.move();
        person.bounce(width,512);
        person.update();
        people.forEach(function(p) {
            if (!Object.is(person, p)) {
                if (eatMode) {
                    person.eat(p);
                    
                }
                update(people);
            }
        });
        
    });

    if (keyIsDown(65)) {   //A
        people[0].exertForce({x: -0.005, y:0})
    }
    if (keyIsDown(68)) {       //D
        people[0].exertForce({x: 0.005, y:0});
    }
    if (keyIsDown(87)) {    //S
        people[0].exertForce({x: 0, y:-0.005});
    }
    if (keyIsDown(83)) {   //W
        people[0].exertForce({x: 0, y:+0.005});
    }
}

function keyPressed() {
    // if (keyCode == 65) {   //A
    //     people[0].exertForce({x: -0.05, y:0})
    // }
    // if (keyCode == 68) {       //D
    //     people[0].exertForce({x: 0.05, y:0});
    // }
    // if (keyCode == 87) {    //S
    //     people[0].exertForce({x: 0, y:-0.05});
    // }
    // if (keyCode == 83) {   //W
    //     people[0].exertForce({x: 0, y:+0.05});
    // }
    if (keyCode == 32) {
        for (var j=0; j<people.length; j++) {
            people[j].v.x *= 0.5;
            people[j].v.y *=0.5;
        }
    }
    if (keyCode == 67) {
        console.log(people[0].count);
    }
    if (keyCode == 88) {
        people.pop();
    }
    if (keyCode==69) {
        if (!eatMode) {
            eatMode = true;
        }
        else {eatMode = false}
        
    }
    console.log("keyPressed: " + keyCode)
}


// function mousePressed() {
//     people[people.length] = new ball(50, mouseX, mouseY, 5,0)
//     // people[people.length].g = -1;
// }