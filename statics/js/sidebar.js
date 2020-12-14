let sidebarButton, sidebar, mask

function initSidebar(){
    sidebarButton = document.querySelector("#showSidebar")
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
        history.replaceState(null, null, location.pathname)
    } else {
        let query = '?'
        for(let i in map){
            query += i + '=' + map[i] + '&'
        }
        query = query.slice(0, -1)
        history.replaceState(null, null, location.pathname + query)
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