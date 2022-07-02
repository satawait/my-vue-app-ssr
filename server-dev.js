const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const koaConnect = require('koa-connect')

const vite = require('vite')
;(async () => {
  const app = new Koa()
  // 创建vite服务
  const viteServer = await vite.createServer({
    root: process.cwd(),
    logLevel: 'error',
    server: {
      middlewareMode: true
    }
  })
  // 注册vite的connect的实例作为中间件（注意：vite.middlewares是一个 Connect 实例）
  app.use(koaConnect(viteServer.middlewares))

  const renderFunc = async (ctx) => {
    try {
      // 获取index.html
      let template = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8')
      // 应用vite html转换，注入hmr客户端
      template = await viteServer.transformIndexHtml(ctx.path, template)
      // 加载服务器入口，vite.ssrLoadModule将自动转换
      const { render } = await viteServer.ssrLoadModule('/src/entry-server.ts')
      // 渲染应用的html
      const { renderedHtml, cssHtml } = await render(ctx, {})
      const html = template
        .replace('<!--app-html-->', renderedHtml)
        .replace('<!--css-outlet-->', cssHtml)
      ctx.type = 'text/html'
      ctx.body = html
    } catch (e) {
      viteServer && viteServer.ssrFixStacktrace(e)
      console.log(e.track)
      ctx.throw(500, e.stack)
    }
  }
  app.use(renderFunc)

  app.listen(9000, () => {
    console.log('server is listening in 9000')
  })
})()
