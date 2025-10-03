import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  Edit3, 
  Trash2,
  ChefHat,
  Sparkles,
  BookOpen,
  Tag
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const DIETARY_RESTRICTIONS = [
  { value: 'gluten_free', label: 'Gluten Free', color: 'bg-amber-100 text-amber-800' },
  { value: 'dairy_free', label: 'Dairy Free', color: 'bg-blue-100 text-blue-800' },
  { value: 'no_added_sugar', label: 'No Added Sugar', color: 'bg-purple-100 text-purple-800' },
  { value: 'pescatarian', label: 'Pescatarian', color: 'bg-teal-100 text-teal-800' },
  { value: 'carnivore', label: 'Carnivore', color: 'bg-red-100 text-red-800' },
  { value: 'vegetarian', label: 'Vegetarian', color: 'bg-green-100 text-green-800' },
  { value: 'vegan', label: 'Vegan', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'nut_free', label: 'Nut Free', color: 'bg-orange-100 text-orange-800' },
  { value: 'soy_free', label: 'Soy Free', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'egg_free', label: 'Egg Free', color: 'bg-pink-100 text-pink-800' },
];

const MEAL_TYPES = [
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'dinner', label: 'Dinner' },
  { value: 'snack', label: 'Snack' }
];

const STORE_SECTIONS = [
  'produce', 'meat', 'fish', 'dairy', 'pantry', 'frozen', 'spices', 'general'
];

const Recipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('flexible');
  const [selectedRestrictions, setSelectedRestrictions] = useState([]);
  const [selectedMealType, setSelectedMealType] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dietary_restrictions_compliant: [],
    ingredients: [{ name: '', quantity: '', unit: '', store_section: 'general' }],
    instructions: [''],
    prep_time_minutes: 0,
    cook_time_minutes: 0,
    servings: 4,
    meal_types: [],
    tags: []
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  useEffect(() => {
    filterRecipes();
  }, [recipes, searchTerm, selectedRestrictions, selectedMealType, filterMode]);

  const loadRecipes = async () => {
    try {
      const response = await axios.get(`${API}/recipes`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const filterRecipes = () => {
    let filtered = recipes;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Dietary restrictions filter
    if (selectedRestrictions.length > 0) {
      filtered = filtered.filter(recipe => {
        if (filterMode === 'strict') {
          return selectedRestrictions.every(restriction =>
            recipe.dietary_restrictions_compliant.includes(restriction)
          );
        } else {
          return selectedRestrictions.some(restriction =>
            recipe.dietary_restrictions_compliant.includes(restriction)
          );
        }
      });
    }

    // Meal type filter
    if (selectedMealType) {
      filtered = filtered.filter(recipe =>
        recipe.meal_types.includes(selectedMealType)
      );
    }

    setFilteredRecipes(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Clean up form data
      const cleanedData = {
        ...formData,
        ingredients: formData.ingredients.filter(ing => ing.name && ing.quantity),
        instructions: formData.instructions.filter(inst => inst.trim()),
        tags: formData.tags.filter(tag => tag.trim())
      };

      if (editingRecipe) {
        await axios.put(`${API}/recipes/${editingRecipe.id}`, cleanedData);
        toast.success(`Updated ${cleanedData.name} recipe`);
      } else {
        await axios.post(`${API}/recipes`, cleanedData);
        toast.success(`Added ${cleanedData.name} recipe`);
      }
      
      loadRecipes();
      resetForm();
    } catch (error) {
      console.error('Error saving recipe:', error);
      toast.error('Failed to save recipe');
    }
  };

  const handleDelete = async (recipe) => {
    if (window.confirm(`Are you sure you want to delete "${recipe.name}"?`)) {
      try {
        await axios.delete(`${API}/recipes/${recipe.id}`);
        toast.success(`Deleted ${recipe.name} recipe`);
        loadRecipes();
      } catch (error) {
        console.error('Error deleting recipe:', error);
        toast.error('Failed to delete recipe');
      }
    }
  };

  const startEdit = (recipe) => {
    setEditingRecipe(recipe);
    setFormData({
      name: recipe.name,
      description: recipe.description || '',
      dietary_restrictions_compliant: recipe.dietary_restrictions_compliant || [],
      ingredients: recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', quantity: '', unit: '', store_section: 'general' }],
      instructions: recipe.instructions.length > 0 ? recipe.instructions : [''],
      prep_time_minutes: recipe.prep_time_minutes || 0,
      cook_time_minutes: recipe.cook_time_minutes || 0,
      servings: recipe.servings || 4,
      meal_types: recipe.meal_types || [],
      tags: recipe.tags || []
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      dietary_restrictions_compliant: [],
      ingredients: [{ name: '', quantity: '', unit: '', store_section: 'general' }],
      instructions: [''],
      prep_time_minutes: 0,
      cook_time_minutes: 0,
      servings: 4,
      meal_types: [],
      tags: []
    });
    setEditingRecipe(null);
    setShowForm(false);
  };

  const addIngredient = () => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '', store_section: 'general' }]
    }));
  };

  const updateIngredient = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => 
        i === index ? { ...ing, [field]: value } : ing
      )
    }));
  };

  const removeIngredient = (index) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const addInstruction = () => {
    setFormData(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }));
  };

  const updateInstruction = (index, value) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.map((inst, i) => 
        i === index ? value : inst
      )
    }));
  };

  const removeInstruction = (index) => {
    setFormData(prev => ({
      ...prev,
      instructions: prev.instructions.filter((_, i) => i !== index)
    }));
  };

  const getDietaryColor = (restriction) => {
    const dietaryRestriction = DIETARY_RESTRICTIONS.find(d => d.value === restriction);
    return dietaryRestriction ? dietaryRestriction.color : 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-80 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl font-bold gradient-text font-space-grotesk" data-testid="recipes-title">
            Recipe Collection
          </h1>
          <p className="text-gray-600 mt-2">
            Browse and manage your family-friendly recipes
          </p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
          data-testid="add-recipe-btn"
        >
          <Plus className="w-4 h-4" />
          <span>Add Recipe</span>
        </Button>
      </div>

      {/* Filters */}
      <Card className="custom-shadow">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search Recipes</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="recipe-search-input"
                />
              </div>
            </div>

            {/* Filter Mode */}
            <div className="space-y-2">
              <Label>Filter Mode</Label>
              <Select value={filterMode} onValueChange={setFilterMode} data-testid="filter-mode-select">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible">Flexible - Any Match</SelectItem>
                  <SelectItem value="strict">Strict - All Requirements</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Meal Type Filter */}
            <div className="space-y-2">
              <Label>Meal Type</Label>
              <Select value={selectedMealType} onValueChange={setSelectedMealType} data-testid="meal-type-filter">
                <SelectTrigger>
                  <SelectValue placeholder="All meal types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All meal types</SelectItem>
                  {MEAL_TYPES.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRestrictions([]);
                  setSelectedMealType('');
                  setFilterMode('flexible');
                }}
                data-testid="clear-filters-btn"
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Dietary Restrictions */}
          <div className="mt-4">
            <Label className="mb-3 block">Dietary Restrictions</Label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_RESTRICTIONS.map((restriction) => (
                <div key={restriction.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`filter-${restriction.value}`}
                    checked={selectedRestrictions.includes(restriction.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedRestrictions(prev => [...prev, restriction.value]);
                      } else {
                        setSelectedRestrictions(prev => prev.filter(r => r !== restriction.value));
                      }
                    }}
                    data-testid={`filter-restriction-${restriction.value}`}
                  />
                  <Label 
                    htmlFor={`filter-${restriction.value}`} 
                    className="text-sm cursor-pointer"
                  >
                    {restriction.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredRecipes.length} of {recipes.length} recipes
      </div>

      {/* Recipes Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <Card key={recipe.id} className="recipe-card group" data-testid={`recipe-card-${recipe.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg group-hover:text-emerald-600 transition-colors" data-testid={`recipe-name-${recipe.id}`}>
                      {recipe.name}
                    </CardTitle>
                    {recipe.description && (
                      <CardDescription className="mt-1 line-clamp-2">
                        {recipe.description}
                      </CardDescription>
                    )}
                  </div>
                  
                  <div className="flex space-x-2 ml-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => startEdit(recipe)}
                      data-testid={`edit-recipe-${recipe.id}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(recipe)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`delete-recipe-${recipe.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Recipe Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{recipe.prep_time_minutes + recipe.cook_time_minutes} min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{recipe.servings} servings</span>
                    </div>
                  </div>
                </div>

                {/* Meal Types */}
                {recipe.meal_types?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {recipe.meal_types.map((type) => (
                      <Badge key={type} variant="outline" className="text-xs capitalize">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Dietary Restrictions */}
                {recipe.dietary_restrictions_compliant?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {recipe.dietary_restrictions_compliant.slice(0, 3).map((restriction) => (
                      <Badge 
                        key={restriction} 
                        className={`text-xs ${getDietaryColor(restriction)}`}
                      >
                        {DIETARY_RESTRICTIONS.find(d => d.value === restriction)?.label || restriction}
                      </Badge>
                    ))}
                    {recipe.dietary_restrictions_compliant.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{recipe.dietary_restrictions_compliant.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Tags */}
                {recipe.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {recipe.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Ingredients Preview */}
                {recipe.ingredients?.length > 0 && (
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-sm font-medium text-gray-700 mb-1">Main Ingredients:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {recipe.ingredients.slice(0, 4).map(ing => ing.name).join(', ')}
                      {recipe.ingredients.length > 4 && '...'}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="custom-shadow">
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {recipes.length === 0 ? 'No Recipes Added' : 'No Recipes Match Your Filters'}
            </h3>
            <p className="text-gray-500 mb-6">
              {recipes.length === 0 
                ? 'Start building your recipe collection with family-friendly meals' 
                : 'Try adjusting your search criteria or clear the filters'
              }
            </p>
            {recipes.length === 0 ? (
              <Button 
                onClick={() => setShowForm(true)}
                data-testid="add-first-recipe-btn"
              >
                Add Your First Recipe
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedRestrictions([]);
                  setSelectedMealType('');
                }}
                variant="outline"
                data-testid="clear-all-filters-btn"
              >
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Recipe Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" data-testid="recipe-form-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <ChefHat className="w-5 h-5" />
              <span>{editingRecipe ? `Edit ${editingRecipe.name}` : 'Add New Recipe'}</span>
            </DialogTitle>
            <DialogDescription>
              Create a detailed recipe with ingredients, instructions, and dietary information.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="recipe-name">Recipe Name *</Label>
                <Input
                  id="recipe-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter recipe name"
                  required
                  data-testid="recipe-name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="servings">Servings</Label>
                <Input
                  id="servings"
                  type="number"
                  value={formData.servings}
                  onChange={(e) => setFormData(prev => ({ ...prev, servings: parseInt(e.target.value) }))}
                  min="1"
                  data-testid="servings-input"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the recipe..."
                rows={2}
                data-testid="recipe-description-input"
              />
            </div>

            {/* Timing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="prep-time">Prep Time (minutes)</Label>
                <Input
                  id="prep-time"
                  type="number"
                  value={formData.prep_time_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, prep_time_minutes: parseInt(e.target.value) }))}
                  min="0"
                  data-testid="prep-time-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cook-time">Cook Time (minutes)</Label>
                <Input
                  id="cook-time"
                  type="number"
                  value={formData.cook_time_minutes}
                  onChange={(e) => setFormData(prev => ({ ...prev, cook_time_minutes: parseInt(e.target.value) }))}
                  min="0"
                  data-testid="cook-time-input"
                />
              </div>
            </div>

            {/* This is getting too long - I'll continue in the next batch */}
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Recipes;