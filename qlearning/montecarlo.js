function calculateDistance(x1, y1, target) {
    return Math.sqrt((x1 - target.x) ** 2 + (y1 - target.y) ** 2);
}

class MonteCarloAgent {
    constructor(x, y, width, height) {
        this.origin = { x, y };
        this.width = width;
        this.height = height;
        this.reset();
        
        // Maps "x,y" string to { num_visits: number, score: number (avg discounted cost) }
        this.wisdom = new Map(); 
    }

    reset() {
        this.x = this.origin.x;
        this.y = this.origin.y;
        this.currentBudget = BUDGET;
        this.alive = true;
        // CRITICAL CHANGE: memory now stores { key: string, cost: number }
        this.memory = []; 
        this.currentDistance = calculateDistance(this.x, this.y, TARGET);
    }
    
    /**
     * Calculates the cost (negative reward) for the current state transition.
     * In this simple setup, every step has a constant cost.
     * @returns {number} Instantaneous cost incurred.
     */
    getInstantaneousCost() {
        // Assume STEP_COST is a globally defined negative value (e.g., -1)
        // Since we are minimizing cost, we return the absolute value of the step cost.
        // If STEP_COST = -1, this returns 1.
        return Math.abs(STEP_COST); // || 1; 
        
        // NOTE: If you had nuggets or other immediate rewards, the cost logic would be here.
        // Example: return (Math.abs(STEP_COST) - rewardFromNuggets)
    }

    /**
     * Selects the next best move based on exploration (num_visits) and exploitation (score).
     * @param {Array<Object>} possibleMoves - Array of { key, x, y, utility }
     * @returns {Object} The chosen move object
     */
    choose(possibleMoves) {
        if (possibleMoves.length === 0) return null;

        // Epsilon-Greedy Exploration (simple randomization)
        // Note: The original implementation used a mixed approach (minVisits then minScore). 
        // We will simplify to standard Epsilon-Greedy for better exploration control.
        if (Math.random() < EPSILON) {
            const randomIndex = floor(random(possibleMoves.length));
            return possibleMoves[randomIndex];
        } 
        
        // Exploitation (Greedy choice: Minimize expected discounted cost/score)
        let bestMove = possibleMoves[0];
        let minScore = possibleMoves[0].utility.score;

        for (const move of possibleMoves) {
            // Note: Since score is the *average discounted cost*, we want the minimum score.
            if (move.utility.score < minScore) {
                minScore = move.utility.score;
                bestMove = move;
            } else if (move.utility.score === minScore && move.utility.num_visits < bestMove.utility.num_visits) {
                // Simple tie-breaker: prefer less visited states with the same score (minor exploration)
                bestMove = move;
            }
        }
        return bestMove;
    }

    /**
     * Determines the available moves and their current utility scores.
     * @returns {Object} The chosen move, or null.
     */
    think() {
        let possibleMoves = [];

        for (const [dx, dy] of ACTIONS) {
            const newX = this.x + dx;
            const newY = this.y + dy;
            const key = `${newX},${newY}`;

            if (newX > 0 && newX < this.width && newY > 0 && newY < this.height) {
                
                // Note: Removing the !this.memory.includes(key) check here. 
                // The agent should be allowed to think about revisiting a state; 
                // Monte Carlo handles loops via the discounted return and budget.
                if (!this.checkCollision(newX, newY) && !this.memory.includes(key)) {
                    
                    let utility;
                    if (this.wisdom.has(key)) {
                        utility = this.wisdom.get(key);
                    } else {
                        // Initialize utility: score can start high (worst case) or with a heuristic.
                        // Using a high initial value encourages exploration towards new states first.
                        utility = { 
                            num_visits: 0, 
                            // Initial Score set high (max possible distance/cost)
                            score: this.width + this.height 
                        };
                        this.wisdom.set(key, utility);
                    }

                    possibleMoves.push({ key, x: newX, y: newY, utility, dx, dy });
                }
            }
        }
        return this.choose(possibleMoves);
    }

    /**
     * Takes a step and records the instantaneous cost/reward associated with the transition.
     */
    act(move) {
        if (!move) {
            this.alive = false;
            this.reflect();
            return;
        }

        // 1. Record the state key *before* moving, and the cost incurred to leave this state
        const currentKey = `${this.x},${this.y}`;
        const costToMove = this.getInstantaneousCost(); 

        // CRITICAL CHANGE: Record the state and the cost associated with this step
        this.memory.push({ key: currentKey, cost: costToMove });

        // 2. Update position
        this.x = move.x;
        this.y = move.y;
        this.currentBudget -= 1;
        this.currentDistance = calculateDistance(this.x, this.y, TARGET);
        
        // Check for end conditions immediately after moving
        let isTerminal = false;
        if (this.currentBudget <= 0 || this.checkCollision(this.x, this.y) || this.currentDistance < 10) {
            this.alive = false;
            isTerminal = true;
        }

        if (isTerminal) {
            // If the agent reaches a terminal state, call reflect
            this.reflect();
        }
    }

    /**
     * Updates the utility scores of all visited states using discounted return back-propagation.
     */
    reflect() {
        // Calculate the terminal penalty/reward cost based on the final position
        let terminalCost = 0;
        
        if (this.currentBudget <= 0) {
            // Large penalty for running out of budget
            terminalCost = 500; 
        } else if (this.checkCollision(this.x, this.y)) {
             // Large penalty for hitting an obstacle
            terminalCost = 1000;
        } else if (this.currentDistance < 10) {
            // Large reward (negative cost) for reaching the target
            terminalCost = -1000;
        } else {
            // Fallback: If not a specific terminal state, use the final distance as a penalty
            terminalCost = calculateDistance(this.x, this.y, TARGET);
        }

        // Update best path based on the terminal success/failure score
        if (terminalCost < bestScore) {
            bestScore = terminalCost;
            bestPath = this.memory.map(m => m);
        }

        // --- Core Back-Propagation Logic ---
        // G_t starts with the cost of the terminal state (R_T), 
        // which we apply to the last state in memory (the one that lead to the terminal state)
        let discountedReturn = terminalCost; 

        // 1. Iterate backward through the episode history (from last state to first)
        for (let i = this.memory.length - 1; i >= 0; i--) {
            const step = this.memory[i]; 
            const stateKey = step.key;
            
            // 2. Calculate the discounted return G_t
            // G_t = R_t + gamma * G_{t+1}
            // R_t is the cost incurred when *leaving* state S_t (stored in step.cost)
            // G_{t+1} is the existing discountedReturn from all future steps
            discountedReturn = step.cost + DISCOUNT_FACTOR * discountedReturn;

            // 3. First-Visit Check
            let isFirstVisit = true;
            for (let j = 0; j < i; j++) {
                if (this.memory[j].key === stateKey) {
                    isFirstVisit = false;
                    break;
                }
            }

            if (isFirstVisit) {
                const utility = this.wisdom.get(stateKey); // Must exist due to initialization in think()
                
                // 4. Update running average (Incremental Mean)
                const newVisits = utility.num_visits + 1;
                // Update average cost/return using the new discountedReturn
                const newScore = (utility.score * utility.num_visits + discountedReturn) / newVisits;
                
                // Update wisdom
                utility.score = newScore;
                utility.num_visits = newVisits;
                this.wisdom.set(stateKey, utility);
            }
        }

        // --- Existing Cleanup ---
        episodeCount++;
        this.updateStats();
        // Since allPath stores keys, we extract only the keys from the updated memory objects
        // allPath.push(this.memory.map(m => m));
        this.reset();
    }
    
    /**
     * Checks if the agent's current position is colliding with any obstacle or outside the world.
     * @param {Array<Obstacle>} objs 
     * @param {number} [px=this.x] - Optional check X position
     * @param {number} [py=this.y] - Optional check Y position
     * @returns {boolean} - true if collision occurred
     */
    checkCollision(px = this.x, py = this.y) {
        // Obstacle collision
        for (const obj of obstacles) {
            if (obj.checkCollision(px, py)) {
                return true;
            }
        }
        
        // Boundary collision (using AGENT_SIZE as a simple radius/buffer)
        const radius = AGENT_SIZE / 2;
        if (px - radius < 0 || px + radius > this.width || 
            py - radius < 0 || py + radius > this.height) {
            return true;
        }
        
        return false;
    }

    updateStats() {
        document.getElementById('episodes').innerText = `Episodes: ${episodeCount}`;
        // document.getElementById('best-score').innerText = `Best Distance: ${bestScore.toFixed(2)}`;
        document.getElementById('q-status').innerText = `Wisdom size: ${this.wisdom.size}`;
    }

    live() {
        if (!this.alive) {
            // reflect() // is now called in act() when a terminal condition is met
            return;
        }
        
        // If agent is alive, take a step
        let move = this.think();
        this.act(move);
        // document.getElementById('budget').innerText = `Budget: ${this.currentBudget}`;
        // Note: The check for end conditions is now handled inside act() 
        // to ensure reflect() is called immediately upon termination.
    }
    draw() {
        // Draw path taken in this episode
        // for (const mem of allPath){
        //     this.drawPath(mem, color(0, 150, 0, 100));
        // }
        
        this.drawPath(this.memory, color(0, 150, 0, 100)); // Green for current path
        // Draw the best recorded path
        this.drawPath(bestPath, color(0, 100, 255, 200), 1.5); // Blue for best path

        // Draw the agent
        stroke(255);
        fill(255, 69, 0); // Orange
        ellipse(this.x, this.y, AGENT_SIZE * 2);

        // Draw the target
        fill(255, 255, 0, 150); // Yellow/Gold
        noStroke();
        ellipse(TARGET.x, TARGET.y, 20);
        fill(0);
        textAlign(CENTER, CENTER);
        textSize(10);
        text('Target', TARGET.x, TARGET.y);
    }

    drawPath(pathKeys, pathColor, weight = 1) {
        if (pathKeys.length < 2) return;
        
        stroke(pathColor);
        strokeWeight(weight);
        noFill();
        beginShape();
        pathKeys.forEach((i) => {
            const [x, y] = i.key.split(',').map(Number);
            vertex(x, y);
        })
        // for (const key of pathKeys) {
        //     const [x, y] = key.split(',').map(Number);
        //     vertex(x, y);
        // }
        endShape();
    }
}
