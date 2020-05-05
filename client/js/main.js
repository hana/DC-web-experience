'use strict';

import * as THREE from './lib/three/build/three.module.js';

// import { OrbitControls } from "./lib/three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "./lib/three/examples/jsm/controls/PointerLockControls.js";



import { MTLLoader } from "./lib/three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader2 } from "./lib/three/examples/jsm/loaders/OBJLoader2.js";
import { MtlObjBridge } from "./lib/three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";

let renderer, scene, camera, controls, lights;
const modelName = "cooperHewitt"
const Path_To_OBJ = './src/cooperHewitt.obj';
const Path_To_MTL = './src/cooperHewitt.mtl';


// Variables to move around
let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

function setup() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

    console.log(camera);
    camera.position.set(0, 50, -100);
    camera.rotation.y = -Math.PI * 0.5;
    camera.zoom = 1.0;

    // const helper = new THREE.CameraHelper( camera );
    // scene.add(helper);

    scene.add(new THREE.AxesHelper(10000));

    renderer = new THREE.WebGLRenderer({
        antialias:false,
    });
    renderer.setClearColor(0xaaaaaa);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    document.body.appendChild(renderer.domElement);

    renderer.domElement.addEventListener("mousedown", (e) =>  {
        controls.lock();
    })

    renderer.domElement.addEventListener("mouseup", (e) =>  {
        controls.unlock();
    }) 
    
    controls = new PointerLockControls(camera, renderer.domElement);


    
    document.addEventListener('keydown', (e) => {        
        switch (e.keyCode) {
            case 38:
            case 87:
                moveForward = true;
                break;
            case 37:
            case 65: // a
                moveLeft = true;
                break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;
            default:
                break;
        }    
    }, false)

    document.addEventListener('keyup', (e) => {
        switch ( e.keyCode ) {
            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // s
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;
            default:
                break;
        }
    }, false);


    lights = new THREE.Group();
    lights.add(new THREE.AmbientLight(0xfafafa));

    let light = new THREE.DirectionalLight( 0xC0C090 );
    light.position.set(5, 50, -100);
    lights.add(light);

    scene.add(lights);

    const addTestCube = () => {
        var geometry = new THREE.BoxGeometry();
        var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        var cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
    }
}

function loadObject() {
    const objLoader2 = new OBJLoader2();

    const callbackOnLoad = function ( object3d ) {
        scene.add( object3d );        
        console.log("done");
        console.log(object3d);
    };

    const onLoadMtl = function ( mtlParseResult ) {
        objLoader2.setModelName( modelName );
        objLoader2.setLogging( true, true );
        objLoader2.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
        objLoader2.load(Path_To_OBJ, callbackOnLoad, null, null, null );
    };
    const mtlLoader = new MTLLoader();
    mtlLoader.load( Path_To_MTL, onLoadMtl );
}



function update() {    
    const Delta_Mod = 10.0;
    const Move_Mod = 500.0;

    const time = performance.now();
    const delta = (time - prevTime) * 0.001;

    velocity.x -= velocity.x * Delta_Mod * delta;
    velocity.z -= velocity.z * Delta_Mod * delta;

    direction.z = Number(moveForward) - Number(moveBackward);
    direction.x = Number(moveRight) - Number(moveLeft);
    direction.normalize();

    if(moveForward || moveBackward)  velocity.z -= direction.z * Move_Mod * delta; 
    if(moveLeft || moveRight)  velocity.x -= direction.x * Move_Mod * delta; 

    controls.moveRight(-velocity.x * delta);
    controls.moveForward( -velocity.z * delta);

    prevTime = time;
}


function draw() {    
    update();
    
    renderer.render(scene, camera);

    requestAnimationFrame(draw);
}

function main() {
    setup();
    loadObject();
    draw();

}


document.addEventListener("DOMContentLoaded", main);

