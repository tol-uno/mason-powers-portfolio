import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import { RGBELoader } from "RGBELoader"; 

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
    gltfLoader.load("assets_folder/models/Aventador-SVJ_v2.glb", function (glbModel){
        loadedModel = glbModel;
        glbModel.scene.scale.set(1.0,1.0,1.0);
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
    renderer.outputEncoding = THREE.sRGBEncoding; // For making HDRI the correct Gamma
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // tone mapping
    renderer.toneMappingExposure = 1.2;
    modelWindow.appendChild(renderer.domElement);
    
    // CAMERA
    camera = new THREE.PerspectiveCamera(
        20, 
        modelWindow.offsetWidth / modelWindow.offsetHeight,
        0.1, 
        1000,
    );
    camera.position.z = 13;
    camera.position.y = .8;
  
    //HDRI
    const hdriTexture = "assets_folder/images/autoshop_01_1k.hdr"

    const HDRILoader = new RGBELoader();
    HDRILoader.load(hdriTexture, function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        // scene.background = texture;
        scene.environment = texture;
    })


    //LIGHTS
    var light_height = 2;
    var light_intensity = 1.5;

    // createLight(0xffffff, light_intensity, -8, light_height, -8);
    // createLight(0xffffff, light_intensity, -8, light_height, 8);
    // createLight(0xffffff, light_intensity, 8, light_height, -8);
    // createLight(0xffffff, light_intensity, 8, light_height, 8);
    // createLight(0xffffff, 5, 0, 8, 0);


    // const ambLight = new THREE.AmbientLight(0xffffff, 2); // ambient light. only works on textures. can be used for baked raytracing textures.
    // scene.add(ambLight);

    function createLight(color, intensity, x, y, z) {
        const light = new THREE.DirectionalLight(color, intensity);
        light.position.set( x, y, z);
        scene.add(light);
    }


    // OLD SHADOW PLANE
    // plane = new THREE.Mesh(new THREE.PlaneGeometry(2.3, 5), new THREE.MeshPhongMaterial({color: "#010101"}));
    // plane.rotation.x = -(Math.PI / 2);
    // plane.rotation.z = 0.7
    // plane.position.x = 0;
    // plane.position.y = 0;
    // plane.position.z = 0;
    // scene.add(plane);


    // plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 1), new THREE.MeshPhongMaterial({color: "#010101"}));
    // plane.position.x = -8;
    // plane.position.y = 2;
    // plane.position.z = -8;
    // scene.add(plane);

} // END OF init()


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (loadedModel) {
        loadedModel.scene.rotation.y = -document.documentElement.scrollTop / 1000 + 0.6
        // plane.rotation.z = -document.documentElement.scrollTop / 1000 + 0.6
    };
}


function onWindowResize() {
    camera.aspect = modelWindow.offsetWidth / modelWindow.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelWindow.offsetWidth, modelWindow.offsetHeight);
}


function reveal() { // for floaters to animate in
    var floaters = document.querySelectorAll(".floater")
    var scrollInAt = (window.innerHeight * 0.55); // float = the percentage down page that the element should come in at

    for (var i = 0; i < floaters.length; i++) {
        var elementBot = floaters[i].getBoundingClientRect().bottom;

        if (elementBot < scrollInAt) {
            floaters[i].classList.add("inview");
        } else {
            floaters[i].classList.remove("inview");
        }
    }
}

document.addEventListener("scroll", reveal);

reveal(); // to check scroll position on page (re)load




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