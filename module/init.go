package module

import (
	"database/sql"
	"log"
	"server/constant"
)

type Note struct {
	Id       int    `json:"id"`
	Content  string `json:"content"`
	NoteTime string `json:"noteTime"`
	NoteAddr string `json:"noteAddr"`
}
type Blog struct {
	Title        string `json:"title"`
	CreationTime string `json:"creationTime"`
	ModifiedTime string `json:"modifiedTime"`
	Preview      string `json:"preview"`
	Markdown     string `json:"markdown"`
}
type Comment struct {
	Id        int    `json:"id"`
	BlogId    string `json:"blog_id"`
	Content   string `json:"content"`
	Likes     int    `json:"likes"`
	Username  string `json:"username"`
	AvatarUrl string `json:"avatar_url"`
	Time      string `json:"time"`
}

var db *sql.DB

func init() {
	var err error
	db, err = sql.Open("mysql",
		"root:"+constant.DBPassword+"@tcp(localhost:3306)/server")
	if err != nil {
		log.Fatal(err)
	}
}
