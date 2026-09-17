import * as THREE from "../../build/three.module.js";
import {OrbitControls} from "../../build/controls/OrbitControls.js";
import {scene, camera, renderer, setScene} from "./setup.js";


setScene();

const controls = new OrbitControls(camera, renderer.domElement);

const parents = []
let counter = 0;
const OBJECT_COUNT = 10;

createScene();
addLighting();
addSphere();

function createScene() {

    for (let i = 0; i < OBJECT_COUNT; i++) {

        const parent = new THREE.Object3D();

        const sphereGeometry = new THREE.SphereGeometry(1, 16, 16);
        const sphereMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0.5, 0.1, 0.1),
            wireframe: false
        });
        const planet = new THREE.Mesh(sphereGeometry, sphereMaterial);

        scene.add(parent);
        scene.add(planet);

        const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
        const boxMaterial = new THREE.MeshPhongMaterial({
            color: new THREE.Color(1, 1, 0),
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

function addSphere() {
    const sphereGeometry = new THREE.SphereGeometry(2);
    const sphereMaterial = new THREE.MeshPhongMaterial(
        {
            color: new THREE.Color(0.8,1,1),
            shininess: 100,
            wireframe: false
        }
    );
    scene.add(new THREE.Mesh(sphereGeometry, sphereMaterial));
}

function addLighting() {
    const cameraLight = new THREE.PointLight(new THREE.Color(1,1,1), 0.5);
    camera.add(cameraLight);
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1), 0.2);
    scene.add(ambientLight);
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
        
        if (counter == 360) {
            counter = 0;
        }
        cube.material.color = new THREE.Color(`hsl(${Math.floor(counter)}, 50%, 50%)`);
        counter += 0.1;


    }
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(updateScene);