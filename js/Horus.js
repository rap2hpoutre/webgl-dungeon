var Horus = (function(my, global) {

  var sceneOrtho = new THREE.Scene();
  var cameraOrtho = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 1, 10 );
  cameraOrtho.position.z = 10;

  my.scene = sceneOrtho;
  my.camera = cameraOrtho;

  return my;
} (Horus || {}, this));
