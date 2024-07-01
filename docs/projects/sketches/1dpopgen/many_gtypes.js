// Canvas paramters
let width=600;
let height=300;
let margins=30;


let popsize = {
    default: 4,
    min: 1,
    max: 4,
    step: 0.1,
    current: 10**4,
    text: "Population Size (N)"
}

let mutprob = {
    default: -1,
    min: -4,
    max: -0.3,
    step: 0.1,
    current: 10**-1,
    text: "Mutation Rate (\u03BC)"
}

let fvar = {
    default: 0.3,
    min: 0.0,
    max: 0.5,
    step: 0.01,
    current: 0.3,
    text: "Fitness variance"
}

let num_gtypes = {
    default: 20,
    min: 2,
    max: 50,
    step: 1,
    current: 2,
    text: "Number of genotypes (k)"
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

let fvslider_props = {
    pos_x: margins,
    pos_y: margins+140,
    size: 100
}

let numgslider_props = {
    pos_x: margins,
    pos_y: margins+200,
    size: 100
}

let plot_props = {
    pos_x: margins+230,
    pos_y: margins-30,
    width: 350,
    height: 300
}

function boxMullerTransform() {
    const u1 = Math.random();
    const u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);
    
    return { z0, z1 };
}

function getRandomNormal(mean,stdev){
    const { z0, _ } = boxMullerTransform();
    let num = z0*stdev+mean;
    if(num>=0){
        return num;
    } else {
        return 0.0;
    }
}

let population = Array(num_gtypes.current).fill(popsize.current/num_gtypes.current);
let fitnesses = Array.from({length:num_gtypes.current}, () => getRandomNormal(1.0,fvar.current));

function setup(){
    createCanvas(width,height);

    textSize(18);

    popslider = createSlider(popsize.min,popsize.max,popsize.default,popsize.step);
    popslider.position(popslider_props.pos_x,popslider_props.pos_y);
    popslider.size(popslider_props.size);

    mutslider = createSlider(mutprob.min,mutprob.max,mutprob.default,mutprob.step);
    mutslider.position(mutslider_props.pos_x,mutslider_props.pos_y);
    mutslider.size(mutslider_props.size);

    fvslider = createSlider(fvar.min,fvar.max,fvar.default,fvar.step);
    fvslider.position(fvslider_props.pos_x,fvslider_props.pos_y);
    fvslider.size(fvslider_props.size);

    numgslider = createSlider(num_gtypes.min,num_gtypes.max,num_gtypes.default,num_gtypes.step);
    numgslider.position(numgslider_props.pos_x,numgslider_props.pos_y);
    numgslider.size(numgslider_props.size);

    plot = new GPlot(this);
    plot.setPos(plot_props.pos_x,plot_props.pos_y);
    plot.setOuterDim(plot_props.width,plot_props.height);

    plot.setXLim(-2.5,3.5);
    plot.setYLim(0,1);
    plot.startHistograms(GPlot.VERTICAL);
    plot.getXAxis().setAxisLabelText("Genotypes");
    plot.getXAxis().setFontSize(10);
    plot.getYAxis().setFontSize(16);
    plot.getXAxis().lab.setFontSize(18);
    plot.getYAxis().lab.setFontSize(18);
    plot.getXAxis().setTicks([0,1]);
    plot.getXAxis().setTickLabels(["",""]);
    plot.getYAxis().setAxisLabelText("Fraction");
    plot.getHistogram().setBgColors([color("#a0a7f6")]);
    plot.getHistogram().setLineColors([color("#3c4bfa")]);
    plot.getHistogram().setLineWidths([1]);

    plotfit = new GPlot(this);
    plotfit.setPos(plot_props.pos_x,plot_props.pos_y);
    plotfit.setOuterDim(plot_props.width,plot_props.height);
    plotfit.setXLim(-2.5,3.5);
    plotfit.setYLim(0,2);
    plotfit.getXAxis().setTicks([0,1]);
    plotfit.getXAxis().setTickLabels(["",""]);
    plotfit.startHistograms(GPlot.VERTICAL);
    plotfit.getHistogram().setBgColors([color('rgba(183, 7, 247, 0.2)')]);
    plotfit.getHistogram().setLineColors([color('rgba(255, 0, 0, 0.0)')]);


}

function multvectors(a,b){
    return a.map((e,i)=> e*b[i]);
}

function evostep(pop,fit){
    let mu = 10**mutslider.value();
    let n = Math.round(10**popslider.value());

    // Force the pop vector to be the same length as number of genotypes (truncate or add zeroes)
    pop.length = num_gtypes.current;

    // ## Select
    weights = multvectors(pop,fit);
    //console.log(weights);
    new_pop = SJS.Multinomial(n,weights).draw();

    // ## Mutate
    // Calculate number of mutants of each gtype
    num_mutants = Array(new_pop.length).fill().map((e,idx) => SJS.Poisson(new_pop[idx]*mu).draw());
    //console.log(num_mutants);
    for(idx=0;idx<num_mutants.length;idx++){
        if(idx==0){
            new_pop[idx] += num_mutants[idx+1]/2-num_mutants[idx]/2;
        } else if (idx==num_mutants.length-1){
            new_pop[idx] += num_mutants[idx-1]/2-num_mutants[idx]/2;
        } else {
            new_pop[idx] += num_mutants[idx-1]/2+num_mutants[idx+1]/2 - num_mutants[idx];
        }
    }
    //console.log(new_pop);

    return new_pop;
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

    if(fvslider.value()!=fvar.current){ // If fvar is changed
        fvar.current= fvslider.value();
        // Regenerate fitness landscape
        fitnesses = Array.from({length:num_gtypes.current}, () => getRandomNormal(1.0,fvar.current));
    }
    text(fvar.text,fvslider_props.pos_x+5,fvslider_props.pos_y-10);
    text(fvar.current,fvslider_props.pos_x + fvslider_props.size+10, fvslider_props.pos_y+15);

    if(numgslider.value()!=num_gtypes.current){ // If num_gtypes is changed
        num_gtypes.current = numgslider.value();
        // Regenerate fitness landscape
        fitnesses = Array.from({length:num_gtypes.current}, () => getRandomNormal(1.0,fvar.current));

        // Rescale the x-axis
        plot.setXLim(-2.5,num_gtypes.current+1.5);
        plot.getXAxis().setTicks(Array(num_gtypes.current).fill().map((element,index)=> index));
        plot.getXAxis().setTickLabels(Array(num_gtypes.current).fill(""));

        plotfit.setXLim(-2.5,num_gtypes.current+1.5);
        plotfit.getXAxis().setTicks(Array(num_gtypes.current).fill().map((element,index)=> index));
        plotfit.getXAxis().setTickLabels(Array(num_gtypes.current).fill(""));
    }
    text(num_gtypes.text,numgslider_props.pos_x+5,numgslider_props.pos_y-10);
    text(num_gtypes.current,numgslider_props.pos_x+numgslider_props.size+10,numgslider_props.pos_y+15);


    // Update population here!
    population = evostep(population,fitnesses);

    // Update fitness values
    fitpts = [];
    for(let i=0; i<fitnesses.length; i++){
        fit = fitnesses[i];
        fitpts.push(new GPoint(i,fit));
    }
    plotfit.setPoints(fitpts);


    // Update population
    points = [];
    for(let i=0; i<population.length; i++){
        gpop = population[i];
        points.push(new GPoint(i,gpop/popsize.current));
    }
    plot.setPoints(points);

    // Draw population
    plot.beginDraw();
    plot.drawXAxis();
    plot.drawYAxis();
    plot.drawHistograms();
    plot.endDraw();

    // Draw fitness landscape
    plotfit.beginDraw();
    plotfit.drawHistograms();
    plotfit.endDraw();
}




