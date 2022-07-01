import { createApp } from './main'
import createMyRouter from '@/routes'

const router = createMyRouter('client')
const { app } = createApp()

app.use(router)

router.isReady().then(() => {
  app.mount('#app', true)
})
