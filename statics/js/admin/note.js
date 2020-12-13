const maxContentWidth = 720
const minContentMargin = 40
function updateWidth(){
    const clientWidth = document.body.clientWidth
    const editor = document.querySelector("#editor")
    if(clientWidth < maxContentWidth + minContentMargin)
        editor.style.width = (clientWidth-minContentMargin) + "px"
    else
        editor.style.width = maxContentWidth + "px"
}
function submitNote(){
    const note = document.querySelector('textarea')
    const text = note.value
    if(text === ''){
        alert('内容不可为空')
    } else {
        ajaxReq({
            method: 'POST',
            url: '/admin/note/new',
            query:{
                'content': text,
            },
            handleFunc: function(){
                Notification.requestPermission( function(status) {
                    new Notification("New note has been sent successfully", {body: text}); // 显示通知
                })
            }
        })
    }

}
function init(){
    const submit = document.querySelector('button')
    submit.addEventListener('click', submitNote)
}
window.addEventListener('resize', updateWidth)
