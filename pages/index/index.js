//index.js
//获取应用实例
let app = getApp()
Page({
  data: {
    menus: [
      {
        name: "打卡",
        src: '../../images/signin.png',
        path: '../signin/signin',
        desc: '每日打卡记录'
      },
      {
        name: "钥匙管理",
        src: '../../images/key.png',
        path: '../key/key',
        desc: '每日钥匙管理'
      },
      {
        name: "通讯录",
        src: '../../images/contact.png',
        path: '../member/member',
        desc: '公司群成员通讯录'
      }
    ],
    alreadyBind: wx.getStorageSync('alreadyBind')
  },
  //事件处理函数
  onLoad() {
    let _self = this
    app.openidReady = res => {
      console.log('定义在index.js里面的 openidReady事件')
    }
    app.userInfoReady = res => {
      console.log('定义在index.js里面的 userInfoReady事件')
    }
    app.getBindReady = res => {
      console.log('定义在index.js里面的 getBindReady事件')
      _self.setBindStatus()
    }
  },
  setBindStatus () {
    this.setData({
      alreadyBind: wx.getStorageSync('alreadyBind')
    })
  },
  getPhoneNumber(e) {
    let _self = this
    // 绑定电话
    wx.request({
      url: 'https://open.1juke.cn/WebApi/BindPhone',
      method: 'POST',
      data: {
        code: wx.getStorageSync('code'),
        sessionkey: wx.getStorageSync('sessionkey'),
        iv: e.detail.iv,
        encryptedData: e.detail.encryptedData,
        openid: wx.getStorageSync('openid')
      },
      success(res) {
        if(res.data.ErrCode == 1 ){
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
            success(r) {
              if (r.confirm) {
                _self.setData({
                  alreadyBind: 1
                })
              }
            }
          })
        }else{
          wx.showModal({
            title: '提示',
            content: res.data.Msg,
            showCancel: false,
          })
        }
      },
      fail(res) {
        console.log('请求失败，请检查网络')
      }
    })
  },
  navTo(e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },
  onShareAppMessage (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: app.globalData.shareConf.title,
      path: app.globalData.shareConf.path,
      imageUrl: app.globalData.shareConf.imgUrl,
      success (res) {
        // 转发成功
      },
      fail (res) {
        // 转发失败
      }
    }
  }
})
