let app = getApp()
let util = require('../../utils/util')
let QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js')
let myPostion
const TARGET_POS = {
  latitude: 30.5981712,
  longitude: 114.25827789
}
let qqmapsdk
const NODES = require('rule').nodes
Page({
  data: {
    now: util.formatDate(new Date(), 'hh:mm:ss'),
    distance:null,
    showRule:false,
    showing:false,
    nodes:null
  },
  onLoad (options) {
    this.calculateDistance()
    this.setData({
      nodes: NODES
    })
  },
  runTime () {
    let _self = this
    let timer = setInterval(()=>{
      let date = new Date()
      let timeStr = util.formatDate(date, 'hh:mm:ss')
      _self.setData({
        now: timeStr
      })
    },1000)
  },
  getMyPostion (cb) {
    wx.getLocation({
      success (res) {
        myPostion = res
        cb&&cb()
      }
    })
  },
  calculateDistance () {
    let _self = this
    this.setData({
      distance:null
    })
    qqmapsdk = new QQMapWX({
      key: 'TDNBZ-EZ2RQ-AHR5Y-GGV75-HIAIQ-6QBP7'
    });
    // 先获取定位
    _self.getMyPostion(()=>{
      // 调用接口
      qqmapsdk.calculateDistance({
        from: myPostion,
        to: [TARGET_POS],
        success(res) {
          _self.setData({
            distance: res.result.elements[0].distance
          })
        },
        fail(res) {
          wx.showModal({
            title: '提示',
            content: '网络错误，获取距离失败',
            showCancel: false
          })
        }
      })
    })
  },
  toggleRule () {
    let _self =this
    let showRule = this.data.showRule
    if(!showRule){
      this.setData({
        showRule: !showRule
      })
      let timer = setTimeout(()=> {
        this.setData({
          showing: !showRule
        })
      },10)
    }else{
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
  signInHandler (e) {
    let _self = this
    let openid = wx.getStorageSync('openid')
    let signInTime = util.formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')
    let distance = this.data.distance
    wx.showModal({
      title: '提示',
      content: '确定要打卡吗？',
      success (res) {
        if(res.confirm){
          wx.showLoading({
            title: '提交中。。。'
          })
          wx.request({
            url: 'https://open.1juke.cn/Punch/Add',
            method: 'POST',
            data: {
              Openid: openid,
              PunchTime: signInTime,
              Distance: distance
            },
            success(res) {
              wx.hideLoading()
              if(res.data.ErrCode==1){
                wx.showModal({
                  title: '提示',
                  content: '打卡成功',
                  showCancel: false
                })
              }
              if (res.data.ErrCode==0){
                wx.showModal({
                  title: '提示',
                  content: `打卡失败，${res.data.Msg}`,
                  showCancel: false
                })
              }
            },
            fail(res) {
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '打卡失败，请检查网络',
                showCancel: false
              })
            }
          })
        }
        if(res.cancel){
          wx.showToast({
            title: '取消操作'
          })
        }
      }
    })
  },
  myRecords () {
    wx.navigateTo({
      url: '/pages/records/records'
    })
  },
  onReady () {},
  onShow () {
    this.runTime()
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