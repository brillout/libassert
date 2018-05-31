var logify_input = require('./log').logify_input;
var titleFormat = require('@brillout/format-text').titleFormat;

var option_keys = {
    is_warning: 'is_warning',
    is_usage: 'is_usage',
    is_internal: 'is_internal',
    details: 'details',
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
        var is_option_arg = arg && arg.IS_REASSERT_OPTS;
        if( is_option_arg ) {
            for(var j in arg) {
                if( !option_keys[j] && j!=='IS_REASSERT_OPTS' ) {
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
    var message = [];

    message.push('\n');

    message = message.concat(getErrorDetailsMessage(opts));

    message = message.concat(getStackMessage());

    message = message.concat(getErrorSummaryMessage(condition, msgs, opts));

    return message.join('\n');
}
function getErrorSummaryMessage(condition, msgs, opts) {
    let message = [];

    var title = (
        opts[option_keys.is_warning] && 'Warning' ||
        opts[option_keys.is_usage] && 'Wrong Usage' ||
        opts[option_keys.is_internal] && 'Internal Error' ||
        'Assertion Fail'
    );

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

    if( opts.details ) {
        message.push('');
        message.push('See "Error Details" above for more information.');
    }

    message.push('\n');

    return message;
}
function getStackMessage() {
    var stack = getStack();
    return [
        titleFormat('Stack Trace'),
        stack,
        '\n'
    ];
}
function getErrorDetailsMessage(opts) {
    if( ! opts.details ) {
        return [];
    }

    var message = [
        titleFormat('Error Details')
    ];

    for(var i in opts.details) {
        message.push(logify_input(opts.details[i]));
    }

    message.push('\n');

    return message;
}

function choke(error, opts) {
    var throw_now = !opts[option_keys.is_warning];
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
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    var stack = new Error().stack;
    Error.stackTraceLimit = stackTraceLimit__original;

    var lines = stack.split('\n');

    var lines__filtered = [];
    for(var i in lines) {
        var line = lines[i];
        if( line === 'Error' ) {
            continue;
        }
        if( line.indexOf('/node_modules/reassert/') !== -1 ) {
            continue;
        }
        if( line.indexOf(' (internal/') !== -1 ) {
            continue;
        }
        lines__filtered.push(line.replace(/^ */, ''));
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
