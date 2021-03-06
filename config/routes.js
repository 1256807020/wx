const Wechat = require('../app/controllers/wechat')
const User = require('../app/controllers/user')
const Index = require('../app/controllers/index')
const Category = require('../app/controllers/category')
const Movie = require('../app/controllers/movie')
module.exports = router => {
  router.get('/', Index.homePage)
  router.get('/sdk', Wechat.sdk)
  // 用户的登陆注册
  router.get('/user/signup', User.showSignup)
  router.get('/user/signin', User.showSignin)
  router.post('/user/signup', User.signup)
  router.post('/user/signin', User.signin)
  router.get('/logout', User.logout)
  // 后台的用户列表页面
  router.get('/admin/user/list', User.signinRequired, User.adminRequired, User.list)
  // 后台的分类管理页面
  router.get('/admin/category', User.signinRequired, User.adminRequired, Category.show)
  router.post('/admin/category', User.signinRequired, User.adminRequired, Category.new)
  router.get('/admin/category/list', User.signinRequired, User.adminRequired, Category.list)
  router.get('/admin/category/update/:_id', User.signinRequired, User.adminRequired, Category.show)
  // 后台的电影管理页面
  router.get('/admin/movie', User.signinRequired, User.adminRequired, Movie.show)
  router.post('/admin/movie', User.signinRequired, User.adminRequired, Movie.new)
  router.get('/admin/movie/list', User.signinRequired, User.adminRequired, Movie.list)
  router.get('/admin/movie/update/:_id', User.signinRequired, User.adminRequired, Movie.show)
  router.delete('/admin/movie', User.signinRequired, User.adminRequired, Movie.del)
  // 进入微信消息中间件
  router.get('/wx-hear', Wechat.hear)
  router.post('/wx-hear', Wechat.hear)

  // 跳到授权中间服务页面
  router.get('/wx-oauth', Wechat.oauth)
  // 通过 code 获取用户信息
  router.get('/userinfo', Wechat.userinfo)
}
