//model : contient tout ce qui est commun à tous les chocobans et reste constant dans le temps

var model = model || {};

model.levelsUrl = "content/levels.json";

//Convention de nommage des cases dans la description des niveau (@Tabs : je préfère prendre des lettres ça parle plus que des signes)
model.cellsName = {
  free         : "f", //Free space
  tree         : "t",
  wall         : "w",
  bomb         : "b",
  box          : "x",
  player       : "p",
  playerOnBomb : "q",
  boxOnBomb    : "z",
  getFullName  : function (name) {
    switch (name) {
    case "f" :
      return "free";
    case "t" :
      return "tree";
    case "w" :
      return "wall";
    case "b" :
      return "bomb";
    case "x" :
      return "box";
    case "p" :
      return "player";
    case "q" :
      return "playerOnBomb";
    case "z" :
      return "boxOnBomb";
      default :
        return "";
    }
  }
};

//Codes des touches de mouvement
model.arrowsKeyCode = {
  left  : 37,
  up    : 38,
  right : 39,
  down  : 40
};

//Les vecteurs de mouvements
model.moveVectors = {
  up    : [-1,0],
  down  : [1,0],
  left  : [0,-1],
  right : [0,1]
};

