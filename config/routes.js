const Wechat = require('../app/controllers/wechat')
const User = require('../app/controllers/user')
module.exports = router => {
  router.get('/sdk', Wechat.sdk)
  // 用户的登陆注册
  router.get('/user/signup', User.signup)
  router.get('/user/signin', User.signin)
  router.post('/user/signup', User.signup)
  router.post('/user/signin', User.signin)
  router.post('/logout', User.logout)
  // 进入微信消息中间件
  router.get('/wx-hear', Wechat.hear)
  router.post('/wx-hear', Wechat.hear)

  // 跳到授权中间服务页面
  router.get('/wx-oauth', Wechat.oauth)
  // 通过 code 获取用户信息
  router.get('/userinfo', Wechat.userinfo)
}
