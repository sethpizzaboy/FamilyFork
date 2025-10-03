import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  ShoppingCart,
  Package,
  ChefHat
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', testId: 'nav-dashboard' },
    { path: '/family', icon: Users, label: 'Family Members', testId: 'nav-family' },
    { path: '/recipes', icon: BookOpen, label: 'Recipes', testId: 'nav-recipes' },
    { path: '/meal-planner', icon: Calendar, label: 'Meal Planner', testId: 'nav-meal-planner' },
    { path: '/grocery-list', icon: ShoppingCart, label: 'Grocery List', testId: 'nav-grocery-list' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl border-r border-gray-100 z-50">
      <div className="p-6">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8" data-testid="app-logo">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text font-space-grotesk">Family Meal Prep</h1>
            <p className="text-sm text-gray-500">Nutrition made simple</p>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  data-testid={item.testId}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'nav-active' 
                      : 'nav-inactive'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick Actions */}
        <div className="mt-8 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <h3 className="text-sm font-semibold text-emerald-800 mb-2">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              data-testid="quick-add-recipe"
              className="w-full text-left text-sm text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              + Add New Recipe
            </button>
            <button 
              data-testid="quick-plan-week"
              className="w-full text-left text-sm text-emerald-700 hover:text-emerald-900 transition-colors"
            >
              + Plan This Week
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;