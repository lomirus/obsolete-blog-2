package service

import (
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
	"server/constant"
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
