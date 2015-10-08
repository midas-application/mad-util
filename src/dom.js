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
        ele = query.$(ele);
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
        ele = query.$(ele);
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
        query.$(dom).dispatchEvent(ev);
    },
    removeClass : function(ele, clsname) {
        ele = query.$(ele);
        return (ele.className = ele.className.replace(new RegExp('\\s*' + clsname + '($|\\s)\\b'), '') );
    },
    addClass : function(ele, clsname) {
        ele = query.$(ele);
        return !dom.hasClass(ele, clsname) && (ele.className += ' ' + clsname );
    },
    hasClass : function ( ele, clsname) {
        return new RegExp('\\b' + clsname + '($|\\s)\\b').test(query.$(ele).className);
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
        var next = query.$(node);
        next = node.nextSibling;
        while(next&&next.nodeType!=1){//refetch for filting unelement
            next = next.nextSibling;
        }
        return next;
    },
    getPre:function(node){
        var pre = query.$(node);
        pre = node.previousSibling;
        while(pre&&pre.nodeType!=1){//refetch for filting unelement
            pre = pre.nextSibling;
        }
        return pre;
    }
};