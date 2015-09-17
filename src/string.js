madutil.string = {
    escHTML : function(str, isdecode) {
        var ar = ['&', '&amp;', '<', '&lt;', '>', '&gt;', ' ', '&nbsp;', '"', '&quot;', "'", '&#39;', '\\r', '<br>', '\\n', '<br>'];
        isdecode && ar.reverse();
        for(var i = 0, r = str; i < ar.length; i += 2) {
            r = r.replace(new RegExp(ar[i], 'g'), ar[1 + i]);
        }
        return r;
    },
    format:function() {
        var result = arguments[0];
        if (arguments.length > 1) {
            if (arguments.length == 2 && typeof (arguments[1]) == "object") {
                var args = arguments[1];
                for (var key in args) {
                    if(args[key]!=undefined){
                        var reg = new RegExp("({" + key + "})", "g");
                        result = result.replace(reg, args[key]);
                    }
                }
            }
            else {
                for (var i = 1; i < arguments.length; i++) {
                    if (arguments[i] != undefined) {
                        var reg = new RegExp("({[" + (i-1) + "]})", "g");
                        result = result.replace(reg, arguments[i]);
                    }
                }
            }
        }
        return result;
    }
};