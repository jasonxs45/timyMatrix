const app = getApp()
Page({
  data: {
    information: {},
    nodes: [{
      name: 'div',
      attrs: {},
      children: [{
        text: '1'
      }]
    }]
  },
  onLoad: function (op) {
    let _self = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    const id = op.id
    wx.request({
      url: 'https://open.1juke.cn/AddressList/GetInfo',
      method: 'POST',
      data: {
        id: id
      },
      success(res) {
        _self.setData({
          information: res.data
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  },
  phoneCall(e) {
    e.stopPropagation()
    wx.makePhoneCall({
      phoneNumber: '' + e.currentTarget.dataset.telnum
    })
  },
  previewAvatar() {
    if (!this.data.information.AvatarUrl){
      return
    }else{
      let _self = this
      wx.previewImage({
        current: _self.data.information.AvatarUrl,
        urls: [_self.data.information.AvatarUrl]
      })
    }
  },
  toModify() {
    wx.navigateTo({
      url: '/pages/modify/modify?id=0_1'
    })
  },
  backHandler () {
    wx.navigateBack()
  },
  onShareAppMessage(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.shareConf.title,
      path: app.globalData.shareConf.path,
      imageUrl: app.globalData.shareConf.imgUrl,
      success(res) {
        // 转发成功
      },
      fail(res) {
        // 转发失败
      }
    }
  }
})
