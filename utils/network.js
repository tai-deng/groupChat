/**
 * @Author Jintao Wu
 * @Date 2018/7/30
 * @Description: 请求封装 测试地址： http://47.52.106.40:5556/ 正式地址： https://ezeeship.com/api2/
 */
var GETWAY_URL = 'https://ezeeship.com/api2/'

var API_URL = GETWAY_URL + 'ezeeship'
// GET请求
function GET (url, params, message, config) {
  return request(url, params, message, config, 'GET')
}
// POST请求
function POST (url, params, message, config) {
  return request(url, params, message, config)
}
// 成功提示框
function success (message = '成功') {
  wx.showToast({
    title: message,
    icon: 'success',
    duration: 1500
  })
}
// 错误提示框
function prompt (message = '失败') {
  wx.showToast({
    title: message,
    image: '../../static/image/prompt.png',
    duration: 1500
  })
}
// 提示框
function showModal (obj) {
  wx.showModal({
    title: obj.title,
    content: obj.content,
    showCancel: false,
    success: function (res) {
      if (res.confirm) {
        console.log('用户点击确定')
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}
function request (url, params = {}, message = '加载中...', config, method = 'POST') {
  let time = setTimeout(() => { // 请求时常大于 0.5 秒显示 loading 提示框
    if (message) {
      wx.showLoading({
        title: message
      })
    }
  }, 500)
  return new Promise((resolve, reject) => {
    let header = {
      'Content-Type': 'application/json;charset=UTF-8',
      'accessToken': getApp().globalData.accessToken,
      'ezeeship-user-agent': 'weixin'
    }
    wx.request(Object.assign(config || {}, {
      url: API_URL + url,
      data: params,
      header: header,
      method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function (res) {
        resolve(res)
      },
      fail: function (...args) {
        Reflect.apply(reject, reject, args)
      },
      complete: function () {
        // 接口调用完成后
        clearTimeout(time)
        if (message) {
          wx.hideLoading()
        }
      }
    }))
  })
}

var network = {
  get: GET,
  post: POST,
  success: success,
  prompt: prompt,
  showModal: showModal,
  getWayUrl: GETWAY_URL
}
export default network
