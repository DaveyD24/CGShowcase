import * as THREE from "../../build/three.module.js";
import {scene, camera, renderer, setScene, setSceneElements, setSceneLighting, discs, CLOCK} from "./setup.js";
import {PLYLoader} from "../../build/loaders/PLYLoader.js";
import {OBJLoader} from "../../build/loaders/OBJLoader.js";
import {OrbitControls} from "../../build/controls/OrbitControls.js";

setScene();
setSceneElements();
setSceneLighting();
let controls = new OrbitControls(camera, renderer.domElement);

const modelNames = ["chair.ply", "door.obj", "chair.ply"]
const meshes = []

for (let i = 0; i < modelNames.length; i++) {
    const mesh = await addToMuseum(modelNames[i], discs[i]);
    meshes.push(mesh);
}

const SPEED = 3;

async function addToMuseum(modelName, disc) {
    let mesh;
    switch (modelName.split(".")[1]) {
        case "ply": mesh = await loadPLY(modelName); break;
        case "obj": mesh = await loadOBJ(modelName); break;
    }
    scaleToHeight(mesh, 5);
    
    const material = new THREE.MeshLambertMaterial({
        color: new THREE.Color(1,0.5,0.5),
        wireframe: true
    });
    mesh.material = material;
    
    mesh.castShadow = true;
    mesh.position.y = 2;
    mesh.position.x = disc.position.x;
    
    addSpotlight(mesh);
    scene.add(mesh);
    return mesh;
}

async function loadOBJ(modelName) {
    const loader = new OBJLoader();
    let mesh;
    const group = await loader.loadAsync(`../../models/${modelName}`);
    group.traverse((child) => {
        if (child.isMesh) {
            mesh = child;
            return;
        }
    })
    return mesh;
}

async function loadPLY(modelName) {
    const loader = new PLYLoader();
    const geometry = await loader.loadAsync(`../../models/${modelName}`);
    geometry.computeVertexNormals();
    const mesh = new THREE.Mesh(geometry, null);
    return mesh;
}

function scaleToHeight(mesh, targetHeight) {
    const box = new THREE.Box3().setFromObject(mesh);
    const size = new THREE.Vector3();
    box.getSize(size);

    const currentHeight = size.y
    const scale = targetHeight / currentHeight;

    mesh.scale.multiplyScalar(scale);
}

function addSpotlight(mesh) {
    const spotlight = new THREE.SpotLight(new THREE.Color(1,1,1), 0.2);
    spotlight.angle = Math.PI/8;
    spotlight.penumbra = 0.3;
    spotlight.castShadow = true;

    spotlight.position.set(mesh.position.x,15,0)
    spotlight.target = mesh;

    scene.add(spotlight);
}

function updateScene() {
    const time = CLOCK.getElapsedTime() * SPEED;
    for (const mesh of meshes) {
        if (mesh !== null) {
            mesh.rotation.y += 0.03;
            mesh.position.y += Math.sin(time)*0.03;
        }
    }
    controls.update();
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(updateScene);