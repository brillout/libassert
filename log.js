log.logify_input = logify_input;

module.exports = log;

function log() {
    for(var i in arguments) {
        var input = arguments[i];
        var str = logify_input(input);
        console.log(str);
    }
}

function logify_input(input) {
    var PREFIX = '[object ';

    var str;
    if( !input ) {
        str = input;
    } else {
        str = input.toString();
        if( str.slice(0, PREFIX.length) === PREFIX || input.constructor === Array ) {
            try {
                str = JSON.stringify(input, null, 2);
            } catch(e) {
                str += ' ['+e+']';
            }
        }
    }
    return str;
}
