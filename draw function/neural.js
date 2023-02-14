function dotProduct(a, b) {
    return a.map((x, i) => x * b[i]).reduce((m, n) => m + n, 0);
  }
function addArrays(a, b) {
    return a.map((x, i) => x + b[i]);
  }

function getXValues(points) {
    return points.map(point => point.x);
}
function getYValues(points) {
    return points.map(point => point.y);
}
  

class Layer {
    constructor(n_inputs, n_neurons) {
        this.weights = [];
        this.bias = [];
        this.losses = [];
        this.TotalLoss = 0;
        this.output = [];
        this.Actualpoints = [];
        this.Screenpoints = [];
        this.gen = 0;

        let neuron = 0;
        while (neuron < n_neurons) {
            let w_neuron = [];
            for (let i=0; i<n_inputs; i++) {
                w_neuron.push(Math.random());
            }
            this.weights.push(w_neuron);
            this.bias.push(Math.random());
            neuron++;
            }
    }

    forward(inputs) {
        let tempOutput = [];
        for (let i=0; i<this.weights.length; i++) {
            let result = dotProduct(inputs, this.weights[i]);
            tempOutput.push(result);
        }
        this.output = addArrays(tempOutput, this.bias);
        // console.log('X forwarded to nodes')
    }

    ReLu() {
        let relu = this.output.map(x => Math.max(0, x));
        this.output = relu;
    }

    sigmoid() {
        let sigmoid = this.output.map(x => 1/(1+2.46**-x));
        this.output = sigmoid;
    }

    CalculateLoss(Y) {
        let temploss = [];
        this.TotalLoss = 0;
        for (let i=0; i<this.output.length; i++) {
            let loss = (this.output[i] - Y[i])**2;
            temploss.push(loss);
            this.TotalLoss += loss;
        }
        this.losses = temploss;
        this.TotalLoss /= this.losses.length;
        // console.log(this.TotalLoss);
    }

    learn(rate,X) {
        let result = this.weights.map(neuron => neuron.map((w,i) => w -rate* this.losses[i]/this.TotalLoss));
        // let resultBias = this.bias.map((b, i) => b - rate*this.losses[i]/this.aaTotalLoss*b);
        this.weights = result;
        // this.bias = resultBias;
        this.gen += 1;

    }

    generatePoints(X) {
        let tempActual = [];
        let tempScreen = [];
        for (let i =0; i< this.output.length; i++) {
            let xx = X[i];
            let yy = this.output[i];

            tempActual.push({x: xx, y: yy})
            tempScreen.push(convertActualToScreen(xx,yy,1024,512,20));
        }
        this.Actualpoints = tempActual;
        this.Screenpoints = tempScreen;
    }
}

var layer1;
var layer2;
var X;
var Y;
var Dlayer1 = false;