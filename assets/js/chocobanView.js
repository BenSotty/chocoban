
//chocobanView : gère l'affichage du jeux
chocobanView = function (prefix, theme) {
  this.prefix = prefix ? prefix + "-" : "";
  this.theme = theme ? theme : "";
  this.containerId = this.prefix + "chocoban-container";
  this.container = null;
  this.isInit = false;
  this.isPlugged = false;
  this.cellWidth = 60;
  this.cellHeight = 30;
  this.width = 0;
  this.height = 0;
};


/**
 * Affiche le plateau de jeux
 */
chocobanView.prototype.displayGame = function (state) {
  if (!this.isInit) {
    this.init(state.game);
  }
  this.displayFixCells.call(this, state.game);
  this.displayMovingCells.call(this, state.game);
  this.setCellsPostion.call(this);
  $(this.container).show();
};

chocobanView.prototype.init = function (game) {
  this.container = $("#" + this.containerId);
  if (!$(this.container).length) {
    console.log("chocobanView : le container du chocoban n'a pas été trouvé");
    return;
  }
  this.width = game.length * this.cellWidth;
  this.height = game[0].length * this.cellHeight;
  $(this.container).css({ width : this.width + "px", height : this.height + "px" }).addClass(this.theme);
  this.isInit = true;
};

/**
 * Affiche les cellules fixes (qui ne bougeront jamais pendant la partie)
 */
chocobanView.prototype.displayFixCells = function (game) {
  var html = "";
  for (var i = 0; i < game.length; i++) {
    for (var j = 0; j < game[i].length; j++) {
      html += this.getCellHtml(this.toFixCell(game[i][j]), i, j);
    }
  }
  $(this.container).html(html);
};

/**
 * Affiche les cellules mobiles (caisses et joueurs)
 */
chocobanView.prototype.displayMovingCells = function (game) {
  var html = "";
  for (var i = 0; i < game.length; i++) {
    for (var j = 0; j < game[i].length; j++) {
      var cell = game[i][j];
      if (this.isMoving(cell)) {
        html += this.getCellHtml(game[i][j], i, j);
      }
    }
  }
  $(this.container).append(html);
};

/**
 * Si la cellule est mobile, renvoie le nom de la cellule fixe située sous la cellule mobile
 * sinon, renvoie le nom de la cellule donné
 * @param cellName
 * @returns string nom de la cellule fixe
 */

chocobanView.prototype.toFixCell = function (cellName) {
  if (!this.isMoving(cellName)) {
    return cellName;
  } else if (this.isOnBomb(cellName)) {
    return model.cellsName.bomb;
  } else {
    return model.cellsName.free;
  }
};

chocobanView.prototype.isMoving = function (cellName) {
  switch (cellName) {
    case model.cellsName.box :
    case model.cellsName.player :
    case model.cellsName.boxOnBomb :
    case model.cellsName.playerOnBomb :
      return true;
    default :
      return false;
  }
};

chocobanView.prototype.isPlayer = function (cellName) {
  switch (cellName) {
    case model.cellsName.player :
    case model.cellsName.playerOnBomb :
      return true;
    default :
      return false;
  }
};

chocobanView.prototype.isOnBomb = function (cellName) {
  switch (cellName) {
    case model.cellsName.boxOnBomb :
    case model.cellsName.playerOnBomb :
      return true;
    default :
      return false;
  }
};

/**
 * Renvoie le html d'une cellule
 * @param cellName : nom de la cellule
 * @param x : abscisse
 * @param y : ordonnée
 * @returns {String} : le html
 */

chocobanView.prototype.getCellHtml = function (cellName, x, y) {
  var classes = "cell " +  model.cellsName.getFullName(cellName);
  classes += this.isMoving(cellName) ? " moving " : "";
  classes += this.isOnBomb(cellName) ? " onBomb " : "";
  var data = " data-x='" + x + "' data-y='" + y + "' ";
  data += this.isPlayer(cellName) ? " data-player " : "";
  return "<div class='" + classes + "' " + data + ">" + model.cellsName.getFullName(cellName) + "</div>";
};

chocobanView.prototype.setCellsPostion = function () {
  var w = this.cellWidth;
  var h = this.cellHeight;
  $.each ($("#" + this.containerId + " .cell"), function (index, cell) {
    var x = +$(cell).attr("data-x");
    x = x * h;
    var y = +$(cell).attr("data-y");
    y = y * w;
    $(cell).css({ top :  x + "px", left : y + "px", width : w + "px", height : h + "px" });
  });
};

/**
 * Déplace le joueur et éventuellement une caisse
 * @param action
 */

chocobanView.prototype.move = function (state) {
  var player = "#" + this.containerId + " .cell[data-player]";
  this.moveCell.call(this, $(player), state.px, state.py, state.isOnBomb);
  if (state.movingBox) {
    var box = "#" + this.containerId + " .cell." + model.cellsName.getFullName(state.movingBox.cellName) +"[data-x=" + state.movingBox.from.x + "][data-y=" + state.movingBox.from.y + "]";
    this.moveCell.call(this, $(box), state.movingBox.to.x, state.movingBox.to.y, state.movingBox.isOnBomb);
  }
};

chocobanView.prototype.moveCell = function (cell, x, y, isOnBomb) {
  var px = x * this.cellHeight;
  var py = y * this.cellWidth;
  $(cell).css({ top : px + "px", left : py + "px"}).attr({ "data-x" : x, "data-y" : y });
  if (isOnBomb) {
    $(cell).addClass("onBomb");
  } else {
    $(cell).removeClass("onBomb");
  }
};

/**
 * Montre à l'utilisateur que le joueur ne pas avancer dans la direction demandée
 */

chocobanView.prototype.cannotMove = function () {
  console.log("chocobanView : implement cannotMove (shake player?)");
};

/**
 * Montre à l'utilisateur qu'il a appuyé sur une touche qui ne fait rien
 * (on est pas obilgé de faire quelque chose)
 */

chocobanView.prototype.noMove = function () {
  console.log("chocobanView : implement noMove (show expected keys?)");
};

/**
 * Montre à l'utilisateur qu'il a fini le niveau
 */

chocobanView.prototype.win = function () {
  console.log("chocobanView : implement better winning animation!");
  $(this.container).append("<div class='winTitle'><h2>You win!</h2><p>That's all for now...</p></div>");
};
