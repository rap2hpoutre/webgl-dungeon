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
    Hyacinthe.tryInteraction();
  }, false );

}(Marvin, Hyacinthe, Isis, this));
