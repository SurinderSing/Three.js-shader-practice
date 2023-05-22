import * as THREE from "three";
import { DoubleSide } from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// .
// .
// .
// .
// .
// Texture Maping on objects:: 

const moonImg = new THREE.TextureLoader().load("./moon.jpg");
const moonsurface = new THREE.TextureLoader().load('./normal.jpg');


// window sizes::
let windowHeight = window.innerHeight;
let windowWidth = window.innerWidth;

// creating scene::
const scene = new THREE.Scene();

// creating geometry/mesh ::

const geometry = new THREE.PlaneGeometry(10, 10, 20, 20);


// const meterial = new THREE.MeshStandardMaterial({
//     wireframe: true,
//     color: "#00A884",
//     roughness: 0.6,
//     // map: moonImg,
//     // normalMap: moonsurface,
// });

var meterial = new THREE.ShaderMaterial({
  vertexShader: `
  uniform float amplitude; // Amplitude of the waves
  uniform float frequency; // Frequency of the waves
  uniform float speed; // Speed of the waves
  varying vec2 vUv;
  
  void main() {
    vUv = uv; // Pass the UV coordinates to the fragment shader
    vec3 newPosition = position; // Copy the original position
    float time = speed * length(position); // Calculate the time based on the speed and distance from the origin
    newPosition.z += amplitude * sin(time + frequency * position.x); // Apply the wave effect
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
  `,
  fragmentShader: `
  varying vec2 vUv;
  uniform vec3 color; // Color of the waves
  
  void main() {
    // Apply the color to the fragment
    gl_FragColor = vec4(color, 1.0);
  }
  
  `,
  side: DoubleSide,
  uniforms: {
    amplitude: { value: 1.0 }, // Set the amplitude uniform value
    frequency: { value: 1.0 }, // Set the frequency uniform value
    speed: { value: 0.1 }, // Set the speed uniform value
    color: { value: new THREE.Color(0x00ff00) }, // Set the color uniform value
  },
});

const mesh = new THREE.Mesh(geometry, meterial);
mesh.position.y = 0;
mesh.rotation.x = 300;
// console.log(mesh)

// adding mesh to the scene::
scene.add(mesh);

// creating camera ::
const camera = new THREE.PerspectiveCamera(40, windowWidth / windowHeight, 5, 1000);
// set camera position  ::
camera.position.z = 60;
camera.position.y = 100;
// adding camera to the scene::
scene.add(camera);

// creating light::
const light = new THREE.PointLight("#fff", 1.2, 200);
// Shadow::
light.castShadow = true;
// set light Position::
light.position.z = 20;
light.position.y = 20;
light.position.x = 0;
// adding light to the scene::
scene.add(light);

// creating renderer::
const mainCanvas = document.querySelector('.main-canvas');
const renderer = new THREE.WebGL1Renderer({ canvas: mainCanvas, antialias: true });
renderer.setPixelRatio(window.devicePixelRatio)
// setting renderer size ::
renderer.setSize(windowWidth, windowHeight)
// starting renderer ::
// renderer.render(scene, camera);

// Creating Controler:: 
const controler = new OrbitControls(camera, mainCanvas);
controler.enableDamping = true;
// controler.enableZoom = false;
// controler.enablePan = false;
// controler.autoRotate = true;
// controler.autoRotateSpeed = 3;

// update sizes on window resize::

window.addEventListener('resize', function () {
  windowWidth = window.innerWidth;
  windowHeight = window.innerHeight;

  // updating camera and renderer aspect ratio::
  camera.aspect = windowWidth / windowHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(windowWidth, windowHeight);
})

function animate() {

  // Update the uniform values to animate the waves
  var time = performance.now() * 0.0015; // Use current time for animation
  meterial.uniforms.amplitude.value = 0.6 * Math.sin(time * 1.0); // Update amplitude
  meterial.uniforms.frequency.value = 0.8 + 0.1 * Math.sin(time * 0.6); // Update frequency
  meterial.uniforms.speed.value = 0.4 + 0.05 * Math.tan(time * 0.3); // Update speed



  controler.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

}

animate();


// set background color ::
// this will set the background color transparent and then u can set the background color on canvas:
renderer.setClearColor(0xffffff, 0);



// .
// .
// .
// .
// .
// .
// .
// Adding background to the scene ::

// const background = new THREE.TextureLoader().load("./background.png");
// scene.backgroundIntensity = background;


// .
// .
// .
// .
// Add Stars::
function AddStar() {
  const geometry = new THREE.SphereGeometry(0.1, 24, 24);
  const material = new THREE.MeshBasicMaterial({ color: '#fff' })
  const star = new THREE.Mesh(geometry, material);
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  star.position.set(x, y, z);
  scene.add(star);
}
Array(200).fill().forEach(AddStar);

// .
// .
// .
// .
// Helpers ::

// const lightHelper = new THREE.PointLightHelper(light);
// const gridHelper = new THREE.GridHelper(windowWidth, windowHeight)

// scene.add(lightHelper, gridHelper);
