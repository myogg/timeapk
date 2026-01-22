import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from '../components/Navigation.jsx';
import { format } from 'date-fns';
import { User, TrendingUp, Calendar, PlusCircle, Home, BarChart3, Clock, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';

const Index = () => {
  const { user, logout } = useAuth();
  const today = format(new Date(), 'yyyy年MM月dd日');

  const handleLogout = () => {
    logout();
    // 登出后直接跳转到登录页
    window.location.href = '/login';
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

        <div className="space-y-4">
          <Link 
            to="/daily-stats" 
            className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-3 rounded-full shadow-md">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">日统计</h3>
                <p className="text-gray-600">查看每日工时汇总</p>
              </div>
            </div>
          </Link>
          
          <Link 
            to="/monthly" 
            className="block bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 transform hover:-translate-y-1"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-green-500 to-green-600 p-3 rounded-full shadow-md">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">月度工时统计</h3>
                <p className="text-gray-600">查看每月工时汇总</p>
              </div>
            </div>
          </Link>
          
          {/* 新增统计卡片 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">今日工时</p>
                  <p className="text-xl font-bold text-gray-800">0 小时</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">本月工时</p>
                  <p className="text-xl font-bold text-gray-800">0 小时</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Index;
