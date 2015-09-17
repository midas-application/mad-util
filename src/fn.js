var fn = madutil.fn = {
    numberInputFix: function(ele, isReserve) {
        var _src = ele.value,
            _replace = _src.replace(/[^\d]/g, '');

        if (_src !== _replace && !isReserve) {
            ele.value = _replace;
        }
        return _replace;
    },
    uuid : function(len, radix){
        var CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split('');
        var chars = CHARS, uuid = [], i;
        radix = radix || chars.length;

        if (len) {
            for ( i = 0; i < len; i++)
                uuid[i] = chars[0 | Math.random() * radix];
        } else {
            var r;

            uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
            uuid[14] = '4';

            for ( i = 0; i < 36; i++) {
                if (!uuid[i]) {
                    r = 0 | Math.random() * 16;
                    uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
                }
            }
        }
        return uuid.join('');
    },
    /**
     * 对象浅拷贝
     * @param source
     * @returns {*}
     */
    extend:function(source) {
        for (var i=1; i <= arguments.length; i++) {
            for(var key in arguments[i]) {
                source[key] = arguments[i][key];
            }
        }
        return source;
    },
    each : function(obj, callback) {
        var value, i = 0, length = obj.length, isObj = (length === undefined) && lang.isObject(obj);
        // 注意这里需要lang.js
        if(isObj) {
            for(var name in obj) {
                if(callback.call(obj[name], obj[name], name, obj) === false) {
                    break;
                }
            }
        } else {
            for( value = obj[0]; i < length && false !== callback.call(value, value, i, obj); value = obj[++i]) {
            }
        }
        return obj;
    }
};