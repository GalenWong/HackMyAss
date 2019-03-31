/* global chrome */

var s = document.createElement('script');
s.src = chrome.runtime.getURL('middleware.js');
s.onload = function() {
    this.remove();
    chrome.storage.sync.get(['userinfo', 'whitelist'], result => {
        const { whitelist: whiteList,  userinfo: userInfo } = result;
        window.postMessage({ type: "whiteList", params: { whiteList } }, "*");
        window.postMessage({ type: "userInfo", params: { userInfo } }, "*");
    });
};

(document.head||document.documentElement).appendChild(s);
