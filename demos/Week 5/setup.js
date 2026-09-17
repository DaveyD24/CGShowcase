import * as THREE from "/build/three.module.js"

export let scene;
export let camera;
export let renderer;

export let wallMesh;

const parents = []
let counter = 0;
const OBJECT_COUNT = 10;

const SPEED = 1;
const clock = new THREE.Clock();

export function setScene() {
    scene = new THREE.Scene();
    const renderView = document.querySelector(".render-view");
    const aspectRatio = renderView.clientWidth / renderView.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);

    camera.position.set(0, 0, 15);
    camera.lookAt(0,0,1);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(renderView.clientWidth, renderView.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.background = new THREE.Color("#e3e3ff");
    document.querySelector(".render-view").appendChild(renderer.domElement);
}

export function setSceneElements() {
    const wallGeometry = new THREE.BoxGeometry(20,20,100);
    const wallMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(1,1,1),
    });
    wallMesh = new THREE.Mesh(wallGeometry, wallMaterial);
    wallMesh.receiveShadow = true;
    wallMesh.position.x -= 40;
    scene.add(wallMesh);

    const floorGeometry = new THREE.PlaneGeometry(100,100);
    const floorMaterial = new THREE.MeshLambertMaterial(
        {
            color: new THREE.Color(0.7,0.7,0.7),
            side: THREE.DoubleSide
        }
    );
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.receiveShadow = true;
    floor.position.y = -10;
    floor.rotation.x = Math.PI/2;
    scene.add(floor);

    createPlanets();
}

function createPlanets() {
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
        cube.castShadow = true;
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

export function animatePlanets() {
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
}