let sidebarButton, header, sidebar, mask

function initSidebar(){
    sidebarButton = document.querySelector("#showSidebar")
    header = document.querySelector("header")
    sidebar = document.querySelector("#sidebar")
    mask = document.querySelector("#mask")
    switch(getQuery('showSidebar')){
        case 'true': showSidebar();break;
        default: hideSidebar();break;
    }
    sidebarButton.addEventListener('click', function(){
        switch(getQuery('showSidebar')){
            case 'true': hideSidebar();break;
            default: showSidebar();break;
        }
    })
    mask.addEventListener('click', hideSidebar)
}
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
function showSidebar(){
    sidebar.style.left = '0px'
    sidebar.style.boxShadow = 'rgba(0,0,0,0.2) 20px 0 20px'
    mask.style.display = 'block'
    putQuery({"showSidebar":"true"})
}
function hideSidebar(){
    sidebar.style.left = '-300px'
    sidebar.style.boxShadow = 'none'
    mask.style.display = 'none'
    putQuery()
}
function hideHeader(){
    header.style.top = '-80px'
    header.style.boxShadow = 'none'
}
function showHeader(){
    header.style.top = '0px'
    header.style.boxShadow = 'rgba(0,0,0,0.2) 0 0 24px'
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