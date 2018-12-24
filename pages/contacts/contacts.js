// pages/contacts/contacts.js
Page({
  data: {
    tab:1,
    list1:[
      {pic:'../imgs/chat/pic.jpg',title:'旷斌',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
      {pic:'../imgs/chat/pic.jpg',title:'旷斌',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
      {pic:'../imgs/chat/pic.jpg',title:'旷斌',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
    ],
    list2:[
      {pic:'../imgs/chat/pic.jpg',title:'旷斌--qun',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
      {pic:'../imgs/chat/pic.jpg',title:'旷斌--qun',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
      {pic:'../imgs/chat/pic.jpg',title:'旷斌--qun',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的'},
    ],
  },
  onLoad: function (options) {
    let list = this.data.list1;
    this.setData({list})
  },
  onTab(e){
    let tab = e.currentTarget.dataset.i;
    let list = [];
    if(tab == '1'){
      list = this.data.list1
    }else if(tab == '2'){
      list = this.data.list2
    }
    this.setData({tab,list})
  },
  // 进入聊天
  onChat(e){
    wx.navigateTo({
      url: '../index/chat/chat'
    })
  },
  // 菜单路由
  onRouter(e){
    let router = e.currentTarget.dataset.r;
    if(router == 'mute'){
      wx.navigateTo({
        url:'/pages/index/group/group?tag=group'
      })
    }else if(router == 'add'){
      this.sharFriend();
    }
    this.setData({menuShow:false})
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