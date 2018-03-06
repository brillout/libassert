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
    const obj_copy = get_prettier_copy(obj);
    try {
        return JSON.stringify(obj_copy, null, 2);
    } catch(e) {
        return obj_copy.toString()+'['+e+'][Error]'+stringification_name;
    }
}

function get_prettier_copy(el, parent_objects=[]) {
    if( ! (el instanceof Object) ) {
        return el;
    }

    if( el instanceof RegExp ) {
        if( ! el.toJSON ) {
            el.toJSON = function() {
                var str = '[RegExp: '+el.toString()+']';
                return str;
            };
        }
        return el;
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
        return el;
    }

    if( el.constructor !== Object && el.constructor !== Array ) {
        return el;
    }

    if( parent_objects.includes(el) ) {
        return '[ALREADY_PRINTED_COPY]';
    }
    parent_objects = [el, ...parent_objects];

    const el_copy = new (el.constructor);
    for(var key in el) {
        el_copy[key] = get_prettier_copy(el[key], parent_objects);
    }
    return el_copy;
}
