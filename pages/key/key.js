const util = require('../../utils/util')
const FLOORS = [
  {
    floor: 5
  },
  {
    floor: 11
  }
]
const NODES = require('rule').nodes
let app = getApp()
Page({
  data: {
    active: 0,
    floors: FLOORS,
    showRule: false,
    showing: false,
    nodes: NODES
  },
  onLoad() {
    this.getCurrent()
  },
  getCurrent() {
    let _self = this
    let active = this.data.active
    wx.showLoading({
      title: '查询中',
      mask: true
    })
    wx.request({
      url: 'https://open.1juke.cn/KeyManage/GetInfo',
      method: 'POST',
      data: {
        keyname: active
      },
      success(res) {
        wx.hideLoading()
        res.data.GetKeyTime = new Date(parseInt(res.data.GetKeyTime.replace(/\D*/g, '')))
        res.data.GetKeyTime = util.formatDate(res.data.GetKeyTime, 'MM/dd hh:mm:ss')
        _self.setData({
          person: res.data
        })
      },
      fail(res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '获取失败，请检查网络',
          showCancel: false
        })
      }
    })
  },
  swipeChangeHandler(e) {
    this.setData({
      active: e.detail.current
    })
    this.getCurrent()
  },
  changeTab(e) {
    let _self = this
    let index = e.currentTarget.dataset.idx
    this.setData({
      active: index
    })
    // 切换后重新获取钥匙状态
    this.getCurrent()
  },
  getKey() {
    let _self =this
    let openid = wx.getStorageSync('openid')
    wx.showModal({
      title: '提示',
      content: '您确定吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading()
          wx.request({
            url: 'https://open.1juke.cn/KeyManage/Accept',
            method: 'POST',
            data: {
              Openid: openid,
              Message: '',
              Remark: _self.data.active
            },
            success(res) {
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '请妥善保存钥匙！',
                showCancel:false
              })
              _self.getCurrent()
            },
            fail(res) {
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '申请失败，请检查网络',
                showCancel: false
              })
            }
          })
        }
        if(res.cancel){
          wx.showToast({
            title:'取消操作'
          })
        }
      }
    })
  },
  toggleRule() {
    let _self = this
    let showRule = this.data.showRule
    if (!showRule) {
      this.setData({
        showRule: !showRule
      })
      let timer = setTimeout(() => {
        this.setData({
          showing: !showRule
        })
      }, 10)
    } else {
      this.setData({
        showing: !showRule
      })
      let timer = setTimeout(() => {
        this.setData({
          showRule: !showRule
        })
      }, 400)
    }
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
