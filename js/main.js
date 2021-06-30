import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


let container;
let camera;
let renderer;
let scene;
let controls;

var modelName = "gltf/spinner1.glb";
const mixers = [];
const clock = new THREE.Clock();

function init() {
  container = document.querySelector("#scene-container");

  // Creating the scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color("#323238");

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
  const mainLight = new THREE.DirectionalLight(0xffffff, 3);
  mainLight.position.set(-1, 10, -18);

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
  controls.maxPolarAngle = 0.95;
  controls.minPolarAngle = 0.95;
  controls.enablePan = false;
  controls.screenSpacePanning = false;
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
document.getElementById("start-button").addEventListener("click", () => {
  setTimeout(function () {

    document.getElementById("tip").style.display = 'block';
    document.getElementById("quiz").style.display = 'contents';
    document.getElementById("canvas3d").style.display = 'block';
    document.getElementById("question").style.display = 'block';
    document.getElementById("description").style.display = 'none';
    document.getElementById("start-button").style.display = 'none';
    document.getElementById("title-h1").style.display = 'none';
    document.getElementById("subtitle").style.display = 'none';
    document.getElementById("feedback-info").style.display = 'contents';
    init();
  }, 3000);
});

const questions = [
  { 'file': 'gltf/spinner1.glb', 'hint': '1. Film from 2010', 'answers': ['inception', 'origen'] },
  { 'file': 'gltf/steps2.glb', 'hint': '2. Film from 1997', 'answers': ['harry', 'potter', 'philosopher'] },
  { 'file': 'gltf/platform8.glb', 'hint': '3. Film from 2018', 'answers': ['platform', 'hoyo'] },
  { 'file': 'gltf/spoon.glb', 'hint': '4. Film from 1999', 'answers': ['matrix', 'reloaded', 'revolution'] },
  { 'file': 'gltf/dead_head.glb', 'hint': '5. Film from 1995', 'answers': ['se7en', 'seven', '7'] },
  { 'file': 'gltf/pottery.glb', 'hint': '6. Film from 1990', 'answers': ['ghost'] },
  { 'file': 'gltf/axe.glb', 'hint': '7. Film from 1980', 'answers': ['shining','resplandor'] },
]
var questions_count = 0;

document.getElementById("submit-button").addEventListener("click", () => {

  var answer = document.getElementById("submit-text").value.toLowerCase().split(' ');

  var intersection = answer.filter(function (n) {
    return questions[questions_count]['answers'].indexOf(n) !== -1;
  });

  if (intersection.length > 0) {
    document.getElementById("feedback").style.opacity = '1';
    document.getElementById("feedback").innerHTML = 'Great! Next question';
    document.getElementById("feedback").style.color = '#06D6A0';
    document.getElementById("feedback").style.borderStyle = 'solid';
    document.getElementById("feedback").style.color = '#06D6A0';

    scene.clear();

    setTimeout(function () {
      document.getElementById("feedback").style.opacity = '0';

      questions_count += 1;
      document.getElementById("submit-text").value = '';
      document.getElementById("hint").innerHTML = questions[questions_count]['hint'];

      createLights();
      loadModels(questions[questions_count].file);
      createControls();
      document.getElementById("tip").style.display = 'none';
    }, 3000);
  } else {
    document.getElementById("feedback").style.opacity = '1';
    document.getElementById("feedback").style.color = '#EF476F';
    document.getElementById("feedback").style.borderStyle = 'solid';
    document.getElementById("feedback").style.borderRadius = '#EF476F';
    document.getElementById("feedback").innerHTML = 'Oops, try again!';

  }
});
