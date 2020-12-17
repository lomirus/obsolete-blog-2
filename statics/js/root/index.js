let maxBlogId
function updateImageUrl(){
    const clientWidth = document.body.clientWidth
    const images = document.querySelectorAll('img')
    if (clientWidth > 640 + 20) {
        window.removeEventListener('resize', updateImageUrl)
        images.forEach((v,i) =>
            v.setAttribute('src', 'statics/images/blog/cover/' + (maxBlogId-i) + '.webp')
        )
    }
}
function initBlogCards(res){
    maxBlogId = res.length
    for(let i = maxBlogId - 1; i > -1; i--){
        const article = createBlogCard(res, i)
        blogs.append(article)
    }
    updateImageUrl()
}
function createBlogCard(res, i){
    const article = document.createElement('article')
    const h2 = document.createElement('h2')
    const a = document.createElement('a')
    const p = document.createElement('p')
    const img = document.createElement('img')
    a.innerText = res[i].title
    a.setAttribute("href", "/blog/" + (i+1))
    p.innerText = res[i].preview
    h2.append(a)
    article.append(h2, img)
    article.append(h2, p)
    return article
}

window.addEventListener('resize', updateImageUrl)