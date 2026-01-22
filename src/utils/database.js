// 数据库工具函数
// 这里我们使用 Supabase 作为后端数据库服务
// 由于 Supabase 客户端已配置在 src/integrations/supabase/client.js，我们直接导入使用

import { supabase } from "@/integrations/supabase/client";

// 用户认证相关函数
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('注册失败:', error);
    throw error;
  }
};

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('登出失败:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('获取用户信息失败:', error);
    return null;
  }
};

// 工作记录相关函数
export const saveWorkRecord = async (record) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('用户未登录');
    
    const { data, error } = await supabase
      .from('work_records')
      .insert([
        {
          user_id: user.id,
          date: record.date,
          items: record.items,
          created_at: record.createdAt || new Date().toISOString(),
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('保存工作记录失败:', error);
    throw error;
  }
};

export const updateWorkRecord = async (record) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('用户未登录');
    
    const { data, error } = await supabase
      .from('work_records')
      .update({
        items: record.items,
        updated_at: new Date().toISOString(),
      })
      .eq('id', record.id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('更新工作记录失败:', error);
    throw error;
  }
};

export const getWorkRecords = async (date = null) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('用户未登录');
    
    let query = supabase
      .from('work_records')
      .select('*')
      .eq('user_id', user.id);
    
    if (date) {
      query = query.eq('date', date);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('获取工作记录失败:', error);
    return [];
  }
};

export const getMonthlyReport = async (year, month) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('用户未登录');
    
    const startDate = new Date(year, month - 1, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month, 0).toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('work_records')
      .select('*')
      .eq('user_id', user.id)
      .gte('date', startDate)
      .lte('date', endDate);
    
    if (error) throw error;
    
    // 处理数据以生成月度报告
    const itemStats = {};
    const workDays = new Set();
    
    data.forEach(record => {
      workDays.add(record.date);
      
      record.items.forEach(item => {
        if (!itemStats[item.name]) {
          itemStats[item.name] = {
            totalQuantity: 0,
            totalTime: 0,
            workDays: 0,
          };
        }
        
        itemStats[item.name].totalQuantity += item.quantity;
        itemStats[item.name].totalTime += item.totalTime;
      });
    });
    
    // 计算每个工件的工作天数
    Object.keys(itemStats).forEach(itemName => {
      const itemWorkDays = new Set();
      data.forEach(record => {
        const hasItem = record.items.some(item => item.name === itemName);
        if (hasItem) {
          itemWorkDays.add(record.date);
        }
      });
      itemStats[itemName].workDays = itemWorkDays.size;
    });
    
    return {
      itemStats,
      totalWorkDays: workDays.size,
      records: data,
      isLocked: false, // 可以根据需要添加锁定逻辑
      monthKey: `${year}-${String(month).padStart(2, '0')}`
    };
  } catch (error) {
    console.error('获取月度报告失败:', error);
    return { itemStats: {}, totalWorkDays: 0, records: [], isLocked: false, monthKey: '' };
  }
};

// 锁定月份功能
export const lockMonth = async (year, month) => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('用户未登录');
    
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    
    const { data, error } = await supabase
      .from('locked_months')
      .insert([
        {
          user_id: user.id,
          month_key: monthKey,
          locked_at: new Date().toISOString(),
        }
      ])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('锁定月份失败:', error);
    throw error;
  }
};

export const isMonthLocked = async (year, month) => {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    
    const monthKey = `${year}-${String(month).padStart(2, '0')}`;
    
    const { data, error } = await supabase
      .from('locked_months')
      .select('id')
      .eq('user_id', user.id)
      .eq('month_key', monthKey)
      .maybeSingle();
    
    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error('检查月份锁定状态失败:', error);
    return false;
  }
};
