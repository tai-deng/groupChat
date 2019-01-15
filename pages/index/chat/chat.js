//index.js
//获取应用实例
import cache from '../../../utils/cache.js'
import util from '../../../utils/util.js'
import websocket from '../../../utils/socket.js'
import {network} from '../../../utils/ajax.js'

const app = getApp();
const { emojis, emojiToPath, textToEmoji } = require('../../../utils/emojis');
const inputHeight = 51;
const emojiHeight = 171;
const timeouts = [];
let windowHeight;

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
    windowHeight = sysInfo.windowHeight
    const scrollHeight = `${windowHeight - inputHeight}px`
    // 更新状态
    this.setData({
      emojiList,
      sysInfo,
      scrollHeight,
    })
    this.getData()
  },
  // 获取历史消息
  getData() {
    let gid = this.data.gid;
    let to_uid = this.data.to_uid;
    let type = to_uid ? 1 : 2; 
    let relate_id = this.data.id;
    let page = this.data.page + 1;
    let meId = cache.get('userInfo').userInfo.uid;
    network.get("chat.list", {
      tm: new Date().getTime(),
      type,
      relate_id,
      page,
      limit: this.data.limit,
    })
    .then((res) => {
      if (res.code == '0') {
        let { chatList } = this.data;
        let d = res.data.list;
        let avatar = '';
        let nickname = '';
        if (d.length > 0) {
          d.forEach(el => {
            let isMe = false;
            if (gid) {
              avatar = el.from_user.avatar;
              nickname = el.from_user.nickname;
              if (meId == el.from_uid) {
                isMe = true;
              }
            } else {
              avatar = el.from_user.avatar;
              nickname = el.from_user.nickname;
              if (meId == el.from_user.uid) {
                isMe = true;
              }
            }
            chatList.unshift({
              msg_type:String(el.type),
              msg_text: el.content,
              text_list: textToEmoji(el.content),
              avatar,nickname,isMe
            })
          });
          console.log(chatList)
        }
        this.setData({
          chatList,list:d
        })
        this.goBottom(500);
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
    let id = op['id'];
    let client_id = cache.get('client_id');
    this.setData({
      userInfo:cache.get('userInfo').userInfo,
      gid,
      to_uid,
      id,
      client_id,
      title:op.title,
    })
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
    const { showEmojis, showFiles } = this.data;
    if (showFiles) {
      this.setData({
        showEmojis: true,
        showFiles: false
      });
    } else {
      if (showEmojis) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight}px`,
          showEmojis: !showEmojis
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight}px`,
          showEmojis: !showEmojis
        });
        this.goBottom(50);
      }
    }
  },
  // 隐藏或显示图片选择框
  toggleFiles: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis) {
      this.setData({
        showEmojis: false,
        showFiles: true
      });
    } else {
      if (showFiles) {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight}px`,
          showFiles: !showFiles
        })
      } else {
        this.setData({
          scrollHeight: `${windowHeight - inputHeight - emojiHeight}px`,
          showFiles: !showFiles
        });
        this.goBottom(50);
      }
    }
  },
  inputFocus: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight}px`,
        showEmojis: false,
        showFiles: false,
      });
    }
    this.goBottom(50)
  },
  inputMsg: function(e){
    //
  },
  blurInput: function (e) {
    this.setData({
      msg: e.detail.value
    })
    this.goBottom(50)
  },
  // 点击滚动框
  scrollClick: function () {
    const { showEmojis, showFiles } = this.data;
    if (showEmojis || showFiles) {
      this.setData({
        scrollHeight: `${windowHeight - inputHeight}px`,
        showEmojis: false,
        showFiles: false,
      });
    }
  },
  // 点击表情
  clickEmoji: function (e) {
    const { key } = e.currentTarget.dataset;
    const { msg } = this.data;
    this.setData({ msg: msg + key });
  },
  // 发送信息
  sendMsg: function (e) {
    let { msg,chatList } = this.data
    if (!msg) {
      return
    }
    let type = '1'; // 1 文字 2 图片 3 语音
    let form_id = util.reSpace(e.detail.formId);
    if (this.data.gid) {
      this.pushDo({
        action: 'send_to_group',
        gid: this.data.gid,
        type,
        content: msg,
        form_id
      }, (res) => {
        if (res.code == '0') {
          this.setData({msg:'',type,
          scrollHeight: `${windowHeight - inputHeight}px`,showEmojis:false})
          this.goBottom(500);
        }
      });
    } else {
      this.pushDo({
        action: 'send_to_friend',
        to_uid: this.data.to_uid,
        type,
        content: msg,
        form_id
      }, (res) => {
        if (res.code == '0') {
          this.setData({msg:'',type,
          scrollHeight: `${windowHeight - inputHeight}px`,showEmojis:false})
          this.goBottom(500);
        }
      });
    }
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
    },arg))
      .then((res) => {
        if (typeof cb == 'function') {
          cb(res);
        }
    })
  },
  // 发送图片
  sendPic: function (e) {
    const that = this
    const { chatList } = this.data
    let type = 2;

    wx.chooseImage({
      count: 1,
      success: function (res) {
        const src = res.tempFilePaths[0]
        wx.getImageInfo({
          src,
          success: function (res) {
            const { width, height } = res
            const newChatList = [...chatList, {
              msg_type: 'image',
              msg_image: { src, width, height }
            }]
            that.setData({ chatList: newChatList })
            // wx.setStorageSync('chatList', newChatList);
            that.goBottom(500);
          }
        })
      }
    })
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
    let avatar = '';
    let nickname = '';
    let uid = cache.get('userInfo').userInfo.uid;
    avatar = d.user.avatar;
    nickname = d.user.nickname;
    if (uid == d.user.uid) {
      isMe = true;
    }
    if(d.action == 'receive_from_friend'){
      if(this.data.to_uid == d.uid || d.uid == myId){
        chatList.push({
          msg_type:d.type,
          msg_text: d.content,
          text_list: textToEmoji(d.content),
          nickname,avatar,isMe
        })
        this.setData({chatList})
        this.goBottom(500);
      }
    }else if(d.action = 'receive_from_group'){
      if(this.data.gid == d.gid){
        chatList.push({
          msg_type:d.type,
          msg_text: d.content,
          text_list: textToEmoji(d.content),
          nickname,avatar,isMe
        })
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
})
