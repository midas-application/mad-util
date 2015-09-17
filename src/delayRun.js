/**
 * Created by timlv on 15.9.15.
 */
var nextFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback) { return setTimeout(callback, 1); };
})();
madutil.fn.delayRun  = function (timerKey, fn, delay, object) {
    object = object || window;
    if (object._delayRunList) {
        if (object._delayRunList[timerKey]) {
            clearTimeout(object._delayRunList[timerKey]);
            object._delayRunList[timerKey] = -1;
        }
    } else {
        object._delayRunList = {};
    }
    object._delayRunList[timerKey] = setTimeout(function () {
        fn.call(object);
    }, ~~delay);
};
madutil.nextFrame = function(){
    nextFrame.apply(window, arguments);
};