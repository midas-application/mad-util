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