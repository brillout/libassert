var logify_input = require('./log').logify_input;

module.exports = function(condition) {

    // assert
    if( condition ) {
        return condition;
    }


    // parse arguments
    var msgs = [];
    var opts = {};
    var args = [].slice.call(arguments, 1);
    for(var i in args) {
        var arg = args[i];
        var is_option_arg = false;
        for(var j in arg) {
            is_option_arg = !!option_keys[j]
            if( ! is_option_arg ) {
                break;
            }
        }
        if( is_option_arg ) {
            for(var j in arg) {
                if( !option_keys[j] ) throw new Error('reassert: [Internal Error]: something went wrong parsing option arguments');
                opts[j] = arg[j];
            }
        } else {
            msgs.push(arg);
        }
    }


    // determine whether we are in production
    var prod = is_prod();


    var is_browser = typeof window !== "undefined";

    // build message
    var message = 'Assertion-Error'+(prod?'[prod]':'[dev]')+': '+condition+'!=true';
    for(var i in msgs) {
        var msg = msgs[i];
        if( is_browser && msg instanceof Object ) {
            console.error(msg);
        }
        var str = logify_input(msg);
        message += '\n'+str;
    }
    var error = new Error(message);


    // throw logic
    var throw_now = (! prod || opts[option_keys.is_hard]) && !opts[option_keys.is_soft];
    if( throw_now ) {
        throw error;
    } else {
        setTimeout(function() {
            throw error;
        }, 0);
    }


    // convenience to write code like `if( ! require('reassert')(condition) ) return;`
    return condition;
};


function is_prod() {
    var prod_browser = typeof window !== "undefined" && window.location.hostname !== 'localhost';
    var prod_nodejs = typeof process !== "undefined" && process.env['NODE_ENV'] === 'production';
    return prod_browser || prod_nodejs;
}


var option_keys = {
    is_hard: 'is_hard',
    is_soft: 'is_soft',
};
