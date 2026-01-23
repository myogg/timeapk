// 使用 localStorage 进行数据存储
// 由于移除了用户系统，我们使用固定的用户ID来存储数据

const FIXED_USER_ID = 'default_user';

// 获取今日记录
export const getTodayRecords = async () => {
  try {
    const today = format(new Date(), 'yyyy-MM-dd');
    const allRecords = await getAllRecords();
    return allRecords.filter(record => record.date === today);
  } catch (error) {
    console.error('获取今日记录失败:', error);
    return [];
  }
};

// 保存今日记录
export const saveTodayRecord = async (record) => {
  try {
    const allRecords = await getAllRecords();
    const newRecord = {
      ...record,
      id: record.id || generateId(),
      user_id: FIXED_USER_ID,
    };
    
    const updatedRecords = [...allRecords, newRecord];
    localStorage.setItem('work_records', JSON.stringify(updatedRecords));
    return newRecord;
  } catch (error) {
    console.error('保存记录失败:', error);
    throw error;
  }
};

// 更新今日记录
export const updateTodayRecord = async (record) => {
  try {
    const allRecords = await getAllRecords();
    const updatedRecords = allRecords.map(r => 
      r.id === record.id ? { ...record, updated_at: new Date().toISOString() } : r
    );
    
    localStorage.setItem('work_records', JSON.stringify(updatedRecords));
    return record;
  } catch (error) {
    console.error('更新记录失败:', error);
    throw error;
  }
};

// 获取所有记录
export const getAllRecords = async () => {
  try {
    const records = localStorage.getItem('work_records');
    return records ? JSON.parse(records).filter(record => record.user_id === FIXED_USER_ID) : [];
  } catch (error) {
    console.error('获取所有记录失败:', error);
    return [];
  }
};

// 获取月度报告
export const getMonthlyReport = async (date) => {
  try {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];

    const allRecords = await getAllRecords();
    const monthRecords = allRecords.filter(record =>
      record.date >= startDate && record.date <= endDate
    );

    const monthKey = format(date, 'yyyy-MM');

    // 处理数据以生成月度报告 - 按名称和工时合并
    const itemStats = {};
    const workDays = new Set();

    monthRecords.forEach(record => {
      workDays.add(record.date);

      record.items.forEach(item => {
        const key = `${item.name}_${item.timePerUnit}`;
        if (!itemStats[key]) {
          itemStats[key] = {
            name: item.name,
            timePerUnit: item.timePerUnit,
            totalQuantity: 0,
            totalTime: 0,
            workDays: 0,
          };
        }

        itemStats[key].totalQuantity += item.quantity;
        itemStats[key].totalTime += item.totalTime;
      });
    });

    // 计算每个工件的工作天数
    Object.keys(itemStats).forEach(key => {
      const item = itemStats[key];
      const itemWorkDays = new Set();
      monthRecords.forEach(record => {
        const hasItem = record.items.some(i => i.name === item.name && i.timePerUnit === item.timePerUnit);
        if (hasItem) {
          itemWorkDays.add(record.date);
        }
      });
      itemStats[key].workDays = itemWorkDays.size;
    });

    return {
      itemStats,
      totalWorkDays: workDays.size,
      records: monthRecords,
      monthKey
    };
  } catch (error) {
    console.error('获取月度报告失败:', error);
    return { itemStats: {}, totalWorkDays: 0, records: [], monthKey: '' };
  }
};

// 导入数据
export const importData = async (data, format) => {
  try {
    let records = [];
    if (format === 'json') {
      records = Array.isArray(data) ? data : data.records || [];
    } else if (format === 'csv') {
      // CSV格式暂不支持导入完整记录结构
      return false;
    }

    const allRecords = await getAllRecords();
    const existingIds = new Set(allRecords.map(r => r.id));

    const newRecords = records.filter(r => !existingIds.has(r.id)).map(r => ({
      ...r,
      user_id: FIXED_USER_ID
    }));

    if (newRecords.length > 0) {
      const updatedRecords = [...allRecords, ...newRecords];
      localStorage.setItem('work_records', JSON.stringify(updatedRecords));
      return newRecords.length;
    }
    return 0;
  } catch (error) {
    console.error('导入数据失败:', error);
    throw error;
  }
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 导入日期格式化函数
import { format } from 'date-fns';

// 数据存储说明（更新版）
/*
数据存储机制说明：

1. 当前状态：
   - 使用 localStorage 进行本地数据存储
   - 使用固定的用户ID (default_user) 来存储所有数据
   - 无需用户认证，直接访问系统

2. 数据结构：
   
   a) 工作记录 (work_records)
      - id: 唯一标识符
      - user_id: 固定用户ID (default_user)
      - date: 日期 (YYYY-MM-DD)
      - items: 工件列表 (JSON数组)
      - created_at: 创建时间
      - updated_at: 更新时间
   
   b) 锁定月份 (locked_months)
      - id: 唯一标识符
      - user_id: 固定用户ID (default_user)
      - month_key: 月份键 (YYYY-MM)
      - locked_at: 锁定时间

3. 优势：
   - 无需用户认证，简化使用流程
   - 数据本地存储，保护隐私
   - 支持离线使用
   - 简单易用，适合个人使用

4. 注意事项：
   - 数据存储在浏览器本地，清除浏览器数据会导致数据丢失
   - 建议在更换设备前导出重要数据
   - 支持数据导出功能，可定期备份
*/
