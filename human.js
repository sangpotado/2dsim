class human {
    cosntructor(x, y) {
        this.body = new ball(50, x, y, 0, 0);
        this.head = new ball(30, x, y-55, 0, 0 );
    }
}

let drawHuman = function(h) {
    noStroke;
    fill(250);
    ellipse(h.body.x, h.body.y, h.body.r);
    ellipse(h.head.x,h.head.y, h.body.r);
}

