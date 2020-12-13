const maxContentWidth = 720
const minContentMargin = 80
let notesJSON
function updateWidth(){
    const clientWidth = document.body.clientWidth
    const articles = document.querySelectorAll("article")
    articles.forEach(article => {
        if(clientWidth < maxContentWidth + minContentMargin)
            article.style.width = (clientWidth-minContentMargin) + "px"
        else
            article.style.width = maxContentWidth + "px"
    })
}
function initNotes(){
    //加载所有评论
    ajaxReq({
        method: 'GET',
        url:'/admin/note/getAll',
        handleFunc:function(req){
            const notesDOM = document.querySelector('div#main')
            notesJSON = JSON.parse(req.response)
            notesJSON.forEach( (v,i) => notesDOM.appendChild(createNote(i)))
            updateWidth()
        }
    })
}
function createNote(index){
    let note = document.createElement('article')
    let content = document.createElement('p')
    let info = document.createElement('footer')
    let notetime = document.createElement('p')
    let innertime = document.createElement('time')
    let address = document.createElement('p')

    info.setAttribute('class', 'info')


    content.innerText = notesJSON[index].content
    innertime.innerText = notesJSON[index].notetime
    address.innerText = "Chongqing"

    notetime.appendChild(innertime)
    info.appendChild(notetime)
    info.appendChild(address)
    note.appendChild(content)
    note.appendChild(info)


    return note
}
window.addEventListener('resize', updateWidth)