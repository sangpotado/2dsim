function dotProduct(a, b) {
    return a.map((x, i) => x * b[i]).reduce((m, n) => m + n, 0);
  }

function elementProduct(a, b) {
    if (a.length !== b.length) {
      throw "Arrays must have the same length.";
    }
    return a.map((item, index) => item * b[index]);
  }

function addArrays(a, b) {
    return a.map((x, i) => x + b[i]);
  }

function subtractArray(a, b) {
    return a.map((x, i) => x - b[i]);
}

function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
  }


