var Isis = (function(my, global) {

	var zone = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
		[1,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,1,1],
		[1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0,0,1,1],
		[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,1,1,1,1],
		[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,2,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1]
	];

	// Uh... Don't know why i see things in mirror
	for(var i = 0; i < zone.length; i++) {
		zone[i].reverse();
	}

	my.isWall = function(cell) {
		if (cell == 1) return true;
	}

	my.buildTestLevel = function(Marvin) {
		for(var i = 0; i < zone.length; i++) {
			for(var j = 0; j < zone[i].length; j++) {
				if (zone[i][j] == 1) Marvin.drawCube(i,j);
				if (zone[i][j] == 2) {
					Marvin.setCameraPosition(i,j);
				}
			}
		}
		Marvin.drawFloor(zone.length, zone[0].length);
	}

	my.getCollisionMap = function() {
		var colMap = [];
		for(var i = 0; i < zone.length; i++) {
			colMap[i] = [];
			for(var j = 0; j < zone[i].length; j++) {
				if (my.isWall(zone[i][j])) {
					colMap[i][j] = 1;
				} else {
					colMap[i][j] = 0;
				}
			}
		}
		return colMap;
	}

	my.getPlayerPosition = function() {
		for(var i = 0; i < zone.length; i++) {
			for(var j = 0; j < zone[i].length; j++) {
				if (zone[i][j] == 2) return {x: j, y: i};
			}
		}
	}

	return my;
}(Isis || {}, this));
