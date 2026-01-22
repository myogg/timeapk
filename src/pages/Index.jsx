import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import { format } from 'date-fns';
import { User, Calendar, PlusCircle, LogOut, Clock, Package } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useQuery } from '@tanstack/react-query';
import { getAllRecords } from '../utils/storage.js';

const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy年MM月dd日');
  const todayStr = format(new Date(), 'yyyy-MM-dd');

  const { data: allRecords = [] } = useQuery({
    queryKey: ['allRecords'],
    queryFn: getAllRecords,
  });

  const todayRecords = allRecords.filter(record => record.date === todayStr);

  const todayStats = {
    totalTime: 0,
    totalQuantity: 0,
  };

  todayRecords.forEach(record => {
    record.items.forEach(item => {
      todayStats.totalTime += item.totalTime;
      todayStats.totalQuantity += item.quantity;
    });
  });

  const totalHours = Math.round(todayStats.totalTime / 60 * 100) / 100;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 pb-20">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-6 pt-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">欢迎回来</h2>
              <p className="text-sm text-gray-600">{user?.username || '用户'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="退出登录"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">智能工作记录系统</h1>
          <p className="text-gray-600">专为移动端优化的工作记录工具</p>
        </div>

        {/* 当天记录快捷入口 */}
        <div className="mb-6">
          <Link
            to="/daily"
            className="block bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 text-white transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">今日工作记录</h3>
                  <p className="text-blue-100">{today}</p>
                </div>
              </div>
              <div className="bg-white/20 p-2 rounded-full">
                <PlusCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </Link>
        </div>

        {/* 今日记录详情 */}
        {todayRecords.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">今日记录详情</h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-4 text-center text-white shadow-md">
                <Clock className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{totalHours}</div>
                <div className="text-sm opacity-90">总工时(小时)</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-4 text-center text-white shadow-md">
                <Package className="h-6 w-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{todayStats.totalQuantity}</div>
                <div className="text-sm opacity-90">总数量(件)</div>
              </div>
            </div>

            <div className="space-y-3">
              {todayRecords.map((record) => (
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
          </div>
        )}
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
