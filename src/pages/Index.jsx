import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, getDay } from 'date-fns';
import { User, Calendar, PlusCircle, LogOut, Clock, Package } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import { useQuery } from '@tanstack/react-query';
import { getAllRecords } from '../utils/storage.js';

const Index = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const currentMonth = format(today, 'yyyy-MM');

  const { data: allRecords = [] } = useQuery({
    queryKey: ['allRecords'],
    queryFn: getAllRecords,
  });

  const todayRecords = allRecords.filter(record => record.date === todayStr);
  const monthRecords = allRecords.filter(record => record.date.startsWith(currentMonth));

  const datesWithRecords = new Set(allRecords.map(r => r.date));

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDateClick = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    if (datesWithRecords.has(dateStr)) {
      navigate(`/daily?date=${dateStr}`);
    }
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

        {/* 今日工作记录 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">今日工作记录</h3>
            <Link to="/daily" className="text-blue-600 hover:text-blue-700 text-sm">
              <PlusCircle className="h-5 w-5" />
            </Link>
          </div>
          <div className="text-sm text-gray-600 mb-3">{format(today, 'yyyy年MM月dd日')}</div>
          {todayRecords.length > 0 ? (
            <div className="space-y-3">
              {todayRecords.map((record) => (
                <div key={record.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  {record.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <div className="font-medium text-gray-800">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        {item.quantity}件 × {item.timePerUnit}分 = {(item.totalTime / 60).toFixed(1)}时
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-4">暂无记录</div>
          )}
        </div>

        {/* 本月日历 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">{format(today, 'yyyy年MM月')}</h3>
          <div className="grid grid-cols-7 gap-1">
            {['日', '一', '二', '三', '四', '五', '六'].map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-600 py-2">
                {day}
              </div>
            ))}
            {Array.from({ length: getDay(monthStart) }).map((_, i) => (
              <div key={`empty-${i}`} className="aspect-square" />
            ))}
            {daysInMonth.map(date => {
              const dateStr = format(date, 'yyyy-MM-dd');
              const hasRecord = datesWithRecords.has(dateStr);
              const isToday = isSameDay(date, today);
              return (
                <button
                  key={dateStr}
                  onClick={() => handleDateClick(date)}
                  disabled={!hasRecord}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-colors ${
                    isToday ? 'bg-blue-500 text-white font-bold' :
                    hasRecord ? 'bg-blue-100 text-blue-700 hover:bg-blue-200 cursor-pointer' :
                    'text-gray-400'
                  }`}
                >
                  {format(date, 'd')}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
