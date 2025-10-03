import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  ShoppingCart, 
  Plus, 
  Check, 
  X, 
  Sparkles,
  Calendar,
  Package,
  Beef,
  Apple,
  Milk,
  Bread,
  Snowflake,
  ChefHat
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const STORE_SECTION_ICONS = {
  produce: Apple,
  meat: Beef,
  fish: ChefHat,
  dairy: Milk,
  pantry: Package,
  frozen: Snowflake,
  spices: Package,
  general: Package
};

const STORE_SECTION_COLORS = {
  produce: 'bg-green-100 text-green-800',
  meat: 'bg-red-100 text-red-800',
  fish: 'bg-blue-100 text-blue-800',
  dairy: 'bg-yellow-100 text-yellow-800',
  pantry: 'bg-amber-100 text-amber-800',
  frozen: 'bg-cyan-100 text-cyan-800',
  spices: 'bg-purple-100 text-purple-800',
  general: 'bg-gray-100 text-gray-800'
};

const GroceryList = () => {
  const [groceryList, setGroceryList] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkedItems, setCheckedItems] = useState({});
  const [currentWeek, setCurrentWeek] = useState(getStartOfWeek(new Date()));
  const [aiOptimization, setAiOptimization] = useState('');
  const [loadingOptimization, setLoadingOptimization] = useState(false);

  useEffect(() => {
    loadGroceryList();
  }, [currentWeek]);

  function getStartOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
  }

  const loadGroceryList = async () => {
    try {
      const weekString = currentWeek.toISOString().split('T')[0];
      
      try {
        // Try to get existing grocery list
        const response = await axios.get(`${API}/grocery-lists/${weekString}`);
        setGroceryList(response.data);
      } catch (error) {
        if (error.response?.status === 404) {
          // Generate new grocery list if none exists
          await generateGroceryList();
        } else {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error loading grocery list:', error);
      toast.error('Failed to load grocery list');
    } finally {
      setLoading(false);
    }
  };

  const generateGroceryList = async () => {
    try {
      setLoading(true);
      const weekString = currentWeek.toISOString().split('T')[0];
      const response = await axios.post(`${API}/grocery-list/${weekString}`);
      setGroceryList(response.data);
      toast.success('Grocery list generated successfully');
    } catch (error) {
      console.error('Error generating grocery list:', error);
      toast.error('Failed to generate grocery list');
    } finally {
      setLoading(false);
    }
  };

  const getAiOptimization = async () => {
    if (!groceryList) return;
    
    try {
      setLoadingOptimization(true);
      const weekString = currentWeek.toISOString().split('T')[0];
      const response = await axios.post(`${API}/ai/grocery-optimization`, null, {
        params: { week_start_date: weekString }
      });
      setAiOptimization(response.data.optimization_suggestions);
      toast.success('AI optimization suggestions loaded');
    } catch (error) {
      console.error('Error getting AI optimization:', error);
      toast.error('Failed to get AI suggestions');
    } finally {
      setLoadingOptimization(false);
    }
  };

  const toggleItemCheck = (itemIndex) => {
    setCheckedItems(prev => ({
      ...prev,
      [itemIndex]: !prev[itemIndex]
    }));
  };

  const groupItemsBySection = () => {
    if (!groceryList?.items) return {};
    
    const grouped = {};
    groceryList.items.forEach((item, index) => {
      const section = item.store_section || 'general';
      if (!grouped[section]) {
        grouped[section] = [];
      }
      grouped[section].push({ ...item, index });
    });
    
    return grouped;
  };

  const getTotalItems = () => {
    return groceryList?.items?.length || 0;
  };

  const getCheckedItems = () => {
    return Object.values(checkedItems).filter(Boolean).length;
  };

  if (loading) {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const groupedItems = groupItemsBySection();

  return (
    <div className="space-y-6 fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-4xl font-bold gradient-text font-space-grotesk" data-testid="grocery-list-title">
            Grocery List
          </h1>
          <p className="text-gray-600 mt-2">
            Smart grocery list for week of {currentWeek.toLocaleDateString()}
          </p>
        </div>

        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={() => setCurrentWeek(getStartOfWeek(new Date(currentWeek.getTime() - 7 * 24 * 60 * 60 * 1000)))}
            data-testid="prev-week-grocery-btn"
          >
            Previous Week
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentWeek(getStartOfWeek(new Date()))}
            data-testid="current-week-grocery-btn"
          >
            This Week
          </Button>
          <Button 
            variant="outline"
            onClick={() => setCurrentWeek(getStartOfWeek(new Date(currentWeek.getTime() + 7 * 24 * 60 * 60 * 1000)))}
            data-testid="next-week-grocery-btn"
          >
            Next Week
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="custom-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{getTotalItems()}</p>
              </div>
              <ShoppingCart className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="custom-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Checked Off</p>
                <p className="text-2xl font-bold text-gray-900">{getCheckedItems()}</p>
              </div>
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="custom-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getTotalItems() > 0 ? Math.round((getCheckedItems() / getTotalItems()) * 100) : 0}%
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grocery List */}
        <div className="lg:col-span-2">
          {groceryList && groceryList.items && groceryList.items.length > 0 ? (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([section, items]) => {
                const SectionIcon = STORE_SECTION_ICONS[section] || Package;
                const sectionColor = STORE_SECTION_COLORS[section] || 'bg-gray-100 text-gray-800';
                
                return (
                  <Card key={section} className="custom-shadow" data-testid={`grocery-section-${section}`}>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <SectionIcon className="w-5 h-5" />
                        <span className="capitalize">{section}</span>
                        <Badge className={sectionColor}>
                          {items.length} items
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div 
                            key={item.index} 
                            className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg transition-all duration-200 ${
                              checkedItems[item.index] ? 'opacity-60 line-through' : ''
                            }`}
                            data-testid={`grocery-item-${item.index}`}
                          >
                            <div className="flex items-center space-x-3">
                              <Checkbox
                                checked={checkedItems[item.index] || false}
                                onCheckedChange={() => toggleItemCheck(item.index)}
                                data-testid={`grocery-item-checkbox-${item.index}`}
                              />
                              <div>
                                <h4 className="font-medium text-gray-900">{item.ingredient_name}</h4>
                                <p className="text-sm text-gray-600">
                                  {item.total_quantity} {item.unit}
                                </p>
                                {item.from_recipes && item.from_recipes.length > 0 && (
                                  <p className="text-xs text-gray-500">
                                    From: {item.from_recipes.slice(0, 2).join(', ')}
                                    {item.from_recipes.length > 2 && ` +${item.from_recipes.length - 2} more`}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            <Badge variant="outline" className="text-xs">
                              {item.unit}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <Card className="custom-shadow">
              <CardContent className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Grocery List Yet</h3>
                <p className="text-gray-500 mb-6">Generate a grocery list from your weekly meal plans</p>
                <Button 
                  onClick={generateGroceryList}
                  disabled={loading}
                  data-testid="generate-grocery-list-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Generate Grocery List
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card className="custom-shadow">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={generateGroceryList}
                className="w-full"
                disabled={loading}
                data-testid="regenerate-grocery-list-btn"
              >
                <Plus className="w-4 h-4 mr-2" />
                {groceryList ? 'Regenerate List' : 'Generate List'}
              </Button>
              
              {groceryList && (
                <Button 
                  onClick={getAiOptimization}
                  variant="outline"
                  className="w-full"
                  disabled={loadingOptimization}
                  data-testid="get-ai-optimization-btn"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {loadingOptimization ? 'Getting Suggestions...' : 'Get AI Optimization'}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* AI Optimization */}
          {aiOptimization && (
            <Card className="custom-shadow bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-emerald-800">
                  <Sparkles className="w-5 h-5" />
                  <span>AI Optimization</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-emerald-700 whitespace-pre-line">
                  {aiOptimization}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Shopping Tips */}
          <Card className="custom-shadow">
            <CardHeader>
              <CardTitle>Shopping Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Start with produce section while fruits and vegetables are fresh</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Shop frozen items last to maintain cold chain</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Check expiration dates, especially for dairy and meat</p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Buy in bulk for pantry staples to save money</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GroceryList;