var Horus = (function(my, global) {

  var sceneOrtho = new THREE.Scene();
  var cameraOrtho = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 1, 10 );
  cameraOrtho.position.z = 10;

  var projectorraf = new THREE.Projector();

  my.scene = sceneOrtho;
  my.camera = cameraOrtho;
  my.objects = [];

  my.updateInventory = function() {
    for (i = 0; i < my.objects.length; i++) {
      my.displayObjectOrtho(i, my.objects[i]);
    }
  }

  my.displayObjectOrtho = function(i, o) {
    o.scale.set( window.innerWidth/32, window.innerWidth/32, 1 );
    o.position.set(-window.innerWidth/2+32 +(i*32),window.innerHeight/2-32,1);
    my.scene.add(o);
  }

  my.debugThrowAll = function() {
    for (i = 0; i < my.objects.length; i++) {
      my.scene.remove(my.objects[i]);
    }
    my.objects = [];
  }

  my.getElement = function(x, y) {

   var vector = new THREE.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);

    var ray = projectorraf.pickingRay( vector, cameraOrtho );

    var intersects = ray.intersectObjects( my.objects );
    if ( intersects.length > 0 ) {
      return intersects[ 0 ];
    }
  }

  return my;
} (Horus || {}, this));
