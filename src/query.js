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