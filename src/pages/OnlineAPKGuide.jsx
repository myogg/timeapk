
import { useNavigate } from 'react-router-dom';
import { Github, ArrowLeft, CheckCircle, AlertCircle, Download, Smartphone, Code, Terminal, ExternalLink } from 'lucide-react';
import React, { useState } from 'react';
import Navigation from '../components/Navigation.jsx';
const OnlineAPKGuide = () => {
  const navigate = useNavigate();
  const [selectedOptions, setSelectedOptions] = useState({
    githubActions: false,
    monaca: false,
    ionic: false,
    aide: false,
    termux: false
  });

  const handleOptionChange = (option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [option]: !prev[option]
    }));
  };

  const getSelectedCount = () => {
    return Object.values(selectedOptions).filter(Boolean).length;
  };

  const handleStartBuild = () => {
    const selected = Object.entries(selectedOptions)
      .filter(([_, selected]) => selected)
      .map(([key, _]) => key);
    
    if (selected.length === 0) {
      alert('请至少选择一个构建方案');
      return;
    }
    
    // 根据选择的方案跳转到相应的详细指南
    if (selected.includes('githubActions')) {
      alert('即将跳转到GitHub Actions详细指南');
      // 这里可以添加跳转到GitHub Actions详细指南的逻辑
    } else if (selected.includes('monaca')) {
      alert('即将跳转到Monaca.io详细指南');
      // 这里可以添加跳转到Monaca详细指南的逻辑
    } else if (selected.includes('ionic')) {
      alert('即将跳转到Ionic Appflow详细指南');
      // 这里可以添加跳转到Ionic详细指南的逻辑
    } else if (selected.includes('aide')) {
      alert('即将跳转到AIDE详细指南');
      // 这里可以添加跳转到AIDE详细指南的逻辑
    } else if (selected.includes('termux')) {
      alert('即将跳转到Termux详细指南');
      // 这里可以添加跳转到Termux详细指南的逻辑
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pb-20">
      <div className="max-w-md mx-auto p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-100">
          <div className="flex items-center space-x-3 mb-6">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">在线APK构建教程</h1>
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              免费
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">选择适合您的构建方案</h2>
            <p className="text-sm text-gray-600 mb-4">勾选您感兴趣的方案，我们将为您提供详细的操作指南</p>
            
            <div className="space-y-3">
              {/* GitHub Actions */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOptions.githubActions 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleOptionChange('githubActions')}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {selectedOptions.githubActions ? (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Github className="h-5 w-5 text-gray-700" />
                      <h3 className="font-medium text-gray-800">GitHub Actions</h3>
                      <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        推荐
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">完全免费，自动化构建，无需安装任何软件</p>
                  </div>
                </div>
              </div>

              {/* Monaca.io */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOptions.monaca 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleOptionChange('monaca')}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {selectedOptions.monaca ? (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Smartphone className="h-5 w-5 text-gray-700" />
                      <h3 className="font-medium text-gray-800">Monaca.io</h3>
                    </div>
                    <p className="text-sm text-gray-600">在线Cordova构建服务，操作简单</p>
                  </div>
                </div>
              </div>

              {/* Ionic Appflow */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOptions.ionic 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleOptionChange('ionic')}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {selectedOptions.ionic ? (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Code className="h-5 w-5 text-gray-700" />
                      <h3 className="font-medium text-gray-800">Ionic Appflow</h3>
                    </div>
                    <p className="text-sm text-gray-600">支持Cordova应用，提供持续集成</p>
                  </div>
                </div>
              </div>

              {/* AIDE */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOptions.aide 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleOptionChange('aide')}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {selectedOptions.aide ? (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Terminal className="h-5 w-5 text-gray-700" />
                      <h3 className="font-medium text-gray-800">AIDE (Android IDE)</h3>
                    </div>
                    <p className="text-sm text-gray-600">手机端直接构建APK</p>
                  </div>
                </div>
              </div>

              {/* Termux */}
              <div 
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedOptions.termux 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                onClick={() => handleOptionChange('termux')}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-1">
                    {selectedOptions.termux ? (
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    ) : (
                      <div className="h-5 w-5 border-2 border-gray-300 rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Terminal className="h-5 w-5 text-gray-700" />
                      <h3 className="font-medium text-gray-800">Termux + DroidEdit</h3>
                    </div>
                    <p className="text-sm text-gray-600">使用终端模拟器构建，需要技术基础</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">已选择方案</span>
                <span className="text-sm font-bold text-blue-600">{getSelectedCount()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(getSelectedCount() / 5) * 100}%` }}
                ></div>
              </div>
            </div>

            <button
              onClick={handleStartBuild}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Download className="h-5 w-5" />
              <span>开始构建</span>
            </button>
          </div>

          {/* 推荐方案详情 */}
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
            <div className="flex items-center space-x-2 mb-3">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h2 className="text-lg font-semibold text-amber-800">推荐方案</h2>
            </div>
            <p className="text-sm text-amber-700 mb-3">对于大多数用户，强烈推荐GitHub Actions方案</p>
            
            <div className="bg-white rounded-lg p-3 border border-amber-200">
              <h3 className="font-medium text-gray-800 text-sm mb-2">✅ 优点</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 完全免费，无使用限制</li>
                <li>• 自动化构建过程</li>
                <li>• 支持持续集成</li>
                <li>• 无需安装任何软件</li>
                <li>• 构建速度快，通常5-10分钟</li>
              </ul>
            </div>
            
            <div className="bg-white rounded-lg p-3 border border-amber-200 mt-2">
              <h3 className="font-medium text-gray-800 text-sm mb-2">❌ 缺点</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• 需要学习基本的GitHub操作</li>
                <li>• 首次设置需要一些时间</li>
                <li>• 需要稳定的网络连接</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default OnlineAPKGuide;
