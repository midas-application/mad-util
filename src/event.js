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