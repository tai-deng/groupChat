// pages/index/group/group.js

Page({
  data: {
    clue:'',
    data:[
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
    ],
  },
  onLoad: function (options) {
    if (options.tag == 'group') {
      wx.setNavigationBarTitle({
        title: '新建'
      })
    } else if (options.tag == 'chat') {
      wx.setNavigationBarTitle({
        title: '设置'
      })
    }
  },
  // 确定提交数据
  onAffirm(e) {
    console.log('提交成功！')
  },
  // checkbox
  checkboxChange(e) {
    let arr = e.detail.value;
    let clue = `已选择${arr.length}个人`
    this.setData({clue})
    console.log(e)
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