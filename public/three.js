import { swing } from "./sketch.js";
import * as THREE from "three";
import { GLTFLoader } from "https://threejs.org/examples/jsm/loaders/GLTFLoader.js";

import { io } from "socket.io-client";
const socket = io();

document.querySelector(".storageManager").addEventListener("click", () => {
  sessionStorage.removeItem("10nis");
  socket.emit("obituary", socket.id);
});

//css palette changer
let colourCount = 0;
var root = document.querySelector(":root");
function setColour(key, value) {
  root.style.setProperty(key, value);
}

document.querySelector(".palette").addEventListener("click", () => {
  if (colourCount > 3) {
    colourCount = 0;
  }
  switch (colourCount) {
    //green tennis court
    case 0:
      setColour("--background", "#568432");
      setColour("--primary", "white");
      setColour("--secondary", "black");
      break;
    //blue tennis court
    case 1:
      setColour("--background", "#207CA0");
      setColour("--primary", "white");
      setColour("--secondary", "black");
      break;
    //orange tennis court
    case 2:
      setColour("--background", "#EA822D");
      setColour("--primary", "white");
      setColour("--secondary", "black");
      break;
    case 3:
      setColour("--background", "black");
      setColour("--primary", "white");
      setColour("--secondary", "#E8D023");
      break;

    default:
      break;
  }
  colourCount++;
});

//swing detection
let swingData = {
  src: sessionStorage.getItem("10nis"),
  heading: "",
  magnitude: "",
};

//socket Onboarding
socket.on("connect", () => {
  console.log("connecting with " + socket.id);
  socket.emit("onboarding", {
    src: socket.id,
    storage: sessionStorage.getItem("10nis"),
  });
  socket.on(socket.id, (msg) => {
    sessionStorage.setItem("10nis", msg.storage);
    alert(msg.info);
  });
});

socket.on("swing", (msg) => {
  swing(msg);
});

//3js
//racket maker
function protagonist() {
  const scene = new THREE.Scene();
  scene.background = null;
  var left = -3.2,
    right = 3.2,
    top = 2.4,
    bottom = -2.4,
    near = 1,
    far = 100,
    camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  camera.zoom = 1.2;
  camera.updateProjectionMatrix();
  camera.position.set(0, 0, 1); // position camera
  camera.lookAt(0, 0, 0); // have camera look at 0,0,0

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    (window.innerWidth / 100) * 30,
    (window.innerWidth / 100) * 40
  );
  document.querySelector(".protagonist").appendChild(renderer.domElement);

  /*const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/

  const loader = new GLTFLoader();
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  var model;

  loader.load(
    "textures/files/tennisracket.glb",
    function (gltf) {
      model = gltf.scene;
      scene.add(model);

      const sensorAbs = new AbsoluteOrientationSensor({ frequency: 60 });
      sensorAbs.onreading = () => {
        //pass reading to server
        document.querySelector(".protagonist").style.color = "black";
        socket.emit("sensor", {
          src: sessionStorage.getItem("10nis"),
          reading: sensorAbs.quaternion,
        });

        //pass reading to 3d model
        model.quaternion.fromArray(sensorAbs.quaternion);

        renderer.render(scene, camera);
        renderer.domElement.id = "protagonistCanvas";
      };
      sensorAbs.start();

      //swingdetection
      let laSensor = new LinearAccelerationSensor({ frequency: 60 });
      laSensor.addEventListener("reading", (e) => {
        if (laSensor.x > 20 || laSensor.y > 20 || laSensor.z > 20) {
          console.log("SWING");
          socket.emit("swing", swingData);
        }
        socket.emit("laSensor", {
          src: sessionStorage.getItem("10nis"),
          reading: { x: laSensor.x, y: laSensor.y, z: laSensor.z },
        });

        model.position.x = laSensor.x / 8;
        model.position.y = laSensor.y / 8;
        model.position.z = laSensor.z / 8;

        renderer.render(scene, camera);
      });
      laSensor.start();
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
protagonist();

function antagonist() {
  const scene = new THREE.Scene();
  scene.background = null;
  var left = -3.2,
    right = 3.2,
    top = 2.4,
    bottom = -2.4,
    near = 0.01,
    far = 100,
    camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
  camera.position.set(0, 0, 1); // position camera
  camera.lookAt(0, 0, 0); // have camera look at 0,0,0

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(
    (window.innerWidth / 100) * 30,
    (window.innerWidth / 100) * 40
  );
  document.querySelector(".antagonist").appendChild(renderer.domElement);

  /*const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );*/

  const loader = new GLTFLoader();
  const ambientLight = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambientLight);
  var model;

  loader.load(
    "textures/files/tennisracket.glb",
    function (gltf) {
      model = gltf.scene;
      scene.add(model);

      //move secondary tennisracket
      socket.on("sensor", (msg) => {
        if (msg.reading) {
          let reading = msg.reading;
          document.querySelector(".antagonist").style.color = "black";
          if (msg.src !== sessionStorage.getItem("10nis")) {
            model.quaternion.fromArray(reading);
          }
        } else {
          console.log("bananabread");
        }
      });
      renderer.render(scene, camera);
      renderer.domElement.id = "antagonistCanvas";

      socket.on("laSensor", (msg) => {
        if (msg.reading) {
          let laReading = msg.reading;
          if (msg.src !== sessionStorage.getItem("10nis")) {
            model.position.x = laReading.x / 8;
            model.position.y = laReading.y / 8;
            model.position.z = laReading.z / 8;
          }
        } else {
          console.log("bananabread");
        }
      });
      renderer.render(scene, camera);
    },
    undefined,
    function (error) {
      console.error(error);
    }
  );

  camera.position.z = 5;
  camera.lookAt(0, 0, 0);

  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
  }
  animate();
}
antagonist();
export { swing };
