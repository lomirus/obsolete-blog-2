let images, upper ,viewer, directory
let commentsData, directoryData = []

function initBlog(){
    initContent()
    initDirectory()
    initComments()
    initCommentEditor()
    initBackground()
    upper = document.querySelector("#upper")
    upper.onclick = function(){
        upper.style.display = 'none'
        viewer.style.display = 'none'
    }
}
function initContent(){
    let html = marked(content);
    document.querySelector('#content').innerHTML = html
    initCode()
    initImages()
    initFormulas()
}
function initCode(){
    hljs.initHighlightingOnLoad();
}
function initFormulas(){
    const formulas = document.querySelectorAll(".language-math")
    formulas.forEach(function(v){
        v.parentElement.setAttribute("class", "language-math-wrap")
        katex.render(v.innerText, v);
    })
    const codes = document.querySelectorAll("code")
    codes.forEach(function(v){
        if(v.innerText.slice(0,2) === "$$"){
            v.setAttribute("class", "language-math")
            katex.render(v.innerText.slice(2), v);
        }
    })
}
function initImages(){
    images = document.querySelectorAll("div#content img")
    viewer = document.querySelector("#viewer")
    for(let i = 0;i < images.length;i++){
        images[i].setAttribute('onselectstart',"return false")
        let oldSrc = images[i].getAttribute('src')
        let newSrc = '/statics/md/' + blog_id  + '/' + oldSrc
        images[i].setAttribute('src',newSrc)
        images[i].onclick = function(){
            upper.style.display = 'flex'
            viewer.style.display = 'block'
            viewer.setAttribute('src',images[i].getAttribute('src'))
        }
    }
}
function initComments(){
    //加载所有评论
    ajaxReq({
        method: 'GET',
        url:'/api/comment/all',
        query:{
            id: blog_id
        },
        handleFunc:function(req){
            const commentsDOM = document.querySelector('div#comments')
            commentsData = JSON.parse(req.response)
            if(commentsData.length === 0){
                commentsDOM.style.display = "none"
            } else {
                commentsData.forEach( (v,i) => commentsDOM.appendChild(createComment(i)))
            }
        }
    })
}
function initCommentEditor(){
    //初始化提交评论功能
    const newCommentButton = document.querySelector('div#newComment>button')
    newCommentButton.addEventListener('click',submitComment)
    //初始化评论编辑区域的头像与用户名
    const newCommentUsername = document.querySelector('div#newComment>input')
    const newCommentAvatar = document.querySelector('div#newComment>img')
    newCommentUsername.value = localStorage.getItem('username')
    if(localStorage.getItem('avatar')){
        newCommentAvatar.setAttribute('src', localStorage.getItem('avatar'))
    }
    newCommentAvatar.addEventListener('click', changeAvatar)
}
function initDirectory(){
    const elements = document.querySelector("#content").children
    directory = document.querySelector("#directory")
    for(let i in elements){
        if(["h2", "h3", "h4", "h5", "h6"].indexOf(elements[i].localName) !== -1) {
            const label = parseInt(elements[i].localName[1])
            const name = elements[i].innerText
            directoryData.push([label, name])
            elements[i].innerHTML = `<a name="${name}" href="#${name}">${name}</a>`
        }
    }
}
function initBackground(){
    updateBackground()
    window.addEventListener('scroll', updateBackground)
}
/*function initDirectory(){
    const elements = document.querySelector("#content").children
    const titleNumber = [0,0,0,0,0,0,0]
    const titles = []
    for(let i in elements){
        let name
        if(elements[i].localName === "h2"){
            titleNumber[2]++
            name = titleNumber[2] + " " +
                elements[i].innerText;
            titleNumber[3] = 0
            titleNumber[4] = 0
            titleNumber[5] = 0
            titleNumber[6] = 0
        } else if(elements[i].localName === "h3"){
            titleNumber[3]++
            name = titleNumber[2] + "." +
                titleNumber[3] + " " +
                elements[i].innerText;
            titleNumber[4] = 0
            titleNumber[5] = 0
            titleNumber[6] = 0
        } else if(elements[i].localName === "h4"){
            titleNumber[4]++
            name =titleNumber[2] + "." +
                titleNumber[3] + "." +
                titleNumber[4] + " " +
                elements[i].innerText;
            titleNumber[5] = 0
            titleNumber[6] = 0
        } else if(elements[i].localName === "h5"){
            titleNumber[5]++
            name =titleNumber[2] + "." +
                titleNumber[3] + "." +
                titleNumber[4] + "." +
                titleNumber[5] + " " +
                elements[i].innerText;
            titleNumber[6] = 0
        } else if(elements[i].localName === "h6"){
            titleNumber[6]++
            name =titleNumber[2] + "." +
                titleNumber[3] + "." +
                titleNumber[4] + "." +
                titleNumber[5] + "." +
                titleNumber[6] + " " +
                elements[i].innerText;
        } else {
            continue
        }
        titles.push(name)
        elements[i].innerHTML = `<a name="${name}" href="#${name}">${elements[i].innerText}</a>`
    }
    titles.forEach(v => console.log(v))
    console.log('\n')
}*/

function submitComment(){
    const newCommentName = document.querySelector('div#newComment>input')
    const newCommentAvatar = document.querySelector('div#newComment>img')
    const newCommentText = document.querySelector('div#newComment>textarea')
    const text = newCommentText.value
    const username = newCommentName.value === ''? "Anonymous" : newCommentName.value
    const avatar = newCommentAvatar.src
    if(text === ''){
        alert('内容不可为空')
    } else {
        localStorage.setItem('avatar', avatar)
        localStorage.setItem('username', username)
        ajaxReq({
            method: 'POST',
            url: '/api/comment/new',
            query:{
                'content': text,
                'username': username,
                'blog_id': blog_id,
                'avatar_url': escape(avatar)
            },
            handleFunc: function(res){
                let commentJSON = {
                    "id": res.response,
                    "content": text,
                    "time": getNowTime(),
                    "username": username,
                    "avatar_url": avatar,
                    "likes": 0,
                }
                const commentsDOM = document.querySelector('div#comments')
                commentsData.push(commentJSON)
                commentsDOM.appendChild(createComment(commentsData.length - 1))
                commentsDOM.style.display = "block"
                Notification.requestPermission().then(function(permission){
                    if (permission === 'granted')
                        new Notification("You've sent your comment", {body: text}); // 显示通知
                    else if (permission === 'denied')
                        alert("You've sent your comment."); // 显示通知
                })
            }})
    }

}
function changeAvatar(){
    const newAvatarUrl = prompt("Please input the url of new avatar:")
    if (newAvatarUrl == null) return
    this.setAttribute('src', newAvatarUrl)
}
function createComment(index){
    let comment = document.createElement('div')
    let avatar = document.createElement('img')
    let main = document.createElement('div')
    let username = document.createElement('span')
    let info = document.createElement('div')
    let content = document.createElement('p')
    let operation = document.createElement('div')
    let likes = document.createElement('span')
    let pro = document.createElement('span')
    let con = document.createElement('span')
    let time = document.createElement('span')

    comment.setAttribute('class', 'comment')
    comment.setAttribute('comment_id', commentsData[index].id)
    avatar.setAttribute('class', 'avatar')
    main.setAttribute('class', 'main')
    username.setAttribute('class', 'username')
    content.setAttribute('class', 'content')
    info.setAttribute('class', 'info')
    operation.setAttribute('class', 'operation')
    likes.setAttribute('class', 'likes')
    pro.setAttribute('class', 'pro')
    con.setAttribute('class', 'con')
    time.setAttribute('class', 'time')
    avatar.setAttribute('src', commentsData[index].avatar_url)
    likes.setAttribute('likes', commentsData[index].likes)

    username.innerText = commentsData[index].username
    content.innerText = commentsData[index].content
    if(commentsData[index].likes >= 0){
        likes.innerText = '❤️'
    } else {
        likes.innerText = '💔️'
    }

    pro.innerText = '👍'
    con.innerText = '👎'
    time.innerText = commentsData[index].time

    pro.addEventListener('click', function (event){
        const likes = this.parentElement.children[2]
        ajaxReq({
            method: 'POST',
            url: '/api/comment/pro',
            query:{
                id: commentsData[index].id
            },
            handleFunc: function(){
                const oldLikes = parseInt(likes.getAttribute('likes'))
                likes.setAttribute('likes', oldLikes + 1)
                likes.innerText =
                    parseInt(likes.getAttribute('likes')) >= 0 ? '💖' : '💗'
                likes.style.transitionDuration = "120ms"
                likes.style.transform = "scale(1.2)"
                setTimeout(() => {
                    likes.style.transform = ""
                    setTimeout(() => {
                        likes.style.transitionDuration = "240ms"
                        likes.innerText =
                            parseInt(likes.getAttribute('likes')) >= 0 ? '❤️' : '💔️'
                    }, 120)
                }, 120)
            }
        })
    })
    con.addEventListener('click', function (){
        const likes = this.parentElement.children[2]
        ajaxReq({
            method:'POST',
            url: '/api/comment/con',
            query:{
                id: commentsData[index].id
            },
            handleFunc: function(){
                const oldLikes = parseInt(likes.getAttribute('likes'))
                likes.setAttribute('likes',oldLikes - 1)
                likes.innerText =
                    parseInt(likes.getAttribute('likes')) >= 0 ? '💓' : '🖤'
                likes.style.transform = "scale(1.2)"
                setTimeout(() => {
                    likes.style.transform = ""
                    likes.innerText =
                        parseInt(likes.getAttribute('likes')) >= 0 ? '❤️' : '💔️'
                }, 240)
            }
        })
    })

    operation.appendChild(pro)
    operation.appendChild(con)
    operation.appendChild(likes)
    info.appendChild(username)
    info.appendChild(time)
    main.appendChild(info)
    main.appendChild(content)
    main.appendChild(operation)

    comment.appendChild(avatar)
    comment.appendChild(main)

    return comment
}
function getNowTime(){
    let now = new Date()
    let year = now.getFullYear()
    let month = now.getMonth()
    let date = now.getDate()
    let hour = now.getHours()
    let minute = now.getMinutes()
    let second = now.getSeconds()
    month = month < 10 ? "0" + month : month
    date = date < 10 ? "0" + date : date
    hour = hour < 10 ? "0" + hour : hour
    minute = minute < 10 ? "0" + minute : minute
    second = second < 10 ? "0" + second : second
    now = `${year}-${month}-${date} ${hour}:${minute}:${second}`
    return now
}
function showDirectory(){
    upper.style.display = 'flex'
    directory.style.display = 'block'
    directoryData.forEach(function(v){
        console.log(strMultiply('  ', v[0]-2) + v[1])
    })
}
function updateBackground(){
    const height = document.documentElement.clientHeight
    const top = document.documentElement.scrollTop
    const mask = document.querySelector('#background>.mask')
    const cover = document.querySelector('#cover')
    if(top < height * 0.5){
        mask.style.opacity = (top / height * 0.4).toString()
        cover.style.opacity = "1"
    } else if(top < height) {
        mask.style.opacity = "0.2"
        cover.style.opacity = (2 - top / height * 2).toString()
    } else {
        mask.style.opacity = "0.2"
        cover.style.opacity = "0"
    }
}
function strMultiply(str='', time=1){
    let newStr = ''
    for(let i = 0; i < time; i++){
        newStr += str
    }
    return newStr
}