import * as THREE from 'three';
// import { GLTFLoader } from "GLTFLoader";
// import { RGBELoader } from "RGBELoader";
import { OrbitControls } from "OrbitControls";

let scene, camera, controls, renderer, modelWindow;


init();
animate();
window.addEventListener("resize", onWindowResize, false);


function init() {
    //SCENE
    scene = new THREE.Scene();

    modelWindow = document.getElementById("model");

    // RENDERER canvas
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
    renderer.setSize(modelWindow.offsetWidth, modelWindow.offsetHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    modelWindow.appendChild(renderer.domElement);
    
    // CAMERA
    camera = new THREE.PerspectiveCamera(
        15,
        modelWindow.offsetWidth / modelWindow.offsetHeight,
        10, // near clip plane
        10000, // far clip plane
    );
    camera.position.z = 150; // towards camera
    camera.position.y = 0; // up
    camera.rotation.set(-20 * Math.PI / 180, 0, 0)
  

    controls = new OrbitControls( camera, renderer.domElement );
    controls.autoRotate = true;
    controls.autoRotateSpeed = 5;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;

    const geometry = new THREE.TorusKnotGeometry( 10, 3, 100, 16 ); 
    // const material = new THREE.MeshBasicMaterial( { color: 0x000000, wireframe: true } ); 
    // const torusKnot = new THREE.Mesh( geometry, material ); 
    // scene.add( torusKnot );


    const wireframe = new THREE.WireframeGeometry( geometry );

    const line = new THREE.LineSegments( wireframe );
    line.material.depthTest = false;
    line.material.opacity = 0.5;
    line.material.transparent = true;
    line.material.color = { color: 0xffff00 }
    
    scene.add( line );

    
} // END OF init() 


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}


function onWindowResize() {
    // camera.aspect = modelWindow.offsetWidth / modelWindow.offsetHeight;
    camera.aspect = 1;
    camera.updateProjectionMatrix();

    renderer.setSize(modelWindow.offsetWidth, modelWindow.offsetHeight);
}
