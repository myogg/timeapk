import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Smartphone, Code, Terminal, Github, CheckCircle } from 'lucide-react';
import Navigation from '../components/Navigation.jsx';

const APKGuideMobile = () => {
  const navigate = useNavigate();

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
            <h1 className="text-xl font-bold text-gray-800">APK构建指南</h1>
          </div>

          <div className="space-y-4">
            {/* 方案一：GitHub Actions */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <Github className="h-5 w-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-blue-800">方案一：GitHub Actions</h2>
              </div>
              <p className="text-sm text-blue-700 mb-3">完全免费，无需安装应用，自动化构建</p>
              
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">步骤1：创建GitHub账户</h3>
                      <p className="text-xs text-gray-600">在手机浏览器访问 github.com 注册免费账户</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">步骤2：创建仓库</h3>
                      <p className="text-xs text-gray-600">点击"+" → "New repository"，输入仓库名称</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">步骤3：上传代码</h3>
                      <p className="text-xs text-gray-600">点击"Add file" → "Upload files"，上传项目文件</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">步骤4：设置自动构建</h3>
                      <p className="text-xs text-gray-600">点击"Actions" → 创建新工作流 → 粘贴构建代码</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-blue-200">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-gray-800 text-sm">步骤5：下载APK</h3>
                      <p className="text-xs text-gray-600">构建完成后，在"Actions"中下载APK文件</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 方案二：在线构建服务 */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center space-x-2 mb-3">
                <Smartphone className="h-5 w-5 text-green-600" />
                <h2 className="text-lg font-semibold text-green-800">方案二：在线构建服务</h2>
              </div>
              <p className="text-sm text-green-700 mb-3">使用第三方平台，操作简单</p>
              
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <h3 className="font-medium text-gray-800 text-sm">Monaca.io</h3>
                  <p className="text-xs text-gray-600">访问 monaca.io，注册账户，导入GitHub仓库</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-green-200">
                  <h3 className="font-medium text-gray-800 text-sm">Ionic Appflow</h3>
                  <p className="text-xs text-gray-600">访问 ionic.io，有免费计划，支持Cordova应用</p>
                </div>
              </div>
            </div>

            {/* 方案三：手机APP构建 */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center space-x-2 mb-3">
                <Code className="h-5 w-5 text-purple-600" />
                <h2 className="text-lg font-semibold text-purple-800">方案三：手机APP构建</h2>
              </div>
              <p className="text-sm text-purple-700 mb-3">使用手机APP直接构建</p>
              
              <div className="space-y-2">
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <h3 className="font-medium text-gray-800 text-sm">AIDE (Android IDE)</h3>
                  <p className="text-xs text-gray-600">在Google Play下载AIDE，创建Cordova项目</p>
                </div>
                
                <div className="bg-white rounded-lg p-3 border border-purple-200">
                  <h3 className="font-medium text-gray-800 text-sm">Termux + DroidEdit</h3>
                  <p className="text-xs text-gray-600">使用终端模拟器构建，需要一定技术基础</p>
                </div>
              </div>
            </div>

            {/* 推荐方案 */}
            <div className="bg-gradient-to-r from-amber-50 to-amber-100 rounded-lg p-4 border border-amber-200">
              <div className="flex items-center space-x-2 mb-3">
                <Download className="h-5 w-5 text-amber-600" />
                <h2 className="text-lg font-semibold text-amber-800">推荐方案</h2>
              </div>
              <p className="text-sm text-amber-700 mb-3">对于手机用户，强烈推荐GitHub Actions方案</p>
              
              <div className="bg-white rounded-lg p-3 border border-amber-200">
                <h3 className="font-medium text-gray-800 text-sm mb-2">✅ 优点</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 完全免费</li>
                  <li>• 无需安装额外应用</li>
                  <li>• 自动化构建过程</li>
                  <li>• 支持持续集成</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-3 border border-amber-200 mt-2">
                <h3 className="font-medium text-gray-800 text-sm mb-2">❌ 缺点</h3>
                <ul className="text-xs text-gray-600 space-y-1">
                  <li>• 需要学习基本的GitHub操作</li>
                  <li>• 首次设置需要一些时间</li>
                </ul>
              </div>
            </div>

            {/* 注意事项 */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4 border border-red-200">
              <h2 className="text-lg font-semibold text-red-800 mb-3">注意事项</h2>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• 生成的APK是未签名的，可以在手机上直接安装测试</li>
                <li>• 发布到应用商店需要对APK进行签名</li>
                <li>• 首次构建可能需要10-15分钟</li>
                <li>• 建议在WiFi环境下进行构建</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default APKGuideMobile;
