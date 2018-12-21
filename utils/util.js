const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const toast = (title='',icon='none',duration=1500,mask=false,image='')=>{
  wx.showToast({
    title: title,
    icon: icon,
    duration: duration,
    mask: mask,
    image: image,
  });
}

const showModal = (title='',content='',showCancel=false,right,wrong,cancelText='取消',confirmText='确定',
cancelColor='#000000',confirmColor='#3cc51f')=>{
  wx.showModal({
    title: title,
    content: content,
    showCancel,
    cancelText,
    cancelColor,
    confirmText,
    confirmColor,
    success:(e)=>{
      if(e.cancel){
        if(typeof wrong == 'function')
        wrong();
      }else if(e.confirm){
        if(typeof right == 'function')
        right();
      }
    },
  })
}

const preview = (arr,item)=>{
  wx.previewImage({
    current: item,
    urls: arr
  })
}

const call = phone =>{
  wx.makePhoneCall({
    phoneNumber: phone
  })
}

const scrool = (px,ms)=>{
  wx.pageScrollTo({
    scrollTop: px,
    duration: ms
  })
}

module.exports = {
  formatTime,
  toast,
  showModal,
  preview,
  call,
  scrool
}
