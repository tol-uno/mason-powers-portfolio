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
    gltfLoader.load("assets/models/assets/models/HurricanSTO_v1.glb", function (glbModel){
        loadedModel = glbModel;
        glbModel.scene.scale.set(2.0,2.0,2.0);
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
        20, 
        modelWindow.offsetWidth / modelWindow.offsetHeight,
        0.1, 
        1000,
    );
    camera.position.z = 23;
    camera.position.y = 1.8;
  
    //LIGHTS
    createLight(0xffffff, 4, 4, 5, 5)
    createLight(0xffffff, 1.5, -2, 1, 0)

    // const ambLight = new THREE.AmbientLight(0xffffff, 10); // ambient light. only works on textures. can be used for baked raytracing textures.
    // scene.add(ambLight);

    function createLight(color, intensity, x, y, z) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set( x, y, z);
        scene.add(light);
    }

    //PLANE
    plane = new THREE.Mesh(new THREE.PlaneGeometry(4.2,9), new THREE.MeshPhongMaterial({color: "#010101"}));
    plane.rotation.x = -(Math.PI / 2);
    plane.rotation.z = 0.7
    plane.position.x = 0;
    plane.position.y = 0;
    plane.position.z = 0;
    scene.add(plane);


}


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    // console.log(model);
    if (loadedModel) {
        // console.log();
        loadedModel.scene.rotation.y = -document.documentElement.scrollTop / 1000 + 0.6
        plane.rotation.z = -document.documentElement.scrollTop / 1000 + 0.6

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