var logify_input = require("./log").logify_input;
var titleFormat = require("@brillout/format-text").titleFormat;
var isNodejs = require("./utils/isNodejs");

var option_keys = {
  is_warning: "is_warning",
  is_usage: "is_usage",
  is_internal: "is_internal",
  details: "details",
};

module.exports = assert;

function assert(condition) {
  if (condition) {
    return condition;
  }

  // parse arguments
  var parsed = parseArguments([].slice.call(arguments, 1));
  var msgs = parsed.msgs;
  var opts = parsed.opts;

  const { callStack__processed, callStack__original } = getCallStack();

  // build error message
  var { errorMessagesWithStackAndTitles, errorMessages } = getErrorMessage({
    condition,
    msgs,
    opts,
    callStack__processed,
  });

  // throw logic
  throwError({
    errorMessagesWithStackAndTitles,
    errorMessages,
    opts,
    callStack__original,
  });

  // convenience to write code like `if( ! require('assert/soft')(condition) ) return;`
  return condition;
}

function parseArguments(args) {
  var msgs = [];
  var opts = {};
  for (var i in args) {
    var arg = args[i];
    var is_option_arg = arg && arg.IS_REASSERT_OPTS;
    if (is_option_arg) {
      for (var j in arg) {
        if (!option_keys[j] && j !== "IS_REASSERT_OPTS") {
          var msg = "Unkonwn option `" + j + "`";
          throw new Error("@brillout/assert: [Internal Error]: " + msg);
        }
        opts[j] = arg[j];
      }
    } else {
      msgs.push(arg);
    }
  }

  return { msgs: msgs, opts: opts };
}

function getErrorMessage({ condition, msgs, opts, callStack__processed }) {
  var errorMessagesWithStackAndTitles = [];

  errorMessagesWithStackAndTitles = errorMessagesWithStackAndTitles.concat(
    getErrorDetailsMessage(opts)
  );

  errorMessagesWithStackAndTitles = errorMessagesWithStackAndTitles.concat(
    getStackMessage({ opts, msgs, callStack__processed })
  );
  errorMessagesWithStackAndTitles.push("\n");

  var { errorMessages, errorMessagesWithTitle } = getErrorSummaryMessage(
    condition,
    msgs,
    opts
  );

  errorMessagesWithStackAndTitles = errorMessagesWithStackAndTitles.concat(
    errorMessagesWithTitle
  );

  return { errorMessages, errorMessagesWithStackAndTitles };
}
function getErrorSummaryMessage(condition, msgs, opts) {
  var errorMessagesWithTitle = [];
  var errorMessages = [];

  var title =
    (opts[option_keys.is_warning] && "Warning") ||
    (opts[option_keys.is_usage] && "Wrong Usage") ||
    (opts[option_keys.is_internal] && "Internal Error") ||
    "Assertion Fail";
  errorMessagesWithTitle.push(titleFormat(title));

  if (msgs.length === 0) {
    const msg = "Failed assertion condition: `" + condition + " != true`";
    errorMessagesWithTitle.push(msg);
    errorMessages.push(msg);
  }

  for (var i in msgs) {
    var msg = msgs[i];
    var str = logify_input(msg);

    errorMessagesWithTitle.push(str);
    errorMessages.push(str);
  }

  if (opts.details) {
    errorMessagesWithTitle.push("");
    errorMessagesWithTitle.push(
      'See "Error Details" above for more information.'
    );
  }

  return { errorMessagesWithTitle, errorMessages };
}
function getStackMessage({ opts, msgs, callStack__processed }) {
  if (opts[option_keys.is_warning] && msgs.length > 0) {
    return [];
  }

  /*
    // Without this Node.js adds a `[` and a `]` to the error string
    var niceFormattingPrefix = 'Error\n    at:';
    */

  return [
    // niceFormattingPrefix,
    titleFormat("Stack Trace"),
    callStack__processed.join("\n"),
  ];
}
function getErrorDetailsMessage(opts) {
  if (!opts.details) {
    return [];
  }

  var message = [titleFormat("Error Details")];

  for (var i in opts.details) {
    message.push(logify_input(opts.details[i]));
  }

  message.push("\n");

  return message;
}

function throwError({
  errorMessagesWithStackAndTitles,
  errorMessages,
  opts,
  callStack__original,
}) {
  var interupt_execution = !opts[option_keys.is_warning];

  const err = new Error(errorMessages.join("\n"));
  err.stack = errorMessagesWithStackAndTitles.join("\n");
  err.stack__original = callStack__original;

  if (isNodejs()) {
    if (interupt_execution) {
      throw err;
    } else {
      // for(var i in errorMessagesWithStackAndTitles) console.error(errorMessagesWithStackAndTitles[i]);
      console.error(err);
    }
  }

  if (is_browser()) {
    // for(var i in errorMessagesWithStackAndTitles) console.error(errorMessagesWithStackAndTitles[i]);
    if (interupt_execution) {
      throw err;
    } else {
      setTimeout(function () {
        throw err;
      }, 0);
    }
  }
}

function getCallStack() {
  var stackTraceLimit__original = Error.stackTraceLimit;
  Error.stackTraceLimit = Infinity;
  const callStack__original = new Error().stack;
  Error.stackTraceLimit = stackTraceLimit__original;

  const lines__filtered = [];
  const lines = callStack__original.split("\n");
  for (var i in lines) {
    var line = lines[i];
    if (line === "Error") {
      continue;
    }
    if (line.indexOf("/node_modules/@brillout/assert/") !== -1) {
      continue;
    }
    if (line.indexOf(" (internal/") !== -1) {
      continue;
    }
    // line = line.replace(/^ */, '');
    // line = line.replace(/^at */, '  ');
    lines__filtered.push(line);
  }

  const callStack__processed = lines__filtered;

  return { callStack__original, callStack__processed };
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
