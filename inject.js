
const isString = (s) => s instanceof String || typeof s === 'string';

const matchAll = (userinfo, string) => {
    const result = new Object;
    for (let key in userinfo) {
        if (! isString(userinfo[key])) continue;
        const toMatch = userinfo[key];
        if (toMatch.length < 1) continue;
        console.log(string, toMatch);
        if (string.indexOf(toMatch) != -1) {
            result[key] = toMatch;
        }
    }
    return result;
};

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
            const leaked = matchAll(userinfo, h);
            allLeaks = {...allLeaks, ...leaked}
        }
    }
    /* check body */
    if (isString(body)) {
        const leaked = matchAll(user, body);
        allLeaks = {...allLeaks, ...leaked};
    } else if (body instanceof Object) {
        const marshalled = JSON.stringify(body);
        const leaked = matchAll(user, marshalled);
        allLeaks = {...allLeaks, ...leaked};
    }

    const leakedKeys = Object.keys(allLeaks);
    if (leakedKeys.length === 0) return;
    
    let warning = 'The website tries to send the following data to server:';
    for (let k of leakedKeys) {
        warning += `${k}: ${allLeaks[k]}\n`;
    }
    warning += 'Give Permission?'
    if (confirm(warning)) return; // given consent
    throw "User consent not given";
};

(function(){
    
const oldfetch = window.fetch;
const newfetch = async (...args) => {
    fetchCheck({
        "username": "GalenWong",
    }, ...args);
    return oldfetch(...args);
}

window.fetch = newfetch;

})();

