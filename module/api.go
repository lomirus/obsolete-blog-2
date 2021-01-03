package module

import (
	"fmt"
	"github.com/gin-gonic/gin"
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
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	for rows.Next() {
		var comment Comment
		err := rows.Scan(&comment.Id, &comment.BlogId, &comment.Content, &comment.Time,
			&comment.Username, &comment.AvatarUrl, &comment.Likes)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		comments = append(comments, comment)
	}
	c.JSON(200, comments)
}
func NewComment(c *gin.Context) {
	var newComment Comment
	err := c.BindJSON(&newComment)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	if newComment.Content == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "评论内容不可为空",
		})
		return
	}
	if newComment.Username == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "用户名不可为空",
		})
		return
	}
	newComment.Likes = 0
	newComment.Time = time.Now().Format("2006-01-02 15:04:05")
	_, err = db.Exec("INSERT INTO comments (content, time, username, avatar_url, blog_id, likes) VALUES (?,?,?,?,?,?);",
		newComment.Content, newComment.Time, newComment.Username, newComment.AvatarUrl, newComment.BlogId, newComment.Likes)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	var lastId int
	err = db.QueryRow("select max(id) from comments").Scan(&lastId)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(200, gin.H{
		"id": lastId,
	})

}
func ProComment(c *gin.Context) {
	var likes int
	id := c.Query("id")
	err := db.QueryRow("SELECT likes FROM comments WHERE id=" + id).Scan(&likes)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	_, err = db.Exec("UPDATE comments SET likes=? where id=?", likes+1, id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{})
}
func ConComment(c *gin.Context) {
	var likes int
	id := c.Query("id")
	err := db.QueryRow("SELECT likes FROM comments WHERE id=" + id).Scan(&likes)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	_, err = db.Exec("UPDATE comments SET likes=? where id=?", likes-1, id)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{})
}
func GetNoteAll(c *gin.Context) {
	var notes []Note
	row, err := db.Query("SELECT `id`, `content`, `note_time`, `note_addr` FROM `notes`;")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}
	for row.Next() {
		var note Note
		err = row.Scan(&note.Id, &note.Content, &note.NoteTime, &note.NoteAddr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{
				"error": err.Error(),
			})
			return
		}
		notes = append(notes, note)
	}
	c.JSON(200, notes)
}
