/**
 * Marvin - TODO: clean
 */
var Marvin = (function(my, global) {
  var objects = [],
    sprite_material = {},
    camera_target_rotation_y = null,
    camera_target_position = null,
    camera_direction,
    camera_axis,
    camera_rotation_callback,
    camera_position_callback;

  var sceneOrtho = new THREE.Scene();
  var cameraOrtho = new THREE.OrthographicCamera( - window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, - window.innerHeight / 2, 1, 10 );
  cameraOrtho.position.z = 10;

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog( new THREE.Color( 0 ), 1,10 );

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  var map = THREE.ImageUtils.loadTexture( "images/1.png" );
  map.magFilter = THREE.NearestFilter;

  var scale = 2;
  var cube_geometry = new THREE.CubeGeometry(scale,scale,scale);
  var cube_material = new THREE.MeshBasicMaterial( { map: map } );

  var renderCameraRotation = function() {
    if (camera_target_rotation_y !== null) {
      camera.rotation.y += camera_direction*0.1;
      if ((camera_direction == 1 && camera.rotation.y > camera_target_rotation_y) || (camera_direction == -1 && camera.rotation.y < camera_target_rotation_y)) {
        camera.rotation.y = camera_target_rotation_y;
        camera_target_rotation_y = null;
        if (typeof camera_rotation_callback == 'function') camera_rotation_callback();
      }
    }
  }

  var renderCameraPosition = function() {
    if (camera_target_position !== null) {
      camera.position[camera_axis] += camera_direction*0.1;
      if ((camera_direction == 1 && camera.position[camera_axis] > camera_target_position) || (camera_direction == -1 && camera.position[camera_axis] < camera_target_position)) {
        camera.position[camera_axis] = camera_target_position;
        camera_target_position = null;
        if (typeof camera_position_callback == 'function') camera_position_callback();
      }
    }
  }

  var render = function () {
    requestAnimationFrame(render);

    renderCameraRotation();
    renderCameraPosition();

    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(sceneOrtho, cameraOrtho );
  };

  /**
   * drawCube()
   */
  my.drawCube = function(x, y) {
    var c = new THREE.Mesh(cube_geometry, cube_material);
    scene.add(c);
    objects.push(c);
    c.position.z = scale*y;
    c.position.x = scale*x;

    var __g = new THREE.CubeGeometry( 0.1, 6*2/32, 14*2/32 );
    var __m = new THREE.MeshBasicMaterial( { color: 0xaaaaaa } );
    var __b = new THREE.Mesh( __g, __m );
    __b.position.z = scale*y + 9*2/32 -0.5;
    __b.position.x = scale*x+1;
    scene.add( __b );

    return c;
  }

  /**
   * drawCube()
   */
  my.drawSprite = function(x, y, n) {

    // Initialisation du materiel si non existant
    if (!sprite_material[n]) {
      var sprite_texture = THREE.ImageUtils.loadTexture( "images/" + n + ".png" );
      sprite_texture.magFilter = THREE.NearestFilter;
      sprite_material[n] = new THREE.SpriteMaterial( { map: sprite_texture, color: 0xffffff, fog: true } );
    }
  
    var sprite = new THREE.Sprite( sprite_material[n] );
    sprite.scale.set( 0.5, 0.5, 1 );
    sprite.position.z = scale*y;
    sprite.position.x = scale*x;
    sprite.position.y = -1 + (0.5/2);

    objects.push(sprite);
    scene.add( sprite );
    return sprite;
  }

  /**
   * drawFloor()
   */
  my.drawFloor = function(wx, wy) {
    var geometry_plane = new THREE.PlaneGeometry( wx*scale, wy*scale );
    var material_plane = new THREE.MeshBasicMaterial( {color: 0x444444 } );
    var floor = new THREE.Mesh( geometry_plane, material_plane );
    floor.rotation.x = Math.PI + Math.PI/2;
    floor.position.y = -1;
    floor.position.z = scale*(wy/2);
    floor.position.x = scale*(wx/2);

    var ceil = new THREE.Mesh( geometry_plane, material_plane );
    ceil.rotation.x = Math.PI/2;
    ceil.position.y = 1;
    ceil.position.z = scale*(wy/2);
    ceil.position.x = scale*(wx/2);

    scene.add( floor );
    scene.add( ceil );
  }
  /**
   * setCameraPosition()
   */
  my.setCameraPosition = function(x, y) {
    camera.position.z = scale*y;
    camera.position.y = 0;
    camera.position.x = scale*x;
  }
  /**
   * startRender()
   */
  my.startRender = function () {
    render();
  }
  /**
   * startCameraRotation()
   */
  my.startCameraRotation = function(direction, callback) {
    camera_direction = direction;
    camera_rotation_callback = callback;
    camera_target_rotation_y = camera.rotation.y + (Math.PI / 2)*camera_direction;
    console.log(camera.rotation.y, camera_target_rotation_y);
  }
  /**
   * startCameraMovement()
   */
  my.startCameraMovement = function(axis, direction, callback) {
    camera_direction = direction;
    camera_axis = axis;
    camera_position_callback = callback;
    camera_target_position = camera.position[camera_axis] + 2*camera_direction;
    console.log(camera.position[camera_axis], camera_target_position);
  }

  my.getObjects = function() {
    return objects;
  }

  my.getElement = function(x, y) {
    
    var vector = new THREE.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
    var projector = new THREE.Projector();

    projector.unprojectVector(vector, camera);

    var raycaster = new THREE.Raycaster(camera.position, vector.sub(camera.position).normalize());

    var intersects = raycaster.intersectObjects(objects);

    if (intersects[0]) {
      console.log(raycaster.ray.origin.distanceTo( intersects[0].point ));
      intersects[0].realDistance = raycaster.ray.origin.distanceTo( intersects[0].point );
      return intersects[0];
    }
  }

  my.removeObject = function(o) {
    scene.remove(o);
  }

  my.displayObjectOrtho = function(i, o) {
    console.log(o);
    o.scale.set( window.innerWidth/32, window.innerWidth/32, 1 );
    o.position.set(-window.innerWidth/2+32 +(i*32),window.innerHeight/2-32,1)
    sceneOrtho.add(o);
  }

  return my;
}(Marvin || {}, this));
