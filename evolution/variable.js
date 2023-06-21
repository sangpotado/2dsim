const original_path = [];
for (let i = 0; i < 200; i++) {
    original_path.push([getRandomArbitrary(-5,5), getRandomArbitrary(-5,5)]);
}

//mousepress function, if add_ob = 0, set first ob_x and ob_y, if add_ob = 1, new Obstacle, reset add_ob
let add_ob = 0;
let ob_x = 0;
let ob_y = 0;

let obs = [
    // new Obstacle(200,10,40,150),
    // new Obstacle(400, 350,30,80),
    // new Obstacle(500,100,40,200),
    // new Obstacle(650, 300, 100, 30)
];

let og = new Ball(original_path);
let P = new Population(og, 100, obs);

