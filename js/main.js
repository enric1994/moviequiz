import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


  let container;
  let camera;
  let renderer;
  let scene;
  let controls;
  
  const mixers = [];
  const clock = new THREE.Clock();
  
  function init() {
    container = document.querySelector("#scene-container");
  
    // Creating the scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color("#7abcff");
  
    createCamera();
    createLights();
    loadModels();
    createControls();
    createRenderer();
  
    renderer.setAnimationLoop(() => {
      update();
      render();
    });
  }
  
  function createCamera() {
    const fov = 60;
    const aspect = container.clientWidth / container.clientHeight;
    const near = 0.01;
    const far = 10000;
    camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.set(-1.5, 1.5, 10);
  }
  
  function createLights() {
    const mainLight = new THREE.DirectionalLight(0xffffff, 5);
    mainLight.position.set(10, 10, 10);
  
    const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 5);
    scene.add(mainLight, hemisphereLight);
  }
  
  function loadModels() {
    const loader = new GLTFLoader();
  
    const onLoad = (result, position) => {
      const model = result.scene;
      // model.position.copy(position);
      model.scale.set(3,3,3);
  
      const mixer = new THREE.AnimationMixer(model);
      mixers.push(mixer);
  
      const animation = result.animations[0];
      const action = mixer.clipAction(animation);
      action.play();
  
      scene.add(model);
    };
  
    const onProgress = (progress) => {};
  
    const parrotPosition = new THREE.Vector3(0, 0, 2.5);
    loader.load(
      "gltf/platform6.glb",
      (gltf) => onLoad(gltf, parrotPosition),
      onProgress
    );
  
  }
  
  function createRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    renderer.physicallyCorrectLights = true;
  
    container.appendChild(renderer.domElement);
  }
  
  function createControls() {
    controls = new OrbitControls(camera, container);
  }
  
  function update() {
    const delta = clock.getDelta();
    mixers.forEach((mixer) => mixer.update(delta));
  }
  
  function render() {
    renderer.render(scene, camera);
  }
  
  init();
  
  function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
  
    // Update camera frustum
    camera.updateProjectionMatrix();
  
    renderer.setSize(container.clientWidth, container.clientHeight);
  }
  window.addEventListener("resize", onWindowResize, false);
  