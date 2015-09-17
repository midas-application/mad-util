var noop = function(){};
var req = module.request = {
    /**
     * 统计请求
     * @param  {String} url 统计请求的url
     * @return {undefined}
     */
    log : (function() {
        var fix = [];
        return function(url) {
            var image = new Image();
            fix.push(image);
            image.onload = image.onerror = image.onabort = function() {
                image = image.onload = image.onerror = image.onabort = null;
                for(var i = 0, l = fix.length; i < l; ++i) {(fix[i] === image) && fix.splice(i, 1);
                }
            }
            image.src = url;
        }
    })(),
    getJsonp:function(url,options,callbacks){
        callbacks = fn.extend({onSucess:noop,onFailed:noop},callbacks);
        var _res = null;
        var method = String.format("c{0}{1}",U.fn.uuid(4,10),(+new Date()));
        var callbackName = options.fixedCB?options.fixedCB:method;//固定回调函数名
        delete options.fixedCB;
        window[callbackName] = function(res) {
            _res = res;
            delete window[callbackName];
        };
        var cbArg = {};
        if(options.fixedCBR){//固定回调函数参数名
            cbArg[options.fixedCBR] = method;
            delete options.fixedCBR;
        }else{
            cbArg = {format:String.format("jsonp_{0}",method)}
        }
        var args = fn.extend(cbArg,options);
        var qstr = urlParse.serializeParam(args);
        url += (url.indexOf('?') > -1 ? '&':'?' ) + qstr;
        this.loadScript(url, function(path,sucess){
            if(!_res||!sucess){
                _res = {
                    ret: -9999,
                    path: path,
                    msg: '系统繁忙，请稍后再试！'
                };
                if(callbacks.onFailed){
                    callbacks.onFailed.apply(window,[_res]);
                }
            }else{
                if(callbacks.onSucess){
                    callbacks.onSucess.apply(window,[_res]);
                }
            }
        },url);
    },
    /**
     * ajax请求对象
     * @param  {Object} option 请求参数
     * @return {XMLHttpRequest} xhr
     */
    ajax : function(option) {
        var o = option;
        var m = o.method.toLocaleUpperCase();
        var isPost = 'POST' == m;

        var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : false;
        if(!xhr) {
            o.error && o.error.call(null, {
                ret : 999,
                msg : 'Create XHR Error!'
            });
            return false;
        }

        var qstr = urlParse.serializeParam(o.param);

        // get 请求 参数处理
        qstr && !isPost && (o.url += (o.url.indexOf('?') > -1 ? '&' : '?' ) + qstr );

        xhr.open(m, o.url, true);
        isPost && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

        xhr.onreadystatechange = function() {
            if(4 == xhr.readyState) {
                var status = xhr.status;
                if(status >= 200 && status < 300) {
                    var response = xhr.responseText.replace(/(\r|\n|\t)/gi, '');
                    var m = /(?:callback\()?(.+)(?:\))?/gi.exec(response);
                    var result = {
                        ret : 998,
                        msg : '解析数据出错，请稍后再试',
                        status : status
                    };
                    try {
                        result = eval('(' + m[1] + ')')
                    } catch ( e ) {
                    }
                    o.success && o.success.call(xhr, result);
                } else {
                    o.error && o.error.call(xhr, {
                        ret : 997,
                        msg : '连接错误，请稍后再试',
                        status : status
                    });
                }
            }
        };

        xhr.send( isPost ? qstr :
            void (0));

        return xhr;
    },
    loadScript : function (path, cb, args, charset) {
        var _head = document.getElementsByTagName("head")[0], _js = document.createElement("script"), _eventHandlerLoad = function () {
            if (!_js) {
                return;
            }
            try {
                _js.src = "";
            } catch (_) {
            }
            event.unon(_js, "load", _eventHandlerLoad);
            _head.removeChild(_js);
            _js = null;
            typeof cb == "function" && cb(args, true);
        }, _eventHandlerError = function () {
            if (!_js) {
                return;
            }
            try {
                _js.src = "";
            } catch (_) {
            }
            event.unon(_js, "error", _eventHandlerError);
            _head.removeChild(_js);
            _js = null;
            typeof cb == "function" && cb(args, false);
        };
        event.on(_js, "load", _eventHandlerLoad);
        event.on(_js, "error", _eventHandlerError);
        _js.charset = charset || "utf-8";
        _js.src = path;
        _head.insertBefore(_js, _head.firstChild);
    }
};