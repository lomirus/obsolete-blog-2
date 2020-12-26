let list, header, mask

function getQuery(key){
    let query = {}
    let map = location.search.slice(1).split('&')
    for(let i in map){
        let pair = map[0].split('=')
        query[pair[0]] = pair[1]
    }
    if (key === undefined) {
        return query
    } else {
        return query[key]
    }
}
function putQuery(map){
    if(map === undefined || map === {}){
        history.replaceState(null, null, location.pathname + location.hash)
    } else {
        let query = '?'
        for(let i in map){
            query += i + '=' + map[i] + '&'
        }
        query = query.slice(0, -1)
        history.replaceState(null, null, location.pathname + query + location.hash)
    }
}
function updateButtons(){
    const root = document.documentElement
    if(getComputedStyle(root).getPropertyValue('--button-transform') === 'scale(1) rotate(0deg)'){
        root.style.setProperty('--button-transform', 'scale(0) rotate(180deg)')
        root.style.setProperty('--button-opacity', '0')
    } else {
        root.style.setProperty('--button-transform', 'scale(1) rotate(0deg)')
        root.style.setProperty('--button-opacity', '1')
    }
}
function ajaxReq({method, url, query, handleFunc}){
    if(query){
        const query_keys = Object.keys(query)
        if(query_keys.length > 0){
            url += '?' + query_keys[0] + '=' + query[query_keys[0]]
            for(let i = 1;i < query_keys.length;i++){
                url += '&' + query_keys[i] + '=' + query[query_keys[i]]
            }
        }
    }
    const req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if(req.readyState === 4 && req.status === 200)
            handleFunc(req)
    }
    req.open(method, url, true)
    req.send()
}
