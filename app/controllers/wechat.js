const { reply } = require('../../wechat/reply')
const config = require('../../config/config')
const api = require('../api/index')
const wechatMiddle = require('../../wechat-lib/middleware')
// 接入微信消息中间件
exports.sdk = async (ctx, next) => {
  const url = ctx.href
  const params = await api.wechat.getSignature(url)
  await ctx.render('wechat/sdk', params)
}
// 接入微信消息中间件
exports.hear = async (ctx, next) => {
  const middle = wechatMiddle(config.wechat, reply)
  await middle(ctx, next)
}

exports.oauth = async (ctx, next) => {
  // const oauth = getOAuth()
  const target = config.baseUrl + 'userinfo'
  const scope = 'snsapi_userinfo'
  const state = ctx.query.id
  const url = api.wechat.getAuthorizeUrl(scope, target, state)
  ctx.redirect(url)
}

exports.userinfo = async (ctx, next) => {
  // const oauth = getOAuth()
  const code = ctx.query.code
  // const data = await api.wechat.fetchAccessToken(code)
  const userData = await api.wechat.getUserInfo(code)
  ctx.body = userData
}
