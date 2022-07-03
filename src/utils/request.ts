import HttpRequest from './axios'
import config from '@/config/index'
console.log(process.env.NODE_ENV, 9999)
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.prod

const request = new HttpRequest(baseUrl)

export default request
