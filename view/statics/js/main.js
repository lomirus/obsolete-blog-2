let listControl, nav, basic

/*function getQuery(key){
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
}*/
function initPanel(){
    listControl = document.querySelector("#listControl")
    nav = document.querySelector("nav")
    basic = document.querySelector("#basic")
    listControl.onclick = function(){
        if (nav.getAttribute('class') === 'visible') {
            listControl.innerText = '≡'
            nav.setAttribute('class', 'hidden')
        } else {
            listControl.innerText = '×'
            nav.setAttribute('class', 'visible')
        }
    }
    basic.addEventListener('mousedown', function(e){
        if(e.button === 0) {
            listControl.innerText = '≡'
            nav.setAttribute('class', 'hidden')
        }
    })
}
const query = (url, data) => url + '?' + Object.keys(data).map(key => `${key}=${encodeURI(data[key])}`).join("&")