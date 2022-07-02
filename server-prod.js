const fs = require('fs')
const path = require('path')

const Koa = require('koa')
const sendFile = require('koa-send')

const resolve = (p) => path.resolve(__dirname, p)

const clientRoot = resolve('dist/client')
const template = fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
const render = require('./dist/server/entry-server').render
const manifest = require('./dist/client/ssr-manifest.json')

;(async () => {
  const app = new Koa()

  const renderFunc = async (ctx) => {
    if (ctx.path.startsWith('/assets')) {
      await sendFile(ctx, ctx.path, { root: clientRoot })
      return
    }
    const { renderedHtml, preloadLinks, cssHtml } = await render(ctx, manifest)
    console.log(1111, cssHtml)
    const html = template
      .replace('<!--app-html-->', renderedHtml)
      .replace('<!--preload-links-->', preloadLinks)
      .replace('<!--css-outlet-->', cssHtml)
    ctx.type = 'text/html'
    ctx.body = html
  }
  app.use(renderFunc)

  app.listen(9009, () => {
    console.log('server is listening in 9009')
  })
})()
