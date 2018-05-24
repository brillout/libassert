var logify_input = require('./log').logify_input;
var titleFormat = require('@brillout/format-text').titleFormat;

var option_keys = {
    is_warning_error: 'is_warning_error',
    is_wrong_usage_error: 'is_wrong_usage_error',
    is_internal_error: 'is_internal_error'
};

module.exports = reassert;

function reassert(condition) {
    // assert
    if( condition ) {
        return condition;
    }

    // parse arguments
    var parsed = parseArguments([].slice.call(arguments, 1));
    var msgs = parsed.msgs;
    var opts = parsed.opts;

    // build error message
    var message = getErrorMessage(condition, msgs, opts);

    // build error
    var error = new Error(message);
    if( is_nodejs() ) {
        error.stack = '';
    }

    // throw logic
    choke(error, opts);

    // convenience to write code like `if( ! require('reassert/soft')(condition) ) return;`
    return condition;
}

function parseArguments(args) {
    var msgs = [];
    var opts = {};
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
                if( !option_keys[j] ) {
                    var msg = 'Unkonwn option `'+j+'`';
                    throw new Error('Reassert: [Internal Error]: '+msg);
                }
                opts[j] = arg[j];
            }
        } else {
            msgs.push(arg);
        }
    }

    return {msgs: msgs, opts: opts};
}

function getErrorMessage(condition, msgs, opts) {
    var stack = getStack();

    var title = (
        opts[option_keys.is_warning_error] && 'Warning' ||
        opts[option_keys.is_wrong_usage_error] && 'Wrong Usage' ||
        opts[option_keys.is_internal_error] && 'Internal Error' ||
        'Assertion Fail'
    );

    var message = [];

    message.push('\n');

    message.push(titleFormat('Stack Trace'));

    message.push(stack);

    message.push('\n');

    message.push(titleFormat(title));

    if( msgs.length===0 ) {
        message.push('Failed assertion condition: `'+condition+' != true`');
    }

    for(var i in msgs) {
        var msg = msgs[i];
        if( is_browser() && msg instanceof Object ) {
            console.error(msg);
        }
        var str = logify_input(msg);

        message.push(str);
    }

    message.push('\n');

    return message.join('\n');
}

function choke(error, opts) {
    var throw_now = !opts[option_keys.is_warning_error];
    if( throw_now ) {
        throw error;
    } else {
        if( is_browser() ) {
            setTimeout(function() {
                throw error;
            }, 0);
        } else {
            console.error(error);
        }
    }

}

function getStack() {
    var stack = new Error().stack;

    var lines = stack.split('\n');

    var lines__filtered = [];
    for(var i in lines) {
        var line = lines[i];
        if( line!=='Error' && line.indexOf('/node_modules/reassert/') === -1 ) {
            lines__filtered.push(line.replace(/^ */, ''));
        }
    }

    return lines__filtered.join('\n');
}

/* TODO - reimplement soft errors

    // determine whether we are in production
    var prod = is_prod();

    var message = 'Assertion-Error'+(prod?'[prod]':'[dev]')+': '+condition+'!=true';
    var throw_now = (!prod || opts[option_keys.is_hard]) && !opts[option_keys.is_soft];

function is_prod() {
    var prod_browser = is_browser() && window.location.hostname !== 'localhost';
    var prod_nodejs = is_nodejs() && process.env['NODE_ENV'] === 'production';
    return prod_browser || prod_nodejs;
}
*/

function is_browser() {
    return typeof window !== "undefined";
}

function is_nodejs() {
    return typeof process !== "undefined";
}
