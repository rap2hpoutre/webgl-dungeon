/**
 * Marvin - TODO: clean
 */
var Marvin = (function(my, global) {
	var camera_target_rotation_y = null, 
		camera_target_position = null, 
		camera_direction, 
		camera_axis,
		camera_rotation_callback,
		camera_position_callback;

	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( new THREE.Color( 0 ), 0.2 );
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	var map = THREE.ImageUtils.loadTexture( "images/1.png" );
	map.wrapS = THREE.RepeatWrapping;
	map.wrapT = THREE.RepeatWrapping;
	map.magFilter = THREE.NearestFilter;
	map.repeat.set( 1, 1 );

	var material = new THREE.SpriteMaterial( { map: map, color: 0xffffff, fog: true } );
	var sprite = new THREE.Sprite( material );
	sprite.position.x = 2;
	scene.add( sprite );

	var scale = 2;
	var cube_geometry = new THREE.CubeGeometry(scale,scale,scale);
	var cube_material = new THREE.MeshBasicMaterial( { map: map } );// new THREE.MeshBasicMaterial({map: map});

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

		renderer.render(scene, camera);
	};

	/**
	 * drawCube()
	 */
	my.drawCube = function(x, y) {
		var c = new THREE.Mesh(cube_geometry, cube_material);
		scene.add(c);
		c.position.z = scale*y;
		c.position.x = scale*x;
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

	return my;
}(Marvin || {}, this));