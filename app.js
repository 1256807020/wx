let Koa = require('koa'),
  router = require('koa-router')(),
  path = require('path'),
  render = require('koa-art-template'),
  static = require('koa-static'),
  session = require('koa-session'),
  sd = require('silly-datetime'),
  bodyParser = require('koa-bodyparser'),
  jsonp = require('koa-jsonp'),
  cors = require('koa-cors'),
  convert = require('koa-convert'),
  wechat = require('./wechat-lib/middleware'),
  mytoken = require('./config/token'),
  config = require('./config/config')
const { reply } = require('./wechat/reply.js')
const { initSchemas, connect } = require('./app/database/init')

  ; (async function () {
    await connect(config.db)
    initSchemas()
    // 一定要保证mongodb数据库开启
    const { test } = require('./wechat/index')
    await test()
    // 实例化
    let app = new Koa()
    app.use(wechat(mytoken, reply))
    // 配置jsonp的中间件
    app.use(jsonp())
    //配置post提交数据的中间件
    app.use(bodyParser())
    //配置session的中间件
    // koa2允许cors跨域
    app.use(cors())
    app.keys = ['some secret hurr']
    const CONFIG = {
      key: 'koa:sess',
      maxAge: 864000,
      overwrite: true,
      httpOnly: true,
      signed: true,
      rolling: true,   /*每次请求都重新设置session*/
      renew: false,
    };
    app.use(session(CONFIG, app))

    render(app, {
      root: path.join(__dirname, 'views'),
      extname: '.html',
      debug: process.env.NODE_ENV !== 'production',
      dateFormat: dateFormat = function (value) {
        return sd.format(value, 'YYYY-MM-DD HH:mm');
      } /*扩展模板里面的方法*/
    })
    // 静态资源默认目录
    app.use(convert(static(__dirname + '/public')))
    // app.use(static(__dirname + '/public'))
    // let wx = require('./routes/wx.js')
    // router.use('/wx', wx)

    app.use(router.routes())
    app.use(router.allowedMethods())
    app.listen(3000, () => {
      console.log('app is running port 3000')
    })
  })()
