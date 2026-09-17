import * as THREE from "../../build/three.module.js";
import {OrbitControls} from "../../build/controls/OrbitControls.js";
import {scene, camera, renderer, setScene} from "./setup.js";


setScene();

const controls = new OrbitControls(camera, renderer.domElement);

const parents = []
const OBJECT_COUNT = 10;

createScene();

function createScene() {

    for (let i = 0; i < OBJECT_COUNT; i++) {

        const parent = new THREE.Object3D();

        const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
        const sphereMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0.1, 0.1, 0.1),
            wireframe: true
        });
        const planet = new THREE.Mesh(sphereGeometry, sphereMaterial);

        scene.add(parent);
        scene.add(planet);

        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        const boxMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color(0.5, 0.5, 0),
            wireframe: false
        });
        const cube = new THREE.Mesh(boxGeometry, boxMaterial);
        scene.add(cube);
        
        parent.attach(planet);
        parent.attach(cube);

        const parentRotation = new THREE.Matrix4().makeRotationY((2 * Math.PI / OBJECT_COUNT) * i);
        const parentTranslation = new THREE.Matrix4().makeTranslation(OBJECT_COUNT * 2.5, 0, 0);
        parent.applyMatrix4(new THREE.Matrix4().multiply(parentRotation).multiply(parentTranslation));


        const childTranslation = new THREE.Matrix4().makeTranslation(3.5, 0, 0);
        planet.applyMatrix4(new THREE.Matrix4().multiply(childTranslation));

        parents.push(parent);

    }
}


function updateScene() {
    controls.update();

    for (let i = 0; i < parents.length; i++) {

        const parent = parents[i];
        const planet = parents[i].children[0];
        const cube = parents[i].children[1];

        parent.applyMatrix4(new THREE.Matrix4().makeRotationY(0.01));

        cube.rotation.x -= 0.05;
        cube.rotation.z += 0.03;

        planet.applyMatrix4(new THREE.Matrix4().makeRotationY(0.05));

    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(updateScene);