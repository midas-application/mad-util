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
