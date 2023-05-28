window.onerror ??= (_msg, _url, _line, _col, err) => alert(err.stack)
const url = `${location.origin}/chat/recieve/${s.innerText}`
a.href = `javascript:fetch("${location.origin}/cors/embed-recieve.js").then(res=>res.text()).then(data=>eval(data)("${url}"))`
