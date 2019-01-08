//index.js
//获取应用实例
import util from '../../utils/util.js'
import cache from '../../utils/cache.js'
import network from '../../utils/ajax.js'
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    type:true,
    tab:1,
    // canIUse: wx.canIUse('button.open-type.getUserInfo'),
    data1:[
      {pic:'../imgs/chat/image.png',title:'鸡蛋供应',cont:'将持续更新该品类的最新价格，敬请关注！',time:util.nowDate(),id:1},
      {pic:'../imgs/chat/image.png',title:'牛肉供应',cont:'将持续更新该品类的最新价格，敬请关注！',time:util.nowDate(),id:2},
      {pic:'../imgs/chat/image.png',title:'大米供应',cont:'将持续更新该品类的最新价格，敬请关注！',time:util.nowDate(),id:3},
    ],
    dataa:[
      {pic:'../imgs/chat/image.png',title:'鸡蛋供应',cont:'将持续更新该品类的最新价格，敬请关注！',time:util.nowDate()},
      {pic:'../imgs/chat/image.png',title:'牛肉竞价',cont:'将持续更新该品类的最新价格，敬请关注！',time:util.nowDate()},
      {pic:'../imgs/chat/image.png',title:'大米供应',cont:'将持续更新该品类的最新价格，敬请关注！',time:util.nowDate()},
    ],
    datab:[
      {pic:'../imgs/chat/image.png',title:'鸡蛋竞价',cont:'将持续更新该品类的最新价格，敬请关注！'},
      {pic:'../imgs/chat/image.png',title:'牛肉竞价',cont:'将持续更新该品类的最新价格，敬请关注！'},
      {pic:'../imgs/chat/image.png',title:'大米竞价',cont:'将持续更新该品类的最新价格，敬请关注！'},
    ],
    searchSta:false,
  },
  onLoad: function (op) {
    // this.getUserInfoInit();
    let data = this.data.data1;
    this.setData({data})
    this.init(op)
  },
  // 用户登录
  init(op){
    let code = cache.get('code');     // code
    let scene = cache.get('scene')    // 场景
    let inviter = 0;                  // 邀请人
    let roomid = 0;                 // 聊天室
    if (op['inviter'] && op['roomid']) {
      inviter = op.inviter;
      roomid = op.roomid;
    }
    this.setData({roomid,inviter})
    network.post('login.do',{
      code,
      scene,
      inviter,
      roomid,
    }).then((res)=>{
      if (res.code == '0' && res.data.bind_id) {
        this.setData({bind_id:res.data.bind_id})
      } else {
        cache.set('token', res.data.token);
        let user = cache.get('userInfo');
        user = user? user: {};
        user['userInfo'] = res.data.user;
        cache.set('userInfo',user)
      }
    })
  },
  // 用户注册
  reg(bind_id,raw_data,signature,encrypted_data,iv){
    let scene= cache.get('scene'); // 场景
    let inviter= this.data.inviter;// 邀请人 id
    let roomid= this.data.roomid;  // 聊天室 id
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
      console.log('reg',res)
      if (res.code == '0') {
        cache.set('token', res.data.token);
        let user = cache.get('userInfo');
        user.userInfo = res.data.user;
        cache.set('userInfo',user);
      }
    })
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
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
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
  onShareAppMessage: function () {

  }
})
