//index.js
//获取应用实例
import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import {network} from '../../utils/ajax.js'
import websocket from '../../utils/socket.js'
// import dataManage from '../../utils/DataManage'
const app = getApp()
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    audit:false,
    tab:1,
    limit: 50,
    friendPage: 0,
    groupPage: 0,
    isUpFri: true,
    isUpGro: true,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data1:[],
    dataa:[],
    datab:[],
    searchSta:false,
    timeId: '',
    click:true,
    url:'user/friend.list',
  },
  onLoad: function (op) {
    this.init(op)
    console.log('index-->',op)
    // dataManage.instance;
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
        wx.hideLoading()
      } else {
        wx.showLoading({title:'网络连接中'})
      }
    }, 500);
    network.get('config.get',{tm:new Date().getTime()})
    .then((res)=>{
      if(res.audit == 1){
        app.globalData.audit = true;
        let data1 = [{avatar:'../imgs/chat/image.png',nickname:'鸡蛋供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:1},
        {avatar:'../imgs/chat/image.png',nickname:'牛肉供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:2},
        {avatar:'../imgs/chat/image.png',nickname:'大米供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:3},
        {avatar:'../imgs/chat/image.png',nickname:'鸡蛋供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:1},]
        let datab= [{gcover:'../imgs/chat/image.png',gname:'鸡蛋竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
        {gcover:'../imgs/chat/image.png',gname:'牛肉竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
        {gcover:'../imgs/chat/image.png',gname:'大米竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'}]
        let dataa= [{gcover:'../imgs/chat/image.png',gname:'鸡蛋供应',gintro:'将持续更新该品类的最新价格，敬请关注！'},
        {gcover:'../imgs/chat/image.png',gname:'牛肉竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
        {gcover:'../imgs/chat/image.png',gname:'大米供应',gintro:'将持续更新该品类的最新价格，敬请关注！'},]
        this.setData({
          audit:true,
          data1,
          datab,
          dataa
        })
      }else{
        app.globalData.audit = false;
        this.setData({audit:false,fdata:[],gdata:[]})
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
        if(op.scene){
          let str = decodeURIComponent(op.scene).split('/');
          for(var i =0;i<str.length;i++){
            let item = str[i].split(':')
            let key = item[0];
            let v = item[1];
            if (key == 'inviter') {
              inviter = v;
            }
            if (key == 'roomid') {
              roomid = v;
            }
          }
          console.log(op,str,inviter,roomid)
        }else{
          if (query['inviter']) {
            inviter = query['inviter'];
          }
          if (query['roomid']) {
            roomid = query['roomid'];
          }
        }
        let has = cache.get('userInfo') ? false : true;
        this.setData({roomid,inviter,hasUserInfo:has})
        network.post('login.do',{
          code,
          scene,
          inviter,
          roomid,
        }).then((res)=>{
          if (res.code == '0') {
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
        this.socketInit()
      }
    })
  },
  // 获取聊天
  getData(tab=1){
    let audit= this.data.audit;
    let url = this.data.url;
    let tm = new Date().getTime();
    let page = 1;
    let limit = this.data.limit;
    let pageData = '';
    let flag = true;
    let myUid= cache.get('userInfo').userInfo.uid;
    let power= cache.get('userInfo').userInfo.create_group;
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
      this.setData({myUid,power})
      network.get(url,{tm,page,limit})
      .then((res)=>{
        if(res.code == '0'){
          let list = res.data.list;
          let goon = true;
          if(tab == '1'){
            if(audit){
              pageData = this.data.data1;
              this.setData({fdata: pageData})
              return
            }else{
              pageData = this.data.data1.concat(list);
            }
          }else if(tab == '2') {
            if(audit){
              pageData = this.data.datab;
              this.setData({gdata: pageData})
              return
            }else{
              pageData = this.data.datab.concat(list);
            }
          }
          pageData.forEach((element,index) => {
            if (pageData[index].last_info['type']) {
              if (pageData[index].last_info.type=='1') {
                pageData[index].last_content = pageData[index].last_info.content;
              }
              if (pageData[index].last_info.type=='2') {
                pageData[index].last_content='图片'
              }
              if (pageData[index].last_info.type=='3') {
                pageData[index].last_content='语音'
              }
              pageData[index].now_tm = util.nowDate(pageData[index].last_info.time);
              if (pageData[index].last_view_tm<pageData[index].last_info.time) {
                  if(pageData[index].last_info.uid == myUid){
                    pageData[index].mute = false;
                  }else{
                    pageData[index].mute = true;
                  }
              } else {
                pageData[index].mute = false;
              }
            } else {
              pageData[index].last_content = '你们可以聊天了';
              pageData[index].mute = false;
              if(tab == '1'){
                pageData[index].now_tm = util.nowDate(pageData[index].relate_tm);
              }else if(tab == '2'){
                pageData[index].now_tm = util.nowDate(pageData[index].create_tm);
              }
            }
          });
          if(list.length !=0 && list.length <= this.data.limit){
            goon =false;
          }else if(list.length ==0){
            this.setData({hasUserInfo:false})
            return
          }
          if(tab == '1'){
            this.setData({fdata: pageData,data1:pageData,isUpFri:goon,hasUserInfo:false,friendPage:page,url})
          }else if(tab == '2') {
            this.setData({gdata: pageData,datab:pageData,isUpGro:goon,hasUserInfo:false,groupPage:page,url})
          }
        }
      })
    } else {
      if(page!=2)
      util.toast('没有更多')
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
    let v = e.detail.value.search.trim();
    let url=this.data.url;
    let audit= this.data.audit;
    let tm = new Date().getTime();
    if(v==''){
      util.toast('搜索内容不能为空！')
      return;
    }else{
      network.get(url,{tm,page:1,limit:5,name:v})
      .then((res)=>{
        if(audit){
          this.setData({searchSta:true})
          console.log(this.data.dataa)
          return
        }
        if(res.code=='0'){
          let pageData = res.data.list;
          if(pageData.length==0){
            util.toast("没有您要的内容")
            return;
          }
          pageData.forEach((element,index) => {
            if (pageData[index].last_info['type']) {
              if (pageData[index].last_info.type=='1') {
                pageData[index].last_content = pageData[index].last_info.content;
              }
              if (pageData[index].last_info.type=='2') {
                pageData[index].last_content='图片'
              }
              if (pageData[index].last_info.type=='3') {
                pageData[index].last_content='语音'
              }
              pageData[index].now_tm = util.nowDate(pageData[index].last_info.time);
              if (pageData[index].last_view_tm<pageData[index].last_info.time) {
                pageData[index].mute = true;
              } else {
                pageData[index].mute = false;
              }
            } else {
              pageData[index].last_content = '你们可以聊天了';
              pageData[index].mute = false;
              pageData[index].now_tm = util.nowDate(pageData[index].create_tm);
              console.log(pageData)
            }
          });
          console.log(res)
          this.setData({dataa: pageData,searchSta:true})
        }else{
          util.toast(res.msg)
        }
      })
    }
  },
  // 取消搜索
  onSearchCancel(){
    this.setData({searchSta:false,searchV:''})
  },
  onChat(){
    let title = e.currentTarget.dataset.title;
    let uid = e.currentTarget.dataset.uid;
    let id = e.currentTarget.dataset.id;
    let rid = e.currentTarget.dataset.rid;
    let tab = this.data.tab;
    let isOk = app.globalData.isOk;
    let unum = e.currentTarget.dataset.unum;
    let i = e.currentTarget.dataset.i;
    let gdata= this.data.gdata;
    let fdata= this.data.fdata;
    if (id) {
      if (!isOk) {
        util.toast('正在连接')
        this.restore(3)
        return false;
      }
      if(tab == '1'){
        this.pushDo({ action: 'view_friend', to_uid: uid });
        if (fdata[i]['mute']) {
          fdata[i]['mute'] = false;
          this.setData({ fdata });
        }
        wx.navigateTo({
          url: `./chat/chat?title=${title}&to_uid=${uid}&id=${rid}`
        })
      }else if(tab == '2'){
        this.pushDo({ action: 'view_group', gid: id });
        if (gdata[i]['mute']) {
          gdata[i]['mute'] = false;
          this.setData({ gdata });
        }
        wx.navigateTo({
          url: `./chat/chat?title=${title}&gid=${id}&id=${rid}&unum=${unum}`
        })
      }
      this.restore(4)
      return false;
    }else{
      wx.navigateTo({
        url: `../market/market?title=${title}`
      })
    }
  },
  // 取消授权
  onCancel(e){
    this.setData({hasUserInfo:true})
  },
  // 获取 socket 返回
  msgReceived(res){
    let d = JSON.parse(res);
    console.log(d)
    switch (d.action) {
      case "connect_ok":    // 链接成功
        app.globalData.isOk = true;
        this.pushDo({ action: 'say_hello', client_id: d.client_id });
        cache.set('client_id', d.client_id)
        this.setData({ client_id: d.client_id })
        break;
      case 'receive_from_friend':  // 收到新聊天消息1
        this.pageDataManage('1','3',d)
        break;
      case 'receive_from_group':  // 收到新聊天消息2
      this.pageDataManage('2','4',d)
        break;
      case 'receive_add_friend':  // 添加好友
        this.pageDataManage('1','1', d.user)
        break;
      case 'receive_join_group':  // 添加群
      this.pageDataManage('2','2', d)
        break;
      case 'receive_del_friend':  // 删除好友
        this.pageDataManage('1','-1',d.uid)
        break;
      case 'receive_leave_group':  // 退出除群
        this.pageDataManage('2','-2', d)
        break;
      case 'receive_ungroup':  // 群解散
        this.pageDataManage('2','-2', d)
        break;
      default:
        console.log('该内容不做处理',d.action)
    }
  },
  // 数据处理
  pageDataManage(tab,f,d) {
    let dm = '';
    let myUid= this.data.myUid;
    if (tab == '1') {
      dm = this.data.fdata;
    } else if(tab== '2'){
      dm = this.data.gdata;
    }
    // 加减好友
    if (f == '1') {
      dm.unshift(Object.assign({}, d, {
        mute: true,
        now_tm: util.nowDate(new Date().getTime() / 1000),
        relate_id:d.uid,
        last_content:'你们可以聊天了'
      }))
    }
    if (f == '-1') {
      dm.forEach((el,ind) => {
        if (el.relate_id == d)
          dm.splice(ind, 1);
      });
    }
    // 新聊天消息
    if (f == '3') {
      dm.forEach((el, ind) => {
        let obj = {};
        if (el.relate_id == d.uid || el.relate_id == d.relate_id) {
          if(d.type == '1'){
            obj.last_content= d.content;
          }else if(d.type == '2'){
            obj.last_content= '图片';
          }else if(d.type == '3'){
            obj.last_content= '语音';
          }
          if(d.uid==myUid){
            obj.mute= false;
          }else{
            obj.mute= true
          }
          let item = dm.splice(ind, 1)['0'];
          dm.unshift(Object.assign({}, item, obj))
        }
      });
    }
    if (f == '4') {
      dm.forEach((el, ind) => {
        let obj = {};
        if (el.gid == d.gid) {
          if(d.type == '1'){
            obj.last_content= d.content;
          }else if(d.type == '2'){
            obj.last_content= '图片';
          }else if(d.type == '3'){
            obj.last_content= '语音';
          }
          if(d.user.uid==myUid){
            obj.mute = false;
          }else{
            obj.mute = true;
          }
          obj.now_tm=util.nowDate(d.chat_tm)
          let item = dm.splice(ind, 1)['0'];
          dm.unshift(Object.assign({}, item, obj))
        }
      });
    }
    // 加减群
    if (f == '2') {
      dm.unshift(Object.assign({}, d.group, {
        mute: true,
        now_tm: util.nowDate(new Date().getTime() / 1000),
        gid:d.gid,
        last_content:'你们可以聊天了'
      }))
    }
    if (f == '-2') {
      dm.forEach((el,ind) => {
        if (el.gid == d.gid) {
          dm.splice(ind, 1);
        }
      });
    }
    if (tab == '1') {
      this.setData({ fdata: dm });
    } else if(tab== '2'){
      this.setData({ gdata: dm });
    }
    
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
    console.log(e)
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
  // 监听左滑删除
  onTouchMoveItem(e){
    let type= e.type;
    let title = e.currentTarget.dataset.title;
    let uid = e.currentTarget.dataset.uid;
    let guid = e.currentTarget.dataset.guid;
    let myUid = cache.get('userInfo').userInfo.uid;
    let id = e.currentTarget.dataset.id;
    let rid = e.currentTarget.dataset.rid;
    let tab = this.data.tab;
    let isOk = app.globalData.isOk;
    let unum = e.currentTarget.dataset.unum;
    let power = this.data.power;
    let i = e.currentTarget.dataset.i;
    let gdata= this.data.gdata;
    let fdata= this.data.fdata;
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
    if(this.start && this.end && (this.start- this.end)>100 &&power){
      util.showModal('提示', '是否确定删除?', true, () => {
        let tm = new Date().getTime();
        if(tab == '1'){
          network.post('user/friend.remove',{relate_id:rid,tm})
          .then((res)=>{
            if(res.code == '0'){
              // fdata.splice(i,1);
              // util.toast(res.data.message)
              // this.setData({fdata})
            }else{
              util.toast(res.msg)
            }
          })
        }
        if(tab == '2' &&  guid == myUid){
          network.post('user/group.remove',{gid:id,tm})
          .then((res)=>{
            if(res.code == '0'){
              // gdata.splice(i,1);
              // util.toast(res.data.message)
              // this.setData({ gdata })
            } else {
              util.toast(res.msg)
            }
          })
        }
      })
      this.restore(1)
      return false;
    }else if(this.start == this.end){
       if((this.endTime-this.startTime >= 350)){
          if (tab == '2') {
            util.showModal('提示', '要设置该会话吗？', true, () => {
                wx.navigateTo({
                  url:`/pages/index/group/group?tag=chat&id=${id}&title=${title}`
                })
            })
          }
          this.restore(2)
          return false;
        }else if (id) {
          if (!isOk) {
            util.toast('正在连接')
            this.restore(3)
            return false;
          }
          if(tab == '1'){
            this.pushDo({ action: 'view_friend', to_uid: uid });
            if (fdata[i]['mute']) {
              fdata[i]['mute'] = false;
              this.setData({ fdata });
            }
            wx.navigateTo({
              url: `./chat/chat?title=${title}&to_uid=${uid}&id=${rid}`
            })
          }else if(tab == '2'){
            this.pushDo({ action: 'view_group', gid: id });
            if (gdata[i]['mute']) {
              gdata[i]['mute'] = false;
              this.setData({ gdata });
            }
            wx.navigateTo({
              url: `./chat/chat?title=${title}&gid=${id}&id=${rid}&unum=${unum}`
            })
          }
          this.restore(4)
          return false;
        }else{
          wx.navigateTo({
            url: `../market/market?title=${title}`
          })
        }
        this.restore(5)
        return false;
    }else{
      if(!power){
        util.toast('不能删除')
      }
    }
  },
  // 体统消息
  onSystemMsg(e){
    wx.navigateTo({
      url:'/pages/index/systemMsg/systemMsg'
    })
  },
  // 还原 触摸参数
  restore(s){
    this.start='';
    this.end= '';
    this.startTime= '';
    this.endTime= '';
    // console.log('调试-->'+s)
    // util.isClick(this,'1')
  },
  onShow() {
    if (!websocket.socketOpened) {
      websocket.setReceiveCallback(this.msgReceived, this);
    }
  }
})
