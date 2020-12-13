const maxContentWidth = 960
const minContentMargin = 20
const imgThresholdWidth = 540
function updateWidth(){
    const clientWidth = document.body.clientWidth
    const blogs = document.querySelector("#blogs")
    const articles = document.querySelectorAll('article')
    const images = document.querySelectorAll('img')
    if(clientWidth < imgThresholdWidth + minContentMargin){
        blogs.style.width = (clientWidth-minContentMargin) + "px"
        articles.forEach(v => v.setAttribute('class', 'mobile_atc'))
    }
    else if(clientWidth < maxContentWidth + minContentMargin){
        blogs.style.width = (clientWidth-minContentMargin) + "px"
        images.forEach((v,i) =>
            v.setAttribute('src', 'statics/images/blog/cover/' + (maxBlogId-i) + '.webp')
        )
        articles.forEach(v => v.setAttribute('class', 'pc_atc'))
    }
    else {
        blogs.style.width = maxContentWidth + "px"
        images.forEach((v,i) =>
            v.setAttribute('src', 'statics/images/blog/cover/' + (maxBlogId-i) + '.webp')
        )
        articles.forEach(v => v.setAttribute('class', 'pc_atc'))
    }
}
function initBlogs(res){
    maxBlogId = res.length
    for(let i = maxBlogId - 1; i > -1; i--){
        const clientWidth = document.body.clientWidth
        const article = document.createElement('article')
        const h2 = document.createElement('h2')
        const a = document.createElement('a')
        const p = document.createElement('p')
        const img = document.createElement('img')
        a.innerText = res[i].title
        a.setAttribute("href", "/blog/" + (i+1))
        if (clientWidth < imgThresholdWidth + minContentMargin){
            article.setAttribute('class', 'mobile_atc')
        } else {
            img.setAttribute('src','statics/images/blog/cover/' + (i+1) + '.webp')
            article.setAttribute('class', 'pc_atc')
        }
        p.innerText = res[i].preview
        h2.append(a)
        article.append(h2, img)
        article.append(h2, p)
        blogs.append(article)
    }
}

window.addEventListener('resize', updateWidth)