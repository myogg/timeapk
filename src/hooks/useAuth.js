import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中的用户信息
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      setUser(JSON.parse(currentUser));
    }
    setIsLoading(false);
  }, []);

  const login = (username, password) => {
    // 检查用户是否存在
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const user = existingUsers.find(u => u.username === username);
    
    if (!user) {
      throw new Error('用户不存在');
    }
    
    // 验证密码
    if (user.password !== password) {
      throw new Error('密码错误');
    }
    
    const userData = {
      id: user.id,
      username: user.username,
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  const register = (username, password) => {
    // 检查用户名是否已存在
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const usernameExists = existingUsers.some(user => user.username === username);
    
    if (usernameExists) {
      throw new Error('用户名已存在');
    }
    
    // 创建新用户
    const newUser = {
      id: Date.now().toString(),
      username: username,
      password: password, // 注意：实际应用中应该加密存储
      createdAt: new Date().toISOString(),
    };
    
    // 保存到本地存储
    const updatedUsers = [...existingUsers, newUser];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    // 自动登录
    const userData = {
      id: newUser.id,
      username: newUser.username,
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    // 清除本地存储的用户信息
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
