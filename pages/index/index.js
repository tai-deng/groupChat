//index.js
//获取应用实例
import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import {network} from '../../utils/ajax.js'
import websocket from '../../utils/socket.js'
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: true,
    audit:false,
    tab:1,
    limit: 50,
    friendPage: 0,
    groupPage: 0,
    isUpFri: true,
    isUpGro: true,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data1:[],
    dataa:[
      {gcover:'../imgs/chat/image.png',gname:'鸡蛋供应',gintro:'将持续更新该品类的最新价格，敬请关注！'},
      {gcover:'../imgs/chat/image.png',gname:'牛肉竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
      {gcover:'../imgs/chat/image.png',gname:'大米供应',gintro:'将持续更新该品类的最新价格，敬请关注！'},
    ],
    datab:[],
    searchSta:false,
    timeId: '',
    first:false,
  },
  onLoad: function (op) {
    this.init(op)
  },
  // 处理 back
  onBack(op){
    if(op['back']){
      let back = JSON.parse(op['back']);
      let url = '';
      if(back.tab == '1'){
        url= `./chat/chat?title=${back.title}&to_uid=${back.to_uid}&id=${back.id}`
        this.pushDo({action:'view_friend',to_uid:back.to_uid});
      }else if(back.tab == '2'){
        this.pushDo({action:'view_group',gid:back.gid});
        url= `./chat/chat?title=${back.title}&gid=${back.gid}&id=${back.id}`
      }
      wx.navigateTo({
        url
      })
    }
  },
  // socket 链接
  socketInit() {
    let time = setInterval(() => {
      if (!websocket.socketOpened) {
        websocket.setReceiveCallback(this.msgReceived, this);
        websocket.connect();
        clearInterval(time)
      } else {
        wx.showLoading({title:'网络连接中'})
      }
    }, 2000);
    network.get('config.get',{tm:new Date().getTime()})
    .then((res)=>{
      if(res.audit == 1){
        let data1 = [{avatar:'../imgs/chat/image.png',nickname:'鸡蛋供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:1},
        {avatar:'../imgs/chat/image.png',nickname:'牛肉供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:2},
        {avatar:'../imgs/chat/image.png',nickname:'大米供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:3},
        {avatar:'../imgs/chat/image.png',nickname:'鸡蛋供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:1},]
        let datab= [{gcover:'../imgs/chat/image.png',gname:'鸡蛋竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
          {gcover:'../imgs/chat/image.png',gname:'牛肉竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
          {gcover:'../imgs/chat/image.png',gname:'大米竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'}]
        this.setData({
          audit:true,
          data1,
          datab
        })
      }else{
        this.setData({audit:false})
      }
      this.getData(this.data.tab);
    })
  },
  // 用户登录
  init(op){
    wx.login({
      success: res => {
        let code = res.code
        let query = app.globalData.query;
        let scene = app.globalData.scene; // 场景
        let inviter = 0;                  // 邀请人
        let roomid = 0;                 // 聊天室
        if (query['inviter']) {
          inviter = query['inviter'];
        }
        if (query['roomid']) {
          roomid = query['roomid'];
        }
        this.setData({roomid,inviter})
        network.post('login.do',{
          code,
          scene,
          inviter,
          roomid,
        }).then((res)=>{
          if (res.code == '0') {
            this.setData({ first: true})
            if (res.data.bind_id) {
              this.setData({bind_id:res.data.bind_id,hasUserInfo:true})
            } else {
              cache.set('token', res.data.token);
              let user = cache.get('userInfo');
              user = user? user: {};
              user['userInfo'] = res.data.user;
              cache.set('userInfo',user)
              this.socketInit()
              websocket.onClose((res) => {
                app.globalData.isOk = false;
                this.socketInit()
              })
              let isOk = app.globalData.isOk;
              if(isOk && op['back']){
                let time = setInterval(()=>{
                  let isOk = app.globalData.isOk;
                  if(isOk){
                    this.onBack(op);
                    clearInterval(time)
                  }
                },500)
              }
            }
          }else if(res.code == '10001'|| res.code == '10002'){
            this.setData({hasUserInfo: true})
          }
        })
      }
    })
  },
  // 用户注册
  reg(bind_id,raw_data,signature,encrypted_data,iv){
    let scene = app.globalData.scene;    // 场景
    let inviter= this.data.inviter;// 邀请人 id
    let roomid= this.data.roomid;  // 聊天室 id
    wx.showLoading({
      title: '用户注册中',
    })
    network.post('reg.do',{
      raw_data,
      signature,
      encrypted_data,
      iv,
      scene,
      bind_id,
      inviter,
      roomid,
    }).then((res)=>{
      if (res.code == '0') {
        cache.set('token', res.data.token);
        let user = cache.get('userInfo');
        user.userInfo = res.data.user;
        cache.set('userInfo',user);
        wx.hideLoading()
        this.socketInit()
        this.getData(this.data.tab);
      }
    })
  },
  // 获取聊天
  getData(tab){
    let upd= this.data.audit;
    let url = 'user/friend.list';
    let tm = new Date().getTime();
    let page = 1;
    let limit = this.data.limit;
    let pageData = '';
    let flag = true;
    if(tab == '1'){
      url = 'user/friend.list';
      page = this.data.friendPage+ 1;
      flag = this.data.isUpFri;
    }else if(tab == '2'){
      url = 'user/group.list';
      page = this.data.groupPage+ 1;
      flag = this.data.isUpGro;
    }
    if(flag){
      network.get(url,{tm,page,limit})
      .then((res)=>{
        if(res.code == '0'){
          let list = res.data.list;
          let goon = true;
          if(tab == '1'){
            if(upd){
              pageData = this.data.data1;
              // .concat(res.data.list)
            }else{
              pageData = res.data.list;
            }
          }else if(tab == '2') {
            
            if(upd){
              pageData = this.data.datab;
            }else{
              pageData = res.data.list;
            }
          }
          pageData.forEach((element,index) => {
            if(pageData[index].relate_tm)
            pageData[index].relate_tm = util.nowDate(pageData[index].relate_tm)
          });
          if(list.length < this.data.limit){
            // goon =false;
          }
          if(tab == '1'){
            this.setData({fdata: pageData,data1:pageData,isUpFri:goon,hasUserInfo:false})
          }else if(tab == '2') {
            this.setData({gdata: pageData,datab:pageData,isUpGro:goon,hasUserInfo:false})
          }
        }
      })
    }else{
      if(pageData.length > 0 && pageData.length < this.data.limit){
        util.toast('加载完毕')
      }
    }
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
    this.getData(tab)
    this.setData({tab,data})
  },
  // from 表单提交 搜索
  form(e){
    let fromId = e.detail.formId;
  },
  // 搜索
  onSearch(){
    let searchcnt = e.detail.value.search;
    let searchSta = this.data.searchSta;
    if(!searchSta && searchcnt){
      searchSta = true;
    }
    this.setData({searchSta})
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
    let token = cache.get('token');
    let uid = e.currentTarget.dataset.uid;
    let id = e.currentTarget.dataset.id;
    let rid = e.currentTarget.dataset.rid;
    let tab = this.data.tab;
    let isOk = app.globalData.isOk;
    let client_id = cache.get('client_id');
    if (this.data.type) {
      if (!isOk) {
        util.toast('socket 链接失败!')
        return false;
      }
      if(tab == '1'){
        this.pushDo({action:'view_friend',to_uid:uid});
        wx.navigateTo({
          url: `./chat/chat?title=${title}&to_uid=${uid}&id=${rid}`
        })
      }else if(tab == '2'){
        this.pushDo({action:'view_group',gid:id});
        wx.navigateTo({
          url: `./chat/chat?title=${title}&gid=${id}&id=${rid}`
        })
      }
    }else{
      wx.navigateTo({
        url: `../market/market?title=${title}`
      })
    }
  },
  // 获取 socket 返回
  msgReceived(res){
    let d = JSON.parse(res);
    let client_id = '';
    if (d.action == "connect_ok") {
      app.globalData.isOk = true;
      wx.hideLoading({})
      client_id = d.client_id;
      this.pushDo({ action: 'say_hello', client_id });
      cache.set('client_id',client_id)
      this.setData({ client_id })
    }
    // console.log('index',d)
  },
  // 授权用户信息
  getUserInfoInit() {
    console.log(cache.get('userInfo'),this.data.canIUse)
    if (cache.get('userInfo')) {
      this.setData({
        userInfo: cache.get('userInfo'),
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        console.log(1,res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(3,res)
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
  getUserInfo: function (e) {
    if (e.errMsg = 'getUserInfo:ok') {
      if (this.data.bind_id) {
        cache.set('userInfo', e.detail);
        this.reg(this.data.bind_id,
          e.detail.rawData,
          e.detail.signature,
          e.detail.encryptedData,
          e.detail.iv
        )
      }
    }
  },
  // 会话设置
  onLongpress(e) {
    let tab = this.data.tab;
    let id = e.currentTarget.dataset.id;
    let data = this.data.data;
    let i = e.currentTarget.dataset.i;
    let title = e.currentTarget.dataset.title;
    if (tab == '2') {
      util.showModal('提示', '要修改该会话吗？', true, () => {
          wx.navigateTo({
            url:`/pages/index/group/group?tag=chat&id=${id}&title=${title}`
          })
      })
    }
  },
  // 上拉更新
  onReachBottom: function (e) {
    let tab = this.data.tab;
    this.getData(tab)
  },
  pushDo(arg) {
    network.post('push.do',Object.assign({}, {
      action:'',			//必传
      client_id:'',		//可选	socket链接成功时返回
      type:'',			//可选	1文字 2图片 3语音
      content:'',			//可选	发送内容
      to_uid:'',			//可选	好友id
      gid:'',				//可选	群id
      form_id:''			//可选
    },arg))
      .then((res) => {
        // console.log('pushDoIndex',res)
    })
  },
  onShow: function () {
    if (this.data.first) {
      // this.getData(this.data.tab)
    }
  },
})
