var assert = require('./');

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({is_wrong_usage_error: true});
    return assert.apply(this, args);
};
