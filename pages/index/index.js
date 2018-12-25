//index.js
//获取应用实例
import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    tab:1,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data1:[
      {pic:'../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate(),id:1},
      {pic:'../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate(),id:2},
      {pic:'../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate(),id:3},
    ],
    dataa:[
      {pic:'../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
      {pic:'../imgs/chat/image.png',title:'牛肉竞价',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
      {pic:'../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',time:util.nowDate()},
    ],
    datab:[
      {pic:'../imgs/chat/image.png',title:'鸡蛋竞价',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
      {pic:'../imgs/chat/image.png',title:'牛肉竞价',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
      {pic:'../imgs/chat/image.png',title:'大米竞价',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
    ],
    searchSta:false,
  },
  onLoad: function () {
    this.getUserInfoInit();
    let data = this.data.data1;
    this.setData({data})
  },
  // tab 菜单切换
  onTab(e){
    let tab = e.currentTarget.dataset.i;
    let data = [];
    if(tab == '1'){
      data = this.data.data1;
    }else if(tab == '2'){
      data = this.data.datab;
    }
    this.setData({tab,data})
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
    let title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: `./chat/chat?title=${title}`
    })
  },
  // 授权用户信息
  getUserInfoInit() {
    if (cache.get('userInfo')) {
      this.setData({
        userInfo: cache.get('userInfo'),
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
          cache.set('userInfo',res.userInfo)
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
    cache.set('userInfo', e.detail.userInfo);
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  // 会话设置
  onLongpress(e) {
    let id = e.currentTarget.dataset.id;
    let data = this.data.data;
    let i = e.currentTarget.dataset.i;
    util.showModal('提示', '要修改该会话吗？', true, () => {
        wx.navigateTo({
          url:'/pages/index/group/group?tag=chat'
        })
    })
  },
  onShareAppMessage: function () {

  }
})
