import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { navItems } from '../nav-items';

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 px-4 py-2 shadow-lg">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ to, icon, title }) => (
          <Link
            key={to}
            to={to}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-300 ${
              location.pathname === to
                ? 'text-blue-600 bg-blue-50 shadow-sm transform scale-105'
                : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
            }`}
          >
            <div className={`mb-1 ${location.pathname === to ? 'animate-pulse' : ''}`}>
              {icon}
            </div>
            <span className="text-xs font-medium">{title}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
