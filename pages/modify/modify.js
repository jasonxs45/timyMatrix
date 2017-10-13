const app = getApp()
Page({
  data: {
    information: {},
    wxInfo: {},
    nodes: [{
      name: 'div',
      attrs: {},
      children: [{
        text: '1'
      }]
    }]
  },
  onLoad: function (op) {
  	const _self = this
  	app.getUserInfo((res) => {
      console.log(3)
  		_self.setData({
  			wxInfo: res
  		})
  	})
  },
  phoneCall (e) {
    e.stopPropagation()
    wx.makePhoneCall({
      phoneNumber: ''+e.currentTarget.dataset.telnum
    })
  },
  previewAvatar () {
    console.log(this.avatarUrl)
  }
})
