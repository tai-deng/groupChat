//app.js
import {set} from './utils/cache.js'
App({
  onLaunch: function (e) {
    // 登录
    wx.login({
      success: res => {
        set('code',res.code)
        set('scene',e.scene)
      }
    })
  },
  getUserInfo: function(cb){
    if (this.globalData.userInfo){
      cb(this.globalData.userInfo);
    } else {
      // 获取用户信息
      wx.getUserInfo({
        success: res => {
          this.globalData.userInfo = res.userInfo;
          console.log(2,res)
          cb(res.userInfo);
        }
      })
    }
  },
  globalData: {
    userInfo: null
  },
})