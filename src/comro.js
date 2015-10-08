if(typeof define!="undefined") {
    define(function (require, exports, module) {
        module.exports = exports = window["@Alias"];
    });
}else if (typeof module != "undefined" && module.exports) {
    module.exports = window["@Alias"];
}