var cookie = madutil.cookie = {
    get : function(name) {
        var ret = document.cookie.match(new RegExp("(?:^|;\\s)" + name + "=(.*?)(?:;\\s|$)"));
        return ret ? ret[1] : "";
    },
    set : function(key, value, opt) {
        opt = opt || {};
        var _date = new Date(), _domain = opt.domain || "pay.qq.com", _path = opt.path || "/", _time_gap = opt.time || 10 * 365 * 24 * 3600 * 1000;
        _date.setTime(_date.getTime() + _time_gap);
        document.cookie = key + "=" + value + "; path=" + _path + "; domain=" + _domain + "; expires=" + _date.toUTCString();
    },
    del : function(key, opt) {
        opt = opt || {};
        opt.time = -new Date();
        this.set(key, '', opt);
    }
};