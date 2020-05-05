import Visual from './visual.js';

const visual = new Visual();

function setup()    {
    visual.setup();
    visual.loadObject();
}

function update()   {
    visual.update();
};

function draw() {
    update();
    requestAnimationFrame(draw);

    visual.draw();
}

function main() {
    setup();
    draw();
}

function onWindowResize() {
    visual.onWindowResize();
}

document.addEventListener("DOMContentLoaded", main);