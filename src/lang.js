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