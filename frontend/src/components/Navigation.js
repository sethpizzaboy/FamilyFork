import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Users, 
  BookOpen, 
  Calendar, 
  ShoppingCart,
  Package,
  ChefHat,
  Zap,
  TrendingUp,
  Star,
  Settings,
  HelpCircle
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Navigation = () => {
  const location = useLocation();

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard', testId: 'nav-dashboard' },
    { path: '/family', icon: Users, label: 'Family Members', testId: 'nav-family' },
    { path: '/recipes', icon: BookOpen, label: 'Recipes', testId: 'nav-recipes', badge: 'AI' },
    { path: '/inventory', icon: Package, label: 'Inventory', testId: 'nav-inventory' },
    { path: '/meal-planner', icon: Calendar, label: 'Meal Planner', testId: 'nav-meal-planner' },
    { path: '/grocery-list', icon: ShoppingCart, label: 'Grocery List', testId: 'nav-grocery-list' },
  ];

  const quickActions = [
    { icon: TrendingUp, label: 'AI Suggestions', description: 'Get smart meal ideas' },
    { icon: Star, label: 'Favorites', description: 'Your saved recipes' },
    { icon: Settings, label: 'Settings', description: 'Customize your experience' },
    { icon: HelpCircle, label: 'Help & Support', description: 'Get assistance' },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-white/95 backdrop-blur-md shadow-2xl border-r border-slate-200 z-50">
      <div className="p-6 h-full flex flex-col">
        {/* Logo */}
        <div className="flex items-center space-x-3 mb-8" data-testid="app-logo">
          <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
            <ChefHat className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent font-space-grotesk">
              Family Fork
            </h1>
            <p className="text-xs text-slate-500 font-medium">Enterprise Edition</p>
          </div>
        </div>

        {/* Navigation Links */}
        <ul className="space-y-1 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  data-testid={item.testId}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : 'text-slate-500 group-hover:text-slate-700'}`} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-700 border-emerald-200">
                      {item.badge}
                    </Badge>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick Actions */}
        <div className="mt-6 space-y-3">
          <div className="p-4 bg-gradient-to-br from-slate-50 to-emerald-50 rounded-xl border border-slate-200">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-4 h-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-slate-800">Quick Actions</h3>
            </div>
            <div className="space-y-2">
              {quickActions.map((action, index) => (
                <button 
                  key={index}
                  className="w-full text-left p-2 rounded-lg hover:bg-white/60 transition-colors group"
                >
                  <div className="flex items-center space-x-2">
                    <action.icon className="w-4 h-4 text-slate-500 group-hover:text-emerald-600" />
                    <div>
                      <p className="text-xs font-medium text-slate-700">{action.label}</p>
                      <p className="text-xs text-slate-500">{action.description}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status indicator */}
          <div className="flex items-center space-x-2 text-xs text-slate-500">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;