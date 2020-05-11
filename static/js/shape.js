import * as THREE from './three/build/three.module.js';


export default class Shape  {
    constructor() {

        this.group = new THREE.Group();
  

        this.faceMesh = new THREE.Mesh(
            new THREE.BoxGeometry(20, 20, 20),
            new THREE.MeshStandardMaterial({
                color:0xbababa,
                roughness:0.5
            }),
        );

        this.group.add(this.faceMesh);


        const rad = 2;
        const div = 16;
        const length = 2;

        const pos = {
            x:5,
            y:5,
            z: -(10 + length * 0.5)
        };

        this.left_eye = new  THREE.Mesh(
            new THREE.CylinderGeometry( rad, rad, length, div ),
            new THREE.MeshLambertMaterial({
                color:0x000000
            }),
        );
        this.left_eye.rotateX(Math.PI * 0.5);
        this.left_eye.position.set(pos.x, pos.y, pos.z);

        this.right_eye = new THREE.Mesh( 
            new THREE.CylinderGeometry( rad, rad, length, div ),
            new THREE.MeshLambertMaterial({
                color:0x000000
            }),
        );
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