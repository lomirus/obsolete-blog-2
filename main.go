package main

import (
	"database/sql"
	"github.com/gin-gonic/gin"
	_ "github.com/go-sql-driver/mysql"
	"log"
	"server/module/constant"
	"server/module/request"
	"server/module/service"
)

var db *sql.DB
var router *gin.Engine
var ajax *gin.RouterGroup
var admin *gin.RouterGroup

func init() {
	var err error
	db, err = sql.Open("mysql",
		"root:"+constant.DBPassword+"@tcp(localhost:3306)/server")
	if err != nil {
		log.Fatal(err)
	}

	router = gin.Default()
	ajax = router.Group("/ajax")
	admin = router.Group("/admin")
	admin.Use(service.VerifyAdmin())
	router.LoadHTMLGlob("templates/**/*")
	router.Static("/statics", "statics")
}
func main() {
	router.GET("/", request.Homepage())
	router.GET("/favicon.ico", request.Favicon())
	router.GET("/blog/:id", request.Blog())
	router.GET("/notes", request.Notes())
	router.GET("/about", request.About())
	ajax.GET("/blog/getAll", service.GetBlogAll())
	ajax.GET("/comment/getAll", service.GetCommentAll(db))
	ajax.POST("/comment/new", service.NewComment(db))
	ajax.POST("/comment/pro", service.ProComment(db))
	ajax.POST("/comment/con", service.ConComment(db))
	ajax.GET("/note/getAll", service.GetNoteAll(db))
	ajax.GET("/util/setCookie", service.SetCookie())
	admin.GET("/note/new", service.NewNote(db))
	admin.GET("/note/alt", service.AltNote(db))
	err := router.Run(":8080")
	if err != nil {
		log.Fatal(err)
	}
}
