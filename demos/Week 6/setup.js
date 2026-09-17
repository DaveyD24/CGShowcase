import * as THREE from "/build/three.module.js"

export let scene;
export let camera;
export let renderer;

export let discs = [];
export const CLOCK = new THREE.Clock();
const DISC_DISTANCE = 15;

export function setScene() {
    scene = new THREE.Scene();
    const renderView = document.querySelector(".render-view");
    const aspectRatio = renderView.clientWidth / renderView.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);

    camera.position.set(0, 5, 20);
    camera.lookAt(0,0,5);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(renderView.clientWidth, renderView.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.background = new THREE.Color("#e3e3ff");
    document.querySelector(".render-view").appendChild(renderer.domElement);
}

export function setSceneElements() {
    const planeGeometry = new THREE.PlaneGeometry(50,50);
    const planeMaterial = new THREE.MeshLambertMaterial(
        {
            color: new THREE.Color(1,1,1),
            side: THREE.DoubleSide
        }
    );
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x += Math.PI/2;
    plane.position.y -= 2;
    scene.add(plane);
    
    const discGeometry = new THREE.CylinderGeometry(4,4,0.5,100,100);
    const discMaterial = new THREE.MeshLambertMaterial({
        color: new THREE.Color(1,1,1)
    });
    const disc = new THREE.Mesh(discGeometry, discMaterial);
    disc.receiveShadow = true;
    discs.push(disc, disc.clone(), disc.clone());
    discs[1].position.x -= DISC_DISTANCE;
    discs[2].position.x += DISC_DISTANCE;
    discs.forEach(disc => scene.add(disc));

    const cylinderGeometry = new THREE.CylinderGeometry(4, 4, 10, 30);
    const cylinderMaterial = new THREE.MeshPhongMaterial({
        color: new THREE.Color(1, 1, 1)
    })
    cylinderMaterial.transparent = true;
    cylinderMaterial.opacity = 0.2;
    const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    cylinder.position.y = 5;

    const leftCylinder = cylinder.clone();
    leftCylinder.position.x = -DISC_DISTANCE;

    const rightCylinder = cylinder.clone();
    rightCylinder.position.x = DISC_DISTANCE;

    scene.add(cylinder, leftCylinder, rightCylinder);
}

export function setSceneLighting() {
    const cameraLight = new THREE.PointLight( new THREE.Color(1,1,1), 0.5);
    camera.add(cameraLight);
    scene.add(camera);

    const ambientLight = new THREE.AmbientLight(new THREE.Color(1,1,1),0.2);
    scene.add(ambientLight);
}

//Event Listeners
function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width,height);
    camera.aspect = width/height;
    camera.updateProjectionMatrix();
    renderer.render(scene,camera);
}
window.addEventListener('resize', resize);