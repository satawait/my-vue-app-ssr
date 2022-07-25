export default {
  baseUrl: {
    dev: 'http://localhost:9000/api/',
    prod: import.meta.env.SSR ? 'http://nodeServer:4004' : 'http://localhost:4004' // docker容器中
  }
}
