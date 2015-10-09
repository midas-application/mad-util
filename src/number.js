var numberParse = madutil.number={
    /**
     * 格式化浮点数
     * @param {Float} floatNumber 需要规范的浮点数
     * @param {Int} savePrecision 保留的小数位数
     */
    formatFloat : function(floatNumber, savePrecision) {
        savePrecision = savePrecision || 2;
        var possiblePrecision = savePrecision + 1;
        //先给他乘以 10的N次方
        var intNumber = Math.round(floatNumber * Math.pow(10, possiblePrecision));
        //由整数做除法，除以10的N次方不会出现乱七八糟的浮点数
        return (Math.round(intNumber / 10) / Math.pow(10, savePrecision)).toFixed(savePrecision);
    },
    convertToNumber:function(value){
        return value.replace(/[^\d]/g, '');
    }
};
