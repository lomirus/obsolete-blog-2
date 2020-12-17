const maxClientWidth = 880
const maxImageWidth = 720
const maxContentPadding = 40
const minContentPadding = 20
const blog_id = parseInt(location.pathname.slice(6))
let beforePageYOffset // used to calc the scroll orientation
let commentsJSON

function updateLayout(){
    let clientWidth = document.body.clientWidth
    const images = document.querySelectorAll("#content img")
    const content = document.querySelector("#content")
    const comment = document.querySelector("#comment")

    if(clientWidth > maxClientWidth + maxContentPadding * 2){
        content.style.width = maxClientWidth + "px"
        comment.style.width = maxClientWidth + "px"
        content.style.padding = maxContentPadding + "px"
        comment.style.padding = maxContentPadding + "px"
        images.forEach(v => v.style.width = maxImageWidth + "px")
    } else if(clientWidth > maxClientWidth + minContentPadding * 2){
        content.style.width = maxClientWidth + "px"
        comment.style.width = maxClientWidth + "px"
        content.style.padding = (clientWidth - maxClientWidth)/2 + "px"
        comment.style.padding = (clientWidth - maxClientWidth)/2 + "px"
    } else {
        content.style.width = (clientWidth - minContentPadding*2) + "px"
        comment.style.width = (clientWidth - minContentPadding*2) + "px"
        content.style.padding = minContentPadding + "px"
        comment.style.padding = minContentPadding + "px"
    }

    if (clientWidth > maxImageWidth + minContentPadding*2)
        images.forEach(v => v.style.width = maxImageWidth + "px")
    else
        images.forEach(v => v.style.width = (clientWidth-minContentPadding*2) + "px")
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
    const images = document.querySelectorAll("div#content img")
    const imgMask = document.querySelector("div#imgMask")
    const maskImg = document.querySelector("div#imgMask img")
    for(let i = 0;i < images.length;i++){
        images[i].setAttribute('onselectstart',"return false")
        images[i].addEventListener('click',function(){
            imgMask.style.display = 'block'
            maskImg.setAttribute('src',images[i].getAttribute('src'))
        })
    }
    imgMask.addEventListener('click',function(){
        imgMask.style.display = 'none'
    })
}
function initHeader(){
    const down = document.querySelector("div#down")
    const left = document.querySelector("div#left")
    const right = document.querySelector("div#right")
    down.addEventListener('click',function (){
        window.scrollTo({
            left: 0,
            top: document.documentElement.clientHeight,
            behavior: 'smooth'
        })
    })
    if(blog_id != 1){
        left.addEventListener('click',function (){
            window.location.href = "/blog/" + (blog_id - 1)
        })
    } else {
        let style = document.createElement('style');
        style.innerHTML = 'div#left:hover{background:none!important}'
        document.body.appendChild(style);
    }

    if(blog_id != maxBlogId){
        right.addEventListener('click',function (){
            window.location.href = "/blog/" + (blog_id +1)
        })
    } else {
        let style = document.createElement('style');
        style.innerHTML = 'div#right:hover{background:none!important}'
        document.body.appendChild(style);
    }
}
function initComments(){
    //加载所有评论
    ajaxReq({
        method: 'GET',
        url:'/ajax/comment/getAll',
        query:{
            id: blog_id
        },
        handleFunc:function(req){
            const commentsDOM = document.querySelector('div#comments')
            commentsJSON = JSON.parse(req.response)
            if(commentsJSON.length === 0){
                commentsDOM.style.display = "none"
            } else {
                commentsJSON.forEach( (v,i) => commentsDOM.appendChild(createComment(i)))
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
function initBlog(){
    hljs.initHighlightingOnLoad();
    initFormulas()
    initImages()
    initHeader()
    initSidebar()
    initComments()
    initCommentEditor()
    updateLayout()
    window.addEventListener('scroll',() => {
        window.pageYOffset > beforePageYOffset ? hideHeader(): showHeader()
        beforePageYOffset = window.pageYOffset
    })
}

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
            url: '/ajax/comment/new',
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
                commentsJSON.push(commentJSON)
                commentsDOM.appendChild(createComment(commentsJSON.length - 1))
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
    comment.setAttribute('comment_id', commentsJSON[index].id)
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
    avatar.setAttribute('src', commentsJSON[index].avatar_url)
    likes.setAttribute('likes', commentsJSON[index].likes)

    username.innerText = commentsJSON[index].username
    content.innerText = commentsJSON[index].content
    if(commentsJSON[index].likes >= 0){
        likes.innerText = '❤️'
    } else {
        likes.innerText = '💔️'
    }

    pro.innerText = '👍'
    con.innerText = '👎'
    time.innerText = commentsJSON[index].time

    pro.addEventListener('click', function (event){
        const likes = this.parentElement.children[2]
        ajaxReq({
            method: 'POST',
            url: '/ajax/comment/pro',
            query:{
                id: commentsJSON[index].id
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
            url: '/ajax/comment/con',
            query:{
                id: commentsJSON[index].id
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
function getDirectory(){
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
}