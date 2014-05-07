var Hyacinthe = (function(my, Marvin, global) {

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
  };

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
  };

  var canGo = function (direction) {
    var c = my.compass[0];
    console.log(my);
    var ret = ((c == "N" && my.collisionMap[my.playerPosition.y-direction][my.playerPosition.x] == 0 ||
      c == "S" && my.collisionMap[my.playerPosition.y+direction][my.playerPosition.x] == 0 ||
      c == "W" && my.collisionMap[my.playerPosition.y][my.playerPosition.x+direction] == 0 ||
      c == "E" && my.collisionMap[my.playerPosition.y][my.playerPosition.x-direction] == 0));
    return ret;
  };

  my.compass = ["E", "S", "W", "N"];

  my.isMoving = false;

  my.collisionMap = [];

  my.playerPosition = {
    x: 0,
    y: 0
  };

  my.backPack = {
    items: []
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

  my.updateInventory = function () {
    for (i = 0; i < my.backPack.items.length; i++) {
      Marvin.displayObjectOrtho(i, my.backPack.items[i]);
    }  
  }

  my.take = function (item) {
    Marvin.removeObject(item);
    my.backPack.items.push(item);
    my.updateInventory();
  }

  my.tryInteraction = function() {
    var element = Marvin.getElement(event.clientX, event.clientY);

    // Object ramassable
    if (element.realDistance < 2.5 && element.object.isItem) {
      my.take(element.object);
    }
  }

  return my;
}(Hyacinthe || {}, Marvin, this));
