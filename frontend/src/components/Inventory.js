import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Scan,
  Edit3, 
  Trash2,
  Calendar,
  MapPin,
  AlertTriangle,
  ShoppingCart,
  Camera,
  X,
  Save,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { toast } from 'sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const CATEGORIES = [
  { value: 'produce', label: 'Produce', color: 'bg-green-100 text-green-800' },
  { value: 'meat', label: 'Meat', color: 'bg-red-100 text-red-800' },
  { value: 'fish', label: 'Fish', color: 'bg-blue-100 text-blue-800' },
  { value: 'dairy', label: 'Dairy', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'pantry', label: 'Pantry', color: 'bg-amber-100 text-amber-800' },
  { value: 'frozen', label: 'Frozen', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'spices', label: 'Spices', color: 'bg-purple-100 text-purple-800' },
  { value: 'general', label: 'General', color: 'bg-gray-100 text-gray-800' }
];

const LOCATIONS = [
  { value: 'pantry', label: 'Pantry' },
  { value: 'fridge', label: 'Refrigerator' },
  { value: 'freezer', label: 'Freezer' },
  { value: 'counter', label: 'Counter' }
];

const UNITS = [
  'each', 'lb', 'kg', 'oz', 'g', 'cup', 'liter', 'ml', 'tbsp', 'tsp', 'package', 'bag', 'box', 'can', 'bottle'
];

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);
  
  // Barcode scanning
  const [scanningBarcode, setScanningBarcode] = useState(false);
  const [manualBarcode, setManualBarcode] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    quantity: 1,
    unit: 'each',
    category: 'general',
    barcode: '',
    brand: '',
    expiration_date: '',
    purchase_date: '',
    location: 'pantry',
    notes: ''
  });

  useEffect(() => {
    loadInventory();
  }, []);

  useEffect(() => {
    filterInventory();
  }, [inventory, searchTerm, selectedCategory, selectedLocation, showExpiringOnly]);

  const loadInventory = async () => {
    try {
      const response = await axios.get(`${API}/inventory`);
      setInventory(response.data);
    } catch (error) {
      console.error('Error loading inventory:', error);
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  const filterInventory = () => {
    let filtered = inventory;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }

    // Location filter
    if (selectedLocation) {
      filtered = filtered.filter(item => item.location === selectedLocation);
    }

    // Expiring soon filter
    if (showExpiringOnly) {
      const weekFromNow = new Date();
      weekFromNow.setDate(weekFromNow.getDate() + 7);
      
      filtered = filtered.filter(item => {
        if (!item.expiration_date) return false;
        const expirationDate = new Date(item.expiration_date);
        return expirationDate <= weekFromNow;
      });
    }

    setFilteredInventory(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const submitData = {
        ...formData,
        quantity: parseFloat(formData.quantity),
        expiration_date: formData.expiration_date || null,
        purchase_date: formData.purchase_date || null
      };

      if (editingItem) {
        await axios.put(`${API}/inventory/${editingItem.id}`, submitData);
        toast.success(`Updated ${submitData.name} in inventory`);
      } else {
        await axios.post(`${API}/inventory`, submitData);
        toast.success(`Added ${submitData.name} to inventory`);
      }
      
      loadInventory();
      resetForm();
    } catch (error) {
      console.error('Error saving inventory item:', error);
      toast.error('Failed to save inventory item');
    }
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Are you sure you want to remove "${item.name}" from inventory?`)) {
      try {
        await axios.delete(`${API}/inventory/${item.id}`);
        toast.success(`Removed ${item.name} from inventory`);
        loadInventory();
      } catch (error) {
        console.error('Error deleting inventory item:', error);
        toast.error('Failed to remove inventory item');
      }
    }
  };

  const startEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      barcode: item.barcode || '',
      brand: item.brand || '',
      expiration_date: item.expiration_date || '',
      purchase_date: item.purchase_date || '',
      location: item.location,
      notes: item.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      quantity: 1,
      unit: 'each',
      category: 'general',
      barcode: '',
      brand: '',
      expiration_date: '',
      purchase_date: '',
      location: 'pantry',
      notes: ''
    });
    setEditingItem(null);
    setShowForm(false);
    setManualBarcode('');
  };

  const startCamera = async () => {
    try {
      // Import QuaggaJS dynamically
      const Quagga = await import('quagga');
      
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: videoRef.current,
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          }
        },
        decoder: {
          readers: [
            "code_128_reader",
            "ean_reader",
            "ean_8_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader"
          ]
        },
        locate: true,
        locator: {
          patchSize: "medium",
          halfSample: true
        }
      }, (err) => {
        if (err) {
          console.error('QuaggaJS initialization error:', err);
          toast.error('Unable to initialize barcode scanner. Please enter barcode manually.');
          return;
        }
        
        Quagga.start();
        setScanningBarcode(true);
        
        // Listen for barcode detection
        Quagga.onDetected((data) => {
          const barcode = data.codeResult.code;
          console.log('Barcode detected:', barcode);
          Quagga.stop();
          setScanningBarcode(false);
          setShowScanner(false);
          lookupBarcode(barcode);
        });
      });
      
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast.error('Unable to access camera. Please enter barcode manually.');
    }
  };

  const stopCamera = async () => {
    try {
      // Stop QuaggaJS if it's running
      if (scanningBarcode) {
        const Quagga = await import('quagga');
        Quagga.stop();
      }
      
      // Stop any media stream
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
      
      setScanningBarcode(false);
      setShowScanner(false);
    } catch (error) {
      console.error('Error stopping camera:', error);
      setScanningBarcode(false);
      setShowScanner(false);
    }
  };

  const lookupBarcode = async (barcode) => {
    if (!barcode) return;
    
    try {
      const response = await axios.post(`${API}/inventory/barcode/${barcode}`);
      const productInfo = response.data;
      
      setFormData(prev => ({
        ...prev,
        name: productInfo.name,
        brand: productInfo.brand || '',
        category: productInfo.category || 'general',
        unit: productInfo.unit || 'each',
        barcode: barcode
      }));
      
      toast.success('Product information loaded from barcode');
      stopCamera();
      setShowForm(true);
    } catch (error) {
      console.error('Error looking up barcode:', error);
      toast.error('Could not find product information for this barcode');
      
      // Still allow manual entry with the barcode
      setFormData(prev => ({
        ...prev,
        barcode: barcode
      }));
      stopCamera();
      setShowForm(true);
    }
  };

  const handleManualBarcodeSubmit = () => {
    if (manualBarcode.trim()) {
      lookupBarcode(manualBarcode.trim());
    }
  };

  const getCategoryColor = (category) => {
    const categoryObj = CATEGORIES.find(c => c.value === category);
    return categoryObj ? categoryObj.color : 'bg-gray-100 text-gray-800';
  };

  const getExpirationStatus = (expirationDate) => {
    if (!expirationDate) return null;
    
    const expDate = new Date(expirationDate);
    const today = new Date();
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { status: 'expired', color: 'bg-red-100 text-red-800', text: 'Expired' };
    } else if (diffDays <= 3) {
      return { status: 'expiring', color: 'bg-orange-100 text-orange-800', text: `Expires in ${diffDays} days` };
    } else if (diffDays <= 7) {
      return { status: 'warning', color: 'bg-yellow-100 text-yellow-800', text: `Expires in ${diffDays} days` };
    }
    
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6 fade-in-up">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
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
          <h1 className="text-4xl font-bold gradient-text font-space-grotesk" data-testid="inventory-title">
            Food Inventory
          </h1>
          <p className="text-gray-600 mt-2">
            Track your current food inventory and never run out of essentials
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button 
            onClick={() => setShowScanner(true)}
            variant="outline"
            className="flex items-center space-x-2"
            data-testid="scan-barcode-btn"
          >
            <Scan className="w-4 h-4" />
            <span>Scan Barcode</span>
          </Button>
          
          <Button 
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2"
            data-testid="add-inventory-btn"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="custom-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">{inventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-emerald-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="custom-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold text-orange-600">
                  {inventory.filter(item => {
                    const status = getExpirationStatus(item.expiration_date);
                    return status && (status.status === 'expiring' || status.status === 'expired');
                  }).length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="custom-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-bold text-blue-600">
                  {new Set(inventory.map(item => item.category)).size}
                </p>
              </div>
              <Filter className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="custom-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventory.filter(item => item.quantity <= 1).length}
                </p>
              </div>
              <ShoppingCart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="custom-shadow">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search Items</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or brand..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="inventory-search-input"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label>Category</Label>
              <select 
                value={selectedCategory} 
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                data-testid="category-filter"
              >
                <option value="">All categories</option>
                {CATEGORIES.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div className="space-y-2">
              <Label>Location</Label>
              <select 
                value={selectedLocation} 
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                data-testid="location-filter"
              >
                <option value="">All locations</option>
                {LOCATIONS.map(location => (
                  <option key={location.value} value={location.value}>
                    {location.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Expiring Soon Toggle */}
            <div className="space-y-2">
              <Label>Quick Filters</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="expiring-soon"
                  checked={showExpiringOnly}
                  onCheckedChange={setShowExpiringOnly}
                  data-testid="expiring-soon-filter"
                />
                <Label htmlFor="expiring-soon" className="text-sm cursor-pointer">
                  Expiring Soon
                </Label>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="space-y-2">
              <Label>&nbsp;</Label>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                  setShowExpiringOnly(false);
                }}
                data-testid="clear-filters-btn"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {filteredInventory.length} of {inventory.length} items
      </div>

      {/* Inventory Grid */}
      {filteredInventory.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInventory.map((item) => {
            const expirationStatus = getExpirationStatus(item.expiration_date);
            
            return (
              <Card key={item.id} className="custom-shadow hover:shadow-lg transition-all duration-200" data-testid={`inventory-item-${item.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg" data-testid={`item-name-${item.id}`}>
                        {item.name}
                      </CardTitle>
                      {item.brand && (
                        <CardDescription>{item.brand}</CardDescription>
                      )}
                    </div>
                    
                    <div className="flex space-x-2 ml-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => startEdit(item)}
                        data-testid={`edit-item-${item.id}`}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(item)}
                        className="text-red-600 hover:text-red-700"
                        data-testid={`delete-item-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Quantity and Unit */}
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">
                      {item.quantity} {item.unit}
                    </span>
                    <Badge className={getCategoryColor(item.category)}>
                      {CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                    </Badge>
                  </div>

                  {/* Location */}
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="capitalize">{item.location}</span>
                  </div>

                  {/* Expiration Status */}
                  {expirationStatus && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <Badge className={expirationStatus.color}>
                        {expirationStatus.text}
                      </Badge>
                    </div>
                  )}

                  {/* Barcode */}
                  {item.barcode && (
                    <div className="text-xs text-gray-500">
                      Barcode: {item.barcode}
                    </div>
                  )}

                  {/* Notes */}
                  {item.notes && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {item.notes}
                    </p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="custom-shadow">
          <CardContent className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {inventory.length === 0 ? 'No Items in Inventory' : 'No Items Match Your Filters'}
            </h3>
            <p className="text-gray-500 mb-6">
              {inventory.length === 0 
                ? 'Start building your inventory by adding items manually or scanning barcodes' 
                : 'Try adjusting your search criteria or clear the filters'
              }
            </p>
            {inventory.length === 0 ? (
              <div className="flex justify-center space-x-3">
                <Button 
                  onClick={() => setShowScanner(true)}
                  variant="outline"
                  data-testid="scan-first-item-btn"
                >
                  <Scan className="w-4 h-4 mr-2" />
                  Scan First Item
                </Button>
                <Button 
                  onClick={() => setShowForm(true)}
                  data-testid="add-first-item-btn"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Item
                </Button>
              </div>
            ) : (
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('');
                  setSelectedLocation('');
                  setShowExpiringOnly(false);
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

      {/* Barcode Scanner Dialog */}
      <Dialog open={showScanner} onOpenChange={setShowScanner}>
        <DialogContent className="max-w-2xl" data-testid="barcode-scanner-dialog">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Scan className="w-5 h-5" />
              <span>Scan Barcode</span>
            </DialogTitle>
            <DialogDescription>
              Use your camera to scan a product barcode, or enter it manually below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Camera Scanner */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Camera Scanner</Label>
                {!scanningBarcode ? (
                  <Button onClick={startCamera} variant="outline" size="sm">
                    <Camera className="w-4 h-4 mr-2" />
                    Start Camera
                  </Button>
                ) : (
                  <Button onClick={stopCamera} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" />
                    Stop Camera
                  </Button>
                )}
              </div>
              
              {scanningBarcode && (
                <div className="relative bg-black rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-64 object-cover"
                  />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-64 h-32 border-2 border-emerald-500 bg-transparent rounded-lg opacity-75"></div>
                  </div>
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
                    Position barcode within the frame
                  </div>
                </div>
              )}
            </div>

            {/* Manual Barcode Entry */}
            <div className="space-y-4">
              <Label>Or Enter Barcode Manually</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter barcode number..."
                  value={manualBarcode}
                  onChange={(e) => setManualBarcode(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualBarcodeSubmit()}
                  data-testid="manual-barcode-input"
                />
                <Button 
                  onClick={handleManualBarcodeSubmit}
                  disabled={!manualBarcode.trim()}
                  data-testid="submit-barcode-btn"
                >
                  Lookup
                </Button>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <Button 
                variant="outline" 
                onClick={() => {
                  stopCamera();
                  setManualBarcode('');
                }}
                data-testid="cancel-scanner-btn"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add/Edit Item Dialog - Form will be implemented in next part */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-testid="inventory-form-dialog">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? `Edit ${editingItem.name}` : 'Add Inventory Item'}
            </DialogTitle>
            <DialogDescription>
              Add or update details for this inventory item.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="item-name">Item Name *</Label>
                <Input
                  id="item-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                  required
                  data-testid="item-name-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
                  placeholder="Enter brand name"
                  data-testid="brand-input"
                />
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseFloat(e.target.value) || 0 }))}
                  required
                  data-testid="quantity-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <select 
                  id="unit"
                  value={formData.unit} 
                  onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  data-testid="unit-select"
                >
                  {UNITS.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select 
                  id="category"
                  value={formData.category} 
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  data-testid="category-select"
                >
                  {CATEGORIES.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Storage Location</Label>
                <select 
                  id="location"
                  value={formData.location} 
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  data-testid="location-select"
                >
                  {LOCATIONS.map(location => (
                    <option key={location.value} value={location.value}>
                      {location.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiration-date">Expiration Date</Label>
                <Input
                  id="expiration-date"
                  type="date"
                  value={formData.expiration_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiration_date: e.target.value }))}
                  data-testid="expiration-date-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchase-date">Purchase Date</Label>
                <Input
                  id="purchase-date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, purchase_date: e.target.value }))}
                  data-testid="purchase-date-input"
                />
              </div>
            </div>

            {/* Barcode */}
            <div className="space-y-2">
              <Label htmlFor="barcode">Barcode (Optional)</Label>
              <Input
                id="barcode"
                value={formData.barcode}
                onChange={(e) => setFormData(prev => ({ ...prev, barcode: e.target.value }))}
                placeholder="Enter or scan barcode"
                data-testid="barcode-input"
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any additional notes about this item..."
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
                data-testid="cancel-item-btn"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                type="submit"
                data-testid="save-item-btn"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingItem ? 'Update Item' : 'Add Item'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Inventory;