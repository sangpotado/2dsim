class RNN {
    /**
     * 
     * @param {*size of input} input_size
     * @param {*size of hidden layer of neuron} hidden_size 
     * @param {*number of steps to unroll the RNN} seq_length 
     * @param {*learning rate} learning_rate 
     */
    constructor(input_size, hidden_size, seq_length, learning_rate) {
        // hyperparameter
        this.input_size = input_size;
        this.hidden_size = hidden_size;
        this.seq_length = seq_length;
        this.learning_rate = learning_rate;

        // model parameters
        // weights
        this.Wxh = new Matrix(hidden_size, input_size); //input to hidden
        this.Wxh.randomize(-0.5,0.5);
        
        this.Whh = new Matrix(hidden_size, hidden_size); //hidden to hidden
        this.Whh.randomize(-0.5,0.5);

        this.Why = new Matrix(input_size, hidden_size); //hidden to output
        this.Why.randomize(-0.5,0.5);

        // biases
        this.bh = new Matrix(hidden_size, 1); //hidden bias
        this.by = new Matrix(input_size, 1); //hidden bias
        this.bh.randomize(-0.5, 0.5);
        this.by.randomize(-0.5,0.5);

        // gradients
        this.dWxh = new Matrix(hidden_size, input_size);
        this.dWhh = new Matrix(hidden_size, hidden_size);
        this.dWhy = new Matrix(input_size, hidden_size);
        this.dbh = new Matrix(hidden_size, 1);
        this.dby = new Matrix(input_size, 1);
    }
    


}