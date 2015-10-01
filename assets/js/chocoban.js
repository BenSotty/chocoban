Chocoban = function(options) {

    // OPTIONS
    this.level = options.level ? options.level : 1;
    this.debug = options.debug ? options.debug : false;
    this.ready = false;

    // LEVEL LOADING
    var levelsJsonUrl = 'content/levels.json';
    var getLevels = function() {
        var json = null;
        $.ajax({
            type: 'GET',
            url: levelsJsonUrl,
            dataType: 'json',
            global: false,
            async: false,
            success: function(data) {
                json = data;
            },
            error: function(jqxhr, textStatus, error) {
                console.log(error);
                json = error;
            }
        })
        return json
    };
    var levels = getLevels();

    // UPDATE
    var state = {},
        currentState = {};

    var parseLevel = function(levelDescription) {
        //  multiple element = NumberSymbol (ex. 7#)
        //  Wall:           #
        //  Player:         @
        //  Player on Goal: +
        //  Box:            $
        //  Box on goal:    *
        //  Goal:           .
        //  Floor:          _
        //  linejump:       |
        //  ex:             7#|#.@-#-#|#$*-$-#|#3-$-#|#-..--#|#--*--#|7#
    }

    // MOVEMENT
    var direction = {
        'u': [0, -1],
        'r': [1, 0],
        'd': [0, 1],
        'l': [-1, 0]
    }

    // DEBUGGING
    var debugList = {
        "level": this.level,
        "ready": this.ready,
        "debug": this.debug,
        "levels": levels
    };
    var log = function(debugList) {
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
}

var chocoTest = new Chocoban({
    level: 3,
    debug: true
});