import * as THREE from './three/build/three.module.js';
import Visual from './visual.js';
import Socket from './socket.js'
import Sound from './sound.js'

const visual = new Visual();
const socket = new Socket();
const sound = new Sound();
let timer;

async function setup()    {
    sound.setup();
    visual.setup();
    await visual.loadObject();
    socket.setup();
    
       
    socket.addEventListener('/init', (args) => {    
        // visual.init(args);
        for(let key in args)    {
            visual.addUser(args[key]);
            sound.add();
        }
    });

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

    socket.addEventListener('/user/walk', (message) => {
        const pos = new THREE.Vector3(message.x, message.y, message.z);
        const dist = pos.distanceTo(visual.getUserPosition());
        
        const db = Math.pow(dist, 2.0) * 0.0001 * (-1);
        console.log(db);
        sound.play(db);
    })

    visual.setOnMove(() => {
        const pos = visual.getUserPosition();
        socket.send("/user/position", pos);
    })

    visual.setOnWalk(() => {
        const pos = visual.getUserPosition();
        socket.send("/user/walk", pos);
        // sound.play();
    });

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