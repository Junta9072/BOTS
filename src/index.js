import * as THREE from 'three';

//remove gravity from acl
let noGrav = { x: 0, y: 0, z: 0 };
function noGravAcl() {
  noGrav.x = aclStore.x - gravStore.x;
  document.querySelector('.noGravX').textContent = Math.round(noGrav.x);
  noGrav.y = aclStore.y - gravStore.y;
  document.querySelector('.noGravY').textContent = Math.round(noGrav.y);
  noGrav.z = aclStore.z - gravStore.z;
  document.querySelector('.noGravZ').textContent = Math.round(noGrav.z);
}

//gyro
let gyroscope = new Gyroscope({ frequency: 60 });
let gyroStore = { x: 0, y: 0, z: 0 };
gyroscope.addEventListener('reading', (e) => {
  gyroStore.x = gyroStore.x + gyroscope.x;
  document.querySelector('.kompasX').style.transform =
    'rotate(' + gyroStore.x + 'deg)';
  gyroStore.y = gyroStore.y + gyroscope.y;
  document.querySelector('.kompasY').style.transform =
    'rotate(' + gyroStore.y + 'deg)';
  gyroStore.z = gyroStore.z + gyroscope.z;
  document.querySelector('.kompasZ').style.transform =
    'rotate(' + gyroStore.z + 'deg)';
});

//accelerometer
let acl = new Accelerometer({ frequency: 60 });
let aclStore = { x: 0, y: 0, z: 0 };
acl.addEventListener('reading', () => {
  aclStore.x = acl.x;
  aclStore.y = acl.y;
  aclStore.z = acl.z;
  noGravAcl();
});

//gravity
let gravitySensor = new GravitySensor({ frequency: 60 });
let gravStore = { x: 0, y: 0, z: 0 };
gravitySensor.addEventListener('reading', (e) => {
  gravStore.x = gravitySensor.x;
  gravStore.y = gravitySensor.y;
  gravStore.z = gravitySensor.z;
  noGravAcl();
});

gravitySensor.start();
acl.start();
gyroscope.start();

//3js

const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
scene.background = new THREE.Color(0xffffff);

//verlichting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(200, 500, 300);
scene.add(directionalLight);

//camera
// Setting up camera
const aspectRatio = 1 / 1;
const cameraWidth = 150;
const cameraHeight = cameraWidth / aspectRatio;

const camera = new THREE.OrthographicCamera(
  cameraWidth / -2, // left
  cameraWidth / 2, // right
  cameraHeight / 2, // top
  cameraHeight / -2, // bottom
  0, // near plane
  1000, // far plane
);
camera.position.set(200, 200, 200);
camera.lookAt(0, 10, 0);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(200, 200);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

function createPhone() {
  const geometry = new THREE.BoxBufferGeometry(14, 28, 2);
  const material = new THREE.MeshLambertMaterial({
    color: 0xffbe0b,
    map: loader.load('textures/cover.jpg'),
  });
  const phone = new THREE.Mesh(geometry, material);
  phone.position.x = 0;
  phone.position.y = 0;
  scene.add(phone);
}
createPhone();

renderer.render(scene, camera);
