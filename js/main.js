import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r127/examples/jsm/loaders/GLTFLoader.js';


let container;
let camera;
let renderer;
let scene;
let controls;

var modelName = "gltf/empire.glb";
const mixers = [];
const clock = new THREE.Clock();

var url="https://api.countapi.xyz/hit/moviequiz-hii.enricmor.eu/visits";

fetch(url)
.then(response => response.json())
.then(data => null);

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
  document.getElementById("start-button").disabled = true;
  setTimeout(function () {
    if(screen.width > 400) {
      document.getElementById("tip").style.display = 'block';
    }
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
  { 'file': 'gltf/empire.glb', 'hint-button': 'Sci-Fi movie where a fifty-foot gorilla goes on a rampage, destroying everything in his past and kidnapping a beautiful young actress in New York City.', 'hint': '1. Movie from 1933', 'answers': ['king', 'kong'] },
  { 'file': 'gltf/axe.glb', 'hint-button': 'Horror movie where Jack Nicholson descends into madness in an isolated hotel and tries to kill his family.', 'hint': '2. Movie from 1980', 'answers': ['shining','resplandor'] },
  { 'file': 'gltf/neuralyzer.glb', 'hint-button': 'Sci-Fi movie where Tommy Lee Jones and Will Smith work at an ultra-secret organization that patrols alien immigrants on Earth and protects the safety of ordinary citizens.', 'hint': '3. Movie from 1997', 'answers': ['men', 'black'] },
  { 'file': 'gltf/spinner1.glb', 'hint-button': 'Sci-Fi movie where Leonardo DiCaprio is a skilled thief, who is the absolute best in the dangerous art of extraction, stealing valuable secrets from deep within the subconscious during the dream state.', 'hint': '4. Movie from 2010', 'answers': ['inception', 'origen'] },
  { 'file': 'gltf/horse.glb', 'hint-button': 'Crime movie of a 1940s New York Mafia family that struggle to protect their empire from rival families as the leadership switches from the father.', 'hint': '5. Movie from 1972', 'answers': ['godfather', 'padrino'] },
  { 'file': 'gltf/ticket.glb', 'hint-button': 'A Tim Burton movie where an eccentric chocolatier launches a worldwide contest to select an heir to his candy empire.', 'hint': '6. Movie from 2005', 'answers': ['charlie', 'chocolate', 'factory', 'willy', 'wonka'] },
  { 'file': 'gltf/pottery.glb', 'hint-button': 'Romantic movie where a gunned lover comes back as a ghost in order to protect her girlfriend from danger.', 'hint': '7. Movie from 1990', 'answers': ['ghost'] },
  { 'file': 'gltf/steps_bevel.glb', 'hint-button': 'Fantasy movie where a British kid learns that he is the orphaned son of two powerful wizards and possesses unique magical powers of his own.', 'hint': '8. Movie from 2001', 'answers': ['harry', 'potter', 'philosopher'] },
  { 'file': 'gltf/dead_head_bevel.glb', 'hint-button': 'Thriller by Brad Pitt and Morgan Freeman. A serial killer begins murdering people according to the seven deadly sins.', 'hint': '9. Movie from 1995', 'answers': ['se7en', 'seven', '7'] },
  { 'file': 'gltf/bed.glb', 'hint-button': 'Fantasy movie set in Middle-earth, the story tells of the Dark Lord Sauron who seeks the One Ring, which contains part of his soul, in order to return to power.', 'hint': '10. Movie from 2001', 'answers': ['lord', 'rings', 'fellowship', 'señor', 'anillos', 'comunidad'] },
  { 'file': 'gltf/unicorn.glb', 'hint-button': 'Sci-Fi movie where Harrison Ford is a retired cop in Los Angeles in 2019. L.A. has become a pan-cultural dystopia of corporate advertising, pollution and flying automobiles, as well as replicants, human-like androids with short life spans built by the Tyrell Corporation for use in dangerous off-world colonization.', 'hint': '11. Movie from 1982', 'answers': ['blade','runner'] },
  { 'file': 'gltf/potatoes.glb', 'hint-button': 'Black and white comedy where the main actor wrote, directed, produced, edited, starred in, and composed the music for most of his films.', 'hint': '12. Movie from 1925', 'answers': ['gold', 'rush', 'charlie', 'charles', 'chaplin'] },
  // { 'file': 'gltf/bone.glb', 'hint': '12. Movie from 1968', 'answers': ['space', 'odissey'] },
  // { 'file': 'gltf/platform8.glb', 'hint': '3. Movie from 2018', 'answers': ['platform', 'hoyo'] },
  // { 'file': 'gltf/spoon.glb', 'hint': '4. Movie from 1999', 'answers': ['matrix', 'reloaded', 'revolution'] },
]
var questions_count = 0;

document.getElementById("submit-button").addEventListener("click", () => {

  var answer = document.getElementById("submit-text").value.toLowerCase().split(' ');

  var intersection = answer.filter(function (n) {
    return questions[questions_count]['answers'].indexOf(n) !== -1;
  });

  if (intersection.length > 0) {
    if (questions_count == questions.length -1){
      window.location.href = '/congrats.html';
    }

    document.getElementById("submit-button").disabled = true;


    document.getElementById("feedback").style.opacity = '1';
    document.getElementById("feedback").innerHTML = 'Great! Next question';
    document.getElementById("feedback").style.color = '#06D6A0';
    document.getElementById("feedback").style.borderStyle = 'solid';
    document.getElementById("feedback").style.color = '#06D6A0';
    document.getElementById("spinner").style.display = 'block';
    document.getElementById("scene-container").style.opacity = 0;
    document.getElementById("quiz2").style.opacity = 0;
    

    var url = "https://api.countapi.xyz/hit/moviequiz" + questions_count + ".enricmor.eu/visits"

  fetch(url)
  .then(response => response.json())
  .then(data => null);

    scene.clear();

    setTimeout(function () {
      document.getElementById("feedback").style.opacity = '0';

      questions_count += 1;
      document.getElementById("submit-text").value = '';
      document.getElementById("hint").innerHTML = questions[questions_count]['hint'];
      $('[data-toggle="tooltip"]').attr("data-original-title",questions[questions_count]['hint-button']);

      createLights();
      loadModels(questions[questions_count].file);
      createControls();
      document.getElementById("tip").style.display = 'none';
      document.getElementById("submit-button").disabled = false;
      document.getElementById("scene-container").style.opacity = 1;
      document.getElementById("spinner").style.display = 'none';
      document.getElementById("quiz2").style.opacity = 1;
    }, 3000);
  } else {
    document.getElementById("feedback").style.opacity = '1';
    document.getElementById("feedback").style.color = '#EF476F';
    document.getElementById("feedback").style.borderStyle = 'solid';
    document.getElementById("feedback").style.borderRadius = '#EF476F';
    document.getElementById("feedback").innerHTML = 'Oops, try again!';

  }
});
