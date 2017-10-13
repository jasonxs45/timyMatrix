let date
let app = getApp()
Page({
  data: {
    dayText: [
      '日', '一', '二', '三', '四', '五', '六'
    ]
  },
  onLoad(options) {
    this.getRecords()
    this.initCalendar()
  },
  initCalendar() {
    let mydate = new Date()
    let year = mydate.getFullYear()
    let month = mydate.getMonth() + 1
    date = mydate.getDate()
    let day = mydate.getDay()
    let nbsp = day - date % 7 + 1
    let monthDaySize
    if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
      monthDaySize = 31
    } else if (month == 4 || month == 6 || month == 9 || month == 11) {
      monthDaySize = 30
    } else if (month == 2) {
      // 计算是否是闰年,如果是二月份则是29天
      if ((year - 2000) % 4 == 0) {
        monthDaySize = 29
      } else {
        monthDaySize = 28
      }
    };
    this.setData({
      nbsp: nbsp,
      monthDaySize: monthDaySize,
      date: date,
      month: month
    })
  },
  getRecords() {
    let _self = this
    wx.showLoading({
      title: '加载中'
    })
    wx.request({
      url: 'https://open.1juke.cn/Punch/GetInfo',
      method: 'POST',
      data: {
        Openid: wx.getStorageSync('openid')
      },
      success(res) {
        wx.hideLoading()
        let originRecords = JSON.parse(res.data)
        let records = []
        for (let i = 0; i < _self.data.date; i++) {
          let record = {}
          record = originRecords[i]
          if (originRecords[i].am.yes == 1 && originRecords[i].pm.yes == 1) {
            record.status = 'whole'
          } else if (originRecords[i].am.yes != 1 && originRecords[i].pm.yes == 1) {
            record.status = 'pm'
          } else if (originRecords[i].am.yes == 1 && originRecords[i].pm.yes != 1) {
            record.status = 'am'
          } else {
            record.status = 'miss'
          }
          records.push(record)
        }
        let { am: am, pm: pm } = records[date - 1]
        let todayRecord = [am, pm]
        _self.setData({
          records: records,
          todayRecord: todayRecord
        })
      },
      fail(res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '获取记录失败，是否重试？',
          success (res) {
            if(res.confirm) {
              _self.getRecords()
            }
            if(res.cancel){
              wx.showModal({
                title: '提示',
                content: '打卡失败，请检查网络',
                showCancel: false
              })
            }
          }
        })
      }
    })
  },
  selectDate(e) {
    let active = e.currentTarget.dataset.idx
    if (active >= this.data.date) {
      return false
    }
    let { am: am, pm: pm } = this.data.records[active]
    let todayRecord = [am, pm]
    this.setData({
      active: active,
      todayRecord: todayRecord
    })
  },
  onReady() { },
  onShow() { },
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