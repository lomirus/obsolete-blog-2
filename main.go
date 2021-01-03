package main

import (
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"server/constant"
	"server/module"
)

var router *gin.Engine
var api *gin.RouterGroup
var admin *gin.RouterGroup

func init() {
	if constant.GinMode == "release" {
		gin.SetMode(gin.ReleaseMode)
	}
	router = gin.Default()
	api = router.Group("/api")
	admin = router.Group("/admin")
	router.LoadHTMLGlob("view/templates/*")
	router.Static("/statics", "view/statics")
}
func main() {
	router.GET("/", module.RHomepage)
	router.GET("/favicon.ico", module.RFavicon)
	router.GET("/blog/:id", module.RBlog)
	router.GET("/notes", module.RNotes)
	router.GET("/about", module.RAbout)
	api.GET("/blog/all", module.AllBlog)
	api.GET("/comment/all", module.AllComment)
	api.POST("/comment/new", module.NewComment)
	api.GET("/comment/pro", module.ProComment)
	api.GET("/comment/con", module.ConComment)
	api.GET("/note/all", module.GetNoteAll)
	admin.GET("/setCookie", module.SetCookie)
	admin.GET("/note/new", module.VerifyAdmin(), module.NewNote)
	admin.GET("/note/alt", module.VerifyAdmin(), module.AltNote)
	var err error
	if constant.Domain == "localhost" {
		err = router.Run(":8081")
	} else {
		err = router.RunTLS(":443", "conf/anonym.ink_chain.crt", "conf/anonym.ink_key.key")
	}
	if err != nil {
		log.Fatal(err)
	}
}
