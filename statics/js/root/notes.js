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
        url:'/ajax/note/getAll',
        handleFunc:function(req){
            const notesDOM = document.querySelector('div#main')
            notesJSON = JSON.parse(req.response)
            notesJSON.forEach( (v,i) => notesDOM.appendChild(createNote(notesJSON.length - i - 1)))
            updateWidth()
        }
    })
}
function createNote(index){
    let note = document.createElement('article')
    let content = document.createElement('p')
    let info = document.createElement('footer')
    let noteTime = document.createElement('p')
    let innerTime = document.createElement('time')
    let noteAddr = document.createElement('p')

    info.setAttribute('class', 'info')


    content.innerText = notesJSON[index].content
    innerTime.innerText = notesJSON[index].noteTime
    noteAddr.innerText = notesJSON[index].noteAddr

    noteTime.appendChild(innerTime)
    info.appendChild(noteTime)
    info.appendChild(noteAddr)
    note.appendChild(content)
    note.appendChild(info)

    return note
}
window.addEventListener('resize', updateWidth)