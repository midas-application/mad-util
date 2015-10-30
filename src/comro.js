if(typeof define!="undefined") {
    define(function (require, exports, module) {
        module.exports = exports = this["@Alias"];
    });
}else if (typeof module != "undefined" && module.exports) {
    module.exports = this["@Alias"];
}