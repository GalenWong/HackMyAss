
chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
            pageUrl: {schemes: ['http', 'https'],
      }
      })
    ],
            actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
    //actions: [new chrome.declarativeContent.ShowPageAction()]
});


var s = document.createElement('script');
s.src = chrome.runtime.getURL('inject.js');
s.onload = function() {
    this.remove();
};

(document.head||document.documentElement).appendChild(s);
