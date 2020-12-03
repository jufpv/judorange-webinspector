// JUDORANGE : STORE FIRST ERRORS
class JudOrangeStartupErrors {
    // CONSTRUCTOR
    constructor() {
        this.startup_errors = [];
    }
    // ADD ERROR
    addError(error){
        this.startup_errors.push( error )
    }
    // GET ERRORS
    getStartupErrors(){
        return this.startup_errors;
    }
}
// INSTANCIATE
var judorangestartuperrors = new JudOrangeStartupErrors();



// SEND ERRORS TO JUDORANGE "MODEL" CLASS
window.onerror = function (msg, url, lineNo, columnNo, error) {
    judorangestartuperrors.addError(url+" : "+msg+" l:"+lineNo+" c:"+columnNo)
    return false;
}


