/**
 * Created by timlv on 15.9.15.
 */
var urlParse = madutil.url = {
    serializeParam : function(param) {
        if(!param)
            return '';
        var qstr = [];
        for(var key in param ) {
            if(typeof param[key]!='undefined'||param[key]!=null){
                qstr.push(key + '=' + param[key]);
            }
        }
        return qstr.join('&');
    },
    /**
     * 从URL上面获取参数<br>
     * fix 从终端来的url参数上面空格会变成'+'号
     *
     * @param  {String} name     参数字段名
     * @param  {String} url      url串
     * @return {String}          得到的字段内容
     */
    getParam : function(name, url) {
        var src = url || window.location.href;
        if(name && src) {
            var r = new RegExp("(\\?|#|&|^)" + name + "=([^&^#]*)(#|&|$)");
            var m = src.match(r);
            return !m ? "" : m[2];
        }
        return "";
    },
    delParam : function(name, url){
        if (!name instanceof Array) {
            name = [name];
        }
        fn.each(name, function(v){
            url = url.replace(new RegExp('(?:&' + v + '=[^&]*)', 'g'), '');
            url = url.replace(new RegExp('(?:\\?' + v + '=[^&]*&?)', 'g'), '?');
        });
        return url;
    },
    addParam : function(arr, url){
        var names = [];
        fn.each(arr,function(v, k){
            names.push(k);
        });
        url = this.delParam(names, url);
        var postfix = url.serializeParam(arr);
        url += /(\?|&)$/.test(url) ? '' + postfix : /\?/.test(url) ? '&' + postfix : '?' + postfix;
        return url;
    },
    /**
     * 从URL上面获取参数<br>
     * fix 从终端来的url参数上面空格会变成'+'号
     *
     * @param  {String} url      url串
     * @return {Object}          得到所有字段
     */
    getParams : function(url){
        url = url || location.href;
        var _paramArray = url.replace(/.+?\?/, '').replace(/#.*/, '').split('&');
        var params = {};

        for (var _idx in _paramArray) {
            var _paramPart = _paramArray[_idx].split('=');
            if (_paramPart.length === 2) {
                params[_paramPart[0]] = _paramPart[1];
            }
        }
        return params;
    }
};