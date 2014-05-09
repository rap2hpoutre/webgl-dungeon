var Hyacinthe = (function(my, Marvin, Horus, global) {

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

  my.take = function (item) {
    Marvin.removeObject(item);
    my.backPack.items.push(item);
    Horus.objects = my.backPack.items;
    Horus.updateInventory();
  }

  my.tryInteraction = function() {

    var HUDElement = Horus.getElement(event.clientX, event.clientY);
    if (HUDElement) {
      Marvin.mouseLinkObject(HUDElement.object);
    }

    var element = Marvin.getElement(event.clientX, event.clientY);

    if (element.realDistance) {

       // On pose un objet sur le sol
       if (element.object.isFloor) {
          var linked = Marvin.getMouseLinkObject();
          if (linked && element.realDistance < 4.5) {
            Horus.debugThrowAll();
            my.backPack.items = [];
            Marvin.mouseLinkObject(null);
            Marvin.addObject(linked, element.point.x, 0, element.point.z);
          }

      // Object ramassable
      } else if (element.realDistance < 2.5 && element.object.isItem) {
        my.take(element.object);

      // Trigger
      } else if (element.realDistance < 2.5 && element.object.isTrigger) {

        // Destruction d'un mur
        if (element.object.gameProperties.action=='destroy') {
          my.collisionMap[element.object.gameProperties.target.gameProperties.x][element.object.gameProperties.target.gameProperties.y] = 0;
          Marvin.moveWall(element.object.gameProperties.target);
          //Marvin.removeObject(element.object.gameProperties.target);
          Marvin.removeObject(element.object);

        }
      }
    }

  }

  return my;
}(Hyacinthe || {}, Marvin, Horus, this));
