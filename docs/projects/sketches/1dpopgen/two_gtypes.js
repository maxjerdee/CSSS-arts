// Canvas paramters
let width=600;
let height=300;
let margins=30;


let popsize = {
    default: 4,
    min: 1,
    max: 5,
    step: 0.1,
    current: 10**4,
    text: "Population Size (N)"
}

let mutprob = {
    default: -1,
    min: -4,
    max: -1,
    step: 0.1,
    current: 10**-2,
    text: "Mutation Rate (\u03BC)"
}

let selcof = {
    default: 1.001,
    min: 1,
    max: 1.2,
    step: 0.001,
    current: 1.001,
    text: "Fitness of B/Fitness of A (s)"
}

let popslider_props = {
    pos_x: margins,
    pos_y: margins+20,
    size: 100
}

let mutslider_props = {
    pos_x: margins,
    pos_y: margins+80,
    size: 100
}

let selslider_props = {
    pos_x: margins,
    pos_y: margins+140,
    size: 100
}

let plot_props = {
    pos_x: margins+230,
    pos_y: margins-30,
    width: 350,
    height: 300
}

let population = {
    gtype_a : popsize.default/2,
    gtype_b : popsize.default/2
}



function setup(){
    createCanvas(width,height);

    textSize(18);

    popslider = createSlider(popsize.min,popsize.max,popsize.default,popsize.step);
    popslider.position(popslider_props.pos_x,popslider_props.pos_y);
    popslider.size(popslider_props.size);

    mutslider = createSlider(mutprob.min,mutprob.max,mutprob.default,mutprob.step);
    mutslider.position(mutslider_props.pos_x,mutslider_props.pos_y);
    mutslider.size(mutslider_props.size);

    selslider = createSlider(selcof.min,selcof.max,selcof.default,selcof.step);
    selslider.position(selslider_props.pos_x,selslider_props.pos_y);
    selslider.size(selslider_props.size);

    plot = new GPlot(this);
    plot.setPos(plot_props.pos_x,plot_props.pos_y);
    plot.setOuterDim(plot_props.width,plot_props.height);

    point_A = new GPoint(0,population.gtype_a/popsize.current);
    point_B = new GPoint(1,population.gtype_b/popsize.current);

    plot.setPoints([point_A,point_B]);
    plot.setXLim(-2.5,3.5);
    plot.setYLim(0,1);
    plot.startHistograms(GPlot.VERTICAL);
    plot.getXAxis().setAxisLabelText("Genotypes");
    plot.getXAxis().setFontSize(16);
    plot.getYAxis().setFontSize(16);
    plot.getXAxis().lab.setFontSize(18);
    plot.getYAxis().lab.setFontSize(18);
    plot.getXAxis().setTicks([0,1]);
    plot.getXAxis().setTickLabels(["A","B"]);
    plot.getYAxis().setAxisLabelText("Fraction");
    plot.getHistogram().setBgColors([color("#a0a7f6"), color("#ede16f")]);
    plot.getHistogram().setLineColors([color("#3c4bfa"), color("#cfbc09")]);
    plot.getHistogram().setLineWidths([2,2]);


}

function evostep(pop){
    let mu = 10**mutslider.value();
    let n = Math.round(10**popslider.value());
    let s = selslider.value();

    // Selection weights
    weights = [1.0*pop.gtype_a,s*pop.gtype_b];
    new_pops = SJS.Multinomial(n,weights).draw();
    pop.gtype_a = new_pops[0];
    pop.gtype_b = new_pops[1];

    //Calculate number of mutants
    num_atob = SJS.Poisson(pop.gtype_a*mu).draw();
    num_btoa = SJS.Poisson(pop.gtype_b*mu).draw();

    // Mutate
    pop.gtype_a+=num_btoa;
    pop.gtype_a-=num_atob;
    pop.gtype_b+=num_atob;
    pop.gtype_b-=num_btoa;

    return pop;
}

function draw(){
    clear();

    // Draw Controls
    popsize.current=Math.round(10**popslider.value());
    text(popsize.text,popslider_props.pos_x+5,popslider_props.pos_y-10);
    text(popsize.current,popslider_props.pos_x + popslider_props.size+10, popslider_props.pos_y+15);

    mutprob.current=Math.round(10000 * 10**mutslider.value())/10000;
    text(mutprob.text,mutslider_props.pos_x+5,mutslider_props.pos_y-10);
    text(mutprob.current,mutslider_props.pos_x + mutslider_props.size+10, mutslider_props.pos_y+15);

    selcof.current= selslider.value();
    text(selcof.text,selslider_props.pos_x+5,selslider_props.pos_y-10);
    text(selcof.current,selslider_props.pos_x + selslider_props.size+10, selslider_props.pos_y+15);


    // Evolution logic
    population = evostep(population);

    // Update histograms
    point_A = new GPoint(0,population.gtype_a/popsize.current);
    point_B = new GPoint(1,population.gtype_b/popsize.current);
    plot.setPoints([point_A,point_B]);

    // Draw
    plot.beginDraw();
    plot.drawXAxis();
    plot.drawYAxis();
    plot.drawHistograms();
    plot.endDraw();



}




