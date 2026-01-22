import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogIn, UserPlus, Eye, EyeOff } from 'lucide-react';
import Navigation from '../components/Navigation.jsx';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('请输入用户名');
      return;
    }
    
    if (!password) {
      setError('请输入密码');
      return;
    }
    
    if (password.length < 6) {
      setError('密码长度至少为6位');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('两次输入的密码不一致');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 检查用户名是否已存在
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const usernameExists = existingUsers.some(user => user.username === username.trim());
      
      if (usernameExists) {
        throw new Error('该用户名已被使用');
      }
      
      // 创建新用户（密码在实际应用中应该加密存储）
      const newUser = {
        id: Date.now().toString(),
        username: username.trim(),
        password: password, // 注意：实际应用中应该加密存储
        createdAt: new Date().toISOString(),
      };
      
      // 保存到本地存储
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      // 自动登录
      localStorage.setItem('currentUser', JSON.stringify({
        id: newUser.id,
        username: newUser.username,
      }));
      
      // 跳转到首页
      navigate('/');
    } catch (error) {
      setError(error.message || '注册失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="h-8 w-8 text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">创建账户</h1>
            <p className="text-blue-200">注册智能工作记录系统</p>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                用户名
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-blue-300" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入用户名"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入密码（至少6位）"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-blue-300 hover:text-blue-100"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-200 mb-2">
                确认密码
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请再次输入密码"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-blue-300 hover:text-blue-100"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50"
            >
              <UserPlus className="h-5 w-5" />
              <span>{isLoading ? '注册中...' : '注册'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white/10 text-blue-200">已有账户？</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-medium flex items-center justify-center space-x-2 hover:from-green-600 hover:to-green-700 transition-all duration-200"
          >
            <LogIn className="h-5 w-5" />
            <span>立即登录</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
