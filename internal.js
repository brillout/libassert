var assert = require('./');

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({is_internal_error: true});
    return assert.apply(this, args);
};
