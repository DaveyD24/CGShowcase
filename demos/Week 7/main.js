import * as THREE from "../../build/three.module.js";
import {OrbitControls} from "../../build/controls/OrbitControls.js";
import {scene, camera, renderer, setScene, setSceneLighting} from "./setup.js";


setScene();
setSceneLighting();

const controls = new OrbitControls(camera, renderer.domElement);

const IMAGE_SIZE = 512;
const pixels = await destructTexture();

createTerrain(100, 500, 12);

function createTerrain(size, subd, height) {
    
    const terrainGeometry = new THREE.BufferGeometry();

    const vertices = [];
    const triangles = [];
    const gridDistance = size/subd;

    for (let i = 0; i < subd; i++) {
        for (let j = 0; j < subd; j++) {
            const POS = new THREE.Vector3(i * gridDistance, j * gridDistance, 0);
            POS.x -= size/2;
            POS.y -= size/2;

            const pixelIndex = (j * IMAGE_SIZE + i) * 4;
            POS.z = pixels[pixelIndex] / 255;
            POS.z *= height;
            
            vertices.push(POS.x,POS.y,POS.z);
        }
    }
    for (let i = 0; i < subd-1; i++) {
        for (let j = 0; j < subd-1; j++) {
            const bottomLeft = getGridPosition(i,j,subd);
            const bottomRight = getGridPosition(i+1,j,subd);
            const topLeft = getGridPosition(i,j+1,subd);
            const topRight = getGridPosition(i+1,j+1,subd);

            triangles.push(topRight,topLeft,bottomRight);
            triangles.push(bottomRight,topLeft,bottomLeft);
        }
    }

    terrainGeometry.setIndex(triangles);
    terrainGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices,3));
    terrainGeometry.computeVertexNormals();

    const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color(0.3,1,0.3),
        side: THREE.DoubleSide,
        wireframe: false
    })

    const terrain = new THREE.Mesh(terrainGeometry, material);
    terrain.rotation.x -= Math.PI/2;
    scene.add(terrain);
}

async function destructTexture() {
    const loader = new THREE.TextureLoader();
    const texture = await loader.loadAsync("../../texture/perlin.png");
    texture.colorSpace = THREE.NoColorSpace;
    const image = texture.image;

    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(image, 0, 0);

    const pixels = ctx.getImageData(
        0,
        0,
        image.width,
        image.height
    ).data

    return pixels
}

//Helper Functions
function getGridPosition(x,y, subdivision) {
      return x*subdivision+y;
}
function SpawnBox(pos) {
      const box_geom = new THREE.BoxGeometry(0.02,0.02,0.02);
      const box_material = new THREE.MeshPhongMaterial({
            color: new THREE.Color(1,1,0.4),
            wireframe: false
      });
      const box = new THREE.Mesh(box_geom, box_material);
      box.position.set(pos.x, pos.y, pos.z);
      scene.add(box);
}

function updateScene() {
    controls.update();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(updateScene);