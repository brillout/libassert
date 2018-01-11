var assert_soft = require('./');

module.exports = function() {
    var args = [].slice.call(arguments);
    args.push({is_soft: true});
    return assert_soft.apply(this, args);
};
