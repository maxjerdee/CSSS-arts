var popLayer;
//var nnLayer;


var cscale = chroma.scale('Viridis');

// Canvas paramters
let width=800;
let height=640;

// World parameters
let worldwidth = width-200;
let worldheight = height-40;
let worldxmin = 20;
let worldymin = 20;
let worldxmax = worldxmin+worldwidth;
let worldymax = worldymin+worldheight;

// popsize
var popsize = 4;
var popsizemin = 1;
var popsizemax= 4.1;

// mutprob
var mutprob = -1;
var mutprobmin = -5;
var mutprobmax = -1;

// selection coefficient
var selcof = 0.0;
var selcofmin=-1.0;
var selcofmax = 1.0;
var selcofstep = 0.01;

// switching probability
var switchprob = -5;
var switchprobmin = -5;
var switchprobmax = 0.01;
var switchprobstep = 1;

// Genotype space properties
var gridsize_x = 50;
var gridsize_y = 50;
var cell_width = worldwidth/gridsize_x;
var cell_height = worldheight/gridsize_y;

// Speed
var speed = 0;
var speedmin = 0;
var speedmax = 5;





var pop = [];
var diffit = [];  // List of genotypes with a different fitness than the rest
var rects = [];

var time_avg_flag = false;
var avg_pop = [];

var env = false; // Switches between 0 and 1
var envswitching = true; // Should environment switching be ON?


function add_genotypes(popi,gtype,n=1) {
  var gx = gtype[0];
  var gy = gtype[1];
  var gid = gy*gridsize_x+gx;

  if(typeof popi[0]=='undefined'){
    popi[0]=[gid];
    popi[1]=[n];
  }  else if(popi[0].includes(gid)){
    popi[1][popi[0].indexOf(gid)] += n;
  } else {
    popi[0].push(gid);
    popi[1].push(n);
  }
}

function mutate_gtype(gtype){
  var gx = gtype%gridsize_x;
  var gy = Math.floor(gtype/gridsize_x);

  var dir = int(random(0,4));

  if(dir==0){ //N
    var gy_new = gy<gridsize_y-1 ? gy+1 : 0;
    return gy_new*gridsize_x+gx;
  } else if(dir==1){ //E
    var gx_new = gx<gridsize_x-1 ? gx+1 : 0;
    return gy*gridsize_x+gx_new;
  } else if(dir==2){ //S
    var gy_new = gy>0 ? gy-1 : gridsize_y-1;
    return gy_new*gridsize_x+gx;
  } else if(dir==3){ //W
    var gx_new = gx>0 ? gx-1 : gridsize_x-1;
    return gy*gridsize_x+gx_new;
  }
}

function mutate(gtypes_to_add,num_mutants){
  for(let i=0;i<num_mutants;i++){
    mut_idx = int(random(0,gtypes_to_add.length));
    gtype = gtypes_to_add[mut_idx];
    gtypes_to_add[mut_idx] = mutate_gtype(gtype);
  }
}

function multvector(a,b){
  return a.map((e,i) => e * b[i]);
}

function evostep(pop){
  var new_pop = [];

  var num_mutants = Prob.poisson(Math.pow(10,popsize)*Math.pow(10,mutprob))(); // Number of mutants picked from a Poisson distribution
  var weights = [];
  for(let idx=0;idx<pop[0].length;idx++){
    gtype = pop[0][idx];
    if(diffit.includes(gtype)){
      weights.push(!env ? 1.0+selcof : 1.0);
    }
    else{
      weights.push(!env ? 1.0 : 1.0+selcof);
    }
  }

  var gtypes_to_add = math.pickRandom(pop[0],multvector(pop[1],weights),Math.pow(10,popsize));
  mutate(gtypes_to_add,num_mutants);

  for(let i=0;i<gtypes_to_add.length;i++){
    var gtype = gtypes_to_add[i];
    var gx = gtype%gridsize_x;
    var gy = Math.floor(gtype/gridsize_x); 
    add_genotypes(new_pop,[gx,gy]);
  }

  return new_pop;
}

function setup(){

  // Create the basic structure
  createCanvas(width,height); // Create canvas
  background(255);
  popLayer = createGraphics(width,height);
  nnLayer = createGraphics(width,height);

  gui= createGui('Options');
  gui.addGlobals('popsize','mutprob','selcof','switchprob','speed');
  gui.setPosition(worldxmax+20,worldymin);

  button1 = createButton('Reset Neutral Network');
  button1.position(worldxmax+20,worldymax);
  button1.mousePressed(clearNN);

  button2 = createButton('Start Time Averaging');
  button2.position(worldxmax+20,worldymax-40);
  button2.mousePressed(startTimeAverage);

  button3 = createButton('Turn off Environment switching');
  button3.position(worldxmax+20,worldymax-160);
  button3.mousePressed(envSwitchOff);



  for (let i=0; i<Math.pow(10,popsize); i++){
    add_genotypes(pop,[int(random(0,gridsize_x)),int(random(0,gridsize_y))]);
  }



}


function draw(){
  popLayer.background(255,255);
  // Draw the current population
  if(!time_avg_flag){
    var maxpop = Math.max.apply(null,pop[1]);
    var minpop = Math.min.apply(null,pop[1]);
    for(idx=0;idx<pop[0].length;idx++){
      var gtype = pop[0][idx];
      var gx = gtype%gridsize_x;
      var gy = Math.floor(gtype/gridsize_x); 
      var norgs = pop[1][idx];
      popLayer.fill(cscale((norgs-minpop)/(maxpop-minpop)).rgb());
      popLayer.noStroke();
      popLayer.rect(worldxmin+gx*cell_width,worldymin+gy*cell_height,cell_width,cell_height);
    }
  } else{
    var maxpop = Math.max.apply(null,avg_pop[1]);
    var minpop = Math.min.apply(null,avg_pop[1]);
    for(idx=0;idx<avg_pop[0].length;idx++){
      var gtype = avg_pop[0][idx];
      var gx = gtype%gridsize_x;
      var gy = Math.floor(gtype/gridsize_x); 
      var norgs = avg_pop[1][idx];
      popLayer.fill(cscale((norgs-minpop)/(maxpop-minpop)).rgb());
      popLayer.noStroke();
      popLayer.rect(worldxmin+gx*cell_width,worldymin+gy*cell_height,cell_width,cell_height);
    }
  }


  image(popLayer,0,0);
  

  // Draw the neutral network
  var union;
  if(rects.length!=0){
    union = rects[0];
    for(let i=1;i<rects.length;i++){
      rect = rects[i];
      union = g.compound(rect,union,'union');
    }
    union.fill=null;
    union.stroke='red';
    union.strokeWidth=2;
    union.draw(drawingContext);
  }

  // Draw a circle for the environment
  fill(env ? 255 : 0);
  noStroke();
  circle(worldxmax+60,worldymax-100,50);


  // Update population
  for(let i=0;i<Math.pow(10,speed);i++){
    pop = evostep(pop);
    // Switch environment with switchprob;
    if(envswitching){
      if(Math.pow(10,switchprob)>=Math.random()){
        env = !env;
      } 
    } else {
      env = false;
    }
    if(time_avg_flag){
      avg_pop = get_avg_pop(avg_pop,pop);
    }
  }



}

function mouseDragged(){
  if(mouseX<worldxmax && mouseX>worldxmin && mouseY<worldymax && mouseY>worldymin){
    var gx = Math.floor((mouseX-worldxmin)/cell_width);
    var gy = Math.floor((mouseY-worldymin)/cell_width);
    var gid = gy*gridsize_x+gx;
    if(!diffit.includes(gid)){ 
      var rect = g.rect(worldxmin+(gx+1)*cell_width-(cell_width/2),worldymin+(gy+1)*cell_height-(cell_height/2),cell_width,cell_height);
      rects.push(rect);
      diffit.push(gid);
    }
  }
}

function clearNN(){
  rects = [];
  diffit = [];
}

function startTimeAverage(){
  if(time_avg_flag){
    time_avg_flag = false;
    button2.html("Start Time Averaging");
  } else {
    time_avg_flag = true;
    button2.html("Stop Time Averaging");
    avg_pop = [...pop];
    popLayer.clear();
  }
}

function envSwitchOff(){
  if(envswitching){
    envswitching = false;
    button3.html("Turn on Environment switching");
  } else {
    envswitching = true;
    button3.html("Turn off Environment switching");
  }
}

function get_avg_pop(avg_pop,pop){
  for(let idx=0;idx<pop[0].length;idx++){
    var gtype = pop[0][idx];
    var gx = gtype%gridsize_x;
    var gy = Math.floor(gtype/gridsize_x); ;
    var gnum = pop[1][idx];
    add_genotypes(avg_pop,[gx,gy],gnum);
  }
  return avg_pop;
}


