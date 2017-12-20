log.logify_input = logify_input;

module.exports = log;

var project_name = 'Reassert';
var stringification_name = '(Reassert-stringification)';

function log() {
    for(var i in arguments) {
        var input = arguments[i];
        var str = logify_input(input);
        console.log(str);
    }
}

function logify_input(input) {
    if( ! input ) {
        return input;
    }

    if( input.constructor === Array ) {
        return stringify_object(input);
    }

    var PREFIX_UGLY = '[object ';
    var input_str = input.toString();
    if( input_str.slice(0, PREFIX_UGLY.length) === PREFIX_UGLY ) {
        return stringify_object(input);
    }

    return input_str;
}

function stringify_object(obj) {
    add_custom_stringifiers(obj);
    try {
        return JSON.stringify(obj, null, 2);
    } catch(e) {
        return obj.toString()+'['+e+'][Error]'+stringification_name;
    }
}

function add_custom_stringifiers(obj) {
    for(var key in obj) {
        let el = obj[key];
        if( el instanceof RegExp ) {
            if( ! el.toJSON ) {
                el.toJSON = function() {
                    var str = '[RegExp: '+el.toString()+']';
                    return str;
                };
            }
            return;
        }
        if( el instanceof Function ) {
            if( ! el.toJSON ) {
                el.toJSON = function() {
                    var str = (
                        ! el.name ? (
                            '[Function]'
                        ) : (
                            '[Function: '+el.name+']'
                        )
                    );
                    return str;
                };
            }
            return;
        }
        if( el instanceof Object ) {
            add_custom_stringifiers(el);
        }
    }
}
