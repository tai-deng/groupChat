//app.js
import {set} from './utils/cache.js'
import {network} from './utils/ajax.js'
App({
  onLaunch: function (e) {
    // 登录
    // wx.login({
    //   success: res => {
    //     set('code',res.code)
    //     this.init(res.code)
    //   }
    // })
  },
  init(code){
    let arg = wx.getLaunchOptionsSync();
    let scene = arg.scene;    // 场景
    let inviter = 0;                  // 邀请人
    let roomid = 0;                 // 聊天室
    if (arg.query['inviter']) {
      inviter = arg.query['inviter'];
    }
    if (arg.query['roomid']) {
      roomid = arg.query['roomid'];
    }
    this.globalData.roomid = roomid;
    this.globalData.inviter = inviter;
    network.post('login.do',{
      code,
      scene,
      inviter,
      roomid,
    }).then((res)=>{
      if(typeof this.callback == 'function'){
        this.callback(res)
      }
    })
  },
  callback:function(){},
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
    userInfo: null,
    roomid: null,
    inviter: null,
  },
})