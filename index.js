var logify_input = require('./log').logify_input;

var option_keys = {
    is_warning_error: 'is_warning_error',
    is_wrong_usage_error: 'is_wrong_usage',
    is_internal_error: 'is_internal_error'
};

module.exports = reassert;

function reassert(condition) {

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

function getErrorMessage(condition, msgs, opts) {
    var stack = getStack();

    var title = (
        opts[option_keys.is_warning_error] && 'Warning' ||
        opts[option_keys.is_wrong_usage_error] && 'Wrong Usage' ||
        'Assertion Fail'
    );

    var message = '';

    message += '\n\n';

    message += createTitle('Stack Trace');

    message += stack;

    message += '\n\n';

    message += createTitle(title);

    if( msgs.length===0 ) {
        message += 'Failed assertion condition: `'+condition+' != true`';
    }

    for(var i in msgs) {
        var msg = msgs[i];
        if( is_browser() && msg instanceof Object ) {
            console.error(msg);
        }
        var str = logify_input(msg);

        if( i!==0 ) {
            message += '\n';
        }
        message += str;
    }

    message += '\n\n';

    return message;
}

function createTitle(text) {
    var bar = '***************************'+'\n';
    var title = '';

    title += bar
    title += '******* ' + text + ' ******'+'\n';
    title += bar;

    return title;
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
