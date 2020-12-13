const maxContentWidth = 720
const minContentMargin = 80
function updateWidth(){
    const clientWidth = document.body.clientWidth
    const sections = document.querySelectorAll("section")
    sections.forEach(section => {
        if(clientWidth < maxContentWidth + minContentMargin)
            section.style.width = (clientWidth-minContentMargin) + "px"
        else
            section.style.width = maxContentWidth + "px"
    })
}
window.addEventListener('resize', updateWidth)