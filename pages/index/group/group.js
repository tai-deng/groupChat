// pages/index/group/group.js
import {preview} from '../../../utils/util.js'
import network from '../../../utils/ajax.js'
import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
Page({
  data: {
    clue:'',
    data:[
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
      {pic:'../../imgs/chat/image.png',title:'鸡蛋供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:1},
      {pic:'../../imgs/chat/image.png',title:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:2},
      {pic:'../../imgs/chat/image.png',title:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',checked:false,id:3},
    ],
    page:1,
    limit:30,
  },
  onLoad: function (options) {
    this.init(options);
  },
  // 初始化
  init(options){
    let user = cache.get('userInfo');
    let isGroup = null;
    if(user){
      isGroup = cache.get('userInfo').userInfo.create_group;
      if(isGroup){
        if (options.tag == 'group') {
          wx.setNavigationBarTitle({
            title: '新建'
          })
        }else {
          wx.setNavigationBarTitle({
            title: '设置'
          })
          network.get(`group/${options.id}.get`,{})
          .then((res)=>{
            if(res.code == '0'){
              this.setData({groupData: res.data.group,title: res.data.group.gname,notice: res.data.group.gintro});
            }
          })
        }
      }else{
        wx.setNavigationBarTitle({
          title: options.title
        })
      }
      network.get('group/user.list',{
        tm: new Date().getTime(),
        page: this.data.page,
        limit: this.data.limit,
        gid: options.id
      })
      .then((res)=>{
        if(res.code == '0'){
          // this.setData({});
          console.log(res)
        }
      })
    }
    this.setData({tag: options.tag,isGroup})
  },
  // 确定提交数据
  formSubmit(e) {
    if(this.data.tag == 'group'){
      let name = e.detail.value.title.trim();
      let intro = e.detail.value.notice.trim();
      if(name && intro){
        network.post('group/create.do',{
          tm: new Date().getTime(),
          name,
          intro})
        .then((res)=>{
          console.log(res)
        })
      }else{
        if(!intro){
          util.toast('群公告不能为空！')
        }
        if(!name){
          util.toast('群名称不能为空！')
        }
        this.setData({title:name,intro})
      }
    }else if(this.data.isGroup){

    }
    console.log('提交成功！',e)
  },
  // checkbox
  checkboxChange(e) {
    let arr = e.detail.value;
    let clue = `已选择${arr.length}个人`
    this.setData({clue})
    console.log(e)
  },
  // 二维码预览
  onPreview(e){
    let pic = '../../imgs/chat/image.png'
    let arr = [pic];
    preview(arr,pic)
  },
  // 上传图片转base64
  bindupload(){
    let upload = '';
    let that = this;
    let bs64 = '';
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success (res) {
        let poth = res.tempFilePaths[0];
        wx.getImageInfo({
          src: poth,
          success: function(res){
            var ctx = wx.createCanvasContext('my_canvas');
            var ratio = 3;
            var canvasWidth = res.width
            var canvasHeight = res.height;
            while (canvasWidth > 200 || canvasHeight > 200){
              canvasWidth = Math.trunc(res.width / ratio)
              canvasHeight = Math.trunc(res.height / ratio)
              ratio++;
            }
            that.setData({
              canvasWidth: canvasWidth,
              canvasHeight: canvasHeight
            })
            ctx.drawImage(poth, 0, 0, canvasWidth, canvasHeight)
            ctx.draw()

            setTimeout(function(){
              wx.canvasToTempFilePath({
                canvasId: 'my_canvas',
                success: function (res) {
                  upload = res.tempFilePath;
                  wx.uploadFile({
                    url: 'https://example.weixin.qq.com/upload',
                    filePath: upload,
                    name: 'image',
                    formData: {
                      user: 'upload'
                    },
                    success(res) {
                      that.setData({upload})
                      console.log(res)
                    }
                  })
                  // wx.getFileSystemManager().readFile({
                  //   filePath: res.tempFilePath,
                  //   encoding:'base64',
                  //   success: res => {
                  //     bs64 = 'data:image/jpg;base64,'+res.data;
                  //     that.setData({bs64,upload})
                  //   }
                  // })
                },
                fail: function (error) {
                  console.log(error)
                }
              })
            },100)

      }})
      }
    })
  },
  // 删除图片
  delimg(e){
    let upload = this.data.upload;
    let bs64 = this.data.bs64;
    let i = Number(e.target.dataset.i);
    util.showModal('删除!','确定要删除照片吗？',true,(e)=>{
      upload.splice(i,1)
      bs64.splice(i,1)
      this.setData({upload,bs64})
    })
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