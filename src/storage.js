/**
 * Created by timlv on 15.9.15.
 */
var storage = window.localStorage;
madutil.storage = storage?{
    get : function(name,opt) {
        opt = opt || {};
        var _domain = opt.domain || location.host, _path = opt.path || "/";
        return storage.getItem(madutil.string.format("{0}{1}@@{2}",_domain,_path,name));
    },
    set : function(name, value, opt) {
        opt = opt || {};
        var _domain = opt.domain || location.host, _path = opt.path || "/";
        try{//safari will throw on the private mode.
            storage.setItem(madutil.string.format("{0}{1}@@{2}",_domain,_path,name),value);
        }catch(e){

        }
    },
    del : function(name, opt) {
        opt = opt || {};
        var _domain = opt.domain || location.host, _path = opt.path || "/";
        storage.removeItem(madutil.string.format("{0}{1}@@{2}",_domain,_path,name));
    }
}:cookie;