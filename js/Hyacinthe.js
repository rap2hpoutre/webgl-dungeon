var Hyacinthe = (function(my, Marvin, global) {

  var backPack = {
    items: []
  };

  var move = function(direction) {
    if (my.isMoving || !canGo(direction)) return;
    my.isMoving = true;
    var c = my.compass[0];
    Marvin.startCameraMovement(
      (c == "N" || c == "S") ? 'x' : 'z',
      (c == "N" || c == "E") ? -1*direction : direction,
      (function(_this) {
        return function() {
          my.playerPosition.y += (c == "N" ? -1*direction : c == "S" ? direction : 0);
          my.playerPosition.x += (c == "E" ? -1*direction : c == "W" ? direction : 0);
          _this.isMoving = false;
        };
      }(my))
    );
  }

  var turn = function (direction) {
    if (my.isMoving) return;
    my.isMoving = true;
    Marvin.startCameraRotation(1*direction, (function(_this, d) {
      return function() {
        _this.isMoving = false;
        d == 1 ? _this.compass.unshift(_this.compass.pop()) : _this.compass.push(_this.compass.shift());
        console.log(_this.compass[0]);
      };
    }(my, direction)) );
  }

  var canGo = function (direction) {
    var c = my.compass[0];
    var ret = ((c == "N" && my.collisionMap[my.playerPosition.y-direction][my.playerPosition.x] == 0 ||
      c == "S" && my.collisionMap[my.playerPosition.y+direction][my.playerPosition.x] == 0 ||
      c == "W" && my.collisionMap[my.playerPosition.y][my.playerPosition.x+direction] == 0 ||
      c == "E" && my.collisionMap[my.playerPosition.y][my.playerPosition.x-direction] == 0));
    return ret;
  }

  my.compass = ["E", "S", "W", "N"];

  my.isMoving = false;

  my.collisionMap = [];

  my.playerPosition = {
    x: 0,
    y: 0
  };

  my.turnLeft = function() {
    turn(1);
  };

  my.turnRight = function() {
    turn(-1);
  };

  my.moveForward = function() {
    move(1);
  };

  my.moveBack = function() {
    move(-1);
  };

  my.take = function(element) {
    Marvin.removeElement(element);
  }

  return my;
}(Hyacinthe || {}, Marvin, this));
