// pages/contacts/contacts.js
import {get,set} from '../../utils/cache.js'
import util from '../../utils/util.js'
import {network} from '../../utils/ajax.js'
const app = getApp();
Page({
  data: {
    isGroup:false,
  },
  onLoad: function (options) {
  },
  // 初始化
  init(){
    if(app.globalData.audit){
      return
    }
    network.get('user.get',{})
    .then((res)=>{
      if(res.code == '0'){
        let user = get('userInfo');
        user.userInfo = res.data.user;
        set('userInfo',user);
        this.setData({isGroup:res.data.user.create_group})
      }
    })
  },
  // 菜单路由
  onRouter(e){
    let router = e.currentTarget.dataset.r;
    if(router == 'mute'){
      wx.navigateTo({
        url:'/pages/index/group/group?tag=group'
      })
    }
  },
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.init();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      let user = get('userInfo').userInfo;
      let inviter = user.uid;
      return {
        title: '成功平台',
        path: `/pages/index/index?inviter=${inviter}`,
        imageUrl: "../imgs/chat/logo.png",
        success: (res) => {
          util.toast("转发成功")
        },
        fail: (res) => {
          util.toast("转发失败")
        }
      }
    }else {

    }
  }
})