
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { format, addDays, subDays } from 'date-fns';
import { getAllRecords } from '../utils/storage.js';
import { TrendingUp, Calendar, ArrowLeft, Package, Clock, ChevronRight, ChevronLeft } from 'lucide-react';
import React, { useState } from 'react';
import Navigation from '../components/Navigation.jsx';
const DailyStats = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  const { data: allRecords = [], isLoading } = useQuery({
    queryKey: ['allRecords'],
    queryFn: getAllRecords,
  });

  const getDailyStats = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const dayRecords = allRecords.filter(record => record.date === dateStr);
    
    const stats = {
      totalItems: 0,
      totalQuantity: 0,
      totalTime: 0,
      uniqueItems: new Set(),
      records: dayRecords
    };

    dayRecords.forEach(record => {
      record.items.forEach(item => {
        stats.totalItems += 1;
        stats.totalQuantity += item.quantity;
        stats.totalTime += item.totalTime;
        stats.uniqueItems.add(item.name);
      });
    });

    stats.uniqueItems = stats.uniqueItems.size;
    return stats;
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

  const stats = getDailyStats(selectedDate);
  const totalHours = Math.round(stats.totalTime / 60 * 100) / 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
              </button>
              <h1 className="text-xl font-bold text-gray-800">日统计</h1>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handlePrevDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextDay}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 text-lg font-semibold text-gray-800">
              <Calendar className="h-5 w-5" />
              <span>{format(selectedDate, 'yyyy年MM月dd日')}</span>
            </div>
          </div>

          {/* 统计卡片 */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-center text-white shadow-md">
              <Clock className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{totalHours}</div>
              <div className="text-sm opacity-90">总工时(小时)</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-center text-white shadow-md">
              <Package className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalQuantity}</div>
              <div className="text-sm opacity-90">总数量(件)</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-4 text-center text-white shadow-md">
              <TrendingUp className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.uniqueItems}</div>
              <div className="text-sm opacity-90">工件种类</div>
            </div>
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg p-4 text-center text-white shadow-md">
              <Calendar className="h-6 w-6 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.records.length}</div>
              <div className="text-sm opacity-90">记录条数</div>
            </div>
          </div>

          {/* 详细记录 */}
          {stats.records.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">详细记录</h3>
              {stats.records.map((record, index) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="text-sm text-gray-600 mb-2">
                    记录时间: {format(new Date(record.createdAt), 'HH:mm:ss')}
                  </div>
                  <div className="space-y-2">
                    {record.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between items-center">
                        <div className="font-medium text-gray-800">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {item.quantity}件 × {item.timePerUnit}分钟 = {(item.totalTime / 60).toFixed(1)}小时
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-gray-500">该日期暂无工作记录</div>
            </div>
          )}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default DailyStats;
