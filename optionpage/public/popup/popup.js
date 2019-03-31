/* global chrome */
var whiteList = [];
var userInfo = [];

const getDomain = url => {
    let tmp = document.createElement('a');
    tmp.href = url;
    return tmp.hostname;
}

(function(){
    //Adding whitelist API from middleware.js
    window.addEventListener('message', (event) => {
        if (event.source !== window) return;
    
        switch(event.data.type) {
        case 'whiteList':
            whiteList = event.data.params.whiteList;
            break;
        case 'userInfo':
            userInfo = event.data.params.userInfo;
            break;
        default:
        }
    })
    //get the value
    var checkbox = document.querySelector("input[name=checkbox]");

    //First init check
    //On loading of the popup, we will check if the current tab is in the whitelist
    chrome.tabs.getSelected(null,tab => { 
        var currLink = tab.url;
        var currDomain = getDomain(currLink);
        //console.log(currLink);
        var button = document.getElementById('button');
        console.log(button);
        button.onclick = (e) => {
            chrome.storage.sync.get(['whitelist'], (result) => {
                const { whitelist } = result;
                if (! whitelist instanceof Array) return;
                const newlist = whitelist.map(v => {
                    if (getDomain(v.url) === currDomain){
                        const r = { ...v };
                        r.enabled = !e.target.checked;
                        return r;
                    }
                    return v;
                });
                const existed = whitelist.some(v => getDomain(v.url) === currDomain);
                if (! existed) newlist.push({url: `http://${currDomain}`, enabled: true});
                
                chrome.storage.sync.set({whitelist: newlist}, () => {
                    console.log(whitelist, newlist);
                });
            });
        }
        chrome.storage.sync.get(['whitelist'], (result) => {
            //console.log(result.whitelist);
            const list = result['whitelist'];
            console.log(currDomain);
            const contention = list.filter((e) => getDomain(e.url) === currDomain && e.enabled);
            if (contention.length >=1) {
                console.log(currLink + " already exists in whitelist; Button disabled");
                button.checked = false;
            }
        });
    });    
})();
