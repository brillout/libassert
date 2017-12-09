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
    add_json_function_handlers(obj);
    try {
        return JSON.stringify(obj, null, 2);
    } catch(e) {
        return obj.toString()+'['+e+'][Error]'+stringification_name;
    }
}

function add_json_function_handlers(obj) {
    for(var key in obj) {
        var el = obj[key];
        if( el instanceof Function ) {
            if( ! el.toJSON ) {
                let str = '['+(el.name||'Anonymous function')+']'+stringification_name;
                el.toJSON = function() {
                    return str;
                };
            }
        } else if( el instanceof Object ) {
            add_json_function_handlers(el);
        }
    }
}
