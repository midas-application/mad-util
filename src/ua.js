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