
const isString = (s) => s instanceof String || typeof s === 'string';

const matchAll = (userinfo, string) => {
    const result = new Object;
    for (let key in userinfo) {
        if (! isString(userinfo[key])) continue;
        const toMatch = userinfo[key];
        if (toMatch.length < 1) continue;
        if (string.indexOf(toMatch) != -1) {
            result[key] = toMatch;
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
        warning += `${k}: ${leaked[k]}\n`;
    }
    warning += 'Give Permission?'
    if (confirm(warning)) return; // given consent
    throw "User consent not given";
}

const fetchCheck = (userinfo, ...args) => {
    const URL = args[0];
    const { headers, body } = args[1]?args[1]:{};
    let allLeaks = new Object;
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

// TODO: remove this
const tempUserInfo = {
    "username": "GalenWong",
};

function replaceFetch() {
    const oldfetch = window.fetch;
    const newfetch = async (...args) => {
        fetchCheck(tempUserInfo, ...args);
        return oldfetch.call(this, ...args);
    }

    window.fetch = newfetch;
    console.log('fetch has been replaced');
    console.log(window.fetch);
}

function replaceXML() {
    const oldsend = window.XMLHttpRequest.prototype.send;
    async function newsend (body) {
        XMLSendCheck(tempUserInfo, body);
        return oldsend.call(this, body);
    }
    window.XMLHttpRequest.prototype.send = newsend;
    console.log('XMLHttpRequest.send replaced')

    const oldopen = window.XMLHttpRequest.prototype.open;
    async function newopen (method, URL, ...args) {
        XMLOpenCheck(tempUserInfo, URL);
        return oldopen.call(this, method, URL, ...args);
    }
    window.XMLHttpRequest.prototype.open = newopen;
    console.log('XMLHttpRequest.open replaced')
}

(function(){
    /* Script init check */
    console.log('HackMyAss is running');
    replaceFetch();
    replaceXML();

})();

