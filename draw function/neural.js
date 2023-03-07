class Layer {
    constructor(n_inputs, n_neurons, id) {
        this.weights = math.multiply(math.ones(n_inputs, n_neurons), Math.random());
        this.bias = math.multiply(math.ones(n_neurons), Math.random());
        this.dW = math.zeros(n_inputs, n_neurons);
        this.dB = math.zeros(n_neurons);
        this.z = [];
        this.activated_z= [];
        this.grad = [];
        this.Actualpoints = [];
        this.Screenpoints = [];
        this.id = id;
        this.gen = 0;
    }

    forward(x) {
        this.z =math.add(math.multiply(x,this.weights), this.bias);
        // this.activated_z = sigmoid(this.z);
        this.activated_z = relu(this.z);
    }

    //calculate delta_w and delta_b, the gradient of each weight and bias
    backprop_last(y) {  //previous layer and next layer
        //feed forward, calculate z and activated_z
        // this.forward(x);

        //calculate delta for the last layer
        //dotMultiply is * elementwise multiply

        // this.grad =  math.dotMultiply(math.subtract(this.activated_z, y), sigmoid_prime(this.z));
        this.grad =  math.dotMultiply(math.subtract(this.activated_z, y), relu_prime(this.z));
        this.dB = this.grad;
        this.dW = math.dotMultiply(this.weights, this.grad);
    }
    backprop(next) {
        // let grad_w = math.multiply(math.transpose(this.weights), next.grad);
        let grad_w = math.multiply(next.grad, this.weights);

        // this.grad = math.dotMultiply(grad_w, sigmoid_prime(this.z));
        this.grad = math.dotMultiply(grad_w, relu_prime(this.z));
        this.dB = this.grad;
        this.dW = math.dotMultiply(this.grad,this.activated_z);
    }


    learn(rate) {
        this.weights = math.subtract(this.weights, math.multiply(this.dW, rate));
        this.bias = math.subtract(this.bias, math.multiply(this.dB,rate));
        this.gen += 1;
    }

    generatePoints(x) {
        let tempActual = [];
        let tempScreen = [];
        for (let i =0; i< this.activated_z._data.length; i++) {
            let xx = x[i];
            let yy = this.z._data[i];
            // console.log(this.activated_z['_data'][i]);
            tempActual.push({x: xx, y: yy})
            tempScreen.push(convertActualToScreen(xx,yy,1024,512,20));
        }
        this.Actualpoints = tempActual;
        this.Screenpoints = tempScreen;
    }

}
// Relu
function relu(z) {
    let relu = z.map(x => Math.max(0, x));
    return relu;
}
function relu_prime(z) {
    let a_d = z.map(y => {if (y>0.01) {return 1;} else {return 0}}); //relu derivative
    return a_d
}

function sigmoid(z) {
    let sig = z.map(x => 1/(1+2.46**-x));
    return sig;
}

function sigmoid_prime(z) {
    let sp = z.map(x => 1/(1+2.46**-x) * (1-1/(1+2.46**-x)));
    return sp;
}

var l1;
var l2;
var x;
var y;
var DRAW = false;
var TRAIN = false;
//testing
// let l1 = new Layer(3,2, "first");
// let l2 = new Layer(2,3, "last");
// var x = [1,2,3];
// var y = [2,2,2];

