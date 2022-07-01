import { createApp } from './main'
import { renderToString } from '@vue/server-renderer'
import { ParameterizedContext } from 'koa'
import createMyRouter from '@/routes'

export const render = async (ctx: ParameterizedContext, manifest: Record<string, string[]>) => {
  const { app } = createApp() // 路由注册

  const router = createMyRouter('server')
  app.use(router)
  await router.push(ctx.path)
  await router.isReady()

  // 注入vue ssr中的上下文对象
  const renderCtx: { modules?: string[] } = {}
  const renderedHtml = await renderToString(app, renderCtx)
  const preloadLinks = renderPreLoadLinks(renderCtx.modules, manifest)

  return { renderedHtml, preloadLinks }
}

const renderPreLoadLinks = (
  modules: undefined | string[],
  manifest: Record<string, string[]>
): string => {
  let links = ''
  const seen = new Set()
  if (modules === undefined) throw new Error()
  modules.forEach((module) => {
    console.log(modules, module, manifest[module])
    const files = manifest[module]
    if (files) {
      files.forEach((file) => {
        console.log(seen, file, links)
        if (!seen.has(file)) {
          seen.add(file)
          links += renderPreLoadLink(file)
        }
      })
    }
  })
  return links
}

const renderPreLoadLink = (file: string): string => {
  if (file.endsWith('.js')) {
    return `<link rel="modulepreload" crossorigin href="${file}">`
  } else if (file.endsWith('.css')) {
    return `<link rel="stylesheet" href="${file}">`
  } else {
    return ''
  }
}