package module

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"server/constant"
	"strconv"
	"time"
)

func NewNote(c *gin.Context) {
	var content = c.Query("content")
	if content == "" {
		c.String(200, "\"content\" cannot be empty")
		return
	}
	var noteAddr = c.Query("noteAddr")
	if noteAddr == "" {
		c.String(200, "\"noteAddr\" cannot be empty")
		return
	}
	var noteTime = time.Now().Format("2006-01-02 15:04:05")
	_, err := db.Exec("INSERT INTO notes (content, note_time,  note_addr) VALUES (?,?,?);",
		content, noteTime, noteAddr)
	if err != nil {
		log.Println(err)
		c.String(200, err.Error())
	} else {
		c.String(200, "New note was sent successfully")
	}
}
func AltNote(c *gin.Context) {
	var id = c.Query("id")
	if id == "" {
		c.String(200, "id cannot be empty")
		return
	}
	var content = c.Query("content")
	var noteAddr = c.Query("noteAddr")
	var noteTime = c.Query("noteTime")
	if noteAddr == "" && noteTime == "" && content == "" {
		c.String(200, "one of \"noteAddr\", \"noteTime\" and \"content\" "+
			"should not be empty at least")
		return
	}
	if content != "" {
		_, err := db.Exec("UPDATE notes SET `content`=? WHERE `id`=?;", content, id)
		if err != nil {
			c.String(200, err.Error())
			return
		}
	}
	if noteAddr != "" {
		_, err := db.Exec("UPDATE notes SET `note_addr`=? WHERE `id`=?;", noteAddr, id)
		if err != nil {
			c.String(200, err.Error())
			return
		}
	}
	if noteTime != "" {
		_, err := db.Exec("UPDATE notes SET `note_time`=? WHERE `id`=?;", noteTime, id)
		if err != nil {
			c.String(200, err.Error())
			return
		}
	}
	c.String(200, "Note was altered successfully")

}
func GetNote(c *gin.Context) {
	var idStr = c.Query("id")
	if idStr == "" {
		c.String(200, "id cannot be empty")
		return
	}
	idInt, err := strconv.Atoi(idStr)
	if err != nil {
		c.String(200, "id cannot be converted to integer")
		return
	}
	var note Note
	note.Id = idInt
	row := db.QueryRow("select `content`,`note_addr`,`note_time` from notes where id=?", note.Id)
	err = row.Scan(&note.Content, &note.NoteAddr, &note.NoteTime)
	if err != nil {
		c.String(200, err.Error())
		return
	}
	c.JSON(200, note)
}
func SetCookie(c *gin.Context) {
	name := c.Query("name")
	if name == "" {
		c.String(http.StatusOK, "name cannot be empty")
		return
	}
	value := c.Query("value")
	if value == "" {
		c.String(http.StatusOK, "value cannot be empty")
		return
	}
	c.SetCookie(name, value, 864000000, "/", constant.Domain, false, true)
	c.String(http.StatusOK, "set cookie successfully")

}
func VerifyAdmin() gin.HandlerFunc {
	return func(c *gin.Context) {
		key, err := c.Cookie("key")
		if err != nil {
			c.String(http.StatusOK, "Here's no flag.\nAll hackers leave please.")
			c.Abort()
			return
		}
		if key == "aJsq743EfRt1YWu9vSmzgi5PyBlrwUThekp8cQH0V6ojdAMn" {
			c.Next()
			return
		} else {
			c.String(http.StatusOK, "Here's no flag.\nAll hackers leave please.")
			c.Abort()
			return
		}
	}
}
