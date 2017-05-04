var assert_soft = require('./');

module.exports = function() {
    arguments[1] = arguments[1] || {};
    arguments[1].is_hard = true;
    return assert_soft.apply(this, arguments);
};
