package module

import (
	"fmt"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"os"
	"time"
)

func AllBlog(c *gin.Context) {
	var blogCards []Blog
	for i := 1; ; i++ {
		filePath := fmt.Sprintf("view/statics/md/%d/readme.md", i)
		_, err := os.Stat(filePath)
		if os.IsNotExist(err) {
			break
		} else {
			blogCards = append(blogCards, GetBlog(i, true))
		}
	}
	c.JSON(http.StatusOK, blogCards)
}
func AllComment(c *gin.Context) {
	blogId := c.Query("id")
	comments := make([]Comment, 0)
	rows, err := db.Query("SELECT * FROM comments WHERE blog_id = " + blogId)
	if err != nil {
		log.Print(err)
	}
	for rows.Next() {
		var comment Comment
		err := rows.Scan(&comment.Id, &comment.BlogId, &comment.Content, &comment.Time,
			&comment.Username, &comment.AvatarUrl, &comment.Likes)
		if err != nil {
			log.Print(err)
		}
		comments = append(comments, comment)
	}
	c.JSON(200, comments)
}
func NewComment(c *gin.Context) {
	var newComment Comment
	newComment.Content = c.Query("content")
	newComment.Username = c.Query("username")
	newComment.BlogId = c.Query("blog_id")
	newComment.AvatarUrl = c.Query("avatar_url")
	newComment.Likes = 0
	newComment.Time = time.Now().Format("2006-01-02 15:04:05")
	_, err := db.Exec("INSERT INTO comments (content, time, username, avatar_url, blog_id, likes) VALUES (?,?,?,?,?,?);",
		newComment.Content, newComment.Time, newComment.Username, newComment.AvatarUrl, newComment.BlogId, newComment.Likes)
	if err != nil {
		log.Println(err)
	}
	var lastId string
	err = db.QueryRow("select max(id) from comments").Scan(&lastId)
	if err != nil {
		log.Println(err)
	}
	c.String(200, lastId)

}
func ProComment(c *gin.Context) {
	var likes int
	id := c.Query("id")
	err := db.QueryRow("SELECT likes FROM comments WHERE id=" + id).Scan(&likes)
	if err != nil {
		log.Println(err)
	}
	_, err = db.Exec("UPDATE comments SET likes=? where id=?", likes+1, id)
	if err != nil {
		log.Println(err)
	}
}
func ConComment(c *gin.Context) {
	var likes int
	id := c.Query("id")
	err := db.QueryRow("SELECT likes FROM comments WHERE id=" + id).Scan(&likes)
	if err != nil {
		log.Println(err)
	}
	_, err = db.Exec("UPDATE comments SET likes=? where id=?", likes-1, id)
	if err != nil {
		log.Println(err)
	}
}
func GetNoteAll(c *gin.Context) {
	var notes []Note
	row, err := db.Query("SELECT `id`, `content`, `note_time`, `note_addr` FROM `notes`;")
	if err != nil {
		log.Println(err)
	}
	for row.Next() {
		var note Note
		err = row.Scan(&note.Id, &note.Content, &note.NoteTime, &note.NoteAddr)
		if err != nil {
			log.Println(err)
		}
		notes = append(notes, note)
	}
	c.JSON(200, notes)
}
