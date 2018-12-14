function Basket(x, y){
    this.x = x;
    this.y = y;
    this.boundries = [];

    this.getBounds = function(){
        boundries.push(new Boundry(this.x+60, this.y+45, 15, 100, -PI/10));
        boundries.push(new Boundry(this.x, this.y, 110, 10, PI));
        //boundries.push(new Boundry(this.x+85, this.y+90, 80, 10, PI));
        boundries.push(new Boundry(this.x+85+50, this.y+45, 15, 100, PI/10));
        target.x = this.x + 100;
        target.y = this.y + 20;

        return this.boundries;
    }

    this.drawTarget = function(){
        push();
        fill(51);
        strokeWeight(2);
        stroke(200);
        ellipse(this.x+100, this.y, 100, 10);
        pop();

        fill(0, 200, 0);
        ellipse(target.x, target.y, target.r);
    }

}