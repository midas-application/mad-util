/**
 * madutil.js 0.0.1
 */
(function(global,document,undefined) {
    if (global["util"]) {
        return
    }
var madutil = global["util"] = {
    version: "0.0.1"
};
var lang = madutil.lang = {
    /**
     * 判断某个对象是某种类型
     * @see javascript秘密花园 http://bonsaiden.github.com/JavaScript-Garden/zh/#types
     * @param  {String}  type 对象类型Class Name
     * @param  {Object}  obj  需要判断的Object
     * @return {Boolean}      对象是否是某种类型
     */
    is : function(type, obj) {
        var klass = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && klass === type;
    },
    /**
     * 判断某个对象是否是数字类型
     * @param  {Object}  obj 需要判断的Object
     * @return {Boolean}      对象是否是数字类型
     */
    isNumber : function(obj) {
        return this.is('Number', obj);
    },
    /**
     * 判断某个对象是否是字符类型
     * @param  {Object}  obj 需要判断的Object
     * @return {Boolean}      对象是否是字符类型
     */
    isString : function(obj) {
        return this.is('String', obj);
    },
    /**
     * 判断某个对象是否是函数类型
     * @param  {Object}  obj 需要判断的Object
     * @return {Boolean}      对象是否是函数类型
     */
    isFunction : function(obj) {
        return this.is('Function', obj);
    },
    /**
     * 判断某个对象是否是对象类型
     * @param  {Object}  obj 需要判断的Object
     * @return {Boolean}      对象是否是对象类型
     */
    isObject : function(obj) {
        return this.is('Object', obj);
    },
    /**
     * 判断某个对象是否是数组类型
     * @param  {Object}  obj 需要判断的Object
     * @return {Boolean}      对象是否是数组类型
     */
    isArray : function(obj) {
        return this.is('Array', obj);
    }
};
var query = madutil.query = {
    /**
     * 经典的document 获取单个节点方法
     *
     * @param  {String} selector  节点选择器
     * @param  {String|Element} [container] 容器节点，默认是document
     * @return {Element}           得到的节点
     */
    $: function (selector, container) {
        container = (container && this.$(container) ) || document;
        return (lang.isString(selector)) && '' != selector ? container.querySelector(selector) : selector;
    },
    /**
     * 也是经典的获取符合selector的所有的节点
     *
     * @param  {String} selector  节点选择器
     * @param  {String|Element} container 容器节点，默认是document
     * @return {NodeList}           节点List
     */
    $a: function (selector, container) {
        container = (container && this.$(container) ) || document;
        return (lang.isString(selector) ) && '' != selector ? container.querySelectorAll(selector) : selector;
    }
};
madutil.$ = query.$;
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
var numberParse = madutil.number={
    /**
     * 格式化浮点数
     * @param {Float} floatNumber 需要规范的浮点数
     * @param {Int} savePrecision 保留的小数位数
     * @param {String} method 取小数时所用的方法
     * @param {Int} possiblePrecision 可能出现的小数位数
     */
    formatFloat : function(floatNumber, savePrecision, method, possiblePrecision){
        possiblePrecision = ~~possiblePrecision ? ~~possiblePrecision : savePrecision + 1;
        //先给他乘以 10的N次方，变成整数
        intNumber = Math.round(floatNumber * Math.pow(10, possiblePrecision));
        //由整数做除法，除以10的N次方不会出现乱七八糟的浮点数
        return Math[method](intNumber / Math.pow(10, possiblePrecision - savePrecision)) / Math.pow(10, savePrecision);
    }
};

var dateParse = madutil.date = {
    /**
     * 将日期格式字符串转化为日期对象
     * @param  {String} 日期字符串yyyy-MM-dd HH:mm:ss
     * @return {Date}
     */
    convertToDate:function(dateStr){
        var date = dateStr;
        if(typeof dateStr == "string"){
            date = new Date(Date.parse(dateStr));
            if(isNaN(date.getTime())){
                dateStr.replace(/^(\d{4})-(\d{1,2})-(\d{1,2}).(\d{2}):(\d{2}):(\d{2})$/, function ($0, $1, $2, $3, $4, $5, $6) {
                    date = new Date($1, $2 - 1, $3, $4, $5, $6);
                });
            }
        }
        return date;
    },
    format:function (date,formatStr){
        date = Date.convertToDate(date);
        var zeroize = function (value, length){
            if (!length){
                length = 2;
            }
            value = new String(value);
            for (var i = 0, zeros = ''; i < (length - value.length); i++){
                zeros += '0';
            }
            return zeros + value;
        };
        return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function($0){
            switch ($0)
            {
                case 'd': return date.getDate();
                case 'dd': return zeroize(date.getDate());
                case 'ddd': return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];
                case 'dddd': return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
                case 'M': return date.getMonth() + 1;
                case 'MM': return zeroize(date.getMonth() + 1);
                case 'MMM': return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
                case 'MMMM': return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
                case 'yy': return new String(date.getFullYear()).substr(2);
                case 'yyyy': return date.getFullYear();
                case 'h': return date.getHours() % 12 || 12;
                case 'hh': return zeroize(date.getHours() % 12 || 12);
                case 'H': return date.getHours();
                case 'HH': return zeroize(date.getHours());
                case 'm': return date.getMinutes();
                case 'mm': return zeroize(date.getMinutes());
                case 's': return date.getSeconds();
                case 'ss': return zeroize(date.getSeconds());
                case 'l': return date.getMilliseconds();
                case 'll': return zeroize(date.getMilliseconds());
                case 'tt': return date.getHours() < 12 ? 'am' : 'pm';
                case 'TT': return date.getHours() < 12 ? 'AM' : 'PM';
            }
        });
    },
    diff:function (from,to,flag){
        var msCount;
        from  = Date.convertToDate(from);
        to = Date.convertToDate(to);
        var diff = to.getTime() - from.getTime();
        switch (flag)
        {
            case "ms":
                msCount = 1;
                break;
            case "s":
                msCount = 1000;
                break;
            case "m":
                msCount = 60 * 1000;
                break;
            case "h":
                msCount = 60 * 60 * 1000;
                break;
            case "d":
                msCount = 24 * 60 * 60 * 1000;
                break;
            default:
                msCount = 24 * 60 * 60 * 1000;
                break;
        }
        return Math.floor(diff / msCount);
    }
};
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
/**
 * Created by timlv on 15.9.15.
 */
var storage = window.localStorage;
madutil.storage = storage?{
    get : function(name,opt) {
        opt = opt || {};
        var _domain = opt.domain || location.host, _path = opt.path || "/";
        return storage.getItem(String.format("{0}{1}@@{2}",_domain,_path,name));
    },
    set : function(name, value, opt) {
        opt = opt || {};
        var _domain = opt.domain || location.host, _path = opt.path || "/";
        try{//safari will throw on the private mode.
            storage.setItem(String.format("{0}{1}@@{2}",_domain,_path,name),value);
        }catch(e){

        }
    },
    del : function(name, opt) {
        opt = opt || {};
        var _domain = opt.domain || location.host, _path = opt.path || "/";
        storage.removeItem(String.format("{0}{1}@@{2}",_domain,_path,name));
    }
}:cookie;
/**
 * Created by timlv on 15.9.15.
 */
var jsonParse = madutil.json = {
    stringify : function(obj) {
        var ret = '';
        try {
            ret = JSON.stringify(obj)
        } catch( e ) {

        }
        return ret;
    },
    /**
     * JSON.parse<br/>
     * 加了个try_catch;
     * @param  {String} str 标准的JSON字符串，key要用'"'引起来
     * @return {Object}     parse之后的对象
     */
    parseJSON : function(str) {
        var ret = null;
        try {
            ret = JSON.parse(str)
        } catch( e ) {

        }
        return ret;
    }
};
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
var ua = {},m,agent = navigator.userAgent;
ua.iPod = agent.indexOf('iPod') > -1;
ua.iPad = agent.indexOf('iPad') > -1;
ua.iPhone = agent.indexOf('iPhone') > -1;
agent.indexOf('Android') > -1 && (ua.android = parseFloat(agent.slice(agent.indexOf("Android") + 8)));

if(ua.iPad || ua.iPhone || ua.iPod){
    m = /OS (\d+)_/.exec(agent);
    ua.iOS = parseInt(m[1], 10) || true;
}

ua.wp = agent.indexOf('Windows Phone') > -1;

// 微信UA
m = / MicroMessenger\/([0-9\.]+)/i.exec(agent);
m && (ua.weixin = parseFloat(m[1], 10));

// 手QUA
m = / QQ\/([0-9\.]+)/i.exec(agent);
m && (ua.QQ = parseFloat(m[1], 10));
madutil.ua = ua;
/**
 * Created by timlv on 15.9.15.
 */
var cacheHeight,getClientHeight  = function(doc) {
    var _doc = doc || document;
    return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientHeight || cacheHeight : _doc.body.clientHeight;
};
cacheHeight = getClientHeight();
var dom = madutil.dom = {
    setStyle : function(ele, style, value) {
        ele = query(ele);
        if(!lang.isObject(style)) {
            ele.style[style] = value;
        } else {
            fn.each(style, function(value, key) {
                ele.style[key] = value;
            })
        }
    },
    getStyle: function(el, styleName){
        if(!el){
            return;
        }
        if(styleName === "float"){
            styleName = "cssFloat";
        }
        if(el.style[styleName]){
            return el.style[styleName];
        }else if(window.getComputedStyle){
            return window.getComputedStyle(el, null)[styleName];
        }else if(document.defaultView && document.defaultView.getComputedStyle){
            styleName = styleName.replace(/([/A-Z])/g, "-$1");
            styleName = styleName.toLowerCase();
            var style = document.defaultView.getComputedStyle(el, "");
            return style && style.getPropertyValue(styleName);
        }else if(el.currentStyle){
            return el.currentStyle[styleName];
        }
    },
    toDom:function(str){
        var node = document.createElement("div"),tempNode=null,tag = true;
        node.innerHTML = str;
        for(var i= 0,l=node.childNodes.length;i<l&&tag;i++){
            tempNode =  node.childNodes[i];
            if(tempNode.nodeType==1){
                tag = false;
            }
        }
        return tempNode;
    },
    css : function(ele, property, value){
        var css = ''
        if (!lang.isObject(property)) {
            if (!value && value !== 0){
                ele.style.removeProperty(dasherize(property));
            }else{
                css = property + ":" + value;
            }
        } else {
            for (key in property){
                if (!property[key] && property[key] !== 0){
                    ele.style.removeProperty(key);
                }else{
                    css += key + ':' + property[key] + ';'
                }
            }
        }
        ele.style.cssText += ';' + css;
    },
    hide : function(ele) {
        return this.setStyle(ele, 'display', 'none');
    },
    show : function(ele) {
        return this.setStyle(ele, 'display', '');
    },
    remove : function(ele) {
        ele = query(ele);
        ele.parentNode.removeChild(ele);
    },
    visible : function(ele) {
        return this.setStyle(ele, 'visibility', 'visible');
    },
    hidden : function(ele) {
        return this.setStyle(ele, 'visibility', 'hidden');
    },
    dispatchEvent:function(dom,type){
        var ev = document.createEvent('Event');
        ev.initEvent(type, true, true);
        query(dom).dispatchEvent(ev);
    },
    removeClass : function(ele, clsname) {
        ele = query(ele);
        return (ele.className = ele.className.replace(new RegExp('\\s*' + clsname + '($|\\s)\\b'), '') );
    },
    addClass : function(ele, clsname) {
        ele = query(ele);
        return !U.dom.hasClass(ele, clsname) && (ele.className += ' ' + clsname );
    },
    hasClass : function ( ele, clsname) {
        return new RegExp('\\b' + clsname + '($|\\s)\\b').test(query(ele).className);
    },
    getScrollLeft : function(doc) {
        var _doc = doc || document;
        return _doc.body.scrollLeft;
    },
    getScrollTop : function(doc) {
        var _doc = doc || document;
        return _doc.body.scrollTop;
    },
    getClientHeight : getClientHeight,
    getClientWidth : function(doc){
        var _doc = doc || document;
        return _doc.compatMode == "CSS1Compat" ? _doc.documentElement.clientWidth : _doc.body.clientWidth;
    },
    getScrollHeight : function(node){
        node = node || document.documentElement;
        return node.scrollHeight;
    },
    getScrollWidth : function(node){
        node = node || document.documentElement;
        return node.scrollWidth;
    },
    getNext:function(node){
        var next = query(node);
        next = node.nextSibling;
        while(next&&next.nodeType!=1){//refetch for filting unelement
            next = next.nextSibling;
        }
        return next;
    },
    getPre:function(node){
        var pre = query(node);
        pre = node.previousSibling;
        while(pre&&pre.nodeType!=1){//refetch for filting unelement
            pre = pre.nextSibling;
        }
        return pre;
    }
};
(function(gb,doc,indexOf) {
    var _atchesSelector = "atchesSelector",
        html = doc.documentElement,
        prefixes = [
            "webkitM",
            "mozM",
            "msM",
            "oM",
            "m"
        ],
        i = prefixes.length,
        _matchesSelector;

    // feature detect .matchesSelector
    while ( i-- ) {
        if ( ( prefixes[i] + _atchesSelector ) in html ) {
            _matchesSelector = prefixes[i] + _atchesSelector;
            break;
        }
    }
    gb.matchesSelector =
        // use .matchesSelector if available
        _matchesSelector ?
            function( elem, selector ) {
                return elem[ _matchesSelector ]( selector );
            } :
            // use qSA + indexOf, if possible
            indexOf ?
                function( elem, selector ) {
                    return indexOf.call(
                            // execute the query on the parentNode to reduce the NodeList
                            // doc.documentElement doesn't have a parent, though
                            ( elem.parentNode || doc ).querySelectorAll( selector ) || [],
                            elem
                        ) !== -1;
                } :
                // use qSA + a loop otherwise (IE8)
                function( elem, selector ) {
                    var nodeList = ( elem.parentNode || doc ).querySelectorAll( selector ) || [],
                        i = nodeList.length;

                    while ( i-- ) {
                        if ( nodeList[i] == elem ) { return true; }
                    }
                    return false;
                };
})(global,document,Array.prototype.indexOf);
var _handlers = [];
var event = madutil.event = {
    domReady : function(fn, args) {
        if (document.readyState == "complete" || document.readyState == "interactive") {
            fn.call();
        }else{
            document.addEventListener("DOMContentLoaded", function(evt) {
                document.removeEventListener("DOMContentLoaded", arguments.callee, false);
                fn.call();
            }, false);
        }
    },
    on : function(ele, type, fun, args, selector, caught) {
        caught = !!caught;
        ele = query.$(ele);
        if(!ele) return;
        var cfn = function(evt) {
            if(selector) {// delegate 如果selector 存在 并且 在ele 里面能够找到这个selector的节点
                var target = null, parent = evt.target;
                do {
                    if(matchesSelector(parent, selector)) {
                        target = parent;
                        break;
                    }
                } while(parent != ele && (parent = parent.parentNode));
                if(target) {
                    fun.apply(target, [evt].concat(args));
                }
            } else {
                return fun.apply(evt.target, [evt].concat(args));
            }
        };
        var eventType = type.split(".");
        type = eventType.length>1?eventType[0]:type
        ele.addEventListener(type, cfn, caught);
        _handlers.push({
            el : ele,
            type : type,
            ws : eventType.length>1?eventType[1]:"",
            cfn : cfn,
            fn : fun,
            caught : caught
        });
    },
    unonWS : function(ws){
        var t = [];
        fn.each(_handlers, function(handler){
            if(ws !=handler.ws) {
                t.push(handler);
                return;
            }
            handler.el.removeEventListener(handler.type, handler.cfn, handler.caught);
        });
        _handlers = t;
    },
    unon : function(ele, type, fun, caught){
        var t = [];
        fn.each(_handlers, function(handler){
            if((ele && handler.el !== ele) || (type && handler.type !== type) || ( typeof fun == "function" && handler.fn !== fun) || (typeof caught !== 'undefined' && handler.caught !== caught)) {
                t.push(handler);
                return;
            }
            handler.el.removeEventListener(handler.type, handler.cfn, handler.caught);
        });
        _handlers = t;
    }
};
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
})(window,document);

if(typeof define!="undefined") {
    define(function (require, exports, module) {
        module.exports = exports = window.madutil;
    });
}if (typeof module != "undefined" && module.exports) {
    module.exports = window.madutil;
}