//app.js
import websocket from './utils/socket.js'
App({
  onLaunch: function (e) {
    this.globalData.scene = e.scene;
    this.globalData.query = e.query;
  },
  onHide() {
    clearInterval(this.globalData.timeId)
  },
  globalData: {
    userInfo: null,
    roomid: null,
    inviter: null,
    timeId: null,
    client_id:null,
    scene:null,
    query:null,
    isOk: null,
    isAuth:null,
  },
})