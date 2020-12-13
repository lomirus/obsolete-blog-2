function initSidebar(){
    const showSidebar = document.querySelector("#showSidebar")
    const sidebar = document.querySelector("#sidebar")
    const mask = document.querySelector("#mask")
    if(getQuery('showSidebar') === 'true'){
        sidebar.style.left = '0px'
        sidebar.style.boxShadow = 'rgba(0,0,0,0.2) 20px 0 20px'
        mask.style.display = 'block'
    } else if(getQuery('showSidebar') === 'false' || getQuery('showSidebar') === undefined){
        sidebar.style.left = '-300px'
        sidebar.style.boxShadow = 'none'
        mask.style.display = 'none'
    }
    showSidebar.addEventListener('click', function(){
        if(getQuery('showSidebar') === 'true'){
            sidebar.style.left = '-300px'
            sidebar.style.boxShadow = 'none'
            putQuery({"showSidebar":"false"})
            mask.style.display = 'none'
        } else if(getQuery('showSidebar') === 'false' || getQuery('showSidebar') === undefined){
            sidebar.style.left = '0px'
            sidebar.style.boxShadow = 'rgba(0,0,0,0.2) 20px 0 20px'
            putQuery({"showSidebar":"true"})
            mask.style.display = 'block'
        }
    })
    mask.addEventListener('click', function(){
        sidebar.style.left = '-300px'
        sidebar.style.boxShadow = 'none'
        putQuery({"showSidebar":"false"})
        mask.style.display = 'none'
    })
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
    let query = '?'
    for(let i in map){
        query += i + '=' + map[i] + '&'
    }
    query = query.slice(0, -1)
    history.replaceState(null, null, location.pathname + query)
}