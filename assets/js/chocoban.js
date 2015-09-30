Chocoban = function (options) {

    // OPTIONS
    this.level = options.level ? options.level : 1;
    this.debug = options.debug ? options.debug : false;
    this.ready = false;
    this.levelFolder = '../../content/levels';
    
    // DEBUGGING
    var debugList = {
        "level": this.level,
        "ready": this.ready,
        "debug": this.debug
    };
    var log = function (debugList) {
        var object = debugList;
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                console.log(key + " -> " + object[key]);
            }
        }
    }
    if (this.debug == true) {
        log(debugList);
    }

    // UPDATE
    var state = {},
        currentState = {};

    // LEVEL LOADER
    var loadLevel = function(level){
        var requestUrl = this.levelFolder + '/' + level + '.txt';
        $.getJSON(requestUrl)
            .done(function (data) {
            })
            .fail(function( jqxhr, textStatus, error ) {
            });
    };
    var parseLevel = function(levelDescription){
        //  multiple element = NumberSymbol (ex. 7#)
        //  Wall:           #
        //  Player:         @
        //  Player on Goal: +
        //  Box:            $
        //  Box on goal:    *
        //  Goal:           .
        //  Floor:          _
        //  separator:      |
        //  ex:             7#|#.@-#-#|#$*-$-#|#3-$-#|#-..--#|#--*--#|7#
    }

    // MOVEMENT
    var direction = {
        'u' : [0,-1],
        'r' : [1, 0],
        'd' : [0, 1],
        'l' : [-1, 0]
    }
}

var chocoTest = new Chocoban({
    level: 3,
    debug: true
});