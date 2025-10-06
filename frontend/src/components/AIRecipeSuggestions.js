import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';

const AIRecipeSuggestions = () => {
  const [inventorySuggestions, setInventorySuggestions] = useState([]);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [maxTime, setMaxTime] = useState(30);
  const [mealType, setMealType] = useState('dinner');

  // Get recipe suggestions based on inventory
  const getInventorySuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipes/suggestions/inventory');
      const data = await response.json();
      
      if (data.suggested_recipes) {
        setInventorySuggestions(data.suggested_recipes);
        toast.success(`Found ${data.suggested_recipes.length} recipes you can make!`);
      } else {
        toast.info('Add some inventory items to get recipe suggestions!');
      }
    } catch (error) {
      console.error('Error getting inventory suggestions:', error);
      toast.error('Failed to get recipe suggestions');
    } finally {
      setLoading(false);
    }
  };

  // Get AI-powered meal suggestions
  const getAISuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/recipes/suggestions/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dietary_restrictions: dietaryRestrictions,
          max_time_minutes: maxTime,
          meal_type: mealType
        })
      });
      const data = await response.json();
      
      if (data.ai_suggestions) {
        setAiSuggestions(data.ai_suggestions);
        toast.success(`Found ${data.ai_suggestions.length} AI suggestions!`);
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      toast.error('Failed to get AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  // Get missing ingredients for a recipe
  const getMissingIngredients = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/suggestions/missing-ingredients/${recipeId}`);
      const data = await response.json();
      
      if (data.missing_ingredients) {
        toast.info(`Missing ${data.missing_ingredients.length} ingredients for ${data.recipe_name}`);
        // You could show this in a modal or separate component
        console.log('Missing ingredients:', data.missing_ingredients);
      }
    } catch (error) {
      console.error('Error getting missing ingredients:', error);
      toast.error('Failed to get missing ingredients');
    }
  };

  // Get shopping list for a recipe
  const getShoppingList = async (recipeId) => {
    try {
      const response = await fetch(`/api/recipes/suggestions/shopping-list/${recipeId}`);
      const data = await response.json();
      
      if (data.shopping_list) {
        toast.success(`Shopping list generated for ${data.recipe_name}`);
        // You could show this in a modal or separate component
        console.log('Shopping list:', data.shopping_list);
      }
    } catch (error) {
      console.error('Error getting shopping list:', error);
      toast.error('Failed to get shopping list');
    }
  };

  useEffect(() => {
    getInventorySuggestions();
  }, []);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold">🤖 AI Recipe Suggestions</h2>
        <p className="text-muted-foreground mt-2">
          Get smart meal suggestions based on your available ingredients
        </p>
      </div>

      {/* AI Meal Suggestions Form */}
      <Card>
        <CardHeader>
          <CardTitle>AI Meal Suggestions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Dietary Restrictions</label>
              <Select onValueChange={(value) => setDietaryRestrictions([value])}>
                <SelectTrigger>
                  <SelectValue placeholder="Select diet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pescatarian">Pescatarian</SelectItem>
                  <SelectItem value="carnivore">Carnivore</SelectItem>
                  <SelectItem value="dairy_free">Dairy Free</SelectItem>
                  <SelectItem value="no_added_sugar">No Added Sugar</SelectItem>
                  <SelectItem value="gluten_free">Gluten Free</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Max Time (minutes)</label>
              <Input
                type="number"
                value={maxTime}
                onChange={(e) => setMaxTime(parseInt(e.target.value))}
                placeholder="30"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Meal Type</label>
              <Select onValueChange={setMealType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button 
            onClick={getAISuggestions} 
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Getting AI Suggestions...' : 'Get AI Meal Suggestions'}
          </Button>
        </CardContent>
      </Card>

      {/* Inventory-Based Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Recipes from Your Inventory</CardTitle>
          <Button 
            onClick={getInventorySuggestions} 
            disabled={loading}
            variant="outline"
          >
            {loading ? 'Loading...' : 'Refresh Suggestions'}
          </Button>
        </CardHeader>
        <CardContent>
          {inventorySuggestions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inventorySuggestions.map((recipe, index) => (
                <Card key={index} className="border-l-4 border-l-green-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{recipe.name}</h3>
                      <Badge variant="secondary">
                        {Math.round(recipe.match_percentage || 0)}% match
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {recipe.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>
                        {recipe.available_ingredients || 0} / {recipe.total_ingredients || 0} ingredients
                      </span>
                      <span>
                        {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => getMissingIngredients(recipe._id)}
                      >
                        Missing Ingredients
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => getShoppingList(recipe._id)}
                      >
                        Shopping List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground">
              Add some inventory items to get recipe suggestions!
            </p>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions Results */}
      {aiSuggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>AI Meal Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiSuggestions.map((recipe, index) => (
                <Card key={index} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold">{recipe.name}</h3>
                      <Badge variant="outline">
                        {Math.round(recipe.availability_percentage || 0)}% available
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {recipe.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm">
                      <span>
                        {recipe.available_ingredients_count || 0} / {recipe.total_ingredients_count || 0} ingredients
                      </span>
                      <span>
                        {recipe.prep_time_minutes + recipe.cook_time_minutes} min
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => getMissingIngredients(recipe._id)}
                      >
                        Missing Ingredients
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => getShoppingList(recipe._id)}
                      >
                        Shopping List
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIRecipeSuggestions;


