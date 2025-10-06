import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Users, 
  BookOpen, 
  Calendar, 
  ShoppingCart,
  TrendingUp,
  Clock,
  Heart,
  Sparkles,
  Plus,
  ArrowRight,
  Zap,
  Target,
  Award,
  BarChart3,
  Activity,
  Shield,
  Star
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const Dashboard = () => {
  const [stats, setStats] = useState({
    familyMembers: 0,
    recipes: 0,
    weeklyMeals: 0,
    groceryItems: 0
  });
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [upcomingMeals, setUpcomingMeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [familyResponse, recipesResponse] = await Promise.all([
        axios.get(`${API}/family-members`),
        axios.get(`${API}/recipes`)
      ]);

      setStats({
        familyMembers: familyResponse.data.length,
        recipes: recipesResponse.data.length,
        weeklyMeals: 0, // Will be calculated from meal plans
        groceryItems: 0 // Will be calculated from grocery lists
      });

      // Get recent recipes (last 5)
      setRecentRecipes(recipesResponse.data.slice(0, 5));
      
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeSampleData = async () => {
    try {
      await axios.post(`${API}/seed-recipes`);
      loadDashboardData();
    } catch (error) {
      console.error('Error seeding data:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-slide-in-top">
      {/* Professional Header */}
      <div className="enterprise-card">
        <div className="enterprise-card-header">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold gradient-enterprise-text font-display" data-testid="dashboard-title">
                  Family Fork Enterprise
                </h1>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <Shield className="w-3 h-3 mr-1" />
                  Enterprise
                </Badge>
              </div>
              <p className="text-slate-600 text-lg">
                Professional meal planning and family nutrition management
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Activity className="w-4 h-4" />
                  <span>All systems operational</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-500">
                  <Star className="w-4 h-4 text-amber-500" />
                  <span>Premium features enabled</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                onClick={initializeSampleData}
                variant="outline"
                className="btn-enterprise btn-enterprise-secondary flex items-center space-x-2"
                data-testid="seed-data-btn"
              >
                <Sparkles className="w-4 h-4" />
                <span>Load Sample Data</span>
              </Button>
              
              <Link to="/meal-planner">
                <Button className="btn-enterprise btn-enterprise-primary flex items-center space-x-2" data-testid="plan-week-btn">
                  <Plus className="w-4 h-4" />
                  <span>Plan This Week</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="enterprise-card hover-enterprise" data-testid="family-stats-card">
          <div className="enterprise-card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">{stats.familyMembers}</div>
                <div className="text-sm text-slate-500">Active profiles</div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">Family Members</h3>
              <p className="text-sm text-slate-600">Manage dietary restrictions and preferences</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-xs text-slate-500">All systems operational</span>
              </div>
            </div>
          </div>
        </div>

        <div className="enterprise-card hover-enterprise" data-testid="recipes-stats-card">
          <div className="enterprise-card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">{stats.recipes}</div>
                <div className="text-sm text-slate-500">In collection</div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">Recipe Collection</h3>
              <p className="text-sm text-slate-600">AI-powered suggestions and favorites</p>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700">
                  <Zap className="w-3 h-3 mr-1" />
                  AI Enhanced
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="enterprise-card hover-enterprise" data-testid="meals-stats-card">
          <div className="enterprise-card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">{stats.weeklyMeals}</div>
                <div className="text-sm text-slate-500">This week</div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">Weekly Planning</h3>
              <p className="text-sm text-slate-600">Smart meal scheduling and optimization</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-xs text-slate-500">Auto-optimized</span>
              </div>
            </div>
          </div>
        </div>

        <div className="enterprise-card hover-enterprise" data-testid="grocery-stats-card">
          <div className="enterprise-card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">{stats.groceryItems}</div>
                <div className="text-sm text-slate-500">On list</div>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">Smart Shopping</h3>
              <p className="text-sm text-slate-600">Optimized lists and barcode scanning</p>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span className="text-xs text-slate-500">Smart sorting</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Family Management */}
        <div className="enterprise-card hover-enterprise group cursor-pointer" data-testid="family-setup-card">
          <div className="enterprise-card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Family Management</h3>
                  <p className="text-sm text-slate-600">Dietary profiles & preferences</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Set up individual family member profiles with dietary restrictions, allergies, and preferences for personalized meal planning.
              </p>
              <Link to="/family" className="block">
                <Button className="btn-enterprise btn-enterprise-primary w-full" data-testid="manage-family-btn">
                  {stats.familyMembers === 0 ? 'Set Up Family' : 'Manage Family'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Recipe Intelligence */}
        <div className="enterprise-card hover-enterprise group cursor-pointer" data-testid="recipe-management-card">
          <div className="enterprise-card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Recipe Intelligence</h3>
                  <p className="text-sm text-slate-600">AI-powered recipe suggestions</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Access our curated collection of family-friendly recipes with AI-powered suggestions based on your inventory and preferences.
              </p>
              <Link to="/recipes" className="block">
                <Button className="btn-enterprise btn-enterprise-primary w-full" data-testid="browse-recipes-btn">
                  {stats.recipes === 0 ? 'Explore Recipes' : 'Browse Collection'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Smart Planning */}
        <div className="enterprise-card hover-enterprise group cursor-pointer" data-testid="meal-planning-card">
          <div className="enterprise-card-content">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-800">Smart Planning</h3>
                  <p className="text-sm text-slate-600">Automated meal scheduling</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-purple-600 transition-colors" />
            </div>
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Generate optimized weekly meal plans that consider dietary restrictions, cooking time, and ingredient availability.
              </p>
              <Link to="/meal-planner" className="block">
                <Button className="btn-enterprise btn-enterprise-primary w-full" data-testid="plan-meals-btn">
                  Create Meal Plan
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Activity Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recipe Intelligence */}
        <div className="enterprise-card" data-testid="recent-recipes-card">
          <div className="enterprise-card-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Recipe Intelligence</h3>
              </div>
              <Link to="/recipes" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center space-x-1">
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="enterprise-card-content">
            {recentRecipes.length > 0 ? (
              <div className="space-y-4">
                {recentRecipes.map((recipe) => (
                  <div key={recipe.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group" data-testid={`recent-recipe-${recipe.id}`}>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-900">{recipe.name}</h4>
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center space-x-1 text-sm text-slate-500">
                          <Clock className="w-3 h-3" />
                          <span>{recipe.prep_time_minutes + recipe.cook_time_minutes} min</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-slate-500">
                          <Users className="w-3 h-3" />
                          <span>{recipe.servings} servings</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 ml-4">
                      {recipe.dietary_restrictions_compliant?.slice(0, 2).map((restriction) => (
                        <Badge key={restriction} variant="secondary" className="text-xs">
                          {restriction.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">No recipes yet</h4>
                <p className="text-slate-600 mb-6">Start building your recipe collection with our AI-powered suggestions</p>
                <Link to="/recipes">
                  <Button className="btn-enterprise btn-enterprise-primary" data-testid="add-first-recipe-btn">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Recipe
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Smart Planning */}
        <div className="enterprise-card" data-testid="upcoming-meals-card">
          <div className="enterprise-card-header">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800">Smart Planning</h3>
              </div>
              <Link to="/meal-planner" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium flex items-center space-x-1">
                <span>View Plan</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          <div className="enterprise-card-content">
            {upcomingMeals.length > 0 ? (
              <div className="space-y-4">
                {upcomingMeals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors group">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-800 group-hover:text-slate-900">{meal.recipe_name}</h4>
                      <p className="text-sm text-slate-600 mt-1">{meal.day} • {meal.meal_type}</p>
                    </div>
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                      {meal.family_member}
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <h4 className="text-lg font-semibold text-slate-800 mb-2">No meals planned</h4>
                <p className="text-slate-600 mb-6">Create your first weekly meal plan with smart scheduling</p>
                <Link to="/meal-planner">
                  <Button className="btn-enterprise btn-enterprise-primary" data-testid="plan-first-week-btn">
                    <Calendar className="w-4 h-4 mr-2" />
                    Plan This Week
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Professional Getting Started Guide */}
      <div className="enterprise-card bg-gradient-to-br from-slate-50 to-emerald-50 border-emerald-200" data-testid="tips-card">
        <div className="enterprise-card-header">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800">Enterprise Quick Start Guide</h3>
              <p className="text-sm text-slate-600">Get the most out of your Family Fork Enterprise experience</p>
            </div>
          </div>
        </div>
        <div className="enterprise-card-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <span className="text-emerald-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-slate-800">Family Profiles</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Set up individual family member profiles with dietary restrictions, allergies, and preferences for personalized meal planning and AI suggestions.
              </p>
              <Link to="/family">
                <Button variant="outline" className="w-full text-sm">
                  <Users className="w-4 h-4 mr-2" />
                  Set Up Family
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-slate-800">Recipe Intelligence</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Build your recipe collection with our AI-powered suggestions, dietary filtering, and smart recommendations based on your family's needs.
              </p>
              <Link to="/recipes">
                <Button variant="outline" className="w-full text-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore Recipes
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-slate-800">Smart Planning</h4>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Generate optimized weekly meal plans with automatic grocery list creation, inventory management, and smart scheduling.
              </p>
              <Link to="/meal-planner">
                <Button variant="outline" className="w-full text-sm">
                  <Calendar className="w-4 h-4 mr-2" />
                  Start Planning
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;