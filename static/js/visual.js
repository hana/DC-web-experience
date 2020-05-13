import * as THREE from './three/build/three.module.js';

// import { OrbitControls } from "./lib/three/examples/jsm/controls/OrbitControls.js";
import { PointerLockControls } from "./three/examples/jsm/controls/PointerLockControls.js";

import { MTLLoader } from "./three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader2 } from "./three/examples/jsm/loaders/OBJLoader2.js";
import { MtlObjBridge } from "./three/examples/jsm/loaders/obj2/bridge/MtlObjBridge.js";
// import {GLTFLoader} from "./three/examples/jsm/loaders/GLTFLoader.js";

import Shape from './shape.js';

const modelName = "cooperHewitt"
const Path_To_OBJ = './src/cooperHewitt.obj';
const Path_To_MTL = './src/cooperHewitt.mtl';
const Walk_Trigger_Interval = 750;

let scene, renderer, camera, controls;

let prevTime = performance.now();

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

let onMove = null;

let prevWalk = performance.now();
let onWalk = null;

const move = {
    forward:false,
    backward:false,
    left:false,
    right:false,
    up:false,
    down:false,
}

const others = {};


export default class Visual {
    constructor()   {}

    setup(){
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1500);
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

                case 82: //r
                    move.up = true;
                    break;

                case 70: // f
                    move.down = true;                    
                    break;
                case 32: // space
                    camera.position.set(0, 70, 250);    // reset position
                    camera.rotation.y = -Math.PI * 0.5; 
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
                case 82: //r
                    move.up = false;
                    break;
                case 70: // f
                    move.down = false;                    
                    break;
                default:
                    break;
            }
        }, false);

        this.lights = new THREE.Group();
        this.lights.add(new THREE.AmbientLight(0x222222));


        /*
            x: 30 ~ 1100
            y: 140?
            z: 100 ~ 300
        */

        const addLight = (x, y, z) => {
            let light = new THREE.PointLight(0xFDFDFD, 0.5, 500);
            light.position.set(x, y, z);
            this.lights.add(light);
        }

        addLight(30, 120, 200);
        addLight(330, 120, 200);
        addLight(630, 120, 200);
        addLight(930, 120, 200);
        // addLight(830, 140, 200);
        // addLight(1030, 140, 200);
        // addLight(630, 140, 200);

        scene.add(this.lights);        
    }

    loadObject() {
        return new Promise((resolve) =>{
            const objLoader2 = new OBJLoader2();

            const callbackOnLoad = ( object3d ) => {
                document.getElementById("progress").innerText = "Done.";
                // object3d.traverse( function( node ) {
                //     if( node.material ) {
                //         node.material.side = THREE.DoubleSide;
                //     }
                // });
                
                scene.add( object3d );        
                console.log("Object loaded.");

                document.getElementById("LoadingMessage").style.display="none";
                resolve();
            };

            const onProgress = (xhr) => {
                const progress = Math.round(xhr.loaded / xhr.total * 100);
                const text = `Loading... ${progress} % loaded`
                document.getElementById("progress").innerText = text;
            }
        
            const onLoadMtl = ( mtlParseResult ) =>{
                objLoader2.setModelName( modelName );
                // objLoader2.setLogging( true, true );
                objLoader2.addMaterials( MtlObjBridge.addMaterialsFromMtlLoader( mtlParseResult ), true );
                objLoader2.load(Path_To_OBJ, callbackOnLoad, onProgress, null, null );
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
        velocity.y -= velocity.y * Delta_Mod * delta;
        velocity.z -= velocity.z * Delta_Mod * delta;
                    
        direction.x = Number(move.right) - Number(move.left);
        direction.y = Number(move.down) - Number(move.up);
        direction.z = Number(move.forward) - Number(move.backward);
        direction.normalize();
    
        
        if(move.left || move.right)  velocity.x -= direction.x * Move_Mod * delta; 
        if(move.up || move.down)  velocity.y -= direction.y * Move_Mod * delta; 
        if(move.forward || move.backward)  velocity.z -= direction.z * Move_Mod * delta; 
    
        controls.moveRight(-velocity.x * delta);
        controls.moveForward( -velocity.z * delta);
        controls.getObject().position.y += ( velocity.y * delta ); // new behavior

        if((move.forward || move.backward || move.left || move.right || move.up || move.down) && onMove) {
            onMove(); 
            
            const diff = (time - prevWalk)
            if( onWalk && Walk_Trigger_Interval < diff) {            
                onWalk();                
                prevWalk = time;
           }
        }
    
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

    init(args) {
        for(let key in args)   {
            const user = args[key];
            console.log(user.position);
            others[user.id] = new Shape();
            others[user.id].setPosition(user.position.x, user.position.y, user.position.z);
            others[user.id].setRotation(user.rotation.x, user.rotation.y, user.rotation.z);
            scene.add(others[user.id].getObject());
        }
    }

    addUser(user)   {
        others[user.id] = new Shape();
        others[user.id].setPosition(user.position.x, user.position.y, user.position.z);
        others[user.id].setRotation(user.rotation.x, user.rotation.y, user.rotation.z);
        scene.add(others[user.id].getObject());
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

    setOnMove(func) {
        onMove = func;
        return true;
    }

    setOnWalk(func) {
        onWalk = func;
        return true;
    }
}

