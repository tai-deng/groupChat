
// 状态管理

const state = (that)=>{
    that.globalData = {
        isLogin:0,        // 是否登录 1,已登录 2,未登录 0,初始值
    }
}

module.exports = {
    state
}