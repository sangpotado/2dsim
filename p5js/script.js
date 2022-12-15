function mandelbrot(n, c) {
    var z = 0;
    for (var i = 0; i < n; i++) {
      if (Math.abs(z) > 30) {
        return i;
      }
      z = z**2 + c;
    }
    return n;
  }
  
  function linspace(min, max, inc) {
    var r = [];
    for (var i=min; i<max; i+=(max-min)/inc) {
      r.push(i)
    }
    return r
  }
  function mandelbrot_set(xmin, xmax, ymin, ymax, width, height, max_iters) {
    var r1 = linspace(xmin, xmax, width);
    var r2 = linspace(ymin, ymax, height);
    // n3 = np.empty((width,height));
    var n3 = [];
    for (var i=0; i<r1.length; i++) {
        n3.push([]);
      for (var j=0; j<r2.length; j++) {
        n3[i].push(mandelbrot(max_iters,r1[i] + r2[j]))
      }
    }
    console.log(n3);
    return [r1, r2, n3]
  }

var ni = 40;
// var sett = mandelbrot_set(-2,1,-1.5,1.5,500,500, ni);

function draw_mandel(sett) {
    for (var i=0;i<500;i++) {
        for (var j=0;j<500;j++) {
          var col = 255 - sett[2][i][j];
          fill(col);
          ellipse(sett[0][i]*500+1000,sett[1][j]*-200+500, 1)
        }
      }
}
function hexagonVertices(x, y, r) {
    var vertices = [];
    for (var i = 0; i < 6; i++) {
      var theta = (i / 6) * (2 * Math.PI);
      var x_coord = x + r * Math.cos(theta);
      var y_coord = y + r * Math.sin(theta);
      vertices.push([x_coord, y_coord]);
    }
    return vertices;
  }


function centerHexagon(hexagon) {
  // Calculate the center of the hexagon
  var center = hexagon.reduce(function(acc, vertex) {
    return [acc[0] + vertex[0], acc[1] + vertex[1]];
  }, [0, 0]);
  center = [center[0] / hexagon.length, center[1] / hexagon.length];
  return center
}

function rotateHexagon(hexagon, angle) {

  center = centerHexagon(hexagon);
  // Define the rotation matrix
  var rotationMatrix = [[Math.cos(angle), -Math.sin(angle)],
                        [Math.sin(angle), Math.cos(angle)]];

  // Apply the rotation matrix to each vertex of the hexagon, using the center of the hexagon as the origin
  var rotatedHexagon = hexagon.map(function(vertex) {
    var x = vertex[0] - center[0];
    var y = vertex[1] - center[1];
    var x_rotated = rotationMatrix[0][0] * x + rotationMatrix[0][1] * y;
    var y_rotated = rotationMatrix[1][0] * x + rotationMatrix[1][1] * y;
    return [x_rotated + center[0], y_rotated + center[1]];
  });

  // Return the rotated hexagon
  return rotatedHexagon;
}


function scaleHexagon(hexagon, factor) {
  // Define the scaling matrix
  var scaleMatrix = [[factor, 0],
                     [0, factor]];

  // center
  var c = centerHexagon(hexagon);
  // Apply the scaling matrix to each vertex of the hexagon
  var scaledHexagon = hexagon.map(function(vertex) {
    var x = vertex[0] //- c[0];
    var y = vertex[1] //- c[1];
    var x_scaled = scaleMatrix[0][0] * x + scaleMatrix[0][1] * y;
    var y_scaled = scaleMatrix[1][0] * x + scaleMatrix[1][1] * y;
    return [x_scaled, y_scaled];
  });

  // Return the scaled hexagon
  return scaledHexagon;
}

var rot = true;
var scl = 1.01;
var angle =0.05;
var hex1 = hexagonVertices(500,250, 100)