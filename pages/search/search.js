let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputVal: '',
    list: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {},
  inputHandler(e) {
    this.setData({
      inputVal: e.detail.value
    })
    if(e.detail.value===''){
      this.setData({
        list: null
      })
    }
  },
  search() {
    let _self = this
    if (!this.data.inputVal) {
      wx.showModal({
        title: '提示',
        content: '请输入姓名或者电话',
        showCancel: false
      })
      return false
    } else {
      wx.showLoading({
        title: '查询中。。。',
        mask: true
      })
      wx.request({
        url: 'https://open.1juke.cn/AddressList/GetInfo',
        method: 'POST',
        data: {
          name: _self.data.inputVal
        },
        success(res) {
          wx.hideLoading()
          _self.setData({
            list: res.data
          })
        },
        fail(res) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '查询失败，请检查网络',
            showCancel: false
          })
        }
      })
    }
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
  cancalHandler () {
    this.setData({
      inputVal:'',
      list:null
    })
    wx.navigateBack()
  },
  /**
   * 用户点击右上角分享
   */
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