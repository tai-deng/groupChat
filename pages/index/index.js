//index.js
//获取应用实例
import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import {network} from '../../utils/ajax.js'
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    type:true,
    tab:1,
    limit: 30,
    friendPage: 0,
    groupPage: 0,
    isUpFri: true,
    isUpGro: true,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data1:[
      {avatar:'../imgs/chat/image.png',nickname:'鸡蛋供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:1},
      {avatar:'../imgs/chat/image.png',nickname:'牛肉供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:2},
      {avatar:'../imgs/chat/image.png',nickname:'大米供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:3},
      {avatar:'../imgs/chat/image.png',nickname:'鸡蛋供应',remark:'将持续更新该品类的最新价格，敬请关注！',gid:1},
    ],
    dataa:[
      {gcover:'../imgs/chat/image.png',gname:'鸡蛋供应',gintro:'将持续更新该品类的最新价格，敬请关注！'},
      {gcover:'../imgs/chat/image.png',gname:'牛肉竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
      {gcover:'../imgs/chat/image.png',gname:'大米供应',gintro:'将持续更新该品类的最新价格，敬请关注！'},
    ],
    datab:[
      {gcover:'../imgs/chat/image.png',gname:'鸡蛋竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
      {gcover:'../imgs/chat/image.png',gname:'牛肉竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
      {gcover:'../imgs/chat/image.png',gname:'大米竞价',gintro:'将持续更新该品类的最新价格，敬请关注！'},
    ],
    searchSta:false,
  },
  onLoad: function (op) {
    this.init()
  },
  // 用户登录
  init(){
    wx.login({
      success: res => {
        let code = res.code
        let arg = wx.getLaunchOptionsSync();
        let scene = arg.scene;    // 场景
        let inviter = 0;                  // 邀请人
        let roomid = 0;                 // 聊天室
        if (arg.query['inviter']) {
          inviter = arg.query['inviter'];
        }
        if (arg.query['roomid']) {
          roomid = arg.query['roomid'];
        }
        this.setData({roomid,inviter})
        network.post('login.do',{
          code,
          scene,
          inviter,
          roomid,
        }).then((res)=>{
          if(res.code == '0'){
            if (res.data.bind_id) {
              this.setData({bind_id:res.data.bind_id,hasUserInfo:true})
            } else {
              cache.set('token', res.data.token);
              let user = cache.get('userInfo');
              user = user? user: {};
              user['userInfo'] = res.data.user;
              cache.set('userInfo',user)
              this.getData(this.data.tab);
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
    let scene= cache.get('scene'); // 场景
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
        this.getData(this.data.tab);
      }
    })
  },
  // 获取聊天
  getData(tab){
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
            pageData = this.data.data1.concat(res.data.list);
          }else if(tab == '2') {
            pageData = this.data.datab.concat(res.data.list);
          }
          pageData.forEach((element,index) => {
            if(pageData[index].relate_tm)
            pageData[index].relate_tm = util.nowDate(pageData[index].relate_tm)
          });
          if(list.length < this.data.limit){
            goon =false;
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
    // 搜索内容
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
    let id = e.currentTarget.dataset.id;
    let i = e.currentTarget.dataset.i;
    if(this.data.type){
      wx.navigateTo({
        url: `./chat/chat?title=${title}`
      })
    }else{
      wx.navigateTo({
        url: `../market/market?title=${title}`
      })
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
    let id = e.currentTarget.dataset.id;
    let data = this.data.data;
    let i = e.currentTarget.dataset.i;
    let title = e.currentTarget.dataset.title;
    util.showModal('提示', '要修改该会话吗？', true, () => {
        wx.navigateTo({
          url:`/pages/index/group/group?tag=chat&id=${id}&title=${title}`
        })
    })
  },

  onReachBottom: function (e) {
    let tab = this.data.tab;
    this.getData(tab)
  },
})
