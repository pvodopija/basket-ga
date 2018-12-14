function Boundry(x, y, w, h, angle){
    this.w = w;
    this.h = h;
    let options = {
        restitution: 0.6,
        friction: 0.3,
        isStatic: true,
        angle: angle,
    }

    this.body = Bodies.rectangle(x, y, w, h, options);

    World.add(world, this.body);

    this.show = function(){
        let pos = this.body.position;
        let angle = this.body.angle;

        push();
        translate(pos.x, pos.y);
        //strokeWeight(1);
        //stroke(250);
        fill(200);
        rotate(angle);
        rectMode(CENTER);
        rect(0, 0, this.w, this.h);
        pop();
    }
}