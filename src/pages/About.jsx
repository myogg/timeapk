import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Calendar, TrendingUp, Download, Shield } from 'lucide-react';
import Navigation from '../components/Navigation.jsx';

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      <div className="max-w-md mx-auto p-4 pt-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">关于</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">智能工作记录系统</h2>
            <p className="text-gray-600 leading-relaxed">
              专为移动端优化的工作记录工具，帮助您轻松管理日常工作数据，提高工作效率。
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span>主要特点</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">工时记录</h4>
                  <p className="text-sm text-gray-600">支持按数量和工时两种方式记录工作，自动计算总工时</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">日历视图</h4>
                  <p className="text-sm text-gray-600">直观的月历显示，快速查看有记录的日期</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">统计分析</h4>
                  <p className="text-sm text-gray-600">按月统计工作数据，支持工作日设置和加班计算</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Download className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">数据导出导入</h4>
                  <p className="text-sm text-gray-600">支持PDF、CSV、JSON格式导出，方便数据备份和分享</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">本地存储</h4>
                  <p className="text-sm text-gray-600">数据存储在本地浏览器，保护隐私，支持离线使用</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">使用说明</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 mb-1">1. 记录工作</p>
                <p>在首页点击"今日工作记录"或进入"工作记录"页面，添加工件名称、数量和单位工时</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 mb-1">2. 查看统计</p>
                <p>在"日统计"页面查看每日工作汇总，在"月统计"页面查看月度数据分析</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 mb-1">3. 导出数据</p>
                <p>在月统计页面可以导出PDF报表、CSV数据或JSON格式的完整数据</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 mb-1">4. 导入数据</p>
                <p>支持导入JSON格式的数据文件，方便在不同设备间同步数据</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="text-center text-gray-600">
              <p className="text-sm mb-2">© 2024 智能工作记录系统</p>
              <p className="text-sm font-medium">版权所有 ShanSheng</p>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default About;
