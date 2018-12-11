var logify_input = require('./log').logify_input;
var titleFormat = require('@brillout/format-text').titleFormat;
var isNodejs = require('./utils/isNodejs');

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

    var callStack = getCallStack();

    // build error message
    var message = getErrorMessage(condition, msgs, opts, callStack);

    // throw logic
    throwError(message, opts, callStack);

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

function getErrorMessage(condition, msgs, opts, callStack) {
    var message = [];

    message = message.concat(getErrorDetailsMessage(opts));

    if( ! is_browser() ) {
        message = message.concat(getStackMessage(opts, msgs, callStack));
        message.push('\n');
    }

    message = message.concat(getErrorSummaryMessage(condition, msgs, opts));

    return message;
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
        var str = logify_input(msg);

        message.push(str);
    }

    if( opts.details ) {
        message.push('');
        message.push('See "Error Details" above for more information.');
    }

    return message;
}
function getStackMessage(opts, msgs, callStack) {
    if( opts[option_keys.is_warning] && msgs.length>0 ) {
        return [];
    }

    /*
    // Without this Node.js adds a `[` and a `]` to the error string
    var niceFormattingPrefix = 'Error\n    at:';
    */

    return [
     // niceFormattingPrefix,
        titleFormat('Stack Trace'),
        callStack.join('\n')
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

function throwError(message, opts, callStack) {
    var interupt_execution = !opts[option_keys.is_warning];

    if( isNodejs() ) {
        if( interupt_execution ) {
            var err = new Error();
            err.stack = message.join('\n');
            throw err;
        } else {
            for(var i in message) console.error(message[i]);
        }
    }

    if( is_browser() ) {
        if( interupt_execution ) {
            throw__browser(message);
        } else {
            setTimeout(function() {
                throw__browser(message);
            }, 0);
        }
    }
}

function throw__browser(message) {
    for(var i in message) console.error(message[i]);
    Error.stackTraceLimit = Infinity;
    throw new Error();
}

function getCallStack() {
    var stackTraceLimit__original = Error.stackTraceLimit;
    Error.stackTraceLimit = Infinity;
    var callStackString = new Error().stack;
    Error.stackTraceLimit = stackTraceLimit__original;

    var lines = callStackString.split('\n');

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
     // line = line.replace(/^ */, '');
     // line = line.replace(/^at */, '  ');
        lines__filtered.push(line);
    }

    var callStack = lines__filtered;
    return callStack;
}

/* TODO - reimplement soft errors

    // determine whether we are in production
    var prod = is_prod();

    var message = 'Assertion-Error'+(prod?'[prod]':'[dev]')+': '+condition+'!=true';
    var interupt_execution = (!prod || opts[option_keys.is_hard]) && !opts[option_keys.is_soft];

function is_prod() {
    var prod_browser = is_browser() && window.location.hostname !== 'localhost';
    var prod_nodejs = isNodejs() && process.env['NODE_ENV'] === 'production';
    return prod_browser || prod_nodejs;
}
*/

function is_browser() {
    return typeof window !== "undefined";
}
