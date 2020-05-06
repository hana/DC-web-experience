import * as THREE from './three/build/three.module.js';

// import { OrbitControls } from "./lib/three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "./three/examples/jsm/controls/PointerLockControls.js";

import { MTLLoader } from "./three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader2 } from "./three/examples/jsm/loaders/OBJLoader2.js";
import { MtlObjBridge } from "./three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";

import Shape from './shape.js';

const modelName = "cooperHewitt"
const Path_To_OBJ = './src/cooperHewitt.obj';
const Path_To_MTL = './src/cooperHewitt.mtl';

let scene, renderer, camera, controls;

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let onMove = null;

const move = {
    forward:false,
    backward:false,
    left:false,
    right:false
}

const others = {};


export default class Visual {
    constructor()   {}

    setup(){
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 50, -100);
        camera.rotation.y = -Math.PI * 0.5;
        camera.zoom = 1.0;

        // this.scene.add(new THREE.AxesHelper(10000));
        
        renderer = new THREE.WebGLRenderer({
            antialias:false,
        });
        renderer.setClearColor(0xAAAAAA);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
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
                    move.forward = true;
                    break;
                case 37:
                case 65: // a
                    move.left = true;
                    break;
    
                case 40: // down
                case 83: // s
                    move.backward = true;
                    break;
    
                case 39: // right
                case 68: // d
                    move.right = true;
                    break;
                default:
                    break;
            }    
        }, false)
    
        document.addEventListener('keyup', (e) => {
            switch ( e.keyCode ) {
                case 38: // up
                case 87: // w
                    move.forward = false;
                    break;
    
                case 37: // left
                case 65: // a
                    move.left = false;
                    break;
    
                case 40: // down
                case 83: // s
                    move.backward = false;
                    break;
    
                case 39: // right
                case 68: // d
                    move.right = false;
                    break;
                default:
                    break;
            }
        }, false);

        this.lights = new THREE.Group();
        this.lights.add(new THREE.AmbientLight(0xfafafa));

        let light = new THREE.DirectionalLight(0xC0C090);
        light.position.set(5, 50, -100);
        this.lights.add(light);

        scene.add(this.lights);


        // setInterval(() => {console.log(scene)}, 3000);
    }

    loadObject() {
        return new Promise((resolve) =>{
            const objLoader2 = new OBJLoader2();
        
            const callbackOnLoad = ( object3d ) => {
                scene.add( object3d );        
                console.log("Object loaded.");
                resolve();
            };
        
            const onLoadMtl = ( mtlParseResult ) =>{
                objLoader2.setModelName( modelName );
                // objLoader2.setLogging( true, true );
                objLoader2.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
                objLoader2.load(Path_To_OBJ, callbackOnLoad, null, null, null );
            };
            const mtlLoader = new MTLLoader();
            mtlLoader.load( Path_To_MTL, onLoadMtl );
        })

    }

    update(){
        const Delta_Mod = 10.0;
        const Move_Mod = 800.0;
    
        const time = performance.now();
        const delta = (time - prevTime) * 0.001;
    
        velocity.x -= velocity.x * Delta_Mod * delta;
        velocity.z -= velocity.z * Delta_Mod * delta;
    
        direction.z = Number(move.forward) - Number(move.backward);
        direction.x = Number(move.right) - Number(move.left);
        direction.normalize();
    
        if(move.forward || move.backward)  velocity.z -= direction.z * Move_Mod * delta; 
        if(move.left || move.right)  velocity.x -= direction.x * Move_Mod * delta; 
    
        controls.moveRight(-velocity.x * delta);
        controls.moveForward( -velocity.z * delta);
    
        prevTime = time;
    }

    draw(){
        renderer.render(scene, camera);
    };

    onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    getUserPosition()   {
        return camera.position;
    }

    getUserRotation()   {
        return camera.rotation;
    }

    addOtherUser(id)    {
        others[id] = new Shape();
        scene.add(others[id].getObject());
    }

    deleteOtherUser(id) {
        if(others[id])  {
            scene.remove(others[id].getObject());
            delete others[id];
        }

    }

    setOtherUserPosition(id, x, y, z)    {
        if(others[id])  {
            others[id].setPosition(x, y, z);
        }
    }

    setOtherUserRotation(id, x, y, z)  {
        if(others[id])  {
            others[id].setRotation(x, y, z);
        }
        
    }


}

