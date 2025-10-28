// --- CONTROL PANEL LOGIC ---

/**
 * Updates the global variable based on slider input and updates the output display.
 */
function updateParameter(id, value) {
    const output = document.getElementById(id + '-value');
    const floatVal = parseFloat(value);
    
    switch(id) {
        case 'learningRate':
            LEARNING_RATE = floatVal;
            output.innerText = LEARNING_RATE.toFixed(3);
            break;
        case 'discountFactor':
            DISCOUNT_FACTOR = floatVal;
            output.innerText = DISCOUNT_FACTOR.toFixed(3);
            break;
        case 'epsilon':
            EPSILON = floatVal;
            output.innerText = EPSILON.toFixed(3);
            break;
        case 'epsilonDecay':
            EPSILON_DECAY = floatVal;
            output.innerText = EPSILON_DECAY.toFixed(4);
            break;
        case 'minEpsilon':
            MIN_EPSILON = floatVal;
            output.innerText = MIN_EPSILON.toFixed(3);
            break;
        case 'budget':
            BUDGET = parseInt(value, 10);
            output.innerText = BUDGET;
            if (agents) {
                agents.ql.reset();
                agents.mc.reset();}
            break;
        default:
            console.warn(`Unknown parameter ID: ${id}`);
    }
}

/** Toggles the state of obstacles. */
function toggleObstacles() {
    obstaclesActive = !obstaclesActive;
    const btn = document.getElementById('toggle-obstacles');
    btn.setAttribute('data-active', obstaclesActive);
    btn.innerText = `Obstacles: ${obstaclesActive ? 'ON' : 'OFF'}`;
    
    obstacles.length = 0; // Clear current obstacles
    if (obstaclesActive) {
        HARDCODED_OBSTACLES.forEach(o => obstacles.push(new Obstacle(o.x, o.y, o.w, o.h)));
    }
    // Force agent reset to avoid being stuck inside a newly created obstacle
    if (agents) {
        agents.ql.reset();
        agents.mc.reset();
    }; 
}

/** Toggles the state of nuggets. */
function toggleNuggets() {
    nuggetsActive = !nuggetsActive;
    const btn = document.getElementById('toggle-nuggets');
    btn.setAttribute('data-active', nuggetsActive);
    btn.innerText = `Nuggets: ${nuggetsActive ? 'ON (Click to Add)' : 'OFF'}`;
    
    // Clear all current nuggets (including user-added ones)
    nuggets.length = 0; 
    if (nuggetsActive) {
        HARDCODED_NUGGETS.forEach(n => nuggets.push(new Nugget(n.x, n.y, n.reward)));
    }
    // Reset agent to refresh collection status
    if (agents) {
        agents.ql.reset();
        agents.mc.reset();
    };
}

window.onload = function() {
    // 1. Setup Slider Listeners
    document.querySelectorAll('#controls input[type="range"]').forEach(input => {
        input.addEventListener('input', (e) => updateParameter(e.target.id, e.target.value));
        updateParameter(input.id, input.value); // Initial sync
    });
    
    // 2. Setup Button Listeners
    document.getElementById('toggle-obstacles').addEventListener('click', toggleObstacles);
    document.getElementById('toggle-nuggets').addEventListener('click', toggleNuggets);
    
    // Set initial button states
    document.getElementById('toggle-obstacles').setAttribute('data-active', obstaclesActive);
    document.getElementById('toggle-nuggets').setAttribute('data-active', nuggetsActive);
};