import Visual from './visual.js';

visual = new Visual();

function setup()    {
    visual.setup();
}

function update()   {
    visual.update();
};

function draw() {
    requestAnimationFrame(draw);

    visual.draw();
}

function main() {
    setup();
    draw();
}

document.addEventListener("DOMContentLoaded", main);