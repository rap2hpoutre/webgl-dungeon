(function(Marvin, Hyacinthe, Isis, global){

	Isis.buildTestLevel(Marvin);

	Hyacinthe.collisionMap = Isis.getCollisionMap();
	Hyacinthe.playerPosition = Isis.getPlayerPosition();

	Marvin.startRender();

	this.addEventListener("keypress", function(e){
		e.preventDefault();
		var code = e.keyCode || e.which;
		if (code == 113) {
			Hyacinthe.turnLeft();
		} else if(code == 100) {
			Hyacinthe.turnRight();
		} else if (code == 122) {
			Hyacinthe.moveForward();
		} else if(code == 115) {
			Hyacinthe.moveBack();
		}
	});

	document.addEventListener( 'mousedown', function(event) {
		var camera = Marvin.camera;
		console.log(camera.position, camera.rotation);
		var raycaster = new THREE.Raycaster( camera.position, camera.rotation );
		console.log(raycaster);
		var intersects = raycaster.intersectObjects(  Marvin.getObjects());
		console.log(intersects);
		if ( intersects.length > 0 ) {
			console.log(intersects);
		}
	}, false );

}(Marvin, Hyacinthe, Isis, this));
