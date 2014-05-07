/**
 * Marvin - TODO: clean
 */
var Marvin = (function(my, Horus, global) {
  var objects = [],
    sprite_material = {},
    wall_material = {},
    moving_walls = [],
    camera_target_rotation_y = null,
    camera_target_position = null,
    camera_direction,
    camera_axis,
    camera_rotation_callback,
    camera_position_callback;

  var scene = new THREE.Scene();
  scene.fog = new THREE.Fog( new THREE.Color( 0 ), 1, 10 );

  var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

  var renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.autoClear = false;
  document.body.appendChild(renderer.domElement);

  var scale = 2;
  var cube_geometry = new THREE.CubeGeometry(scale,scale,scale);

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

    for (var i in moving_walls) {
      moving_walls[i].translateY(0.05);
      if (moving_walls[i].position.y > 1.8) {
        moving_walls[i].material = wall_material[1];
        moving_walls.splice(i, 1);
      }
    }

    renderer.clear();
    renderer.render(scene, camera);
    renderer.clearDepth();
    renderer.render(Horus.scene, Horus.camera );
  };

  /**
   * drawCube()
   */
  my.drawCube = function(x, y, n, transparent) {

    // Initialisation du materiel si non existant
    if (!wall_material[n]) {
      var map_wall = THREE.ImageUtils.loadTexture( "images/" + n + ".png" );
      map_wall.magFilter = THREE.NearestFilter;
      wall_material[n] = new THREE.MeshBasicMaterial( { map: map_wall, transparent: transparent } );
    }

    var c = new THREE.Mesh(cube_geometry, wall_material[n]);

    c.gameProperties = { id: objects.length, x: x, y: y};
    c.position.z = scale*y;
    c.position.x = scale*x;

    objects.push(c);
    scene.add(c);
    return c;
  }

  my.addClickTrigger = function(x, y, type, target) {
    if (/T_SECRET_WALL_BUTTON_./.test(type)) { // bouton secret accessible quand on regarde à l'est

      if (type=='T_SECRET_WALL_BUTTON_E') {
        var t = new THREE.Mesh( new THREE.CubeGeometry( 0.05, 1/8, 1/8 ), new THREE.MeshBasicMaterial( { visible: false } ));
        t.position = new THREE.Vector3(scale*x+1, -2*(1/32), scale*y + 6*(1/32));
      } else if (type=='T_SECRET_WALL_BUTTON_N') {
        var t = new THREE.Mesh( new THREE.CubeGeometry(1/8 , 1/8, 0.05 ), new THREE.MeshBasicMaterial( { visible: false } ));
        t.position = new THREE.Vector3(scale*x - 6*(1/32), -2*(1/32), scale*y +1);
      }
      t.isTrigger = true;
      t.gameProperties = { id: objects.length, action: 'destroy', target: target };

      scene.add(t);
      objects.push(t);
      return t;
    }
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

    sprite.gameProperties = { id: objects.length };
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
    var material_plane = new THREE.MeshBasicMaterial( {color: 0x555555 } );
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
      intersects[0].realDistance = raycaster.ray.origin.distanceTo( intersects[0].point );
      return intersects[0];
    }
  }

  my.removeObject = function(o) {
    objects[o.gameProperties.id] = null;
    scene.remove(o);
  }

  my.moveWall = function(o) {
    moving_walls.push(o);
  }

  /**
   * todo: give it to Horus
   */
  my.displayObjectOrtho = function(i, o) {
    o.scale.set( window.innerWidth/32, window.innerWidth/32, 1 );
    o.position.set(-window.innerWidth/2+32 +(i*32),window.innerHeight/2-32,1)
    Horus.scene.add(o);
  }

  return my;
}(Marvin || {}, Horus, this));
