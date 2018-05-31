var assert = require('./');

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({
        IS_REASSERT_OPTS: true,
        is_usage: true,
    });
    return assert.apply(this, args);
};
