import Visual from './visual.js';
import Socket from './socket.js'

const visual = new Visual();
const socket = new Socket();

let timer;

async function setup()    {
    
    visual.setup();
    await visual.loadObject();
    console.log("after await");
    socket.setup();
       
    socket.addEventListener('/init', (args) => {
        visual.init(args);
    })

    socket.addEventListener('/user/enter', (id) => {
        console.log("New User");
        visual.addOtherUser(id);
    });

    socket.addEventListener('/user/leave', (id) => {
        visual.deleteOtherUser(id);
    });

    socket.addEventListener('/user/position', (mes) => {
        visual.setOtherUserPosition(mes.id, mes.x, mes.y, mes.z);
    })

    socket.addEventListener('/user/rotation', (mes) => {
        visual.setOtherUserRotation(mes.id, mes.x, mes.y, mes.z);
    })

    visual.setOnMove(() => {
        const pos = visual.getUserPosition();
        socket.send("/user/position", pos);
    })

    timer = setInterval(() =>{
        const rotation = visual.getUserRotation();
        socket.send("/user/rotation", rotation);

    }, 100);
}

function update()   {
    visual.update();
};

function draw() {    
    update();
    requestAnimationFrame(draw);

    visual.draw();
}

async function main() {
    await setup();

    console.log("Start drawing");
    draw();
}


function onWindowResize() {
    visual.onWindowResize();
}

window.addEventListener('beforeunload', (e) =>  {
    clearInterval(timer);
    socket.close();
});

document.addEventListener("DOMContentLoaded", main);
window.addEventListener('resize', onWindowResize);