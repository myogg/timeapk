// pages/login/index.js
Page({
  data: {
    isLoading: false
  },

  onLoad: function () {
    // 检查是否已经登录
    const userInfo = wx.getStorageSync('userInfo')
    if (userInfo) {
      wx.redirectTo({
        url: '/pages/index/index'
      })
    }
  },

  onGetUserInfo: function(e) {
    if (e.detail.userInfo) {
      this.setData({ isLoading: true })
      
      // 获取用户信息
      wx.login({
        success: (res) => {
          // 模拟获取openid
          const openid = 'wx_' + Date.now()
          
          const userInfo = {
            ...e.detail.userInfo,
            openid: openid,
            loginTime: new Date().toISOString()
          }
          
          // 保存用户信息到本地存储
          wx.setStorageSync('userInfo', userInfo)
          
          // 显示登录成功提示
          wx.showToast({
            title: '登录成功',
            icon: 'success',
            duration: 2000,
            complete: () => {
              setTimeout(() => {
                wx.redirectTo({
                  url: '/pages/index/index'
                })
              }, 1000)
            }
          })
        },
        fail: () => {
          this.setData({ isLoading: false })
          wx.showToast({
            title: '登录失败',
            icon: 'error'
          })
        }
      })
    } else {
      wx.showToast({
        title: '需要授权才能使用',
        icon: 'none'
      })
    }
  }
})
