// pages/daily/index.js
Page({
  data: {
    workItems: [],
    showForm: false,
    editingItem: null,
    formData: {
      name: '',
      quantity: '',
      timePerUnit: '',
      isHourlyBased: false
    },
    currentDate: ''
  },

  onLoad: function () {
    this.setCurrentDate()
    this.loadTodayRecords()
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

  loadTodayRecords: function () {
    const today = this.formatDate(new Date())
    const records = wx.getStorageSync('workRecords') || []
    const todayRecords = records.filter(record => record.date === today)
    
    if (todayRecords.length > 0) {
      // 显示最近的一条记录
      this.setData({
        workItems: todayRecords[todayRecords.length - 1].items
      })
    }
  },

  formatDate: function (date) {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  },

  get totalQuantity() {
    return this.data.workItems.reduce((sum, item) => sum + item.quantity, 0)
  },

  get totalHours() {
    const totalMinutes = this.data.workItems.reduce((sum, item) => sum + item.totalTime, 0)
    return (totalMinutes / 60).toFixed(1)
  },

  onAddItem: function () {
    this.setData({
      showForm: true,
      editingItem: null,
      formData: {
        name: '',
        quantity: '',
        timePerUnit: '',
        isHourlyBased: false
      }
    })
  },

  onEditItem: function (e) {
    const item = e.currentTarget.dataset.item
    this.setData({
      showForm: true,
      editingItem: item,
      formData: {
        name: item.name,
        quantity: item.quantity.toString(),
        timePerUnit: item.isHourlyBased ? (item.timePerUnit / 60).toFixed(2) : item.timePerUnit.toString(),
        isHourlyBased: item.isHourlyBased
      }
    })
  },

  onRemoveItem: function (e) {
    const id = e.currentTarget.dataset.id
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个工件吗？',
      success: (res) => {
        if (res.confirm) {
          const workItems = this.data.workItems.filter(item => item.id !== id)
          this.setData({ workItems })
        }
      }
    })
  },

  onFormInput: function (e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    this.setData({
      [`formData.${field}`]: value
    })
  },

  onSwitchChange: function (e) {
    const isHourlyBased = e.detail.value
    this.setData({
      'formData.isHourlyBased': isHourlyBased
    })
  },

  onSubmitForm: function () {
    const { name, quantity, timePerUnit, isHourlyBased } = this.data.formData
    
    if (!name || !timePerUnit) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }

    const quantityNum = isHourlyBased ? 1 : parseInt(quantity || 1)
    const timePerUnitNum = isHourlyBased ? parseFloat(timePerUnit) * 60 : parseInt(timePerUnit)
    const totalTime = isHourlyBased ? timePerUnitNum : quantityNum * timePerUnitNum

    const newItem = {
      id: this.data.editingItem ? this.data.editingItem.id : Date.now().toString(),
      name,
      quantity: quantityNum,
      timePerUnit: timePerUnitNum,
      totalTime,
      isHourlyBased
    }

    let workItems = [...this.data.workItems]
    
    if (this.data.editingItem) {
      workItems = workItems.map(item => 
        item.id === this.data.editingItem.id ? newItem : item
      )
    } else {
      workItems.push(newItem)
    }

    this.setData({
      workItems,
      showForm: false,
      editingItem: null
    })
  },

  onCancelForm: function () {
    this.setData({
      showForm: false,
      editingItem: null
    })
  },

  onSaveRecord: function () {
    if (this.data.workItems.length === 0) {
      wx.showToast({
        title: '请先添加工件',
        icon: 'none'
      })
      return
    }

    const record = {
      id: Date.now().toString(),
      date: this.formatDate(new Date()),
      items: this.data.workItems,
      createdAt: new Date().toISOString()
    }

    const records = wx.getStorageSync('workRecords') || []
    records.push(record)
    wx.setStorageSync('workRecords', records)

    wx.showToast({
      title: '保存成功',
      icon: 'success',
      duration: 2000,
      complete: () => {
        setTimeout(() => {
          wx.navigateBack()
        }, 1000)
      }
    })
  }
})
