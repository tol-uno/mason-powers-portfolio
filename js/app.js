import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import { RGBELoader } from "RGBELoader";

const MODEL_PATH = "assets/models/Aventador-SVJ_v3.glb";
const HDRI_PATH = "assets/images/autoshop_01_1k.hdr";
const MODEL_BYTES = 3830176;

class SceneManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.loadedCount = 0;
        this.totalAssets = 2;

        this.#init();
        window.addEventListener("resize", this.#onResize);
        window.addEventListener("scroll", this.#onScroll);
        this.#onScroll();
    }

    // Initialization

    #init() {
        this.scene = new THREE.Scene();
        this.#setupRenderer();
        this.#setupCamera();
        this.#setupLights();
        this.#loadModel();
        this.#loadHDRI();
    }

    #setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1;
        this.renderer.shadowMap.enabled = true;
        this.container.appendChild(this.renderer.domElement);
    }

    #setupCamera() {
        this.camera = new THREE.PerspectiveCamera(14, this.container.offsetWidth / this.container.offsetHeight, 5, 20);
        this.camera.position.set(0, 0.8, 12);
    }

    #setupLights() {
        const light = new THREE.DirectionalLight(0xffffff, 4);
        light.castShadow = true;
        light.position.set(0, 8, 2);

        Object.assign(light.shadow.camera, {
            top: 4,
            bottom: -4,
            left: -4,
            right: 4,
            near: 0.1,
            far: 40,
        });
        light.shadow.bias = -0.002;

        this.scene.add(light);
    }

    // Asset Loading

    #loadModel() {
        const loader = new GLTFLoader();
        loader.load(
            MODEL_PATH,
            (gltf) => {
                this.model = gltf;
                gltf.scene.scale.setScalar(1);
                gltf.scene.position.set(0, 0, 0);
                gltf.scene.rotation.set(0, 0.7, 0);

                gltf.scene.traverse((child) => {
                    if (child.isMesh) {
                        // child.castShadow = true;
                        // child.receiveShadow = true;
                    }
                });

                this.scene.add(gltf.scene);
                this.#onAssetLoaded();
            },
            (xhr) => this.#onModelProgress(xhr),
            (err) => console.error("Failed to load model:", err),
        );
    }

    #loadHDRI() {
        new RGBELoader().load(
            HDRI_PATH,
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this.scene.environment = texture;
                this.#onAssetLoaded();
            },
            undefined,
            (err) => console.error("Failed to load HDRI:", err),
        );
    }

    #onModelProgress({ loaded }) {
        const pct = Math.round((loaded / MODEL_BYTES) * 100);
        const bar = document.querySelector(".loading-bar-fill");
        if (bar) bar.style.width = `${pct}%`;
    }

    #onAssetLoaded() {
        this.loadedCount++;
        if (this.loadedCount >= this.totalAssets) this.#revealScene();
    }

    #revealScene() {

        const loadingPage = document.getElementById("loading-screen");
        const scrollClip = document.getElementById("scroll-clip");

        if (loadingPage) loadingPage.style.visibility = "hidden";
        if (scrollClip) scrollClip.style.visibility = "visible";
        document.body.style.overflow = "auto";

        if (this.model) {
            this.model.scene.rotation.y = -document.documentElement.scrollTop / 1000 + 0.6;
        }
        this.renderer.render(this.scene, this.camera);
    }

    // Animation & Events

    #onResize = () => {
        const w = this.container.offsetWidth;
        this.camera.aspect = 2 / 1;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, w/2);
        this.#onScroll();
    };

    #onScroll = () => {
        if (this.model) {
            this.model.scene.rotation.y = -document.documentElement.scrollTop / 1000 + 0.6;
        }
        this.renderer.render(this.scene, this.camera);

        const threshold = window.innerHeight * 0.55;
        document.querySelectorAll(".floater").forEach((el) => {
            el.classList.toggle("inview", el.getBoundingClientRect().bottom < threshold);
        });
    };
}

new SceneManager("model");
