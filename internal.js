var assert = require('./');

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({
        IS_REASSERT_OPTS: true,
        is_internal: true,
    });
    return assert.apply(this, args);
};
