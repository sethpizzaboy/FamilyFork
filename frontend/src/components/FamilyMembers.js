import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  User, 
  AlertCircle,
  Heart,
  Ban,
  FileText,
  Save,
  X
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
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

const FamilyMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    dietary_restrictions: [],
    favorite_ingredients: [],
    allergies: [],
    dislikes: [],
    notes: ''
  });

  useEffect(() => {
    loadFamilyMembers();
  }, []);

  const loadFamilyMembers = async () => {
    try {
      const response = await axios.get(`${API}/family-members`);
      setMembers(response.data);
    } catch (error) {
      console.error('Error loading family members:', error);
      toast.error('Failed to load family members');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingMember) {
        await axios.put(`${API}/family-members/${editingMember.id}`, formData);
        toast.success(`Updated ${formData.name}'s profile`);
      } else {
        await axios.post(`${API}/family-members`, formData);
        toast.success(`Added ${formData.name} to family`);
      }
      
      loadFamilyMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving family member:', error);
      toast.error('Failed to save family member');
    }
  };

  const handleDelete = async (member) => {
    if (window.confirm(`Are you sure you want to remove ${member.name} from the family?`)) {
      try {
        await axios.delete(`${API}/family-members/${member.id}`);
        toast.success(`Removed ${member.name} from family`);
        loadFamilyMembers();
      } catch (error) {
        console.error('Error deleting family member:', error);
        toast.error('Failed to remove family member');
      }
    }
  };

  const startEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      dietary_restrictions: member.dietary_restrictions || [],
      favorite_ingredients: member.favorite_ingredients || [],
      allergies: member.allergies || [],
      dislikes: member.dislikes || [],
      notes: member.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      dietary_restrictions: [],
      favorite_ingredients: [],
      allergies: [],
      dislikes: [],
      notes: ''
    });
    setEditingMember(null);
    setShowForm(false);
  };

  const handleRestrictionChange = (restriction, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        dietary_restrictions: [...prev.dietary_restrictions, restriction]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        dietary_restrictions: prev.dietary_restrictions.filter(r => r !== restriction)
      }));
    }
  };

  const handleArrayInput = (field, value) => {
    const items = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData(prev => ({ ...prev, [field]: items }));
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
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
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
          <h1 className="text-4xl font-bold gradient-text font-space-grotesk" data-testid="family-members-title">
            Family Members
          </h1>
          <p className="text-gray-600 mt-2">
            Manage dietary restrictions and preferences for each family member
          </p>
        </div>
        
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2"
          data-testid="add-family-member-btn"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </Button>
      </div>

      {/* Family Members Grid */}
      {members.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <Card key={member.id} className="custom-shadow hover:shadow-lg transition-all duration-200" data-testid={`member-card-${member.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg" data-testid={`member-name-${member.id}`}>{member.name}</CardTitle>
                      <CardDescription>
                        {member.dietary_restrictions?.length > 0 
                          ? `${member.dietary_restrictions.length} dietary restriction${member.dietary_restrictions.length > 1 ? 's' : ''}`
                          : 'No restrictions'
                        }
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => startEdit(member)}
                      data-testid={`edit-member-${member.id}`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(member)}
                      className="text-red-600 hover:text-red-700"
                      data-testid={`delete-member-${member.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Dietary Restrictions */}
                {member.dietary_restrictions?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      Dietary Restrictions
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {member.dietary_restrictions.map((restriction) => (
                        <Badge 
                          key={restriction} 
                          className={getDietaryColor(restriction)}
                          data-testid={`member-restriction-${member.id}-${restriction}`}
                        >
                          {DIETARY_RESTRICTIONS.find(d => d.value === restriction)?.label || restriction}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Favorites */}
                {member.favorite_ingredients?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Heart className="w-4 h-4 mr-1 text-red-500" />
                      Favorites
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {member.favorite_ingredients.slice(0, 3).map((ingredient) => (
                        <Badge key={ingredient} variant="outline" className="text-green-700 border-green-200">
                          {ingredient}
                        </Badge>
                      ))}
                      {member.favorite_ingredients.length > 3 && (
                        <Badge variant="outline" className="text-gray-500">
                          +{member.favorite_ingredients.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Allergies */}
                {member.allergies?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Ban className="w-4 h-4 mr-1 text-red-500" />
                      Allergies
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {member.allergies.slice(0, 3).map((allergy) => (
                        <Badge key={allergy} variant="destructive" className="text-xs">
                          {allergy}
                        </Badge>
                      ))}
                      {member.allergies.length > 3 && (
                        <Badge variant="outline" className="text-gray-500">
                          +{member.allergies.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {member.notes && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <FileText className="w-4 h-4 mr-1" />
                      Notes
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2" data-testid={`member-notes-${member.id}`}>
                      {member.notes}
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
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Family Members Added</h3>
            <p className="text-gray-500 mb-6">Start by adding your family members and their dietary preferences</p>
            <Button 
              onClick={() => setShowForm(true)}
              data-testid="add-first-member-btn"
            >
              Add Your First Family Member
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add/Edit Member Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="member-form-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? `Edit ${editingMember.name}` : 'Add Family Member'}
            </DialogTitle>
            <DialogDescription>
              Add dietary restrictions, preferences, and notes for this family member.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter family member's name"
                required
                data-testid="member-name-input"
              />
            </div>

            {/* Dietary Restrictions */}
            <div className="space-y-3">
              <Label>Dietary Restrictions</Label>
              <div className="grid grid-cols-2 gap-3">
                {DIETARY_RESTRICTIONS.map((restriction) => (
                  <div key={restriction.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={restriction.value}
                      checked={formData.dietary_restrictions.includes(restriction.value)}
                      onCheckedChange={(checked) => handleRestrictionChange(restriction.value, checked)}
                      data-testid={`restriction-${restriction.value}`}
                    />
                    <Label 
                      htmlFor={restriction.value} 
                      className="text-sm font-normal cursor-pointer"
                    >
                      {restriction.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Favorite Ingredients */}
            <div className="space-y-2">
              <Label htmlFor="favorites">Favorite Ingredients</Label>
              <Input
                id="favorites"
                value={formData.favorite_ingredients.join(', ')}
                onChange={(e) => handleArrayInput('favorite_ingredients', e.target.value)}
                placeholder="e.g., salmon, broccoli, sweet potatoes (comma separated)"
                data-testid="favorite-ingredients-input"
              />
              <p className="text-xs text-gray-500">Separate multiple ingredients with commas</p>
            </div>

            {/* Allergies */}
            <div className="space-y-2">
              <Label htmlFor="allergies">Allergies</Label>
              <Input
                id="allergies"
                value={formData.allergies.join(', ')}
                onChange={(e) => handleArrayInput('allergies', e.target.value)}
                placeholder="e.g., peanuts, shellfish, tree nuts (comma separated)"
                data-testid="allergies-input"
              />
            </div>

            {/* Dislikes */}
            <div className="space-y-2">
              <Label htmlFor="dislikes">Dislikes</Label>
              <Input
                id="dislikes"
                value={formData.dislikes.join(', ')}
                onChange={(e) => handleArrayInput('dislikes', e.target.value)}
                placeholder="e.g., brussels sprouts, mushrooms (comma separated)"
                data-testid="dislikes-input"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional dietary notes or preferences..."
                rows={3}
                data-testid="notes-input"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={resetForm}
                data-testid="cancel-member-btn"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit"
                data-testid="save-member-btn"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingMember ? 'Update Member' : 'Add Member'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FamilyMembers;