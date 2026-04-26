import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Simple Navbar */}
        <nav className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-2xl font-bold text-primary flex items-center gap-2">
              <span className="text-3xl">🩸</span> HemoLink
            </div>
          </div>
        </nav>

        <main className="flex-1 bg-gray-50 p-6">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
