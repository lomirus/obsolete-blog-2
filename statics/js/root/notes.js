let notesJSON
function initNotes(){
    //加载所有评论
    ajaxReq({
        method: 'GET',
        url:'/ajax/note/getAll',
        handleFunc:function(req){
            const notesDOM = document.querySelector('div#notes')
            notesJSON = JSON.parse(req.response)
            notesJSON.forEach( (v,i) => notesDOM.appendChild(createNote(notesJSON.length - i - 1)))
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