function Ball(x, y, r, dna){
    this.r = r*2;
    this.dna = dna;
    this.body = Bodies.circle(x, y, r);
    this.body.collisionFilter.group = -1;

    this.options = {
        restitution: 0.6,
        friction: 0.1,
    }

    this.force = {
        x: this.dna.x_force,
        y: this.dna.y_force
    }

    

    World.add(world, this.body, this.options);
    Body.applyForce(this.body, this.body.position, this.force);

    this.current_dist = dist(this.body.position.x, this.body.position.y, target.x, target.y);
    this.min_dist = this.current_dist;
    
    

    this.show = function(){
        let pos = this.body.position;
        this.current_dist = dist(pos.x, pos.y, target.x, target.y);

        push();
        translate(pos.x, pos.y);
        strokeWeight(1);
        stroke(200);
        fill(250);
        ellipse(0, 0, this.r);
        pop();

        if(this.current_dist < this.min_dist)
           this.min_dist = this.current_dist;
    }

    this.isOffScreen = function(){
        let pos = this.body.position;
        return (pos.x > width) || (pos.y > height);
    }

    this.removeFromWorld = function(){
        World.remove(world, this.body);
    }


}

function DNA(x_force, y_force){
    this.x_force = x_force;
    this.y_force = y_force;
    this.fitness = 0.0;
}