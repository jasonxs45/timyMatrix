App({
  onLaunch() {
    let _self = this
    // 检查登录状态
    wx.checkSession({
      success() {
        console.log('登录未过期')
        //session 未过期，并且在本生命周期一直有效
        if (!wx.getStorageSync('openid')) {
          _self.login()
        } else {
          if (wx.getStorageSync('alreadyBind') != 1){
            _self.getBindStatus(wx.getStorageSync('openid'))
          }
        }
      },
      fail() {
        //登录态过期
        console.log('登录已经过期')
        _self.login()
      }
    })
  },
  login() {
    let _self = this
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.setStorageSync('code', res.code)
          _self.getUserInfo({ withCredentials: true})
        } else {
          wx.hideLoading()
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  /**
   * 获取用户信息，当参数withCredentials为true时，wx.login且登录态尚未过期，
   * 此时返回的数据会包含encryptedData、iv，用于进一步获取其他信息
   * */
  getUserInfo(opts = { withCredentials: false}) {
    let _self = this
    // 获取绑定状态
    wx.getUserInfo({
      withCredentials: opts.withCredentials,
      success: res => {
        _self.globalData.userInfo = res.userInfo
        /**
         * 当参数withCredentials为true时，利用encryptedData、iv，
         * 进一步获取其他信息
         */
        if (opts.withCredentials) {
          _self.getOpenId(wx.getStorageSync('code'), res.iv, res.encryptedData)
        }
        /**
         * 此处定义获取到用户信息后的回调
         */
        if (_self.userInfoReady) {
          _self.userInfoReady(res.userInfo)
        }
      },
      fail(res) {
        _self.changeSetting()
      }
    })
  },
  /**
   * 获取openid，sessionkey,alreadybind
   */
  getOpenId(code, iv, encryptedData) {
    let _self = this
    wx.showLoading({
      title: '获取中',
      mask: true
    })
    wx.request({
      url: 'https://open.1juke.cn/WebAPI/UserLogin',
      method: 'POST',
      data: {
        code: code,
        iv: iv,
        encryptedData: encryptedData
      },
      success(res) {
        wx.hideLoading()
        wx.setStorageSync('openid', res.data.split('|')[0])
        wx.setStorageSync('sessionkey', res.data.split('|')[1])
        wx.setStorageSync('alreadyBind', res.data.split('|')[2])
        if (_self.openidReady) {
          _self.openidReady(res.data.split('|')[0])
        }
        if (_self.getBindReady) {
          _self.getBindReady(res.data.split('|')[2])
        }
      },
      fail(res) {
        wx.hideLoading()
      }
    })
  },
  changeSetting() {
    let _self = this
    wx.showModal({
      title: '授权提示',
      content: '当前小程序需要获取您的用户信息，点击前往设置！',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success(res) {
              if (res.authSetting['scope.userInfo']) {
                _self.login()
              } else {
                _self.changeSetting()
              }
            }
          })
        }
      }
    })
  },
  // 判断是否绑定过信息
  getBindStatus(openid) {
    let _self = this
    wx.showLoading({
      title: '检查是否已绑定电话',
      mask: true
    })
    wx.request({
      url: 'https://open.1juke.cn/WebApi/GetBindStatus',
      method: 'POST',
      data: {
        Openid: openid
      },
      success(res) {
        wx.hideLoading()
        wx.setStorageSync('alreadyBind', res.data.split('|')[0])
        if (_self.getBindReady) {
          _self.getBindReady(res.data.split('|')[0])
        }
      },
      fail(res) {
        wx.hideLoading()
        console.log('获取是否绑定失败')
      }
    })
  },
  globalData: {
    userInfo: null,
    shareConf: {
      title: '小工矩，矩阵互动小工具',
      path: '/pages/index/index',
      imgUrl: '/images/share.jpg'
    }
  }
})
