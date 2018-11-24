const Koa = require('koa')
const Router = require('koa-router')
const config = require('./config/config')
const { initSchemas, connect } = require('./app/database/init')

;(async () => {
  await connect(config.db)

  initSchemas()
  // 生成服务器实例
  const app = new Koa()
  const router = new Router()
  require('./config/routes')(router)

  app.use(router.routes()).use(router.allowedMethods())

  app.listen(config.port)
  console.log('Listen: ' + config.port)
})()
