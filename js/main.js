import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


let container;
let camera;
let renderer;
let scene;
let controls;

var modelName = "gltf/steps2.glb";
const mixers = [];
const clock = new THREE.Clock();

function init() {
  container = document.querySelector("#scene-container");

  // Creating the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#7abcff");

  createCamera();
  createLights();
  loadModels(modelName);
  createControls();
  createRenderer();

  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

function createCamera() {
  const fov = 60;
  // const aspect = container.clientWidth / container.clientHeight;
  const near = 0.01;
  const far = 10000;
  camera = new THREE.PerspectiveCamera(fov, 1, near, far);
  camera.position.set(4, 9, 12);
}

function createLights() {
  const mainLight = new THREE.DirectionalLight(0xffffff, 5);
  mainLight.position.set(10, 10, 10);

  const hemisphereLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 5);
  scene.add(mainLight, hemisphereLight);
}

function loadModels(modelName) {
  const loader = new GLTFLoader();

  const onLoad = (result, position) => {
    const model = result.scene;
    // model.position.copy(position);
    model.scale.set(3, 3, 3);

    const mixer = new THREE.AnimationMixer(model);
    mixers.push(mixer);

    var i;
    for (i = 0; i < result.animations.length; i++) {

      const animation = result.animations[i];
      const action = mixer.clipAction(animation);
      action.play();
    }

    scene.add(model);
  };

  const onProgress = (progress) => { };

  const modelPosition = new THREE.Vector3(0, 0, 2.5);

  loader.load(
    modelName,
    (gltf) => onLoad(gltf, modelPosition),
    onProgress
  );

}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.gammaFactor = 2.2;
  // renderer.gammaOutput = true;
  renderer.physicallyCorrectLights = true;

  container.appendChild(renderer.domElement);
}

function createControls() {
  controls = new OrbitControls(camera, container);
  controls.enableZoom = false;
  controls.maxPolarAngle = 1;
  controls.minPolarAngle = 1;
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

// Quizz logic
const questions = [
  { 'file': 'gltf/steps2.glb', 'hint': 'Film from 1997', 'answers': ['harry', 'potter', 'philosopher'] },
  { 'file': 'gltf/platform8.glb', 'hint': 'Film from 2018', 'answers': ['platform', 'hoyo'] },
]
var questions_count = 0;

document.getElementById("submit").addEventListener("click", () => {
  questions_count +=1;
  console.log(questions[questions_count]);

  document.getElementById("hint").innerHTML = questions[questions_count].hint;

  scene.clear();

  createLights();
  loadModels(questions[questions_count].file);
  createControls();
});