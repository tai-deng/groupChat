//index.js
//获取应用实例
import util from '../../utils/util.js'
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data:[
      {pic:'../imgs/chat/pic.jpg',title:'旷斌',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
      {pic:'../imgs/chat/pic.jpg',title:'旷斌',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
      {pic:'../imgs/chat/pic.jpg',title:'旷斌',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
    ],
    dataa:[
      {pic:'../imgs/chat/pic.jpg',title:'旷斌--搜索',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
      {pic:'../imgs/chat/pic.jpg',title:'旷斌--搜索',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
      {pic:'../imgs/chat/pic.jpg',title:'旷斌--搜索',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
    ],
    searchSta:false,
  },
  onLoad: function () {
    this.getUserInfoInit();
  },
  // 菜单
  onMenu(e){
    let menuShow = !this.data.menuShow;
    this.setData({menuShow})
  },
  // 菜单路由
  onRouter(e){
    let router = e.currentTarget.dataset.r;
    if(router == 'mute'){
      wx.navigateTo({
        url:'/pages/index/group/group'
      })
    }else if(router == 'add'){
      this.sharFriend();
    }
    this.setData({menuShow:false})
  },
  // from 表单提交 搜索
  form(e){
    let fromId = e.detail.formId;
    // 搜索内容
    let searchcnt = e.detail.value.search;
    let searchSta = this.data.searchSta;
    if(!searchSta && searchcnt){
      searchSta = true;
    }
    this.setData({searchSta})
    console.log(e)
  },
  // 关闭搜索
  onSearchV(e){
    let v = e.detail.value;
    if(!v){
      this.setData({searchSta:false})
    }
  },
  // 取消授权
  onCancel(e){
    console.log(e)
    this.setData({hasUserInfo:true})
  },
  // 进入聊天
  onChat(e){
    wx.navigateTo({
      url: './chat/chat'
    })
  },
  // 授权用户信息
  getUserInfoInit(){
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  // 获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {

  }
})
