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
const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);
scene.background = new THREE.Color(0x292929);

//textures
const materials = [
  new THREE.MeshBasicMaterial({ map: loader.load('textures/phoneSide.png') }),
  new THREE.MeshBasicMaterial({ map: loader.load('textures/player1.png') }),
  new THREE.MeshBasicMaterial({ map: loader.load('textures/phoneTop.png') }),
  new THREE.MeshBasicMaterial({ map: loader.load('textures/phoneBack.png') }),
  new THREE.MeshBasicMaterial({ map: loader.load('textures/player1.png') }),
  new THREE.MeshBasicMaterial({ map: loader.load('textures/phoneBack.png') }),
  new THREE.MeshBasicMaterial({ map: loader.load('textures/phoneBack.png') }),
];

//verlichting
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
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
camera.position.set(0, 10, 10);
camera.lookAt(0, 10, 0);

// Set up renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(200, 200);
renderer.render(scene, camera);

document.body.appendChild(renderer.domElement);

loadManager.onLoad = () => {
  const geometry = new THREE.BoxBufferGeometry(14, 28, 2);
  const phone = new THREE.Mesh(geometry, materials);
  phone.position.x = 0;
  phone.position.y = 0;

  scene.add(phone);
  renderer.render(scene, camera);

  
  /*//functie voor gyroSync
  gyroscope.addEventListener('reading', (e) => {
    phone.rotateX(gyroscope.x / 64);
    phone.rotateY(gyroscope.y / 64);
    phone.rotateZ(gyroscope.z / 64);
    renderer.render(scene, camera);
  });*/

  function initSensor() {
    const options = { frequency: 60, referenceFrame: 'device'};
    console.log(JSON.stringify(options));
    const sensor =  
        new AbsoluteOrientationSensor(options);
  
    sensor.onreading = 
  () => phone.quaternion.fromArray(sensor.quaternion).invert();
  renderer.render(scene, camera);
  
    sensor.onerror = (event) => {
      if (event.error.name == 'NotReadableError') {
       console.log("Sensor is not available.");
      }
    }
   sensor.start();
  }

  initSensor();
};
