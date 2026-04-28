import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';

import { NavLink } from 'react-router-dom';
import { HeartPulse, LayoutDashboard, Map as MapIcon, LogOut } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-50/30">
        {/* Premium Navbar */}
        <nav className="bg-white border-b border-slate-100 px-8 py-6 sticky top-0 z-[5000] shadow-sm backdrop-blur-md bg-white/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl shadow-red-200">
                <HeartPulse size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter uppercase leading-none">HemoLink</h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Intelligent Logistics</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 bg-slate-50 p-2 rounded-2xl border border-slate-100">
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => `flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutDashboard size={16} /> Dashboard
              </NavLink>
              <NavLink 
                to="/map" 
                className={({isActive}) => `flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'bg-white text-primary shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <MapIcon size={16} /> Live Map
              </NavLink>
            </div>

            <button onClick={() => window.location.href='/login'} className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-primary transition-all shadow-xl active:scale-95">
               <LogOut size={20} />
            </button>
          </div>
        </nav>

        <main className="flex-1 p-4 md:p-8">
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
