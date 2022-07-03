import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  RouteRecordRaw,
  Router
} from 'vue-router'
import helloRoutes from './hello'
import todoRoutes from './todo'
import loginRoutes from './login'
import Cookies from 'js-cookie'

const routes: RouteRecordRaw[] = [...helloRoutes, ...todoRoutes, ...loginRoutes]

const createMyRouter = (): Router => {
  const router = createRouter({
    history: !import.meta.env.SSR ? createWebHistory() : createMemoryHistory(),
    routes
  })
  router.beforeEach((to, from, next) => {
    let authorization
    if (!import.meta.env.SSR) {
      authorization = localStorage.getItem('authorization')
      if (!authorization) {
        Cookies.remove('authorization')
      }
    } else {
      authorization = global.__VUE_SSR_COOKIE__
    }
    if (to.name !== 'Login' && !authorization) next({ name: 'Login' })
    else next()
  })
  return router
}

export default createMyRouter()
