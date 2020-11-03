import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "./styles.css";

let scene, camera, renderer;
let geometry, material, cube;
let nGeometry, blueMaterial, nCube;
let colour, intensity, light;
let ambientLight;
let sceneHeight, sceneWidth;

let orbit;

let listener, sound, audioLoader;

let clock, delta, interval;

let startButton = document.getElementById("startButton");
startButton.addEventListener("click", init);

function init() {
  // remove overlay
  let overlay = document.getElementById("overlay");
  overlay.remove();

  //create our clock and set interval at 30 fpx
  clock = new THREE.Clock();
  delta = 0;
  interval = 1 / 30;

  sceneWidth = window.innerWidth;
  sceneHeight = window.innerHeight;

  //create our scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  //create camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;
  camera.position.y = 2;

  //specify our renderer and add it to our document
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //create the orbit controls instance so we can use the mouse move around our scene
  orbit = new OrbitControls(camera, renderer.domElement);
  orbit.enableZoom = true;
  orbit.autoRotate = true;
  orbit.autoRotateSpeed = 50.0;

  colour = 0xffffff;
  intensity = 1;
  light = new THREE.DirectionalLight(colour, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  nGeometry = new THREE.BoxGeometry(2, 2, 2);
  blueMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.5
  });
  geometry = new THREE.BoxGeometry();
  material = new THREE.MeshNormalMaterial();
  cube = new THREE.Mesh(geometry, material);
  nCube = new THREE.Mesh(nGeometry, blueMaterial);

  // gridhelper
  var size = 3;
  var division = 500;
  var mGridHelper = new THREE.GridHelper(size, division, material, material);
  var nGridHelper = new THREE.GridHelper(
    size * 5,
    division,
    0x0000ff,
    0x0000ff
  );
  var oGridHelper = new THREE.GridHelper(
    size * 5,
    division / 10,
    0x0000ff,
    0x0000ff
  );
  var mVector = new THREE.Vector3(2, 0, 0);
  var nVector = new THREE.Vector3(-1000, 1000, 0);
  var oVector = new THREE.Vector3(1000, 1000, 0);
  mGridHelper.lookAt(mVector);
  nGridHelper.lookAt(nVector);
  oGridHelper.lookAt(oVector);

  scene.add(cube);
  scene.add(nCube);
  scene.add(mGridHelper);
  scene.add(nGridHelper);
  scene.add(oGridHelper);

  // listeners
  window.addEventListener("resize", onWindowResize, false);
  listener = new THREE.AudioListener();
  camera.add(listener);
  sound = new THREE.Audio(listener);

  audioLoader = new THREE.AudioLoader();
  audioLoader.load("./sound/GIANNY.mp3", function (buffer) {
    sound.setBuffer(buffer);

    sound.setLoop(true);
    sound.setVolume(0.8);
    sound.play();
  });

  play();
}

// stop animating (not currently used)
function stop() {
  renderer.setAnimationLoop(null);
}

// simple render function

function render() {
  renderer.render(scene, camera);
}

// start animating

function play() {
  //using the new setAnimationLoop method which means we are WebXR ready if need be
  renderer.setAnimationLoop(() => {
    update();
    render();
  });
}

//our update function

function update() {
  orbit.update();
  //update stuff in here
  cube.rotation.x += 0.1;
  cube.rotation.y += 0.0;
  cube.rotation.z -= 0.0;
  nCube.rotation.x += -0.1;
  nCube.rotation.y += 0.0;
  nCube.rotation.z += 0.0;
}

function onWindowResize() {
  //resize & align
  sceneHeight = window.innerHeight;
  sceneWidth = window.innerWidth;
  renderer.setSize(sceneWidth, sceneHeight);
  camera.aspect = sceneWidth / sceneHeight;
  camera.updateProjectionMatrix();
}
