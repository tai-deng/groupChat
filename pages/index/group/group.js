// pages/index/group/group.js
import {preview} from '../../../utils/util.js'
import {network,upFile} from '../../../utils/ajax.js'
import util from '../../../utils/util.js'
import cache from '../../../utils/cache.js'
const _ = require('../../../utils/lodash.get/index.js');
Page({
  data: {
    clue:'',
    data:[
      {avatar:'../../imgs/chat/image.png',nickname:'牛肉供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',group_user:0,friend_id:'01'},
      {avatar:'../../imgs/chat/image.png',nickname:'大米供应',cont:'这里是最后一次的聊天内容,就是有点长了，用来测试的',group_user:0,friend_id:'02'},
    ],
    page:1,
    limit:30,
    flag:true,
    friendPage: 0,
    gid:'',
    allFid:[],
    addFid:'',
    minusFid:'',
    pickFid:[],
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
          this.getData();
        }else {
          wx.setNavigationBarTitle({
            title: '设置'
          })
          network.get(`group/${options.id}.get`,{})
          .then((res)=>{
            if(res.code == '0'){
              if(res.data.group){
                let data = res.data.group;
                this.setData({gid: options.id,groupData: data,title: data.gname,notice: data.gintro,pic: data.gcover});
                this.getData();
              }
            }
          })
        }
      }else{
        wx.setNavigationBarTitle({
          title: options.title
        })
        network.get(`group/${options.id}.get`,{})
        .then((res)=>{
          if(res.code == '0'){
            if(res.data.group){
              let data = res.data.group;
              this.setData({gid: options.id,groupData: data,title: data.gname,notice: data.gintro,pic: data.gqrcode});
              this.getData();
            }
          }
        })
      }
    }
    this.setData({tag: options.tag,isGroup})
  },
  // 获取好友列表
  getData(){
    let url = 'user/friend.list';
    let tm = new Date().getTime();
    let limit = this.data.limit;
    let pageData = [];
    let flag = this.data.flag;
    let gid = this.data.gid;
    let allFid = this.data.allFid;

    if(flag){
      let page = this.data.friendPage+ 1;
      network.get(url,{tm,page,limit,gid})
      .then((res)=>{
        if(res.code == '0'){
          let list = res.data.list;
          pageData = this.data.data.concat(res.data.list);
          if(list.length < limit){
            flag =false;
          }
          if(pageData.length > 0){
            pageData.forEach(element => {
              if(element.group_user){
                allFid.push(element.friend_id)
              }
            });
          }
          this.setData({data: pageData,flag,friendPage: page,allFid})
        }
      })
    }else{
      if(pageData.length > 0 && pageData.length < this.data.limit){
        util.toast('加载完毕')
      }
    }
  },
  // 提交数据
  formSubmit(e) {
    if(this.data.isGroup){
      if(this.data.tag == 'group'){
        let name = e.detail.value.title.trim();
        let intro = e.detail.value.notice.trim();
        let asset_file = this.data.asset_file;
        let cover = this.data.pic;
        let friends = this.data.allFid.join(',');
        if(name && intro && asset_file){
          network.post('group/create.do',{
            tm: new Date().getTime(),
            name,
            intro,asset_file,cover,friends})
          .then((res)=>{
            util.showModal('提示',"创建成功",false,()=>{
              wx.switchTab({
                url:'/pages/index/index'
              })
            })
          })
        }else{
          if(!asset_file){
            util.toast('请上传群图片！')
          }
          if(!intro){
            util.toast('群公告不能为空！')
          }
          if(!name){
            util.toast('群名称不能为空！')
          }
          this.setData({title:name,intro})
        }
      }else {
        this.setUpDate()
      }
    }
  },
  // checkbox
  checkboxChange(e) {
    let pickFid = e.detail.value;
    let clue = `已选择${pickFid.length}个人`;
    let allFid = this.data.allFid;
    let addFid = [];
    let minusFid = [];
    let a =_.difference(allFid,'01')
    console.log(a,allFid,pickFid)
    this.setData({clue,pickFid})
  },
  // 更新设置
  setUpDate(){
    let name = e.detail.value.title.trim();
    let intro = e.detail.value.notice.trim();
    let asset_file = this.data.asset_file;
    let cover = this.data.pic;
    let gid = this.data.gid;
    // 更新群信息
    if(name && intro && cover){
      network.post('group/update.do',{
        tm: new Date().getTime(),
        name,
        intro,
        asset_file,
        cover,
        gid
      })
      .then((res)=>{
        util.showModal('提示',"修改成功",false,()=>{
          wx.switchTab({
            url:'/pages/index/index'
          })
        })
      })
    }else{
      if(!cover){
        util.toast('请上传群图片！')
      }
      if(!intro){
        util.toast('群公告不能为空！')
      }
      if(!name){
        util.toast('群名称不能为空！')
      }
      this.setData({title:name,intro})
    }
    // 加人
    let allFid = this.data.allFid;
    let pickFid = this.dtaa.pickFid;
    if(name && intro && cover){
      network.post('/group/user/add.do',{
        tm: new Date().getTime(),
        name,
        intro,
        asset_file,
        cover,
        gid
      })
      .then((res)=>{
        util.showModal('提示',"修改成功",false,()=>{
          wx.switchTab({
            url:'/pages/index/index'
          })
        })
      })
    }else{
      if(!cover){
        util.toast('请上传群图片！')
      }
      if(!intro){
        util.toast('群公告不能为空！')
      }
      if(!name){
        util.toast('群名称不能为空！')
      }
      this.setData({title:name,intro})
    }
    // 减人
  },
  // 二维码预览
  onPreview(e){
    let pic = '../../imgs/chat/image.png';
    if(this.data.pic){
      pic = this.data.pic;
    }
    let arr = [pic];
    preview(arr,pic)
  },
  // 上传图片
  bindupload(){
    let upload = '';
    let that = this;
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
                  upFile('upload/image.do',upload)
                  .then((res)=>{
                    let r = JSON.parse(res)
                    if(r.code == '0'){
                      that.setData({pic:r.data.asset.asset_url,asset_file: r.data.asset.asset_file})
                      console.log(r.data.asset.asset_url);
                    }
                  })
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
    let i = Number(e.target.dataset.i);
    util.showModal('删除!','确定要删除照片吗？',true,(e)=>{
      upload.splice(i,1)
      this.setData({upload})
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
    this.getData();
  },
})