package main

import (
	"os"

	"github.com/kataras/iris"
	"github.com/kataras/iris/websocket"
)

var port = os.Getenv("PORT")

func main() {
	app := iris.New()
	tmpl := iris.HTML("./templates", ".html")
	setupWebsocket(app)
	app.RegisterView(tmpl)

	app.StaticWeb("/static/", "./static/")

	app.Get("/favicon.ico", func(ctx iris.Context) {
		ctx.ServeFile("./static/img/favicon.ico", false)
	})

	app.Get("/", func(ctx iris.Context) {
		ctx.ViewData("Title", "Server Page")
		ctx.ViewData("Host", ctx.Host())
		ctx.View("server.html")

	})

	app.Get("/device", func(ctx iris.Context) {
		id := ctx.FormValue("id")
		ctx.ViewData("Title", "Server Page")
		ctx.ViewData("Host", ctx.Host())
		ctx.ViewData("ID", id)
		ctx.View("device.html")
	})

	app.Run(iris.Addr(":" + port))
}

func setupWebsocket(app *iris.Application) {
	// create our echo websocket server
	ws := websocket.New(websocket.Config{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
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

	// register the server on an endpoint.
	// see the inline javascript code in the websockets.html, this endpoint is used to connect to the server.
	app.Get("/ws", ws.Handler())

	// serve the javascript built'n client-side library,
	// see websockets.html script tags, this path is used.
	app.Any("/iris-ws.js", func(ctx iris.Context) {
		ctx.Write(websocket.ClientSource)
	})
}
