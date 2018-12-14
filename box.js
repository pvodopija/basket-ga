function Box(x, y, w, h){
    this.w = w;
    this.h = h;

    let options = {
        restitution: 0.6,
        friction: 0.3,
    }
    this.body = Bodies.rectangle(x, y, w, h, options);
    World.add(world, this.body, options);

    this.show = function(){
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        strokeWeight(1);
        stroke(200);
        fill(250);
        rotate(angle);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        pop();
    }
}