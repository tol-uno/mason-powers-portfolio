import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";

let scene, camera, renderer, cube, plane, loadedModel, modelWindow;

init();
animate();
window.addEventListener("resize", onWindowResize, false);


function init() {
    //SCENE
    scene = new THREE.Scene();
    
    // GLTF LOADER
    var model;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("assets/models/truck.glb", function (glbModel){
        loadedModel = glbModel;
        glbModel.scene.scale.set(.02,.02,.02);
        glbModel.scene.position.z = 0;
        glbModel.scene.position.x = 0;
        glbModel.scene.position.y = 0;
        glbModel.scene.rotation.set(0, 0.7, 0);
        scene.add(glbModel.scene);
    })

    modelWindow = document.getElementById("model");

    // RENDERER
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(modelWindow.offsetWidth, modelWindow.offsetHeight);
    modelWindow.appendChild(renderer.domElement);
    
    // CAMERA
    camera = new THREE.PerspectiveCamera(
        15, 
        modelWindow.offsetWidth / modelWindow.offsetHeight,
        0.1, 
        1000,
    );
    camera.position.z = 35;
    camera.position.y = 2;
  
    //LIGHT
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set( 1, 3, 5);
    scene.add(light);
}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // console.log(model);
    if (loadedModel) {
        // console.log();
        loadedModel.scene.rotation.y = -document.documentElement.scrollTop / 1000 + 0.6
    };
}


function onWindowResize() {
    camera.aspect = modelWindow.offsetWidth / modelWindow.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelWindow.offsetWidth, modelWindow.offsetHeight);
}






// function init() {
// const modelWindow = document.getElementById("model");
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(
//     40, // FOV
//     modelWindow.offsetWidth / modelWindow.offsetHeight, // DIMENSIONS
//     0.1, // NEAR PLANE
//     1000 // FAR PLANE
//     );
// camera.position.z = 1.6;

// const renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
// renderer.setSize(modelWindow.offsetWidth, modelWindow.offsetHeight);
// modelWindow.appendChild(renderer.domElement);

// // KNOT
// const material = new THREE.MeshBasicMaterial({color: 0xFFFFFF, wireframe: true});
// const geometryKnot = new THREE.TorusKnotGeometry( .3, 0.1, 64, 8 );
// const torusKnot = new THREE.Mesh( geometryKnot, material );
// scene.add( torusKnot );


// function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);

//     torusKnot.rotation.y = document.documentElement.scrollTop / 500

// }

// animate();
// }