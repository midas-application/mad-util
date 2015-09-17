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