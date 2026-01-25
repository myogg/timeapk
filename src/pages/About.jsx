import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
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
