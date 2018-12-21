
// 缓存管理
const bf = '1.0.0';

const get = (key)=>{
    let temp = wx.getStorageSync(bf);
    return temp[key];
}

const set = (key,value)=>{
    if (!wx.getStorageSync(bf)) {
        wx.setStorageSync(bf, {})
    }
    let temp = wx.getStorageSync(bf);
    temp[key] = value;
    wx.setStorageSync(bf, temp)
}

const clear = (cb)=>{
    wx.clearStorage({
        success(e){
            if(typeof cb == 'function')
            cb(e);
        }
    })
}

module.exports = {
    get,set,clear
}