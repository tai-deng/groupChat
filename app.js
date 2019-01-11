//app.js
import websocket from './utils/socket.js'
App({
  onLaunch: function (e) {
  },
  onHide() {
    clearInterval(this.globalData.timeId)
  },
  globalData: {
    userInfo: null,
    roomid: null,
    inviter: null,
    timeId: null,
  },
})