module.exports = function(condition) {
    if( condition ) {
        return condition;
    }
    var prod = is_prod();
    var message = 'Assertion-Error'+(prod?'[prod]':'[dev]')+': '+condition+'!=true';
    var msgs = [].slice.call(arguments, 1);
    for(var i in msgs) {
        var msg = msgs[i];
        var str;
        if( ! msg ) {
            str = msg;
        } else {
            str = msg.toString();
            if( str === '[object Object]' || msg.constructor === Array ) {
                str = JSON.stringify(msg, null, 2);
            }
        }
        console.log(str);
        message += '\n'+str;
    }
    const error = new Error(message);
    if( ! prod ) {
        throw error;
    } else {
        setTimeout(function() {
            throw error;
        }, 0);
    }
    return condition;
};

function is_prod() {
    var prod_browser = typeof window !== "undefined" && window.location.hostname !== 'localhost';
    var prod_nodejs = typeof process !== "undefined" && process.env['NODE_ENV'] === 'production';
    return prod_browser || prod_nodejs;
}
