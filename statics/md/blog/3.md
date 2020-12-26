# Golang 非侵入式接口学习笔记

初始创建于：***2020/10/25***

最后编辑于：***2020/12/23***

## 非侵入式接口

Golang 的接口属于“非侵入式接口”，不需要显式声明。

## 实例
定义 `Circle` 和 `Heart` 两个结构体：
```go
type Circle struct {

}

type Heart struct {

}
```
定义 `Painter` 接口：
```go
type Painter interface {
	Paint()
}
```
如果直接按照下面的代码定义 `Painter` 接口中的`Paint`函数：
```go
func Paint (painter Painter){
    switch painter.(type){
    case Circle:
        for y := 10; y > -10; y-- {
            for x := 10; x > -10; x-- {
                if x*x + y*y < 100 {
                    fmt.Print("* ")
                } else {
                    fmt.Print("  ")
                }
            }
            fmt.Print("\n")
        }
    case Heart:
        for y := 1.4; y > -1.4; y -= 0.1 {
            for x := 1.4; x > -1.4; x -= 0.1 {
                if (x*x+y*y-1)*(x*x+y*y-1)*(x*x+y*y-1)-x*x*y*y*y < 0 {
                    fmt.Print("* ")
                } else {
                    fmt.Print("  ")
                }
            }
            fmt.Print("\n")
        }
    }
}
```

编辑器会报错，并提示：
```
Impossible type switch case: 'Circle' does not implement 'Painter'
Impossible type switch case: 'Heart' does not implement 'Painter'
```
这是因为此时`Circle`和`Heart`均未实现`Painter`接口，无法将`Circle`和`Heart`类型的结构体作为参数传递给`Paint()`。
## 解决方法
加入以下代码：
```go
func (circle Circle) Paint (){
	
}
func (heart Heart) Paint (){
	
}
```
因为此时`Circle`和`Heart`均定义了`Paint`方法，所以隐式地实现了`Painter`接口，于是就可以将其类型的变量作为参数传递给`Paint`函数了。

## 扩展

### 隐式实现的判断标准
值得一提的是，此处之所以可以通过定义`Paint`方法来隐式地实现`Painter`接口，是因为此时`Painter`接口中只存在`Paint`一个方法。而一旦`Painter`接口下的所有方法都在`Circle`被定义，那么`Circle`就实现了`Painter`接口。反之，如果`Painter`接口中存在着某个方法未在`Circle`被定义，那么就会认为`Circle`未实现`Painter`接口。举个例子，如果此时在`Painter`接口下再声明一个新方法：
```go
type Painter interface {
    Paint()
    ReversePaint()
}
```
编辑器就会再次报错，并给出与上文同样的提示：
```
Impossible type switch case: 'Circle' does not implement 'Painter'
Impossible type switch case: 'Heart' does not implement 'Painter'
```
有些读者读到这里也许会认为，上面之所以会报错是因为我们只去声明了`ReversePaint()`却没有进行定义而已。但实际上，此处的报错与`ReversePaint()`本身是否被定义并没有关系，即使给出下面代码所示的定义，依旧会得到同样的报错信息：
```go
func ReversePaint (painter Painter){
    switch painter.(type){
    case Circle:
        for y := 10; y > -10; y-- {
            for x := 10; x > -10; x-- {
                if x*x+y*y < 100 {
                    fmt.Print(" ")
                } else {
                    fmt.Print("* ")
                }
            }
            fmt.Print("\n")
        }
    case Heart:
        for y := 1.4; y > -1.4; y -= 0.1 {
            for x := 1.4; x > -1.4; x -= 0.1{
                if (x*x+y*y-1)*(x*x+y*y-1)*(x*x+y*y-1)-x*x*y*y*y < 0 {
                    fmt.Print("  ")
                } else {
                    fmt.Print("* ")
                }
            }
            fmt.Print("\n")
        }
    }
}
```
此时解决方法同理，再加入以下代码即可：
```go
func (circle Circle) ReversePaint (){

}
func (heart Heart) ReversePaint (){

}
```
### 实例代码的重构
经过了对代码的大半天修改，现在让我们再来看一下代码的主要部分，会发现它是这样的：
```go
func (circle Circle) Paint (){

}
func (heart Heart) Paint (){

}
func (circle Circle) ReversePaint (){

}
func (heart Heart) ReversePaint (){

}

func Paint (painter Painter){
    switch painter.(type){
    case Circle:
        for y := 10; y > -10; y-- {
            for x := 10; x > -10; x-- {
                if x*x+y*y < 100 {
                    fmt.Print("* ")
				} else {
                    fmt.Print("  ")
                }
            }
            fmt.Print("\n")
        }
    case Heart:
        for y := 1.4; y > -1.4; y-=0.1 {
            for x := 1.4; x > -1.4; x-= 0.1{
                if (x*x+y*y-1)*(x*x+y*y-1)*(x*x+y*y-1)-x*x*y*y*y < 0 {
                    fmt.Print("* ")
                } else {
                    fmt.Print("  ")
                }
            }
            fmt.Print("\n")
        }
    }
}
func ReversePaint (painter Painter){
    switch painter.(type){
    case Circle:
        for y := 10; y > -10; y-- {
            for x := 10; x > -10; x-- {
                if x*x+y*y < 100 {
                    fmt.Print(" ")
                } else {
                    fmt.Print("* ")
                }
            }
            fmt.Print("\n")
        }
    case Heart:
        for y := 1.4; y > -1.4; y-=0.1 {
            for x := 1.4; x > -1.4; x-= 0.1{
                if (x*x+y*y-1)*(x*x+y*y-1)*(x*x+y*y-1)-x*x*y*y*y < 0 {
                    fmt.Print("  ")
                } else {
                    fmt.Print("* ")
                }
            }
            fmt.Print("\n")
        }
    }
}
```
嗯...简直是乱成一团
我们可以稍微修改一下：

```go
func (circle Circle) Paint (){
    for y := 10; y > -10; y-- {
        for x := 10; x > -10; x-- {
            if x*x+y*y < 100 {
                fmt.Print("* ")
            } else {
                fmt.Print("  ")
            }
        }
        fmt.Print("\n")
    }
}
func (heart Heart) Paint (){
    for y := 1.4; y > -1.4; y-=0.1 {
        for x := 1.4; x > -1.4; x-= 0.1{
            if (x*x+y*y-1)*(x*x+y*y-1)*(x*x+y*y-1)-x*x*y*y*y < 0 {
                fmt.Print("* ")
            } else {
                fmt.Print("  ")
            }
        }
        fmt.Print("\n")
    }
}
func (circle Circle) ReversePaint (){
    for y := 10; y > -10; y-- {
        for x := 10; x > -10; x-- {
            if x*x+y*y < 100 {
                fmt.Print(" ")
            } else {
                fmt.Print("* ")
            }
        }
        fmt.Print("\n")
    }
}
func (heart Heart) ReversePaint (){
    for y := 1.4; y > -1.4; y-=0.1 {
        for x := 1.4; x > -1.4; x-= 0.1{
            if (x*x+y*y-1)*(x*x+y*y-1)*(x*x+y*y-1)-x*x*y*y*y < 0 {
                fmt.Print("  ")
            } else {
                fmt.Print("* ")
            }
        }
        fmt.Print("\n")
    }
}

func Paint (painter Painter){
    painter.Paint()
}
func ReversePaint (painter Painter){
    painter.ReversePaint()
}
```
这样写的话，相对来说会更有条理、易于阅读一些，同时代码量也减少了不少。~~（毕竟这才是正常人会写的代码）~~

## 更新记录

### 2020/12/17

* 将 Tab 缩进统一修改为 4 个空格（因为 Tab 实际要占 8 个空格的宽度，导致代码显得有点散乱）；
* 优化目录结构

### 2020/12/23

红岩后端要考核了，赶紧回来补了一下接口知识，顺便改了点小问题

* 修复了部分导致语句不通顺的病句问题；
* 修复了部分语句中思维跨越不太正常的逻辑；
