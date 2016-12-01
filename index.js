module.exports = function(condition) {
    if( condition ) {
        return;
    }
    var prod = is_prod();
    var msg = 'Assertion-Error'+(prod?'[prod]':'[dev]')+': '+condition+'!=true';
    var msgs = [].slice.call(arguments, 1);
    for(var i in msgs) {
        msg += '\n'+msgs[i];
    }
    const error = new Error(msg);
    if( !prod ) {
        throw error;
    } else {
        setTimeout(function() {
            throw error;
        }, 0);
    }
};

function is_prod() {
    var prod_browser = typeof window !== "undefined" && window.location.hostname !== 'localhost';
    var prod_nodejs = typeof process !== "undefined" && process.env['NODE_ENV'] === 'production';
    return prod_browser || prod_nodejs;
}
