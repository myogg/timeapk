import React, { useState, useEffect } from 'react';
import { useQueryClient, useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { format, subDays, addDays, parse } from 'date-fns';
import { Eye, Trash2, Calendar, Edit, Save, Plus, ArrowLeft, ChevronLeft, ChevronRight, Clock, Package } from 'lucide-react';
import WorkItemForm from '../components/WorkItemForm.jsx';
import Navigation from '../components/Navigation.jsx';
import WorkItemList from '../components/WorkItemList.jsx';
import { saveTodayRecord, updateTodayRecord, getTodayRecords, getAllRecords } from '../utils/storage.js';

const DailyRecord = () => {
  const [workItems, setWorkItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get('date');
  const [selectedDate, setSelectedDate] = useState(() => {
    if (dateParam) {
      try {
        return parse(dateParam, 'yyyy-MM-dd', new Date());
      } catch {
        return new Date();
      }
    }
    return new Date();
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 获取指定日期的记录
  const getRecordsByDate = async (date) => {
    const allRecords = await getAllRecords();
    const dateStr = format(date, 'yyyy-MM-dd');
    return allRecords.filter(record => record.date === dateStr);
  };

  const { data: currentRecords = [], isLoading } = useQuery({
    queryKey: ['records', format(selectedDate, 'yyyy-MM-dd')],
    queryFn: () => getRecordsByDate(selectedDate),
  });

  // 获取当月所有记录
  const { data: allRecords = [] } = useQuery({
    queryKey: ['allRecords'],
    queryFn: getAllRecords,
  });

  const currentMonth = format(new Date(), 'yyyy-MM');
  const monthRecords = allRecords.filter(record => record.date.startsWith(currentMonth));

  // 计算当日统计
  const dailyStats = currentRecords.reduce((acc, record) => {
    record.items.forEach(item => {
      acc.totalTime += item.totalTime;
      acc.totalQuantity += item.quantity;
    });
    return acc;
  }, { totalTime: 0, totalQuantity: 0 });

  const dailyHours = Math.round(dailyStats.totalTime / 60 * 100) / 100;

  const saveMutation = useMutation({
    mutationFn: saveTodayRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['allRecords'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyReport'] });
      setWorkItems([]);
      setIsAdding(false);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateTodayRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
      queryClient.invalidateQueries({ queryKey: ['allRecords'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyReport'] });
      setWorkItems([]);
      setIsAdding(false);
      setEditingRecord(null);
    },
  });

  const handleAddWorkItem = (item) => {
    setWorkItems([...workItems, { ...item, id: uuidv4() }]);
    setIsAdding(false);
  };

  const handleRemoveWorkItem = (id) => {
    setWorkItems(workItems.filter(item => item.id !== id));
  };

  const handleSaveRecord = () => {
    if (workItems.length === 0) return;
    
    const record = {
      id: uuidv4(),
      date: format(selectedDate, 'yyyy-MM-dd'),
      items: workItems,
      createdAt: new Date().toISOString(),
    };

    saveMutation.mutate(record);
  };

  const handleEditRecord = (record) => {
    setWorkItems([...record.items]);
    setEditingRecord(record);
    setIsAdding(true);
  };

  const handleUpdateRecord = () => {
    if (workItems.length === 0 || !editingRecord) return;
    
    const updatedRecord = {
      ...editingRecord,
      items: workItems,
      updatedAt: new Date().toISOString(),
    };

    updateMutation.mutate(updatedRecord);
  };

  const handleCancelEdit = () => {
    setWorkItems([]);
    setIsAdding(false);
    setEditingRecord(null);
    setEditingItem(null);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setIsAdding(true);
  };

  const handleUpdateItem = (updatedItem) => {
    setWorkItems(workItems.map(item => 
      item.id === updatedItem.id ? updatedItem : item
    ));
    setEditingItem(null);
    setIsAdding(false);
  };

  const handlePrevDay = () => {
    setSelectedDate(subDays(selectedDate, 1));
  };

  const handleNextDay = () => {
    setSelectedDate(addDays(selectedDate, 1));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-2xl font-bold text-gray-800">工作记录</h1>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" />
              </button>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>{format(selectedDate, 'yyyy年MM月dd日')}</span>
              </div>
              <button
                onClick={handleNextDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>

          {workItems.length > 0 && (
            <WorkItemList 
              items={workItems} 
              onRemove={handleRemoveWorkItem}
              onEdit={handleEditItem}
            />
          )}

          {isAdding ? (
            editingItem ? (
              <WorkItemForm 
                initialData={editingItem}
                onSubmit={handleUpdateItem}
                onCancel={() => {
                  setEditingItem(null);
                  setIsAdding(false);
                }}
              />
            ) : (
              <WorkItemForm 
                onSubmit={handleAddWorkItem}
                onCancel={() => setIsAdding(false)}
              />
            )
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span>添加工件</span>
            </button>
          )}

          {workItems.length > 0 && (
            <div className="flex space-x-3 mt-4">
              {editingRecord ? (
                <>
                  <button
                    onClick={handleUpdateRecord}
                    disabled={updateMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    <Save className="h-5 w-5" />
                    <span>{updateMutation.isPending ? '更新中...' : '更新记录'}</span>
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="flex-1 bg-gray-500 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    <span>取消</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSaveRecord}
                  disabled={saveMutation.isPending}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  <Save className="h-5 w-5" />
                  <span>{saveMutation.isPending ? '保存中...' : '保存记录'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {currentRecords.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              {format(selectedDate, 'yyyy年MM月dd日')} 已保存记录
            </h2>
            <div className="space-y-3">
              {currentRecords.map((record) => (
                <div key={record.id} className="border-l-4 border-blue-500 pl-4 py-3 bg-blue-50 rounded-r-lg hover:bg-blue-100 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700 font-medium">
                      {record.items.map(item => item.name).join(', ')}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditRecord(record)}
                        className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-200 rounded transition-colors"
                        title="编辑记录"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {record.items.map(item => (
                      <span key={item.id} className="mr-3">
                        {item.name}: {item.quantity}件
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentRecords.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">当日统计</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-center text-white shadow-md">
                <Clock className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dailyHours}</div>
                <div className="text-sm opacity-90">总工时(小时)</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-center text-white shadow-md">
                <Package className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{dailyStats.totalQuantity}</div>
                <div className="text-sm opacity-90">总数量(件)</div>
              </div>
            </div>

            {/* 工件详情列表 */}
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-gray-800">工件详情</h3>
              {currentRecords.map((record) => (
                <div key={record.id} className="space-y-2">
                  {record.items.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <div className="flex justify-between items-center mb-1">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-sm text-blue-600 font-semibold">
                          {Math.round(item.totalTime / 60 * 100) / 100} 小时
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        数量: {item.quantity} 件 | 单位工时: {item.timePerUnit} 分钟/件
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {monthRecords.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              本月已填报数据
            </h2>
            <div className="space-y-3">
              {monthRecords.map((record) => (
                <div key={record.id} className="border-l-4 border-green-500 pl-4 py-3 bg-green-50 rounded-r-lg hover:bg-green-100 transition-colors">
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-700 font-medium">
                      {record.date} - {record.items.map(item => item.name).join(', ')}
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    {record.items.map(item => (
                      <span key={item.id} className="mr-3">
                        {item.name}: {item.quantity}件
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default DailyRecord;
