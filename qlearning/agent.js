// --- UTILITY FUNCTIONS & CLASSES (Unchanged but included for context) ---

/**
 * Creates a unique string key for a position.
 * @param {number} x 
 * @param {number} y 
 * @returns {string}
 */
function getKey(x, y) {
    return `${x},${y}`;
}

function calculateDistance(x1, y1, target) {
    return Math.sqrt((x1 - target.x) ** 2 + (y1 - target.y) ** 2);
}

class Nugget {
    constructor(x, y, reward) {
        this.x = x;
        this.y = y;
        this.reward = reward;
        this.isCollected = false;
    }

    draw() {
        if (!this.isCollected) {
            fill(255, 200, 0); // Gold color
            noStroke();
            ellipse(this.x, this.y, NUGGET_RADIUS * 2);
            fill(50);
            textAlign(CENTER, CENTER);
            textSize(10);
            text(`+${this.reward}`, this.x, this.y);
        }
    }
}

class Obstacle {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }

    draw() {
        fill(45, 55, 72); // Dark gray
        noStroke();
        rect(this.x, this.y, this.w, this.h);
    }

    checkCollision(px, py) {
        return (
            px > this.x && 
            px < this.x + this.w && 
            py > this.y && 
            py < this.y + this.h
        );
    }
}

// --- BASE AGENT CLASS ---

class Agent {
    /**
     * Base constructor for the reinforcement learning agent.
     * Initializes core state and environment-related properties.
     */
    constructor(x, y, width, height) {
        // Core positional and environment constants
        this.origin = { x, y };
        this.width = width;
        this.height = height;
        
        // State variables (shared by both RL methods)
        this.x = x;
        this.y = y;
        this.currentBudget = BUDGET; 
        this.alive = true;
        this.memory = []; // Stores the history of the current episode
        this.visitedStatesInEpisode = new Set();
        this.reset();
    }

    /**
     * Resets the agent's state for a new episode.
     */
    reset() {
        this.x = this.origin.x;
        this.y = this.origin.y;
        this.currentBudget = BUDGET; 
        this.alive = true;

        this.memory = []; 
        this.visitedStatesInEpisode.clear();

        // Reset the collection status of active nuggets (common environment logic)
        if (typeof nuggetsActive !== 'undefined' && nuggetsActive) {
            for (const nugget of nuggets) {
                nugget.isCollected = false;
            }
        }
    }

    /**
     * Checks for collision with boundaries and obstacles.
     * @param {number} px - X position to check.
     * @param {number} py - Y position to check.
     * @returns {boolean} True if collision occurred.
     */
    checkCollision(px = this.x, py = this.y) {
        // Obstacle collision (assuming global `obstacles` array)
        if (typeof obstacles !== 'undefined') {
            for (const obj of obstacles) {
                if (obj.checkCollision(px, py)) {
                    return true;
                }
            }
        }
        
        // Boundary collision (assuming global `AGENT_SIZE`)
        const radius = typeof AGENT_SIZE !== 'undefined' ? AGENT_SIZE / 2 : 5;
        if (px - radius < 0 || px + radius > this.width || 
            py - radius < 0 || py + radius > this.height) {
            return true;
        }
        return false;
    }

    /**
     * Calculates the immediate reward gained at the current position, 
     * primarily for nuggets and movement incentive.
     * Note: This is designed for Q-Learning's immediate reward signal.
     * @returns {number} The instantaneous reward value.
     */
    getImmediateReward() {
        // Base reward calculation (e.g., distance-based shaping)
        let reward = 0;
        if (typeof dist !== 'undefined' && typeof ORIGIN !== 'undefined' && typeof TARGET !== 'undefined') {
            reward = dist(this.x, this.y, ORIGIN.x, ORIGIN.y) / 10 - dist(this.x, this.y, TARGET.x, TARGET.y) / 10;
            // reward = - dist(this.x, this.y, TARGET.x, TARGET.y) / 10;
        }

        // Check for Nugget collection
        if (typeof nuggetsActive !== 'undefined' && nuggetsActive && typeof nuggets !== 'undefined') {
            for (const nugget of nuggets) {
                if (!nugget.isCollected) {
                    if (dist(this.x, this.y, nugget.x, nugget.y) < NUGGET_RADIUS) {
                        reward += nugget.reward;
                        nugget.isCollected = true;
                    }
                }
            }
        }
        return reward;
    }

    /**
     * Generic method to update UI statistics (overridden by subclasses).
     */
    updateStats() {
        // Ensure globals exist before trying to update UI elements
        if (typeof document !== 'undefined' && typeof episodeCount !== 'undefined') {
            document.getElementById('episodes').innerText = `Episodes: ${episodeCount}`;
            document.getElementById('epsilon-value').innerText = EPSILON.toFixed(3);
            document.getElementById('budget-value').innerText = BUDGET.toFixed(0); 
        }
    }

    /**
     * Draws a path given an array of state objects or keys.
     * @param {Array<string|Object>} pathItems - Array of state keys or objects with a 'key' property.
     * @param {Object} pathColor - p5.js color object.
     * @param {number} weight - Line stroke weight.
     */
    drawPath(pathItems, pathColor, weight = 1) {
        if (typeof beginShape === 'undefined' || pathItems.length < 2) return;
        
        stroke(pathColor);
        strokeWeight(weight);
        noFill();
        beginShape();
        
        for (const item of pathItems) {
            // Handle both string keys (QL) and objects with a 'key' property (MC)
            const key = typeof item === 'string' ? item : item.key;
            if (key) {
                const [x, y] = key.split(',').map(Number);
                vertex(x, y);
            }
        }
        endShape();
    }
    
    /**
     * Draws the common environment elements and the agent.
     * Subclasses should call this and then add their specific path drawings.
     */
    draw() {
        // Draw the target (assuming global TARGET)
        if (typeof TARGET !== 'undefined') {
            fill(255, 255, 0, 200); 
            noStroke();
            ellipse(TARGET.x, TARGET.y, 20);
            fill(0);
            textAlign(CENTER, CENTER);
            textSize(10);
            text('Target', TARGET.x, TARGET.y);
        }

        // Draw the agent (assuming global AGENT_SIZE)
        stroke(255);
        fill(0, 0, 0); 
        const size = typeof AGENT_SIZE !== 'undefined' ? AGENT_SIZE * 2 : 10;
        ellipse(this.x, this.y, size);

        // Draw start (assuming global ORIGIN)
        if (typeof ORIGIN !== 'undefined') {
            fill(0, 255, 0, 150);
            noStroke();
            ellipse(ORIGIN.x, ORIGIN.y, 10);
        }
    }
    
    // Abstract methods to be defined by subclasses
    live() { throw new Error("Subclass must implement live() method."); }
}

// --- Q-LEARNING AGENT CLASS ---

class QLearningAgent extends Agent {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        // Q-Learning specific structure
        this.qTable = new Map(); // Maps stateKey -> Map<actionKey, QValue>
        this.greedyPath = [];    // Path from the greedy policy
        this.minGreedySteps = Infinity;
    }

    /**
     * Retrieves the Q-Value for a given state-action pair, initializing it to 0 if new.
     */
    getQValue(stateKey, actionKey) {
        if (!this.qTable.has(stateKey)) {
            // Initialize all possible actions for a new state
            const actionMap = new Map();
            for (const [dx, dy] of ACTIONS) {
                actionMap.set(getKey(dx, dy), 0);
            }
            this.qTable.set(stateKey, actionMap);
        }
        return this.qTable.get(stateKey).get(actionKey);
    }

    /**
     * Finds the maximum Q-Value among all actions for a state (Max a' Q(s', a')).
     */
    getMaxQValue(stateKey) {
        if (!this.qTable.has(stateKey)) {
            return 0; 
        }
        return Math.max(...this.qTable.get(stateKey).values());
    }

    /**
     * Chooses an action using the Epsilon-Greedy strategy.
     */
    chooseAction(stateKey) {
        const availableActions = [];
        // Determine legal and unvisited moves 
        for (const [dx, dy] of ACTIONS) {
            const newX = this.x + dx;
            const newY = this.y + dy;
            const key = getKey(newX, newY);

            // Check boundaries, collision, and memory (to prevent immediate loops)
            if (!this.checkCollision(newX, newY) && !this.visitedStatesInEpisode.has(key)) {
                availableActions.push({ dx, dy, actionKey: getKey(dx, dy) });
            }
        }

        if (availableActions.length === 0) return null;

        if (Math.random() < EPSILON) {
            // Exploration: Choose a random available action
            return random(availableActions);
        } else {
            // Exploitation: Choose the action with the highest Q-Value
            let maxQ = -Infinity;
            let bestActions = [];

            for (const action of availableActions) {
                const qValue = this.getQValue(stateKey, action.actionKey);
                
                if (qValue > maxQ) {
                    maxQ = qValue;
                    bestActions = [action]; 
                } else if (qValue === maxQ) {
                    bestActions.push(action); 
                }
            }
            // Break ties randomly among best actions
            return random(bestActions);
        }
    }
    
    /**
     * Updates the Q-Value using the Q-Learning Bellman equation.
     */
    updateQValue(sKey, aKey, reward, sPrimeKey) {
        const oldQ = this.getQValue(sKey, aKey);
        // Find the estimated optimal future value (Max a' Q(s', a'))
        const maxQPrime = this.getMaxQValue(sPrimeKey); 
        
        // Q(s, a) <- Q(s, a) + alpha * [ R + gamma * max a' Q(s', a') - Q(s, a) ]
        const temporalDifference = reward + DISCOUNT_FACTOR * maxQPrime - oldQ;
        const newQ = oldQ + LEARNING_RATE * temporalDifference;
        
        this.qTable.get(sKey).set(aKey, newQ);
        this.updateStats();
    }
    
    /**
     * Takes an action, transitions state, receives reward, and updates the Q-Table.
     */
    act(action) {
        if (!action) {
            this.alive = false;
            return;
        }

        const sKey = getKey(this.x, this.y);
        this.visitedStatesInEpisode.add(sKey);
        const aKey = action.actionKey;
        
        // // 1. Get instantaneous reward BEFORE the move
        let reward = this.getImmediateReward(); 

        // 2. State transition
        this.x += action.dx;
        this.y += action.dy;
        this.currentBudget -= 1;
        
        const sPrimeKey = getKey(this.x, this.y);
        this.memory.push(sKey);
        
        // 3. Check for terminal conditions and apply penalties/bonuses
        let isTerminal = false;

        if (this.currentBudget <= 0) {
            // reward -= 50; // Penalty for running out of budget
            isTerminal = true;
        } else if (typeof obstaclesActive !== 'undefined' && obstaclesActive && this.checkCollision()) {
            reward -= 100; // Penalty for collision
            isTerminal = true;
        } else if (typeof TARGET !== 'undefined' && dist(this.x, this.y, TARGET.x, TARGET.y) < 10) {
            reward += 1000; // Bonus for reaching target
            isTerminal = true;
        }
        
        // 4. Update Q-Value: If terminal, sPrimeKey is the current key, which ensures maxQPrime is 0 
        // (since only non-terminal states are typically learned/stored).
        this.updateQValue(sKey, aKey, reward, isTerminal ? sKey : sPrimeKey);
        
        if (isTerminal) {
            this.alive = false;
        }
    }

    /**
     * Core episode loop for Q-Learning.
     */
    live() {
        if (!this.alive) {
            // Decay exploration rate
            EPSILON = Math.max(MIN_EPSILON, EPSILON * EPSILON_DECAY);
            
            this.reset();
            // Periodically calculate the best greedy path based on learned Q-values
            if (episodeCount % 20 === 0) {
                 this.calculateBestPath();
                 // Budget increase logic is kept here as per original
                 BUDGET += 2;
            }
            episodeCount++;
            this.updateStats();
            return;
        }
        
        const sKey = getKey(this.x, this.y);
        const action = this.chooseAction(sKey);
        this.act(action);
    }
    
    /**
     * Calculates the optimal path by following the highest Q-values (greedy policy).
     */
    calculateBestPath() {
        // ... (Logic remains identical to the original Q-Learning Agent) ...
        let currentX = ORIGIN.x;
        let currentY = ORIGIN.y;
        let steps = 0;
        let path = [getKey(currentX, currentY)];
        let localBudget = BUDGET * 2; 

        while (localBudget-- > 0) {
            const sKey = getKey(currentX, currentY);
            
            if (dist(currentX, currentY, TARGET.x, TARGET.y) < 10) {
                break;  // Target reached
            }

            if (!this.qTable.has(sKey)) {
                break; // Unexplored state
            }

            const qMap = this.qTable.get(sKey);
            let maxQ = -Infinity;
            let bestActionKey = null;

            for (const [aKey, qValue] of qMap.entries()) {
                let [dx, dy] = aKey.split(',').map(Number);
                let potentialX = currentX + dx;
                let potentialY = currentY + dy;

                if (qValue > maxQ && !path.includes(getKey(potentialX, potentialY))) {
                    maxQ = qValue;
                    bestActionKey = aKey;
                }
            }

            if (bestActionKey) {
                const [dx, dy] = bestActionKey.split(',').map(Number);
                currentX += dx;
                currentY += dy;
                path.push(getKey(currentX, currentY));
                steps++;
            } else {
                break; // Stuck
            }
        }
        
        this.greedyPath = path;
        if (steps > 0 && steps < this.minGreedySteps) {
            this.minGreedySteps = steps;
        }
    }

    /**
     * Overrides base stats update to include Q-Table specific metrics.
     */
    updateStats() {
        super.updateStats();
        // Update Q-Learning specific stats (assuming globals are available)
        if (typeof document !== 'undefined') {
            document.getElementById('q-status').innerText = `Q-Table Size: ${this.qTable.size} states`;
            // document.getElementById('ql-budget').innerText = `Q-current st`
        }
    }

    /**
     * Overrides base draw to include Q-Learning path visualizations.
     */
    draw() {
        // Draw the current path taken (memory) and the best learned path (greedyPath)
        this.drawPath(this.memory, color(0, 150, 0, 70), 1); 
        this.drawPath(this.greedyPath, color(255, 69, 0), 2); 

        // Call base draw for agent, target, and start point
        super.draw();
        
        // Custom agent color
        stroke(255);
        fill(0, 0, 0); 
        ellipse(this.x, this.y, AGENT_SIZE * 2);
    }
}

// --- MONTE CARLO AGENT CLASS ---

class MonteCarloAgent extends Agent {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        // Monte Carlo specific properties
        // Maps stateKey -> { num_visits: number, score: number (avg discounted cost) }
        this.wisdom = new Map(); 
        this.currentDistance = calculateDistance(this.x, this.y, TARGET);
        
        // Memory structure for MC: stores { key: string, cost: number }
        this.memory = []; 
    }
    
    reset() {
        super.reset();
        this.currentDistance = calculateDistance(this.x, this.y, TARGET);
    }

    /**
     * Calculates the instantaneous cost (negative reward) for the current step.
     */
    getInstantaneousCost() {
        // Since Monte Carlo here minimizes cost, we use the absolute value of STEP_COST.
        // If STEP_COST is -1 (a reward of -1), the cost is 1.
        return Math.abs(STEP_COST);
        // NOTE: If using nuggets, you would adjust this cost here.
    }

    /**
     * Selects the next best move based on Epsilon-Greedy on the score/cost.
     */
    choose(possibleMoves) {
        if (possibleMoves.length === 0) return null;

        if (Math.random() < EPSILON) {
            // Exploration: random move
            return random(possibleMoves);
        } 
        
        // Exploitation (Greedy choice: Minimize expected discounted cost/score)
        let bestMove = possibleMoves[0];
        let minScore = possibleMoves[0].utility.score;

        for (const move of possibleMoves) {
            // We want the minimum score (minimum expected future cost)
            if (move.utility.score < minScore) {
                minScore = move.utility.score;
                bestMove = move;
            } else if (move.utility.score === minScore && move.utility.num_visits < bestMove.utility.num_visits) {
                // Tie-breaker: prefer less visited states with the same score
                bestMove = move;
            }
        }
        return bestMove;
    }

    /**
     * Determines the available moves and their current utility scores from wisdom.
     */
    think() {
        let possibleMoves = [];

        this.visitedStatesInEpisode.add(getKey(this.x, this.y));  // Track the current state as visited before choosing the next action

        for (const [dx, dy] of ACTIONS) {
            const newX = this.x + dx;
            const newY = this.y + dy;
            const key = getKey(newX, newY);

            // Check 1: Boundaries and Obstacle Collision
            // Check 2: PREVENTS REVISITING THE SAME STATE IN THIS EPISODE  && !this.visitedStatesInEpisode.has(key)
            if (!this.checkCollision(newX, newY)) {
                
                let utility;
                if (this.wisdom.has(key)) {
                    utility = this.wisdom.get(key);
                } else {
                    // Initialize utility: score set high to encourage exploration
                    utility = { 
                        num_visits: 0, 
                        // score: this.width + this.height 
                        score: 0
                    };
                    this.wisdom.set(key, utility);
                }

                if (!this.visitedStatesInEpisode.has(key)) {
                    possibleMoves.push({ key, x: newX, y: newY, utility, dx, dy });
                }
            }
        }
        return this.choose(possibleMoves);
    }

    /**
     * Takes a step, records the transition cost, and checks for termination.
     */
    act(move) {
        if (!move) {
            this.alive = false;
            this.reflect(); // Reflect on inability to move
            return;
        }

        // 1. Record the state key *before* moving, and the cost incurred to leave this state
        const currentKey = getKey(this.x, this.y);
        const costToMove = this.getInstantaneousCost(); 

        // MC memory records the state and the cost associated with this step (to S_t+1)
        this.memory.push({ key: currentKey, cost: costToMove });

        // 2. State transition
        this.x = move.x;
        this.y = move.y;
        this.currentBudget -= 1;
        this.currentDistance = calculateDistance(this.x, this.y, TARGET);
        
        // 3. Check for end conditions immediately after moving
        let isTerminal = false;
        if (this.currentBudget <= 0 || this.checkCollision() || this.currentDistance < 10) {
            this.alive = false;
            isTerminal = true;
        }

        if (isTerminal) {
            this.reflect(); // Start back-propagation if terminal
        }
    }

    /**
     * Updates the utility scores of all visited states using discounted return (G) back-propagation.
     */
    reflect() {
        // Calculate the cost of the terminal state
        let terminalCost = 0;
        
        if (this.currentBudget <= 0) {
            // terminalCost = 500; // Large penalty
            // terminalCost = calculateDistance(this.x, this.y, TARGET);
        } else if (this.checkCollision()) {
            terminalCost = 1000; // Large penalty
        } else if (this.currentDistance < 10) {
            terminalCost = -1000; // Large reward (negative cost)
        } else {
            terminalCost = calculateDistance(this.x, this.y, TARGET); // Fallback penalty
        }
        
        // Update best path (assuming global bestScore and bestPath)
        if (terminalCost < bestScore) {
            bestScore = terminalCost;
            // Map memory objects to ensure they are copied correctly
            bestPath = this.memory.map(m => ({ key: m.key, cost: m.cost })); 
        }

        // --- Core Monte Carlo Back-Propagation Logic (First-Visit) ---
        let discountedReturn = terminalCost; 

        // Iterate backward through the episode history
        for (let i = this.memory.length - 1; i >= 0; i--) {
            const step = this.memory[i]; 
            const stateKey = step.key;
            
            // G_t = R_t + gamma * G_{t+1}
            discountedReturn = step.cost + DISCOUNT_FACTOR * discountedReturn;

            // First-Visit Check: Only update if this is the first time the state is visited in this episode
            let isFirstVisit = true;
            for (let j = 0; j < i; j++) {
                if (this.memory[j].key === stateKey) {
                    isFirstVisit = false;
                    break;
                }
            }

            if (isFirstVisit) {
                const utility = this.wisdom.get(stateKey); 
                
                // Update running average (Incremental Mean)
                const newVisits = utility.num_visits + 1;
                const newScore = (utility.score * utility.num_visits + discountedReturn) / newVisits;
                
                utility.score = newScore;
                utility.num_visits = newVisits;
                this.wisdom.set(stateKey, utility);
            }
        }

        episodeCount++;
        // Decay exploration rate
        EPSILON = Math.max(MIN_EPSILON, EPSILON * EPSILON_DECAY);
        this.updateStats();
        this.reset();
    }
    
    /**
     * Overrides base stats update to include Monte Carlo specific metrics.
     */
    updateStats() {
        super.updateStats();
        // Update Monte Carlo specific stats
        if (typeof document !== 'undefined') {
            document.getElementById('MC-size').innerText = `MC size: ${this.wisdom.size}`;
            document.getElementById('best-score').innerText = `MC Best Cost: ${bestScore.toFixed(2)}`;
        }
    }

    /**
     * Core episode loop for Monte Carlo.
     */
    live() {
        if (!this.alive) {
            return;
        }
        
        let move = this.think();
        this.act(move);
    }

    /**
     * Overrides base draw to include Monte Carlo path visualizations.
     */
    draw() {
        // Draw the current path taken (memory) and the best recorded path (bestPath)
        this.drawPath(this.memory, color(0, 150, 0, 100)); // Green for current path
        this.drawPath(bestPath, color(0, 100, 255, 200), 1.5); // Blue for best path

        // Call base draw for agent, target, and start point
        super.draw();

        // Custom agent color
        stroke(255);
        fill(255, 69, 0); // Orange
        ellipse(this.x, this.y, AGENT_SIZE * 2);
    }
}