const assert_usage = require('../usage.js');
const stackTrace = require('stack-trace');

/*
var err = new Error('ruewhi');
err.stack = 'euqih';
throw err;
*/
try {
    assert_usage(false, "This is a custom error message");
} catch(err) {
    const callStack = stackTrace.parse(err);
    console.log(callStack);
    throw err;
}
