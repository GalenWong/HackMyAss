
let userInfo = [
    {
        key: 'username',
        val: 'GalenWong',
        sensitive: true,
        enabled: true,
    },
    {
        key: 'email',
        val: 'wonggalen1999@gmail.com',
        sensitive: false,
        enabled: true,
    }
];
let whiteList = [
    {
        url: 'http://www.google.com',
        enabled: true,
    }
];

const isString = (s) => s instanceof String || typeof s === 'string';

const matchAll = (userinfo, string) => {
    const result = new Object();
    for (let info of userinfo) {
        if (! info.enabled) continue;
        if (! isString(info.val)) continue;
        const toMatch = info.val;
        if (toMatch.length < 1) continue;
        if (string.indexOf(toMatch) !== -1) {
            result[info.key] = { val: toMatch, sensitive: info.sensitive };
        }
    }
    return result;
};

/**
 * generateLeakReport will issue consent box.
 * If user consent is not given, it will throw an Error.
 * @param {Object} leaked contains leaked data to display
 * @returns {undefined} nothing is returned
 */
const generateLeakReport = leaked => {
    const leakedKeys = Object.keys(leaked);
    if (leakedKeys.length === 0) return;
    
    let warning = 'The website tries to send the following data to server:\n';
    for (let k of leakedKeys) {
        if (leaked[k].sensitive)
            warning += `${k}: ****\n`;
        else
            warning += `${k}: ${leaked[k].val}\n`;
    }
    warning += 'Give Permission?'
    if (window.confirm(warning)) return; // given consent
    throw "User consent not given";
}

const fetchCheck = (userinfo, ...args) => {
    const URL = args[0];
    const { headers, body } = args[1]?args[1]:{};
    let allLeaks = new Object();
    /* check URL */
    if (isString(URL)) {
        const leaked = matchAll(userinfo, URL);
        allLeaks = {...allLeaks, ...leaked};
    }

    /* check headers */
    if (headers instanceof Headers) {
        for(let h of headers) {
            const leaked = matchAll(userinfo, h[1]);
            allLeaks = {...allLeaks, ...leaked};
        }
    }
    else if(headers instanceof Object) {
        const vals = Object.values(headers);
        for(let h of vals) {
            const leaked = matchAll(userinfo, h);
            allLeaks = {...allLeaks, ...leaked};
        }
    }
    /* check body */
    if (isString(body)) {
        const leaked = matchAll(userinfo, body);
        allLeaks = {...allLeaks, ...leaked};
    } else if (body instanceof Object) {
        const marshalled = JSON.stringify(body);
        const leaked = matchAll(userinfo, marshalled);
        allLeaks = {...allLeaks, ...leaked};
    }
    generateLeakReport(allLeaks);
};

const XMLSendCheck = (userinfo, body) => {
    let allLeaks = new Object;
    if (isString(body)) {
        const leaked = matchAll(userinfo, body);
        allLeaks = { ...allLeaks, ...leaked };
    } else if (body instanceof Object) {
        const marshalled = JSON.stringify(body);
        const leaked = matchAll(userinfo, marshalled);
        allLeaks = { ...allLeaks, ...leaked };
    }
    generateLeakReport(allLeaks);
};

const XMLOpenCheck = (userinfo, URL) => {
    if(isString(URL)) {
        const leaked = matchAll(userinfo, URL);
        generateLeakReport(leaked);
    }
}

function replaceFetch() {
    const oldfetch = window.fetch;
    const newfetch = async (...args) => {
        fetchCheck(userInfo, ...args);
        return oldfetch.call(this, ...args);
    }

    window.fetch = newfetch;
    console.log('fetch has been replaced');
    console.log(window.fetch);
}

function replaceXML() {
    const oldsend = window.XMLHttpRequest.prototype.send;
    async function newsend (body) {
        XMLSendCheck(userInfo, body);
        return oldsend.call(this, body);
    }
    window.XMLHttpRequest.prototype.send = newsend;
    console.log('XMLHttpRequest.send replaced')

    const oldopen = window.XMLHttpRequest.prototype.open;
    async function newopen (method, URL, ...args) {
        XMLOpenCheck(userInfo, URL);
        return oldopen.call(this, method, URL, ...args);
    }
    window.XMLHttpRequest.prototype.open = newopen;
    console.log('XMLHttpRequest.open replaced')
}

const getDomain = url => {
    let tmp = document.createElement('a');
    tmp.href = url;
    return tmp.hostname;
}
(function(){
    /* Script init check */
    console.log('HackMyAss is running');

    const url = window.location.href;
    const currDomian = getDomain(url);

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

    const whiteListed = whiteList.some(v => {
        console.log(getDomain(v.url), currDomian);
        return v.enabled && getDomain(v.url) === currDomian
    }); 
    if (whiteListed) return;
    replaceFetch();
    replaceXML();

})();

