import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation

# Set up figure and axes
fig, ax = plt.subplots()

# Set up the Mandelbrot set
N_max = 50
some_threshold = 50

def mandelbrot(c, max_iters):
    z = c
    for n in range(max_iters):
        if abs(z) > some_threshold:
            return n
        z = z*z + c
    return max_iters

def mandelbrot_set(xmin, xmax, ymin, ymax, width, height, max_iters):
    r1 = np.linspace(xmin, xmax, width)
    r2 = np.linspace(ymin, ymax, height)
    n3 = np.empty((width,height))
    for i in range(width):
        for j in range(height):
            n3[i,j] = mandelbrot(r1[i] + 1j*r2[j], max_iters)
    return (r1, r2, n3)

# Set up the animation
xmin, xmax, ymin, ymax = -2, 1, -1.5, 1.5
width, height = 500, 500
max_iters = 50

X, Y, Z = mandelbrot_set(xmin, xmax, ymin, ymax, width, height, max_iters)
# print(Z[3])
image = ax.imshow(Z, interpolation="bilinear", extent=[xmin, xmax, ymin, ymax],
                  cmap=plt.cm.RdYlGn, origin="lower")

# Set up the function to update the plot in each frame
def update(frame):
    global max_iters
    # Increase the maximum number of iterations in each frame
    max_iters += 1
    
    # Generate a new Mandelbrot set with the updated maximum number of iterations
    X, Y, Z = mandelbrot_set(xmin, xmax, ymin, ymax, width, height, max_iters)
    
    # Update the image with the new data
    image.set_data(Z)
    
    return image

# Set up the animation using FuncAnimation
animation = FuncAnimation(fig, update, frames=np.arange(0, 10), interval=500)

plt.show()

