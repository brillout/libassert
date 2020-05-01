const assert = require("./assert");
const assert_internal = require("./internal");
const assert_usage = require("./usage");
const assert_warning = require("./warning");
const log = require("./log");

module.exports = assert;
module.exports.internal = assert_internal;
module.exports.usage = assert_usage;
module.exports.warning = assert_warning;
module.exports.log = log;
