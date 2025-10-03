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
  ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';

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
    <div className="space-y-8 fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl font-bold gradient-text font-space-grotesk" data-testid="dashboard-title">
            Family Meal Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your family's nutrition and meal planning in one place
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={initializeSampleData}
            variant="outline"
            className="flex items-center space-x-2"
            data-testid="seed-data-btn"
          >
            <Sparkles className="w-4 h-4" />
            <span>Load Sample Recipes</span>
          </Button>
          
          <Link to="/meal-planner">
            <Button className="flex items-center space-x-2" data-testid="plan-week-btn">
              <Plus className="w-4 h-4" />
              <span>Plan This Week</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="custom-shadow hover:shadow-lg transition-all duration-200" data-testid="family-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Family Members</CardTitle>
            <Users className="w-5 h-5 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.familyMembers}</div>
            <p className="text-xs text-gray-500 mt-1">Active profiles</p>
          </CardContent>
        </Card>

        <Card className="custom-shadow hover:shadow-lg transition-all duration-200" data-testid="recipes-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recipes</CardTitle>
            <BookOpen className="w-5 h-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.recipes}</div>
            <p className="text-xs text-gray-500 mt-1">In your collection</p>
          </CardContent>
        </Card>

        <Card className="custom-shadow hover:shadow-lg transition-all duration-200" data-testid="meals-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Weekly Meals</CardTitle>
            <Calendar className="w-5 h-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.weeklyMeals}</div>
            <p className="text-xs text-gray-500 mt-1">Planned this week</p>
          </CardContent>
        </Card>

        <Card className="custom-shadow hover:shadow-lg transition-all duration-200" data-testid="grocery-stats-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Grocery Items</CardTitle>
            <ShoppingCart className="w-5 h-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stats.groceryItems}</div>
            <p className="text-xs text-gray-500 mt-1">On current list</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Family Setup */}
        <Card className="custom-shadow hover:shadow-lg transition-all duration-300 group cursor-pointer" data-testid="family-setup-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                  <Users className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Family Profiles</CardTitle>
                  <CardDescription>Manage dietary restrictions & preferences</CardDescription>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-emerald-600 transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <Link to="/family" className="block">
              <Button variant="outline" className="w-full" data-testid="manage-family-btn">
                {stats.familyMembers === 0 ? 'Set Up Family' : 'Manage Family'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recipe Management */}
        <Card className="custom-shadow hover:shadow-lg transition-all duration-300 group cursor-pointer" data-testid="recipe-management-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Recipe Collection</CardTitle>
                  <CardDescription>Browse & add family-friendly recipes</CardDescription>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <Link to="/recipes" className="block">
              <Button variant="outline" className="w-full" data-testid="browse-recipes-btn">
                {stats.recipes === 0 ? 'Add Recipes' : 'Browse Recipes'}
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Meal Planning */}
        <Card className="custom-shadow hover:shadow-lg transition-all duration-300 group cursor-pointer" data-testid="meal-planning-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Weekly Planning</CardTitle>
                  <CardDescription>Plan meals for each family member</CardDescription>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </CardHeader>
          <CardContent>
            <Link to="/meal-planner" className="block">
              <Button variant="outline" className="w-full" data-testid="plan-meals-btn">
                Plan This Week
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Recipes */}
        <Card className="custom-shadow" data-testid="recent-recipes-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>Recent Recipes</span>
              </CardTitle>
              <Link to="/recipes" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                View All
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentRecipes.length > 0 ? (
              <div className="space-y-3">
                {recentRecipes.map((recipe) => (
                  <div key={recipe.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors" data-testid={`recent-recipe-${recipe.id}`}>
                    <div>
                      <h4 className="font-medium text-gray-900">{recipe.name}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500">{recipe.servings} servings</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {recipe.dietary_restrictions_compliant?.slice(0, 2).map((restriction) => (
                        <span key={restriction} className={`dietary-badge ${restriction.replace('_', '-')}`}>
                          {restriction.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No recipes added yet</p>
                <Link to="/recipes">
                  <Button data-testid="add-first-recipe-btn">Add Your First Recipe</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Meals */}
        <Card className="custom-shadow" data-testid="upcoming-meals-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                <span>This Week's Plan</span>
              </CardTitle>
              <Link to="/meal-planner" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                View Plan
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingMeals.length > 0 ? (
              <div className="space-y-3">
                {upcomingMeals.map((meal, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{meal.recipe_name}</h4>
                      <p className="text-sm text-gray-500">{meal.day} • {meal.meal_type}</p>
                    </div>
                    <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                      {meal.family_member}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No meals planned yet</p>
                <Link to="/meal-planner">
                  <Button data-testid="plan-first-week-btn">Plan This Week</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <Card className="custom-shadow bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200" data-testid="tips-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-emerald-800">
            <Sparkles className="w-5 h-5" />
            <span>Getting Started Tips</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-emerald-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">1. Set Up Family Profiles</h4>
              <p className="text-sm">Add each family member with their dietary restrictions and preferences.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">2. Build Recipe Collection</h4>
              <p className="text-sm">Add recipes that work for your family's dietary needs, or use our brain balance recipes.</p>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">3. Plan & Shop Smart</h4>
              <p className="text-sm">Create weekly meal plans and generate optimized grocery lists automatically.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;