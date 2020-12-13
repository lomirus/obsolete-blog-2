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