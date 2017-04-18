package main

import (
	"os"

	"gopkg.in/kataras/iris.v6"
	"gopkg.in/kataras/iris.v6/adaptors/httprouter"
	"gopkg.in/kataras/iris.v6/adaptors/view"
	"gopkg.in/kataras/iris.v6/adaptors/websocket"
)

var port = os.Getenv("PORT")

type clientPage struct {
	Title string
	Host  string
}

type devicePage struct {
	Title string
	Host  string
	ID    string
}

func main() {
	app := iris.New()

	ws := websocket.New(websocket.Config{
		Endpoint:         "/ws",
		ClientSourcePath: "/iris-ws.js",
	})

	app.Adapt(
		iris.DevLogger(),
		httprouter.New(),
		view.HTML("./templates", ".html"),
		ws,
	)

	app.StaticWeb("/static/", "./static/")

	app.Get("/favicon.ico", func(ctx *iris.Context) {
		ctx.ServeFile("./static/img/favicon.ico", false)
	})

	app.Get("/", func(ctx *iris.Context) {

		ctx.Render("server.html", clientPage{"Server Page", ctx.Host()})

	})

	app.Get("/device", func(ctx *iris.Context) {
		id := ctx.FormValue("id")
		ctx.Render("device.html", devicePage{"Device Page", ctx.Host(), id})
	})

	ws.OnConnection(func(c websocket.Connection) {
		c.Emit("ID", c.ID())
		c.On("TO", func(to string) {
			c.SetValue(c.ID(), to)
		})
		c.On("Data", func(data string) {
			c.To(data[7:71]).EmitMessage([]byte(data))
		})

		c.OnDisconnect(func() {
			c.To(c.GetValueString(c.ID())).Emit("DC", "Client disconnected!")
		})

	})
	app.Listen(":" + port)
}
