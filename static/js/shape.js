import * as THREE from './three/build/three.module.js';
const rad = 2;
const div = 16;
const length = 2;
const eye_geometory = new THREE.CylinderGeometry( rad, rad, length, div );
const eye_material = new THREE.MeshBasicMaterial({color:0x000000});

export default class Shape  {
    constructor() {

        this.group = new THREE.Group();

        this.faceMesh = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshLambertMaterial({
                color:0xbababa,
            }),
        );

        this.group.add(this.faceMesh);

        const pos = {
            x:5,
            y:5,
            z: -(10 + length * 0.5)
        };

        this.left_eye = new  THREE.Mesh(eye_geometory, eye_material);
        this.left_eye.rotateX(Math.PI * 0.5);
        this.left_eye.position.set(pos.x, pos.y, pos.z);

        this.right_eye = new THREE.Mesh(eye_geometory,eye_material);
        this.right_eye.rotateX(Math.PI * 0.5);
        this.right_eye.position.set(-pos.x, pos.y, pos.z);

        this.group.add(this.left_eye);
        this.group.add(this.right_eye);
        this.group.position.set(0, 70, 250);
    }

    getObject() {
        return this.group;
    }


    setPosition(x, y, z) {
        this.group.position.set(x, y, z);
    }

    setRotation(x, y, z) {
        this.group.rotation.set(x, y, z);
    }
}