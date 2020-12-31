package request

import (
	"bufio"
	"fmt"
	"github.com/gin-gonic/gin"
	"html/template"
	"log"
	"math/rand"
	"net/http"
	"os"
	"server/module/service"
	"strconv"
)

func Favicon(c *gin.Context) {
	var luckyIcon string
	luckyNum := rand.Intn(101)
	if luckyNum >= 0 && luckyNum < 25 {
		luckyIcon = "google"
	} else if luckyNum >= 25 && luckyNum < 50 {
		luckyIcon = "github"
	} else if luckyNum >= 50 && luckyNum < 75 {
		luckyIcon = "bilibili"
	} else if luckyNum >= 75 && luckyNum < 100 {
		luckyIcon = "pixiv"
	} else {
		luckyIcon = "pornhub"
	}

	icon, _ := os.Open(fmt.Sprintf("statics/icons/%s.ico", luckyIcon))
	iconReader := bufio.NewReader(icon)
	stats, _ := icon.Stat()
	iconBytes := make([]byte, stats.Size())
	_, err := iconReader.Read(iconBytes)
	if err != nil {
		log.Panic(err)
		return
	}
	c.Data(200, "image/x-icon", iconBytes)

}
func Homepage(c *gin.Context) {
	c.HTML(200, "index.html", nil)
}
func Blog(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	maxId := service.GetBlogNumber()
	if id < 1 || id > maxId {
		c.String(http.StatusNotFound, "404 not found")
	} else {
		blog := service.GetBlog(id, false)
		c.HTML(http.StatusOK, "blog.html", gin.H{
			"title":        blog.Title,
			"creationTime": blog.CreationTime,
			"modifiedTime": blog.ModifiedTime,
			"content":      template.HTML(blog.Content),
			"id":           id,
			"maxId":        maxId,
		})
	}
}
func About(c *gin.Context) {
	c.HTML(200, "about.html", nil)
}
func Notes(c *gin.Context) {
	c.HTML(200, "notes.html", nil)
}
