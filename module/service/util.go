package service

import (
	"bufio"
	"fmt"
	"github.com/gin-gonic/gin"
	"github.com/russross/blackfriday"
	"io"
	"log"
	"net/http"
	"os"
	"runtime"
	"server/module/constant"
)

type Blog struct {
	Title        string `json:"title"`
	CreationTime string `json:"creationTime"`
	ModifiedTime string `json:"modifiedTime"`
	Preview      string `json:"preview"`
	Content      string `json:"content"`
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

func GetBlog(blogId int, getPreview bool) (blog Blog) {
	const preLen = 320
	var endLen int
	if runtime.GOOS == "linux" {
		endLen = 1 // \n
	} else if runtime.GOOS == "windows" {
		endLen = 2 // \r\n
	}

	filePath := fmt.Sprintf("statics/md/%d/readme.md", blogId)
	inputFile, inputErr := os.Open(filePath)
	if inputErr != nil {
		log.Println(inputErr.Error())
		return
	}
	defer inputFile.Close()

	fileReader := bufio.NewReader(inputFile)
	var readString string
	//获取标题
	readString, _ = fileReader.ReadString('\n')
	blog.Title = readString[2 : len(readString)-endLen]
	//读取一次回车
	_, _ = fileReader.ReadString('\n')
	//获取创建时间
	readString, _ = fileReader.ReadString('\n')
	blog.CreationTime = readString[21:31]
	//读取一次回车
	_, _ = fileReader.ReadString('\n')
	//读取最后修改时间
	readString, _ = fileReader.ReadString('\n')
	blog.ModifiedTime = readString[21:31]
	// 读取预览内容或全文内容
	if getPreview {
		//获取预览内容
		for {
			//判断预览内容是否已经获取足够长度
			if len([]rune(blog.Preview)) >= preLen {
				break
			}
			//判断文件是否已经被读取完毕
			fileString, readerErr := fileReader.ReadString('\n')
			if readerErr == io.EOF {
				blog.Preview += fileString
				break
			}
			//判断是否为段落标题或空行
			if fileString[0] != '#' && fileString[0] != '\r' && fileString[0] != '\n' {
				if len(fileString) > 2 && fileString[0:2] != "![" {
					blog.Preview += fileString[0:len(fileString)-endLen] + " "
				}
			}
		}
		rPreview := []rune(blog.Preview)
		blog.Preview = string(rPreview[0:preLen])
	} else {
		//获取内容
		for {
			fileString, readerErr := fileReader.ReadString('\n')
			blog.Content += fileString
			if readerErr == io.EOF {
				break
			}
		}
		blog.Content = string(blackfriday.MarkdownCommon([]byte(blog.Content)))
	}
	return blog
}
func GetBlogNumber() (blogNum int) {
	for blogNum = 1; ; blogNum++ {
		filePath := fmt.Sprintf("statics/md/%d/readme.md", blogNum)
		_, err := os.Stat(filePath)
		if os.IsNotExist(err) {
			break
		}
	}
	return blogNum - 1
}
func SetCookie() gin.HandlerFunc {
	return func(c *gin.Context) {
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
}
