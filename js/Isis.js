var Isis = (function(my, global) {

 var zone = [
    '1 1 5 1 . . .',
    '3 . . 6 . . .',
    '1 b 1 1 . . .',
    '1 . 1 . . . .',
    '1 2 1 1 . . .',
    '1 . . 3 . 1 1',
    '5 @ . 4 . 1 1',
    '3 b . 1 2 1 .',
    '1 1 3 1 1 1 1',
  ];

  // Uh... Don't know why i see things in mirror
  for(var i = 0; i < zone.length; i++) {
    zone[i] = zone[i].split(' ');
    zone[i].reverse();
    console.log(zone[i]);
  }

  my.isWall = function(cell) {
    if (!isNaN(cell)) return true;
  }

  my.buildTestLevel = function(Marvin) {
    for(var i = 0; i < zone.length; i++) {
      for(var j = 0; j < zone[i].length; j++) {

        // Wall
        if (!isNaN(zone[i][j])) {

          // ... with secret trigger ?
          if (zone[i][j] == 2 || zone[i][j] == 6) {
            trigger = Marvin.addClickTrigger(i, j, 'T_SECRET_WALL_BUTTON_' + (zone[i][j] == 6 ? 'N' : 'E') , Marvin.drawCube(i,j, 2));

          // Or simple
          } else {
            Marvin.drawCube(i,j, zone[i][j], zone[i][j] == 4);
          }

        // Player
        } else if (zone[i][j] == '@') {
          Marvin.setCameraPosition(i,j);

        // Test Object
        } else if (/[a-z]/.test(zone[i][j])) {
          sprite = Marvin.drawSprite(i, j, zone[i][j]);
          sprite.isItem = true;
        }
      }
    }

    // Floor and Ceil
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
        if (zone[i][j] == '@') return {x: j, y: i};
      }
    }
  }

  return my;
}(Isis || {}, this));
