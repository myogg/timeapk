import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PlusCircle, BarChart3, Calendar } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '首页' },
    { path: '/daily', icon: PlusCircle, label: '记录' },
    { path: '/daily-stats', icon: Calendar, label: '日统计' },
    { path: '/monthly', icon: BarChart3, label: '月统计' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-2 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
              location.pathname === path
                ? 'text-blue-600 bg-blue-50 shadow-sm transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <Icon className={`h-5 w-5 mb-1 ${location.pathname === path ? 'animate-pulse' : ''}`} />
            <span className="text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
