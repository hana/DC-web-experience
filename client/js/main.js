import Visual from './visual.js';
import Socket from './socket.js'

const visual = new Visual();
const socket = new Socket();

async function setup()    {
    visual.setup();
    await visual.loadObject();

    socket.setup();

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

    setInterval(() =>{
        const pos = visual.getUserPosition();
        socket.send("/user/position", pos);

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

function main() {
    setup();
    draw();
}

function onWindowResize() {
    visual.onWindowResize();
}

document.addEventListener("DOMContentLoaded", main);
window.addEventListener('resize', onWindowResize);