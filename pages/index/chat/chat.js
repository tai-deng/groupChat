//index.js
//获取应用实例
import cache from '../../../utils/cache.js'
import util from '../../../utils/util.js'
import websocket from '../../../utils/socket.js'
import {network,upFile} from '../../../utils/ajax.js'

const app = getApp();
const { emojis, emojiToPath, textToEmoji } = require('../../../utils/emojis');
// let inputHeight = 51;
// let emojiHeight = 171;
const timeouts = [];
// let windowHeight;

Page({
  data: {
    userInfo: {},
    emojiList: [],
    showEmojis: false,
    showFiles: false,
    sysInfo: {},
    scrollHeight: '0',
    scrollTop: 9999,
    msg: '',
    chatList: [],
    limit: 50,
    page: 0,
    type:'1', // 1 文字 2 图片 3 语音
    isSpeaking:false,
    j:1,
    maxUnum:1,
    inputHeight: 51,
    emojiHeight: 171,
    windowHeight:'',
  },
  onLoad: function (op) {
    this.init(op)
    // 获取表情包
    const emojiList = Object.keys(emojis).map(key => ({
      key: key,
      img: emojiToPath(key)
    }))
    // 获取屏幕高度信息
    const sysInfo = wx.getSystemInfoSync()
    let ratio = 750 / sysInfo.windowWidth;
    let windowHeight = sysInfo.windowHeight * ratio;
    let inputHeight = this.data.inputHeight * ratio;
    let emojiHeight = this.data.emojiHeight * ratio;
    const scrollHeight = `${windowHeight - inputHeight}rpx`;
    // 更新状态
    this.setData({
      emojiList,
      scrollHeight,windowHeight,inputHeight,emojiHeight
    })
    this.getData()
  },
  onPull() {
    if(this.data.pull){
      this.getData("p")
    }
  },
  // 获取历史消息
  getData(p) {
    let gid = this.data.gid;
    let to_uid = this.data.to_uid;
    let type = to_uid ? 1 : 2; 
    let relate_id = this.data.id;
    let page = this.data.page + 1;
    let meId = cache.get('userInfo').userInfo.uid;
    let limit= this.data.limit;
    let pull = true;
    network.get("chat.list", {
      tm: new Date().getTime(),
      type,
      relate_id,
      page,
      limit,
    })
    .then((res) => {
      // wx.stopPullDownRefresh();
      if (res.code == '0') {
        let { chatList } = this.data;
        let d = res.data.list;
        if (d.length > 0) {
          d.forEach(el => {
            let obj = new Object();
            obj.msg_type= String(el.type);
            obj.isMe= false;
            obj.avatar= el.from_user.avatar;
            obj.nickname= el.from_user.nickname;
            obj.msg_text= el.content;
            obj.chat_id= el.chat_id;
            obj.chat_tm= util.nowDate(el.chat_tm);
            if (gid) {
              if (meId == el.from_uid) {
                obj.isMe = true;
              }
            } else {
              if (meId == el.from_user.uid) {
                obj.isMe = true;
              }
            }
            if(el.type == '1'){
              obj.text_list= textToEmoji(el.content);
            }else if(el.type == '2'){
              if(el.extend){
                let ex= JSON.parse(el.extend)
                obj.msg_image= { src:el.content, width:ex.width, height:ex.height }
              }
            } else if (el.type == '3') {
              if (el.extend) {
                let ms = JSON.parse(el.extend);
                obj.msg_audio= { src:el.content, ms:ms.ms }
              }
            }
            chatList.unshift(obj)
          });
          if(d.length> 0 && d.length < limit){
            pull= false;
          }
          this.setData({chatList,page,pull})
          if(!p)
          this.goBottom(50);
        }
      }
    })
  },
  onUnload: function () {
    // 清除定时器
    timeouts.forEach(item => {
      clearTimeout(item)
    })
  },
  // 初始化数据
  init(op){
    if(op.title){
      util.setTitle(op.title)
    }
    let gid = op['gid'] ? op['gid'] : '';
    let to_uid = op['to_uid'] ? op['to_uid'] : '';
    let unum = op['unum'] ? op['unum'] : '';
    if(unum!=''){
      unum=Number(unum)
    }
    let id = op['id'];
    let client_id = cache.get('client_id');
    this.setData({
      userInfo:cache.get('userInfo').userInfo,
      gid,
      to_uid,
      id,
      client_id,
      title:op.title,
      unum,
    })
    this.msg= '';
    this.manger = wx.getRecorderManager();
    this.manger.onStop(this.onVoice)
    this.manger.onInterruptionBegin((res)=> {
      console.log('被中断')
      this.speaking(false)
    })
    this.bgmanger = wx.createInnerAudioContext();
  },
  // 滚动聊天
  goBottom: function (n = 0) {
    timeouts.push(setTimeout(() => {
      this.setData({
        scrollTop: 9999
      })
    }, n))
  },
  // 隐藏表情选择框
  hideEmojis: function () {
    this.setData({ showEmojis: false });
  },
  // 隐藏或显示表情选择框
  toggleEmojis: function () {
    const { showEmojis, showFiles,windowHeight,inputHeight,emojiHeight } = this.data;
    if (showFiles) {
      this.setData({
        showEmojis: true,
        showFiles: false
      });
    } else {
      if (showEmojis) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight}rpx`,
          showEmojis: !showEmojis
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight}rpx`,
          showEmojis: !showEmojis
        });
        this.goBottom(50);
      }
    }
  },
  // 隐藏或显示图片选择框
  toggleFiles: function () {
    const { showEmojis, showFiles,windowHeight,inputHeight,emojiHeight } = this.data;
    if (showEmojis) {
      this.setData({
        showEmojis: false,
        showFiles: true
      });
    } else {
      if (showFiles) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight}rpx`,
          showFiles: !showFiles
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight}rpx`,
          showFiles: !showFiles
        });
        this.goBottom(50);
      }
    }
  },
  inputFocus: function () {
    const { showEmojis, showFiles,windowHeight,inputHeight,emojiHeight } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight-emojiHeight}rpx`,
        showEmojis: false,
        showFiles: false,
      });
    }
    this.setData({focus:true})
    this.goBottom(50)
  },
  inputMsg: function(e){
    //
  },
  blurInput: function (e) {
    this.msg = e.detail.value;
    this.setData({focus:false})
  },
  // @名字
  onCopyName(e) {
    let msg = '@' + e.currentTarget.dataset.name+" ";
    this.msg = msg
    this.setData({ msg ,msgFocus:true})
  },
  // 点击滚动框
  scrollClick: function () {
    const { showEmojis, showFiles,windowHeight,inputHeight,emojiHeight } = this.data;
    // if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight}rpx`,
        showEmojis: false,
        showFiles: false,
      });
    // }
    this.goBottom(50)
  },
  // 点击表情
  clickEmoji: function (e) {
    const { key } = e.currentTarget.dataset;
    this.msg= this.msg + key;
    this.setData({msg:this.msg})
  },
  // 发送信息
  sendMsg: function (e, type = '1') {
    let { windowHeight, inputHeight, emojiHeight } = this.data;
    let msg = this.msg;
    if (!msg) {
      return
    }
    let form_id = '';
    let agrs = '';
    if(e){
      form_id = util.reSpace(e.detail.formId);
    }
    if (this.data.gid) {
      agrs= {
        action: 'send_to_group',
        gid: this.data.gid,
        type,
        content: msg,
        form_id,extend:''
      }
    } else {
      agrs={
        action: 'send_to_friend',
        to_uid: this.data.to_uid,
        type,
        content: msg,
        form_id,extend:''
      }
    }
    if(type == '2'){
      let width= this.data.width;
      let height= this.data.height;
      agrs = Object.assign({},agrs,{extend:JSON.stringify({width,height})})
    }
    if(type == '3'){
      let ms= this.data.ms;
      agrs = Object.assign({},agrs,{extend:JSON.stringify({ms})})
    }
    this.pushDo(agrs, (res) => {
      if (res.code == '0') {
        this.setData({type,msg:'',showEmojis:false})
        this.scrollClick();
        this.msg = '';
      }else{
        util.toast(res.msg)
      }
    });
  },
  pushDo(arg,cb) {
    network.post('push.do',Object.assign({}, {
      action:'',			//必传
      client_id:'',		//可选	socket链接成功时返回
      type:'',			//可选	1文字 2图片 3语音
      content:'',			//可选	发送内容
      to_uid:0,			//可选	好友id
      gid:0,				//可选	群id
      form_id:''			//可选
    },arg),'正在发送')
      .then((res) => {
        if (typeof cb == 'function') {
          cb(res);
        }
    })
  },
  // 发送图片
  sendPic: function (e) {
    let { windowHeight, inputHeight, emojiHeight } = this.data;
    const that = this
    let type = 2;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        const src = res.tempFilePaths[0]
        wx.getImageInfo({
          src,
          success: function (info) {
            const { width, height } = info
            upFile('upload/image.do',src)
            .then((res)=>{
              if(!res){
                return false;
              }
              let r = JSON.parse(res)
              if(r.code == '0'){
                that.msg = r.data.asset.asset_url;
                that.setData({width,height,showFiles:false,showEmojis:false})
                that.sendMsg('',type)
              }else{
                util.toast(r.msg)
              }
            })
          }
        })
      }
    })
  },
  // 语音-手指按下
  touchStartSilk(e) {
    if (app.globalData.isAuth) {
      this.timerTouch= setTimeout(()=> {
        this.touchUpSilk()
        clearTimeout(this.timerTouch)
      }, 10000)
      this.speaking(true)
    } else {
      this.isAuth()
    } 
  },
  // 语音授权判断
  isAuth() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success(res) {
              app.globalData.isAuth = true;
            }, fail(res) {
              app.globalData.isAuth = false;
              util.showModal('提示','需要授权录音权限',true,(res)=>{
                wx.openSetting({
                  success(res) {
                    if (res.authSetting['scope.record']) {
                      app.globalData.isAuth = true;
                    }
                  }
                })
              })
            }
          })
        } else {
          app.globalData.isAuth = true;
        }
      }
    })
  },
  // 语音-手指抬起 上传文件
  touchUpSilk() {
    if (this.timerTouch) {
      this.speaking(false)
      clearTimeout(this.timerTouch)
    }
  },
  // 语音-发送
  onVoice(res) {
    let ms = Math.round(res.duration/1000);
    let file = res.tempFilePath;
    if (ms) {
      upFile('upload/voice.do', file)
        .then((res) => {
          let r = JSON.parse(res)
          this.msg = r.data.asset.asset_url;
          this.setData({ms})
          this.sendMsg('',3)
      })
    } else {
      util.toast('录音时间过短')
    }
  },
  // 播放语音
  onPlayAudio(e) {
    let sr = e.currentTarget.dataset.src;
    if (!this.bgmanger.paused) {
      this.bgmanger.stop();
    }
    console.log(this.bgmanger)
    this.bgmanger.src = sr;
    this.bgmanger.play();
  },
  // 预览图片
  previewImage: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.id]
    })
  },
  // 获取 socket 返回
  msgReceived(res){
    let d = JSON.parse(res);
    const { chatList } = this.data
    let myId = cache.get('userInfo').userInfo.uid;
    console.log('chat',d)
    if (typeof d.content == 'undefined' || typeof d.client_id != 'undefined') {
      if (typeof d.client_id != 'undefined') {
        cache.set('client_id',d.client_id)
        this.pushDo({ action: 'say_hello', client_id:d.client_id });
        let tab = to_uid?1:2;
        let id = this.data.id;
        let title =  this.data.title;
        let to_uid = this.data.to_uid;
        let gid = this.data.gid;
        let back = JSON.stringify({
          tab,id,title,to_uid,gid
        })
        wx.hideLoading({})
        wx.switchTab({
          url:`pages/index/index?back=${back}`
        })
      }
      return false;
    }
    let isMe = false;
    let uid = cache.get('userInfo').userInfo.uid;
    let obj = new Object();
    
    if (uid == d.user.uid) {
      isMe = true;
    }
    obj.msg_type= d.type;
    obj.msg_text= d.content;
    obj.nickname= d.user.nickname;
    obj.avatar= d.user.avatar;
    obj.chat_id= d.chat_id;
    obj.isMe= isMe;
    obj.chat_tm = util.nowDate(d.chat_tm);
    let pages = getCurrentPages();
    let prePage = pages[pages.length - 2];

    if (d.action == 'receive_from_friend') {
      prePage.pageDataManage('1','3',d);
      if(this.data.to_uid == d.uid || d.uid == myId){
        if(d.type == '1'){
          obj.text_list= textToEmoji(d.content);
        }else if(d.type == '2'){
          let ex= JSON.parse(d.extend)
          obj.msg_image= { src:d.content, width:ex.width, height:ex.height }
        }else if(d.type == '3'){
          let ex= JSON.parse(d.extend)
          obj.msg_audio= { src:d.content, ms:ex.ms }
        }
        chatList.push(obj)
        this.setData({chatList})
        this.goBottom(500);
      }
    }else if(d.action = 'receive_from_group'){
      prePage.pageDataManage('2','4',d);
      if(this.data.gid == d.gid){
        if(d.type == '1'){
          obj.text_list= textToEmoji(d.content);
        }else if(d.type == '2'){
          let ex= JSON.parse(d.extend)
          obj.msg_image= { src:d.content, width:ex.width, height:ex.height }
        }else if(d.type == '3'){
          let ex= JSON.parse(d.extend)
          obj.msg_audio= { src:d.content, ms:ex.ms }
        }
        chatList.push(obj)
        this.setData({chatList})
        this.goBottom(500);
      }
    }
  },
  onSeting(e) {
    let gid = this.data.gid;
    let title = this.data.title;
    if (gid) {
      wx.navigateTo({
        url:`/pages/index/group/group?tag=look&id=${gid}&title=${title}`
      })
    }
  },
  onShow: function () {
    websocket.setReceiveCallback(this.msgReceived, this);
  },
  // 话筒帧动画 
  speaking(click) {
    let isSpeaking = this.data.isSpeaking;
    isSpeaking = click;
    var i = 1;
    if (isSpeaking) {
      this.timer = setInterval(()=> {
        i++;
        i = i % 5;
        this.setData({
          j: i
        })
      }, 300);
      this.manger.start({
        duration: 60000,
        format:'mp3'
      })
    }else{
      clearInterval(this.timer)
      this.manger.stop()
    }
    this.setData({isSpeaking})
  },
  // 监听左滑删除
  onTouchMoveItem(e){
    let chat_id= e.currentTarget.dataset.chat_id;
    let type= e.type;
    let i= e.currentTarget.dataset.i;
    let {chatList} = this.data;
    let power = cache.get('userInfo').userInfo.create_group;
    let genre = e.currentTarget.dataset.genre;
    if(!e.changedTouches[0]){
      return false
    }
    if(type == 'touchstart'){
      this.start= e.changedTouches[0]['pageX'];
      this.startTime= e.timeStamp;
    }else if(type == 'touchend'){
      this.end= e.changedTouches[0]['pageX'];
      this.endTime= e.timeStamp;
    }
    if(!this.start && !this.end ){
      return
    }
    if((this.start- this.end)>100 && power){
      util.showModal('提示','是否确定删除?',true,()=>{
        network.post('chat/remove.do',{chat_id})
        .then((res)=>{
          if(res.code == '0'){
            chatList.splice(i,1);
            util.toast(res.data.message)
            this.setData({chatList})
          }else{
            util.toast(res.msg)
          }
          this.restore(1)
        })
      },()=>{
        this.restore(2)
      })
      return false;
    }else if(this.start == this.end){
      let t = e.currentTarget.dataset.content;
        if((this.endTime-this.startTime > 350)){
          util.copy(t)
          this.restore(3)
          return false;
        }else if(genre == '2'){
          util.preview([t],t)
          this.restore(4)
          return false;
        }else if(genre == '3'){
          if (!this.bgmanger.paused) {
            this.bgmanger.stop();
          }
          this.bgmanger.src = t;
          this.bgmanger.play();
        }
    }else{
      if(!power){
        util.toast('不能删除')
      }
    }
  },
  // 还原 触摸参数
  restore(s){
    this.start='';
    this.end= '';
    this.startTime= '';
    this.endTime= '';
    // console.log('调试-->'+s)
  },
})
