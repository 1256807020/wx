const Koa = require('koa')
const Router = require('koa-router')
const config = require('./config/config')
const { resolve } = require('path')
const bodyParser = require('koa-bodyparser')
const session = require('koa-session')
const mongoose = require('mongoose')
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
    app.keys = ['imooc']
    app.use(session(app))
    app.use(bodyParser())
    // 登陆成功后，依据nickname是否存在来显示登陆注册还是欢饮您
    app.use(async (ctx, next) => {
      const User = mongoose.model('User')
      let user = ctx.session.user

      if (user && user._id) {
        user = await User.findOne({ _id: user._id })
        if (user) {
          ctx.session.user = {
            _id: user._id,
            role: user.role,
            nickname: user.nickname
          }
          ctx.state = Object.assign(ctx.state, {
            user: {
              _id: user._id,
              nickname: user.nickname
            }
          })
        }
      } else {
        ctx.session.user = null
      }

      await next()
    })
    require('./config/routes')(router)

    app.use(router.routes()).use(router.allowedMethods())

    app.listen(config.port)
    console.log('Listen: ' + config.port)
  })()
