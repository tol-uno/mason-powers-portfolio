import * as THREE from 'three';
import { GLTFLoader } from "GLTFLoader";
import { RGBELoader } from "RGBELoader"; 

let scene, camera, renderer, loadedModel, modelWindow;

var loadedMediaCount = 0;

init();
animate();
window.addEventListener("resize", onWindowResize, false);


function init() {
    //SCENE
    scene = new THREE.Scene();

    // GLTF LOADER
    var model;
    const gltfLoader = new GLTFLoader();
    gltfLoader.load("assets/models/ChalaadiGlacier2.glb", function (glbModel){
        loadedModel = glbModel;
        glbModel.scene.scale.set(1.0,1.0,1.0);
        glbModel.scene.position.z = 0;
        glbModel.scene.position.x = 0;
        glbModel.scene.position.y = 0;
        glbModel.scene.rotation.set(0, 0, 0);

        // glbModel.scene.traverse( function(child) { // sorts through all child meshes and enables shadows on them
        //     if (child.isMesh) {
        //         child.castShadow = true;
        //         child.receiveShadow = true;
        //         // console.log("shadows added");
        //     }
        // });

        scene.add(glbModel.scene);
        
        if (loadedMediaCount == 1) {mediaLoaded();} else {loadedMediaCount += 1;}
    
    },
    function (xhr) {
        var percentageLoaded = Math.round(xhr.loaded / 3830176 * 100); //xhr.total isnt read when published. Hardcoded bytes
        document.querySelector(".loading-bar-fill").style.width = percentageLoaded + "%";

    }
    )

    modelWindow = document.getElementById("model");

    // RENDERER canvas
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(modelWindow.offsetWidth, modelWindow.offsetHeight);
    renderer.outputEncoding = THREE.sRGBEncoding; // For making HDRI the correct Gamma
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = THREE.ACESFilmicToneMapping; // Tone mapping
    renderer.toneMappingExposure = 1;

    modelWindow.appendChild(renderer.domElement);
    
    // CAMERA
    camera = new THREE.PerspectiveCamera(
        15,
        modelWindow.offsetWidth / modelWindow.offsetHeight,
        600, // near clip plane
        1500, // far clip plane
    );
    camera.position.z = 1000; // towards camera
    camera.position.y = 375; // up
    camera.rotation.set(-20 * Math.PI / 180, 0, 0)
  
    //HDRI
    const hdriTexture = "assets/images/autoshop_01_1k.hdr"

    const HDRILoader = new RGBELoader();
    HDRILoader.load(hdriTexture, function(texture) {
        texture.mapping = THREE.EquirectangularReflectionMapping;
        // scene.background = texture;
        scene.environment = texture;

        if (loadedMediaCount == 1) {mediaLoaded();} else {loadedMediaCount += 1;}

    })

    const light = new THREE.AmbientLight( 0xF0F0F0, 1 ); // soft white light
    scene.add( light );
    
} // END OF init()


function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (loadedModel) {
        loadedModel.scene.rotation.y = -document.documentElement.scrollTop / 300 + 0.8
        // camera.rotation.set(document.documentElement.scrollTop / 100000 - 30 * Math.PI / 180, 0, 0)

        // plane.rotation.z = -document.documentElement.scrollTop / 1000 + 0.6
    };
}


function onWindowResize() {
    camera.aspect = modelWindow.offsetWidth / modelWindow.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(modelWindow.offsetWidth, modelWindow.offsetHeight);
}

function mediaLoaded() { // REMOVING THE PAGE LOADING SCREEN
    document.getElementById("loading-page").style.visibility="hidden";

    document.querySelector("body").style.overflow="auto";
    document.getElementById("scroll-clip").style.visibility="visible";

}