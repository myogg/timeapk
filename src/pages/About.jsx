import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Clock, Calendar, TrendingUp, Shield } from 'lucide-react';
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
              一款简洁高效的工作记录管理工具，支持日历视图、工作记录、统计分析等功能，数据本地存储，保护隐私。
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-blue-500" />
              <span>主要功能</span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">月历视图</h4>
                  <p className="text-sm text-gray-600">首页显示当月日历，点击有记录的日期可跳转到当日记录</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Clock className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">工作记录</h4>
                  <p className="text-sm text-gray-600">记录工件名称、数量和工时，自动计算总工时（小时）</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-purple-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">日统计</h4>
                  <p className="text-sm text-gray-600">在记录页面显示当天的工件名称、数量和工时统计</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <TrendingUp className="h-5 w-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-gray-800">月统计</h4>
                  <p className="text-sm text-gray-600">显示当月所有工件种类、数量和工时，合并相同工件，自定义工作天数，计算加班工时</p>
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
                <p className="font-medium text-gray-800 mb-1">1. 查看日历</p>
                <p>首页显示当月日历，有记录的日期会高亮显示，点击可跳转到当日记录</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 mb-1">2. 记录工作</p>
                <p>在"工作记录"页面添加工件名称、数量和单位工时，系统自动计算总工时</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 mb-1">3. 查看日统计</p>
                <p>在记录页面底部查看当天的工件详情、数量和工时统计</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="font-medium text-gray-800 mb-1">4. 查看月统计</p>
                <p>在"月统计"页面查看当月所有工件汇总，设置工作天数，查看加班工时</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <div className="text-center text-gray-600">
              <p className="text-sm mb-2">© 2006 智能工作记录系统</p>
              <p className="text-sm font-medium">版权所有 陕生</p>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default About;
