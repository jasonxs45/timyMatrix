let app = getApp()
Page({
  data: {
    memberList: [],
    queryed: false
  },
  onLoad() {
    let _self = this
    if (wx.getStorageSync('memberlist')) {
      console.log('拿取本地缓存')
      this.setData({
        memberList: JSON.parse(wx.getStorageSync('memberlist'))
      })
    } else {
    }
    this.getMemberList()
  },
  getMemberList() {
    let _self = this
    if (!wx.getStorageSync('memberlist')) {
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
    }

    wx.request({
      url: 'https://open.1juke.cn/AddressList/GetList',
      method: 'POST',
      data: {},
      success(res) {
        wx.hideLoading()
        let memberlist = res.data[0].businessunitArr
        _self.setData({
          memberList: memberlist
        })
        // 更新本地缓存
        console.log('更新本地缓存')
        wx.setStorageSync('memberlist', JSON.stringify(memberlist))
      },
      fail() {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '更新通讯录失败，重新获取？',
          success(res) {
            if (res.confirm) {
              _self.getMemberList()
            }
            if (res.cancel) {
              wx.showToast({
                title: '取消操作'
              })
            }
          }
        })
      },
      complete() {
        _self.setData({
          queryed: true
        })
      }
    })
  },
  phoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: '' + e.currentTarget.dataset.telnum
    })
  },
  memberDetail(e) {
    let id = e.currentTarget.dataset.indexmap
    wx.navigateTo({
      url: `/pages/information/information?id=${id}`
    })
  },
  goSearch() {
    wx.navigateTo({
      url: '/pages/search/search'
    })
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
