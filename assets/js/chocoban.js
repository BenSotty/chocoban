Chocoban = function(options) {

    // OPTIONS
    this.level = options.level ? options.level : 1;
    this.debug = options.debug ? options.debug : false;
    this.levelsJsonUrl = options.levelsJsonUrl ? options.levelsJsonUrl : 'content/levels.json';
    this.ready = false;

    // GLOBALS
    var levelsJsonUrl = this.levelsJsonUrl,
        levels,
        state,
        currentState;

    // INIT
    levels = getLevels();
    currentState = parseLevel(this.level);
    debugList = {
        "level": this.level,
        "ready": this.ready,
        "debug": this.debug,
        "levels": levels[1],
        "currentLevel": currentState
    };

    // LEVEL LOADING
    function getLevels() {
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
    

    // UPDATE
    function parseLevel(level) {
        //  multiple element = NumberSymbol (ex. 7#)
        //  Wall:           #
        //  Trees:          ^
        //  Player:         @
        //  Player on Goal: +
        //  Box:            $
        //  Box on goal:    *
        //  Goal:           .
        //  Floor:          _
        //  linejump:       |
        //  ex:             "2^3#4^|2^#.#4^|2^#_4#^|3#$_$.#^|#._$@3#^|4#$#3^|3^#.#3^|3^3#3^|9^"
        
        var levelDescription = levels[level],
            rows = levelDescription.split('|');
        for (var row in rows){
            rows[row] = rows[row].split('');
        }
        return rows;
    }

    // MOVEMENT
    var direction = {
        'u': [0, -1],
        'r': [1, 0],
        'd': [0, 1],
        'l': [-1, 0]
    }

    // DEBUGGING
    function log(debugList) {
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
    level: 1,
    debug: true,
    levelsJsonUrl: 'content/levels.json'
});