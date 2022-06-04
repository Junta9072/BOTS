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
