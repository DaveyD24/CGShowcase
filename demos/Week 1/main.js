import * as THREE from "/build/three.module.js";

//Generate a 0 or 1 at random for each red, green and blue value
//If it is perfect black, return white instead
function getRandomColor() {
    const r = Math.random() >= 0.5 ? 1 : 0;
    const g = Math.random() >= 0.5 ? 1 : 0;
    const b = Math.random() >= 0.5 ? 1 : 0;
    if (r == 0 && g == 0 && b == 0) {
        return new THREE.Color(1,1,1);
    }
    return new THREE.Color(r, g, b);
}
const ROTATION_SPEED = 0.02;
const MESH_SPACING = 6;

//Scene
const scene = new THREE.Scene();

//Camera
const renderView = document.querySelector(".render-view");
const aspectRatio = renderView.clientWidth / renderView.clientHeight;
const camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);

//Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(renderView.clientWidth, renderView.clientHeight);
document.querySelector(".render-view").appendChild(renderer.domElement);

//Step camera back along the z axis. Look straight forward along the z axis
camera.position.set(0, 0, 15);
camera.lookAt(0,0,1);

//Create 3 geometries
const boxGeometry = new THREE.BoxGeometry(2, 2, 2);
const sphereGeometry = new THREE.SphereGeometry(2);
const tetraGeometry = new THREE.TetrahedronGeometry(2, 0);

//Create 3 materials, each with a random colour
const boxMaterial = new THREE.MeshBasicMaterial({
    color: getRandomColor(),
    wireframe: true
});
const sphereMaterial = new THREE.MeshBasicMaterial({
    color: getRandomColor(),
    wireframe: true
});
const tetraMaterial = new THREE.MeshBasicMaterial({
    color: getRandomColor(),
    wireframe: true
});

//Create a mesh for each geometry and material
const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
const tetraMesh = new THREE.Mesh(tetraGeometry, tetraMaterial);

//Add each mesh to the scene and space them out on the x axis
scene.add(boxMesh, sphereMesh, tetraMesh);
boxMesh.position.x -= MESH_SPACING;
tetraMesh.position.x += MESH_SPACING;

//Every frame, rotate each mesh and render the scene
function updateLoop() {
    boxMesh.rotation.y += ROTATION_SPEED;
    sphereMesh.rotation.z += ROTATION_SPEED;
    tetraMesh.rotation.x += ROTATION_SPEED;
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(updateLoop)