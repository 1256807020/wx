const Koa = require('koa')
const Router = require('koa-router')
const config = require('./config/config')
const { resolve } = require('path')
const bodyParser = require('koa-bodyparser')
const moment = require('moment')
const { initSchemas, connect } = require('./app/database/init')

  ; (async () => {
    await connect(config.db, { useNewUrlParser: true })

    initSchemas()
    // 生成服务器实例
    const app = new Koa()
    const router = new Router()
    const views = require('koa-views')
    app.use(views(resolve(__dirname + '/app/views'), {
      extension: 'pug',
      options: {
        moment: moment
      }
    }))
    require('./config/routes')(router)

    app.use(router.routes()).use(router.allowedMethods())

    app.listen(config.port)
    console.log('Listen: ' + config.port)
  })()
