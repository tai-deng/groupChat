// pages/market/market.js
import {setTitle} from '../../utils/util.js'
import datas from '../../utils/datas.js'
Page({
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init(options);
  },
  // 初始化数据
  init(op){
    if(op.mark_id){
      let data={}
      datas.forEach(element => {
        if(element.id==op.mark_id){
          setTitle(element.nickname)
          data['resource']=element.resource;
          data['price']=element.price;
        }
      });
      this.setData({data})
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