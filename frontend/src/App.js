import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import '@/App.css';
import Dashboard from './components/Dashboard';
import FamilyMembers from './components/FamilyMembers';
import Recipes from './components/Recipes';
import Inventory from './components/Inventory';
import MealPlanner from './components/MealPlanner';
import GroceryList from './components/GroceryList';
import Navigation from './components/Navigation';
import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-white mb-2">Family Fork</h2>
          <p className="text-slate-300">Loading your meal planning experience...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      <BrowserRouter>
        <div className="flex min-h-screen">
          <Navigation />
          <div className="flex-1 flex flex-col ml-64">
            <Header />
            <main className="flex-1 p-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/family" element={<FamilyMembers />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/meal-planner" element={<MealPlanner />} />
                <Route path="/grocery-list" element={<GroceryList />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
        <Toaster 
          position="top-right" 
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            },
          }}
        />
      </BrowserRouter>
    </div>
  );
}

export default App;