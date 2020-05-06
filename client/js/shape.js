import * as THREE from './three/build/three.module.js';


export default class Shape  {
    constructor() {
        this.geometory = new THREE.BoxGeometry(50, 50, 50);
        this.material = new THREE.MeshBasicMaterial({
            color:0x00ff00
        })
        this.cube = new THREE.Mesh(this.geometory, this.material);
    }

    getObject() {
        return this.cube;
    }


    setPosition(x, y, z) {
        this.cube.position.set(x, y, z);
    }

    setRotation(x, y, z) {
        this.cube.rotation.set(x, y, z);
    }
}