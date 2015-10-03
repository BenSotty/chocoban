//Le model du jeux
chocoban = function (params) {
  //Identifiant qui permet de différencier une insance de chocoban d'une autre 
  this.id = params.id;
  //Numéro du niveau
  this.level = params.level ? params.level : 1;
  //Plateau de jeux (matrice)
  this.state = null;
  //Gère l'affichage
  this.view = new chocobanView(params.prefix ? params.prefix : null, params.theme ? params.theme : null);
  //Répond-il aux actions de l'utilisateur ?
  this.isPlugged = false;
  this.init.call(this);
};

/**
 * Initialise le niveau
 */
chocoban.prototype.init = function () {
  if (!model || !model.levels) {
    //Si les niveaux ne sont pas encore récupérés : on le fait et on rappelle init une fois que c'est fait
    $(document).one ("chocoban-levels-loaded", this.init.bind(this));
    this.loadLevels();
  } else {
    this.initState(model.levels[this.level]);
    $(document).trigger("chocoban-initialized-" + this.id);
  }
};

chocoban.prototype.initState = function (jsonLevel) {
  this.state = {
   game : [],
   px : null, //abscisse du joueur
   py : null, //ordonnée du joueur
   isPlayerOnBomb : false, //Le joueur est-il sur une bomb
   movingBox : null
  };
  for (var i = 0; i < jsonLevel.length; i++) {
    var ligne = jsonLevel[i];
    this.state.game.push(ligne.split(""));
    if (!this.state.px && this.state.px !== 0) {
      //Si on ne la pas déjà fait on récupère la position du joueur
      var py = ligne.indexOf(model.cellsName.player);
      py = py !== -1 ? py : ligne.indexOf(model.cellsName.playerOnBomb);
      if (py !== -1) {
        this.state.px = i;
        this.state.py = py;
        this.state.isPlayerOnBomb = ligne.indexOf(model.cellsName.playerOnBomb) !== -1;
      }
    }
  }
};

/**
 * Récupère les niveaux et les stock dans la variable globale model.levels
 */

chocoban.prototype.loadLevels = function () {
  if (!model || !model.levels) {
    $.getJSON(model.levelsUrl, function (json) {
      model = model || {};
      model.levels = json;
      $(document).trigger("chocoban-levels-loaded");
    });
  } else {
    $(document).trigger("chocoban-levels-loaded");
  }
};

/**
 * Fait évoluer l'état du plateau de jeux en fonction de la commande de l'utilisateur
 */

chocoban.prototype.move = function (event) {
  if (!this.state) {
    console.log("chocoban n'est pas initialisé");
    return;
  }
  var move = this.getMove(event);
  if (!move) {
    //L'action ne correspond à aucun mouvement, on peut éventuellement le montrer à l'utilisateur
    this.view.noMove();
    return;
  }
  var firstNearbyCell = this.getNearbyCell.call(this, move, true);
  if (!this.canMove.call(this, firstNearbyCell, move, true)) {
    //Le joueur ne peut pas bouger (mûr ou double caisse...), on le signifie à l'utilisateur par la vue
    this.view.cannotMove();
    return;
  }
  //Mise à jour de l'état du plateau de jeux
  this.updateState.call(this, move);
  //Déplacement visuel
  this.view.move.call(this.view, this.state);
  //On regarde si à l'issu du movement le joueur n'a pas gagné
  if (this.hasWinLevel.call(this)) {
    this.win();
    this.view.win.call(this.view);
  }
};

/**
 * Renvoie la nature du mouvement demandé par l'utilisateur
 * "up", "down", "left", "right"
 */

chocoban.prototype.getMove = function (event) {
  switch (event.keyCode) {
  case model.arrowsKeyCode.left :
    return "left";
  case model.arrowsKeyCode.right :
    return "right";
  case model.arrowsKeyCode.up :
    return "up";
  case model.arrowsKeyCode.down :
    return "down";
    default :
      return null;
  }
};

chocoban.prototype.canMove = function (nearbyCell, move, isFirst) {
  switch (nearbyCell) {
    case model.cellsName.wall :
      return false;
    case model.cellsName.free :
    case model.cellsName.bomb :
      return true;
    case model.cellsName.box :
    case model.cellsName.boxOnBomb :
      if (isFirst) {
        //si la case est une caisse, on regarde la case suivante
        return this.canMove.call(this, this.getNearbyCell.call(this, move, false), move, false);
      } else {
        //Si la seconde case est une caisse on ne peut pas bouger
        return false;
      }
    default :
      return false;
  }
};

/**
 * Renvoie la valeur de la case située dans la direction du mouvement du joueur
 * isFirst true : la première case
 * false : la suivante
 */

chocoban.prototype.getNearbyCell = function (move, isFirst) {
  var moveVector = model.moveVectors[move];
  var x = this.state.px + moveVector[0];
  var y = this.state.py + moveVector[1];
  if (!isFirst) {
    x += moveVector[0];
    y += moveVector[1];
  }
  return this.state.game[x][y];
};

/**
 * Mets à jour le plateau de jeux
 * @param action :
 */
chocoban.prototype.updateState = function (move) {
  var moveVector = model.moveVectors[move];
  //On remplace la cellule du joueur par une cellule vide (free ou bomb)
  var oldPlayerCell = this.state.game[this.state.px][this.state.py];
  if (oldPlayerCell === model.cellsName.playerOnBomb) {
    this.state.game[this.state.px][this.state.py] = model.cellsName.bomb;
  } else {
    this.state.game[this.state.px][this.state.py] = model.cellsName.free;
  }
  //On enregistre la nouvelle position du joueur
  this.state.px = this.state.px + moveVector[0];
  this.state.py = this.state.py + moveVector[1];
  //On positionne le joueur a son point d'arrivée
  var newPlayerCell = this.state.game[this.state.px][this.state.py];
  if (newPlayerCell === model.cellsName.bomb) {
    this.state.game[this.state.px][this.state.py] = model.cellsName.playerOnBomb;
    this.state.isPlayerOnBomb = true;
  } else {
    this.state.game[this.state.px][this.state.py] = model.cellsName.player;
    this.state.isPlayerOnBomb = false;
  }
  //Si besoin on déplace aussi la caisse et on enregistre les paramètre de ce mouvement (utile pour la vue)
  if (newPlayerCell === model.cellsName.box || newPlayerCell === model.cellsName.boxOnBomb) {
    this.state.movingBox = {
      cellName : newPlayerCell,
      from : { x : this.state.px, y : this.state.py },
      to   : { x : this.state.px + moveVector[0], y : this.state.py + moveVector[1] }
    };
    var newBoxCell = this.state.game[this.state.movingBox.to.x][this.state.movingBox.to.y];
    if (newBoxCell === model.cellsName.bomb) {
      this.state.game[this.state.movingBox.to.x][this.state.movingBox.to.y] = model.cellsName.boxOnBomb;
      this.state.movingBox.isOnBomb = true;
    } else {
      this.state.game[this.state.movingBox.to.x][this.state.movingBox.to.y] = model.cellsName.box;
      this.state.movingBox.isOnBomb = false;
    }
  } else {
    //Pas de mouvement de boîte
    this.state.movingBox = null;
  }
};

/**
 * Le joueur a-t-il gagné le niveau ?
 */

chocoban.prototype.hasWinLevel = function () {
  for (var i = 0; i < this.state.game.length; i++) {
    for (var j = 0; j < this.state.game[i].length; j++) {
      if (this.state.game[i][j] === model.cellsName.bomb) {
        //On a trouvé une bomb qui n'a pas de boîte : pas gagné
        return false;
      }
    }
  }
  //On n'a pas trouvé de bomb qui n'a pas de boîte : gagné!
  return true;
};

/**
 * Action sur le model si l'utilisateur gagne le niveau
 */

chocoban.prototype.win = function () {
  //On ne veut plus que le niveau réagisse aux actions du joueur
  this.unplug.call(this);
  this.view.win.call(this.view);
};

/**
 * Lance le jeux!
 */

chocoban.prototype.start = function () {
  if (!this.state) {
    //Si chocoban n'est pas encore initilisé, on attend que ce soit fait pour relancer start
    var choco = this;
    $(document).one("chocoban-initialized-" + this.id, this.start.bind(this));
    return;
  }
  this.view.displayGame.call(this.view, this.state);
  this.plug.call(this);
};

/**
 * Attache le chocoban aux actions de l'utilisateur
 */

chocoban.prototype.plug = function () {
  if (!this.isPlugged) {
    $("html").keydown(this.move.bind(this));
    this.isPlugged = true;
  }
};

/**
 * Détache le chocoban des actions de l'utilisateur
 */

chocoban.prototype.unplug = function () {
  if (this.isPlugged) {
    $("html").off("keydown");
    this.isPlugged = false;
  }
};
