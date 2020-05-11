import * as THREE from '../three/build/three.module.js';
import { OrbitControls } from "../three/examples/jsm/controls/OrbitControls.js";

import Shape from '../shape.js';

let shape;

let scene, renderer, camera, controls, lights;

function setup() {
    scene = new THREE.Scene();
    
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, 70, 250);
    camera.rotation.y = -Math.PI * 0.5;
    camera.zoom = 1.0;

    // this.scene.add(new THREE.AxesHelper(10000));
    
    renderer = new THREE.WebGLRenderer({
        antialias:false,
    });
    renderer.setClearColor(0x111111);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);


    controls = new OrbitControls(camera, renderer.domElement);

   
    lights = new THREE.Group();
    // lights.add(new THREE.AmbientLight(0xfafafa));
    lights.add(new THREE.AmbientLight(0x111111));

    let light = new THREE.PointLight(0xFFFFFF, 1, 0);
    light.position.set(50, 50, 50);
    lights.add(light);

    scene.add(lights);

    shape = new Shape();

    scene.add(shape.getObject());


    // setInterval(() => {console.log(scene)}, 3000);
}

function   draw(){
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(draw);
};


function main() {
    setup();
    draw();
}


document.addEventListener('DOMContentLoaded', main);