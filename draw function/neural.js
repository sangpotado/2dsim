class Layer {
    constructor(n_inputs, n_neurons, learnrate) {
        this.weights = new Matrix(n_inputs, n_neurons);
        this.weights.randomize(-0.5,0.5);
        // this.bias = new Matrix(1, n_neurons);
        // this.bias.randomize(-0.5,0.5);
        // this.dW = new Matrix()
        // this.dB = math.zeros(n_neurons);
        // this.z = [];
        // this.activated_z= [];
        // this.grad = [];
        // this.Actualpoints = [];
        // this.Screenpoints = [];
        this.learnrate = learnrate;
    }

    forward(x) {
        this.z = Matrix.mult(x, this.weights) //+ this.bias;
        console.log('forwared, z: ', l1.z.toArray());
    }

    backprop(x,y) {  
        let error = Matrix.sub(y, this.z);
        error.mult(this.learnrate);
        console.log('error: ', error.toArray());

        // calculate gradient
        // db = this.bias.sub(error);
        this.dw = Matrix.mult(Matrix.transpose(x), error);

        // update weights
        // this.bias = Matrix.sub(this.bias, error);
        this.weights.add(this.dw);
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

var l1 = l1 = new Layer(5,3,0.01);
var x = Matrix.fromArray([1,2,3,4,5]);
var y = Matrix.fromArray([9,7,8]);
x = Matrix.transpose(x);
y = Matrix.transpose(y);

for (let i=0; i<10; i++) {
    console.log('iteration: ', i);
    l1.forward(x);
    l1.backprop(x,y);
}