const { getOAuth, getWechat } = require('../../wechat/index')
const util = require('../../wechat-lib/util')
exports.getSignature = async (url) => {
  const client = getWechat()
  const data = await client.fetchAccessToken()
  const token = data.access_token
  const ticketData = await client.fetchTicket(token)
  const ticket = ticketData.ticket

  let params = util.sign(ticket, url)
  params.appId = client.appID

  return params
}
exports.getAuthorizeURL = (scope, target, state) => {
  const oauth = getOAuth()
  const url = oauth.getAuthorizeURL(scope, target, state)

  return url
}
exports.getUserinfoByCode = async (code) => {
  const oauth = getOAuth()
  const data = await oauth.fetchAccessToken(code)
  const userData = await oauth.getUserInfo(data.access_token, data.openid)

  return userData
}
