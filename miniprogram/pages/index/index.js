// pages/index/index.js
Page({
  data: {
    userInfo: {},
    currentDate: '',
    todayStats: {
      totalHours: 0,
      totalQuantity: 0
    },
    monthlyStats: {
      totalItems: 0,
      totalHours: 0
    }
  },

  onLoad: function () {
    this.loadUserInfo()
    this.loadStats()
    this.setCurrentDate()
  },

  onShow: function () {
    this.loadStats()
  },

  loadUserInfo: function () {
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      this.setData({ userInfo })
    } else {
      wx.redirectTo({
        url: '/pages/login/index'
      })
    }
  },

  setCurrentDate: function () {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()
    this.setData({
      currentDate: `${year}年${month}月${date}日`
    })
  },

  loadStats: function () {
    // 加载今日统计数据
    const today = this.formatDate(new Date())
    const todayRecords = this.getRecordsByDate(today)
    
    let totalHours = 0
    let totalQuantity = 0
    
    todayRecords.forEach(record => {
      record.items.forEach(item => {
        totalHours += item.totalTime / 60
        totalQuantity += item.quantity
      })
    })
    
    this.setData({
      'todayStats.totalHours': totalHours.toFixed(1),
      'todayStats.totalQuantity': totalQuantity
    })

    // 加载本月统计数据
    const currentMonth = this.formatMonth(new Date())
    const monthlyRecords = this.getRecordsByMonth(currentMonth)
    
    let monthlyTotalHours = 0
    const uniqueItems = new Set()
    
    monthlyRecords.forEach(record => {
      record.items.forEach(item => {
        monthlyTotalHours += item.totalTime / 60
        uniqueItems.add(item.name)
      })
    })
    
    this.setData({
      'monthlyStats.totalHours': monthlyTotalHours.toFixed(1),
      'monthlyStats.totalItems': uniqueItems.size
    })
  },

  getRecordsByDate: function (date) {
    const records = wx.getStorageSync('workRecords') || []
    return records.filter(record => record.date === date)
  },

  getRecordsByMonth: function (month) {
    const records = wx.getStorageSync('workRecords') || []
    return records.filter(record => record.date.startsWith(month))
  },

  formatDate: function (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  },

  formatMonth: function (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    return `${year}-${month.toString().padStart(2, '0')}`
  },

  onLogout: function () {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('userInfo')
          wx.redirectTo({
            url: '/pages/login/index'
          })
        }
      }
    })
  }
})
