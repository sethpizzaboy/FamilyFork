import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Plus, Users, ChefHat, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DAYS_OF_WEEK = [
  'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
];

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

const MealPlanner = () => {
  const [familyMembers, setFamilyMembers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [mealPlans, setMealPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  const loadData = async () => {
    try {
      const [membersResponse, recipesResponse, mealsResponse] = await Promise.all([
        axios.get(`${API}/family-members`),
        axios.get(`${API}/recipes`),
        axios.get(`${API}/meal-plans?week_start_date=${currentWeek.toISOString().split('T')[0]}`)
      ]);

      setFamilyMembers(membersResponse.data);
      setRecipes(recipesResponse.data);
      setMealPlans(mealsResponse.data);
    } catch (error) {
      console.error('Error loading meal planner data:', error);
      toast.error('Failed to load meal planner data');
    } finally {
      setLoading(false);
    }
  };

  const addMealPlan = async (familyMemberId, dayOfWeek, mealType, recipeId) => {
    try {
      const mealPlanData = {
        week_start_date: currentWeek.toISOString().split('T')[0],
        family_member_id: familyMemberId,
        day_of_week: dayOfWeek,
        meal_type: mealType,
        recipe_id: recipeId,
        servings: 1
      };

      await axios.post(`${API}/meal-plans`, mealPlanData);
      toast.success('Meal added to plan');
      loadData();
    } catch (error) {
      console.error('Error adding meal plan:', error);
      toast.error('Failed to add meal to plan');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl font-bold gradient-text font-space-grotesk" data-testid="meal-planner-title">
            Meal Planner
          </h1>
          <p className="text-gray-600 mt-2">
            Plan weekly meals for your family
          </p>
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setCurrentWeek(getStartOfWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000)))}
            data-testid="prev-week-btn"
          >
            Previous Week
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentWeek(getStartOfWeek(new Date()))}
            data-testid="current-week-btn"
          >
            This Week
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentWeek(getStartOfWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000)))}
            data-testid="next-week-btn"
          >
            Next Week
          </Button>
        </div>
      </div>

      {/* Week Display */}
      <Card className="custom-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Week of {currentWeek.toLocaleDateString()}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2">
            {DAYS_OF_WEEK.map((day, index) => {
              const date = new Date(currentWeek);
              date.setDate(date.getDate() + index);
              
              return (
                <div key={day} className="text-center">
                  <h3 className="font-semibold text-sm capitalize mb-2">
                    {day} {date.getDate()}
                  </h3>
                  
                  <div className="space-y-2">
                    {MEAL_TYPES.map(mealType => (
                      <div key={mealType} className="bg-gray-50 p-2 rounded-lg min-h-[80px]">
                        <h4 className="text-xs font-medium text-gray-600 mb-1 capitalize">
                          {mealType}
                        </h4>
                        
                        {/* Planned meals for this day/meal type */}
                        <div className="space-y-1">
                          {mealPlans
                            .filter(plan => plan.day_of_week === day && plan.meal_type === mealType)
                            .map(plan => {
                              const recipe = recipes.find(r => r.id === plan.recipe_id);
                              const member = familyMembers.find(m => m.id === plan.family_member_id);
                              
                              return (
                                <div key={plan.id} className="bg-white p-1 rounded text-xs">
                                  <div className="font-medium">{recipe?.name || 'Unknown Recipe'}</div>
                                  <div className="text-gray-500">{member?.name || 'Unknown Member'}</div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Family Members */}
        <Card className="custom-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Family Members</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {familyMembers.length > 0 ? (
              <div className="space-y-2">
                {familyMembers.map(member => (
                  <div key={member.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <span className="font-medium">{member.name}</span>
                    <span className="text-xs text-gray-500">
                      {member.dietary_restrictions?.length || 0} restrictions
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No family members added yet</p>
            )}
          </CardContent>
        </Card>

        {/* Available Recipes */}
        <Card className="custom-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5" />
              <span>Available Recipes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recipes.length > 0 ? (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recipes.slice(0, 10).map(recipe => (
                  <div key={recipe.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">{recipe.name}</div>
                      <div className="text-xs text-gray-500">
                        {recipe.prep_time_minutes + recipe.cook_time_minutes} min • {recipe.servings} servings
                      </div>
                    </div>
                  </div>
                ))}
                {recipes.length > 10 && (
                  <p className="text-xs text-gray-500 text-center">
                    +{recipes.length - 10} more recipes available
                  </p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recipes added yet</p>
            )}
          </CardContent>
        </Card>

        {/* AI Recommendations */}
        <Card className="custom-shadow bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-emerald-800">
              <Sparkles className="w-5 h-5" />
              <span>AI Recommendations</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-emerald-700 mb-4">
              Get personalized meal suggestions based on your family's dietary restrictions and preferences.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-100"
              data-testid="get-ai-recommendations-btn"
            >
              Get AI Suggestions
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MealPlanner;