// --- Q-LEARNING CONSTANTS & SETUP ---

const WIDTH = 600;
const HEIGHT = 400;
const ORIGIN = { x: 30, y: 150 };
const TARGET = { x: 550, y: 350 };

// Hyperparameters (Mutable)
let BUDGET = 15; 
const AGENT_SIZE = 5;
const STEP_SIZE = 10;
const NUGGET_REWARD = 50; 
const NUGGET_RADIUS = 15; 

let LEARNING_RATE = 0.2; 
let DISCOUNT_FACTOR = 0.99; 
let EPSILON = 0.4; 
let EPSILON_DECAY = 0.99;
let MIN_EPSILON = 0.05;

// Environment State Toggles
let obstaclesActive = false;
let nuggetsActive = false;

// All possible actions (dx, dy)
const ACTIONS = [
    [STEP_SIZE, 0],       
    [-STEP_SIZE, 0],      
    [0, STEP_SIZE],       
    [0, -STEP_SIZE],
    [STEP_SIZE, STEP_SIZE],   
    [STEP_SIZE, -STEP_SIZE],  
    [-STEP_SIZE, STEP_SIZE],  
    [-STEP_SIZE, -STEP_SIZE]  
];

let agents = {
    ql: new QLearningAgent(ORIGIN.x, ORIGIN.y, WIDTH, HEIGHT),
    mc: new MonteCarloAgent(ORIGIN.x, ORIGIN.y, WIDTH, HEIGHT)
};
let obstacles = [];
let nuggets = [];
let episodeCount = 0;
let greedyPath = [];
let minGreedySteps = Infinity;

// for MONTE CARLO agent
let bestPath = [];
let allPath = [];
let bestScore = Infinity;
let STEP_COST = 2;

// Define initial environmental elements
const HARDCODED_OBSTACLES = [
    { x: 150, y: 50, w: 40, h: 300 },
    { x: 300, y: 0, w: 50, h: 250 },
    { x: 450, y: 150, w: 40, h: 250 }
];
const HARDCODED_NUGGETS = [
    { x: 30, y: 200, reward: 25 },
    { x: 80, y: 370, reward: 25 },
    { x: 380, y: 350, reward: 50 }, 
    { x: 500, y: 100, reward: 75 }
];

// --- P5.JS FUNCTIONS ---
function roundToNearestTen(number) {
    return Math.round(number / 10) * 10;
}
//show location of the mouse, according to the actual coordinate
var drawMouse = function() {
    // 1. Draw the mouse indicator on the canvas
    fill(0, 0, 0);
    ellipse(mouseX, mouseY, 5);

    // Default values
    let qValue = 0.00;
    let mcScore = 0.00;

    // Only process values if mouse is inside the canvas
    if (mouseX >= 0 && mouseX <= WIDTH && mouseY >= 0 && mouseY <= HEIGHT) {
        let x = roundToNearestTen(mouseX);
        let y = roundToNearestTen(mouseY);
        const stateKey = getKey(x, y);

        const qlAgent = agents.ql;
        const mcAgent = agents.mc;

        // Q-Learning Value (Max Q-Value at the state)
        if (qlAgent.qTable && qlAgent.qTable.has(stateKey)) {
            qValue = qlAgent.getMaxQValue(stateKey);
            textSize(15);
            text(`${qValue.toFixed(2)}`, x, y-10);
        }

        // Monte Carlo Score (State Value)
        if (mcAgent.wisdom && mcAgent.wisdom.has(stateKey)) {
            mcScore = mcAgent.wisdom.get(stateKey).score;
        }
    }

    // 2. Update the HTML spans (Targeting the new IDs)
    const qValueSpan = document.getElementById('max-qvalue');
    if (qValueSpan) {
        qValueSpan.textContent = `Q: ${qValue.toFixed(2)}`;
    }

    const mcScoreSpan = document.getElementById('mc-score-at-mouse');
    if (mcScoreSpan) {
        mcScoreSpan.textContent = `MC Score: ${mcScore.toFixed(2)}`;
    }
}

function setup() {
    const canvas = createCanvas(WIDTH, HEIGHT);
    canvas.parent('canvas-container');
    
    // Create Agent
    // agents.ql = new QLearningAgent(ORIGIN.x, ORIGIN.y, WIDTH, HEIGHT);
    // agents.mc = new MonteCarloAgent(ORIGIN.x, ORIGIN.y, WIDTH, HEIGHT );
    
    // Set a high frame rate for fast learning
    frameRate(60); 
}

function draw() {
    background(240); 

    // Draw active obstacles and nuggets
    for (const obj of obstacles) { obj.draw(); }
    for (const nugget of nuggets) { nugget.draw(); }

    agents.ql.live();
    agents.ql.draw();
    agents.mc.live();
    agents.mc.draw();

    drawMouse();
}

/**
 * NEW: Function to add a nugget on mouse click.
 * This is a built-in p5.js function.
 */
function mouseClicked() {
    // Check if the click is within the canvas bounds and nuggets are active
    if (mouseX > 0 && mouseX < WIDTH && mouseY > 0 && mouseY < HEIGHT && nuggetsActive) {
        // Round to nearest STEP_SIZE (10) to align with the grid states
        const newX = roundToNearestTen(mouseX);
        const newY = roundToNearestTen(mouseY);
        
        // Ensure the new nugget is not too close to an obstacle/boundary, 
        // though the agent's movement logic handles this primarily.
        
        // Add a new nugget with a reward of 50
        nuggets.push(new Nugget(newX, newY, 50));
        
        // Reset the agent to ensure the new state is considered in future episodes
        agents.ql.reset(); 
        agents.mc.reset();
        
        // Disable default p5 context menu on right click
        return false;
    }
}