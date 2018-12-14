// module aliasesl
let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body = Matter.Body;
    Constraint = Matter.Constraint;

let engine, world, boundries = [], balls = [], basket,
     population = [], newPopulation, popNumber = 40, mutationRate = 0.1,
      target = {x: null, y: null, r: 10}, lifespan = 0, maxFitness = 0, index = 0, 
      generationCount = 0, solutionFound = false, bestDNA;

let shootImg, noShootImg, imgX, imgY;   // Pics

function setup(){
    createCanvas(1200, 900);
    engine = Engine.create();
    world = engine.world;
    Engine.run(engine);

    mySetup();
    basket = new Basket(50, height/4);
    boundries.push(basket.getBounds());
    boundries.pop();

    shootImg = loadImage("assets/shoot.png");
    noShootImg = loadImage("assets/no_shoot.png");

    imgX = width-100;
    imgY = height-120;
    
}

function draw(){
    background(51);

    if(lifespan%10 == 0 && lifespan<400){
        balls.push(new Ball(imgX+5, imgY+5, 10, population[index]));
        index = (index+1)%popNumber;
    }else if(lifespan == 600){
        if(solutionFound == false)
            createNewGen();
        clearBalls();
        lifespan = -1;
    }

    drawStuff(); 

    lifespan++;

}

function drawStuff(){
    for(let i=0; i<balls.length; i++){
        balls[i].show();
        if(balls[i].isOffScreen()){
            balls[i].removeFromWorld();
        }
    }
    for(let i=0; i<boundries.length; i++){
        boundries[i].show();
    }
    basket.drawTarget();
    
    drawStats();
    
    if(lifespan%20 >=10 && lifespan<400)
        image(shootImg, imgX, imgY);
    else
        image(noShootImg, imgX, imgY);

}

function createNewGen(){
    calcFitness();
    naturalSelection();
    generationCount++;
}

function calcFitness(){
    minDistSum = 0;
    for(let i=0; i<balls.length; i++){
        minDistSum += balls[i].min_dist;
    }

    population[0].fitness = minDistSum/balls[0].min_dist;
    maxFitness = population[0].fitness;
    for(let i=1; i<population.length; i++){
        if(balls[i].min_dist <= target.r){
            bestDNA = balls[i].dna;
            for(let i=0; i<population.length; i++){
                population[i] = bestDNA;
            }

            solutionFound = true;
            return;
        }
        population[i].fitness = minDistSum/balls[i].min_dist;
        if(population[i].fitness > maxFitness)
            maxFitness = population[i].fitness;
    }
    
}

function naturalSelection(){
    if(solutionFound == true)
        return;

    newPopulation = [];
    for(let i=0; i<population.length; i++){
        newPopulation.push(crossOver(chooseParentRandomly(), chooseParentRandomly()));
    }

    population = newPopulation;

}

function chooseParentRandomly(){
    let safeCheck = 0;
    
    while(safeCheck < 10000){
        let parent = population[floor(random(population.length))];
        let r = random(maxFitness);

        if(r <= parent.fitness)
            return parent;
        safeCheck++;           
    }
    return null;
}

function crossOver(parentA, parentB){ 
    let chromosomeA = { x_force: parentA.x_force.toString(), y_force: parentA.y_force.toString() };
    let chromosomeB = { x_force: parentB.x_force.toString(), y_force: parentB.y_force.toString() };
    let newChromosome = {x_force: null, y_force: null};

    
    let midpoint = floor(random(chromosomeA.x_force.length));
    newChromosome.x_force = chromosomeA.x_force.substring(0, midpoint) + chromosomeB.x_force.substring(midpoint);   

    midpoint = floor(random(chromosomeA.y_force.length));
    newChromosome.y_force = chromosomeA.y_force.substring(0, midpoint) + chromosomeB.y_force.substring(midpoint);


    if(random(1) <= mutationRate){
        if(random(1) <= 0.25)
            newChromosome.x_force = newChromosome.x_force.replaceAt(floor(4, floor(random(4)).toString()));
        else
            newChromosome.x_force = newChromosome.x_force.replaceAt(floor(random(5, newChromosome.x_force.length)), floor(random(10)).toString());
    }

    if(random(1) <= mutationRate){
        newChromosome.y_force = newChromosome.y_force.replaceAt(floor(random(4, newChromosome.y_force.length)), floor(random(10)).toString());
    }
    

    return new DNA(parseFloat(newChromosome.x_force), parseFloat(newChromosome.y_force));
}

function initPopulation(){
    for(let i=0; i<popNumber; i++){
        population.push(new DNA(parseFloat(random(-0.025).toFixed(5)), parseFloat(random(-0.035).toFixed(5))));
    }
}

function clearBalls(){
    for(let i=0; i<balls.length; i++){
        balls[i].removeFromWorld();
    }
    balls = [];
}

function keyPressed(){
    if(key === "p")
        noLoop();
    else if(key === "s")
        loop();
}

function mouseClicked(){
    mySetup();
    basket = new Basket(50, mouseY);
    boundries.push(basket.getBounds());
    boundries.pop();
}
function drawStats(){
    push();
    fill(200)
    textSize(20);
    text("Population: " + popNumber, width-260, 30)
    text("Generation: " + generationCount, width-260, 55);
    text("Maximum fitness: " + maxFitness.toFixed(1), width-260, 80);
    text("Mutation rate: " + mutationRate, width-260, 105);
    if(solutionFound)
        fill(0, 200, 0);
    else
        fill(200, 0, 0);
    text("Soultion found: " + solutionFound, width-260, 130);
    pop();
}

function mySetup(){
    solutionFound = false;
    generationCount = 0;
    index = 0;
    lifespan = 0;
    maxFitness = 0;
    population = [];
    clearBalls();
    initPopulation();
    for(let i=0; i<boundries.length; i++){
        World.remove(world, boundries[i].body)
    }
    boundries = [];
    boundries.push(new Boundry(width/2, height+50, width, 100, PI));
    // boundries.push(new Boundry(width/2, 0-50, width, 100, PI));
    //boundries.push(new Boundry(0-50, height/2, 100, height, PI));
    boundries.push(new Boundry(width+50, height/2, 100, height, PI));
}

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + 1);
}