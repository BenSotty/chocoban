Chocoban = function (params) {
    this.level = params.level ? params.level : 1;
    this.ready = false;
    this.debug = params.debug ? params.debug : true;
    
    // debugging
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
}

var chocoTest = new Chocoban({
    level: 3
});
//9x9
