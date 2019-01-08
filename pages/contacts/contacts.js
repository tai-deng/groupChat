// pages/contacts/contacts.js
import {get} from '../../utils/cache.js'
Page({
  data: {
    isGroup:false,
  },
  onLoad: function (options) {
    this.init();
  },
  // 初始化
  init(){
    let user = get('userInfo');
    if(user){
      let isGroup = get('userInfo').userInfo.create_group;
      this.setData({isGroup})
    }
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
  onShareAppMessage: function () {

  }
})