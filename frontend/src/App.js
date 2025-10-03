import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@/App.css';
import Dashboard from './components/Dashboard';
import FamilyMembers from './components/FamilyMembers';
import Recipes from './components/Recipes';
import Inventory from './components/Inventory';
import MealPlanner from './components/MealPlanner';
import GroceryList from './components/GroceryList';
import Navigation from './components/Navigation';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <BrowserRouter>
        <div className="flex">
          <Navigation />
          <main className="flex-1 ml-64">
            <div className="p-8">
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/family" element={<FamilyMembers />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/meal-planner" element={<MealPlanner />} />
                <Route path="/grocery-list" element={<GroceryList />} />
              </Routes>
            </div>
          </main>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;