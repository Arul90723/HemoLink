import React, { useState, useEffect } from 'react';
import { AlertTriangle, Droplets, MapPin, Activity, X, CheckCircle2, ChevronRight, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRequest, setNewRequest] = useState({ bloodType: 'O-', units: 1, urgency: 'NORMAL' });
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reqRes, hospRes] = await Promise.all([
          axios.get('/api/requests/prioritized'),
          axios.get('/api/hospitals')
        ]);
        setRequests(reqRes.data || []);
        const myHospital = (hospRes.data && hospRes.data.length > 0) ? hospRes.data[0] : null; 
        if (myHospital && myHospital.inventory) {
          const invArray = Object.entries(myHospital.inventory).map(([type, count]) => ({ type, count }));
          setInventory(invArray);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/requests', newRequest);
      setIsModalOpen(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
      // Refresh requests
      const res = await axios.get('/api/requests/prioritized');
      setRequests(res.data);
    } catch (err) {
      console.error('Error creating request:', err);
      alert('Network Error: Ensure your MongoDB Atlas IP whitelist is set to 0.0.0.0/0');
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[80vh]">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-red-100 rounded-full"></div>
        <div className="absolute inset-0 border-4 border-primary rounded-full animate-spin border-t-transparent"></div>
        <Droplets className="absolute inset-0 m-auto text-primary animate-pulse" size={32} />
      </div>
      <span className="mt-6 text-slate-500 font-bold tracking-widest uppercase text-xs">Synchronizing Network State...</span>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative font-sans">
      
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-24 right-8 z-[10000] bg-green-600 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right duration-300">
          <CheckCircle2 size={24} />
          <div>
            <p className="font-bold">Broadcast Successful</p>
            <p className="text-xs opacity-90 text-green-50">The emergency network has been notified.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <div className="flex items-center gap-2 text-primary font-black text-xs tracking-[0.2em] uppercase mb-2">
            <span className="w-8 h-[2px] bg-primary"></span> Live Control Center
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hospital Dashboard</h1>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-red-200 hover:-translate-y-1 transition-all active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform"></div>
          <Droplets size={24} className="group-hover:animate-bounce" />
          <span className="relative">NEW EMERGENCY REQUEST</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Alerts (4 cols) */}
        <div className="lg:col-span-4">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 overflow-hidden h-full">
            <div className="p-6 bg-slate-900 flex justify-between items-center">
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <AlertTriangle size={20} className="text-primary" /> PRIORITY ALERTS
              </h2>
              <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full">{requests.length} ACTIVE</span>
            </div>
            <div className="p-6 space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
              {requests.length === 0 ? (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity size={32} className="text-slate-200" />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">NO PENDING EMERGENCIES</p>
                  <p className="text-[10px] text-slate-300 mt-2 px-8 leading-relaxed uppercase tracking-widest">The network is currently stable. New requests will appear here instantly.</p>
                </div>
              ) : (
                requests.map(req => (
                  <div key={req._id} className={`group p-5 rounded-3xl border-2 transition-all hover:scale-[1.02] ${req.urgency === 'CRITICAL' ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100 shadow-sm'}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl shadow-lg ${req.urgency === 'CRITICAL' ? 'bg-primary text-white' : 'bg-slate-900 text-white'}`}>
                          {req.bloodType}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800">{req.units} UNITS</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{req.urgency}</p>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-[8px] font-black tracking-widest ${req.urgency === 'CRITICAL' ? 'bg-red-200 text-red-700 animate-pulse' : 'bg-slate-100 text-slate-500'}`}>
                        {req.time || 'LIVE'}
                      </div>
                    </div>
                    <div className="bg-white/60 backdrop-blur p-3 rounded-2xl mb-4 border border-white">
                       <p className="text-xs font-bold text-slate-600 flex items-center gap-2"><MapPin size={12} className="text-primary"/> {req.requesterId?.name || 'Emergency Center'}</p>
                    </div>
                    <button 
                      onClick={() => alert('Coordinating transfer response...')}
                      className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-primary transition-colors flex items-center justify-center gap-2"
                    >
                      RESOLVE NOW <ChevronRight size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Center Column: Inventory (5 cols) */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-50 h-full flex flex-col">
            <div className="p-8 border-b border-slate-50">
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                <Activity size={28} className="text-green-500" /> STOCK STATUS
              </h2>
              <p className="text-slate-400 text-xs mt-1 font-medium">Real-time inventory levels across your facility.</p>
            </div>
            <div className="p-8 flex-1 grid grid-cols-2 gap-6">
              {(inventory.length > 0 ? inventory : ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(t => ({type: t, count: 0}))).map(item => (
                <div key={item.type} className="relative bg-white p-6 rounded-3xl border-2 border-slate-100 hover:border-primary hover:shadow-2xl transition-all cursor-pointer group overflow-hidden">
                  <div className={`absolute top-0 right-0 w-16 h-16 opacity-5 translate-x-4 -translate-y-4 group-hover:opacity-20 transition-all`}>
                    <Droplets size={64} className="text-primary" />
                  </div>
                  <div className={`text-4xl font-black ${item.count < 5 ? 'text-primary' : 'text-primary'}`}>{item.type}</div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Units: {item.count}</div>
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${item.count < 5 ? 'bg-primary' : 'bg-red-400'}`} 
                        style={{width: `${Math.min(100, (item.count / 20) * 100)}%`}}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-8 pt-0">
               <button 
                onClick={() => alert('Opening smart inventory updater...')}
                className="w-full py-5 bg-slate-50 text-slate-900 font-black rounded-[1.5rem] hover:bg-slate-900 hover:text-white transition-all uppercase tracking-[0.25em] text-[10px] border-2 border-slate-100"
              >
                MANAGE INVENTORY
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Actions & Stats (3 cols) */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <div 
            onClick={() => navigate('/map')}
            className="group bg-primary rounded-[2.5rem] p-10 text-white flex flex-col items-center justify-center text-center cursor-pointer hover:shadow-3xl hover:shadow-red-200 transition-all relative overflow-hidden h-1/2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
            <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center mb-6 backdrop-blur-xl group-hover:scale-110 transition-transform">
              <MapPin size={48} className="text-white" />
            </div>
            <h3 className="text-2xl font-black mb-3">SATELLITE MAP</h3>
            <p className="text-white/70 text-[10px] font-bold leading-relaxed uppercase tracking-widest">
              Live Network Visualization
            </p>
          </div>

          <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white h-1/2 flex flex-col justify-between">
             <div>
               <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                 <Activity size={20} className="text-primary" /> NETWORK LOAD
               </h3>
               <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Daily Success</span>
                    <span className="text-xl font-black text-green-400">98.4%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Peers</span>
                    <span className="text-xl font-black text-white">42</span>
                  </div>
               </div>
             </div>
             <div className="pt-6 border-t border-white/5">
                <div className="flex -space-x-3 mb-4">
                  {[1,2,3,4].map(i => <div key={i} className="w-10 h-10 rounded-xl border-4 border-slate-900 bg-slate-800 shadow-xl overflow-hidden">
                    <div className="w-full h-full bg-primary/20 flex items-center justify-center text-[10px] font-black">H{i}</div>
                  </div>)}
                  <div className="w-10 h-10 rounded-xl border-4 border-slate-900 bg-primary flex items-center justify-center text-[10px] font-black shadow-xl">+12</div>
                </div>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">Connected to the South Kerala regional health cluster</p>
             </div>
          </div>
        </div>
      </div>

      {/* RE-DESIGNED MODAL WITH HIGH VISIBILITY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-2xl flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-[3rem] shadow-3xl w-full max-w-xl p-12 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 relative overflow-hidden">
            
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-[100px] -mr-32 -mt-32"></div>

            <div className="flex justify-between items-center mb-10 relative">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary text-white rounded-[1.5rem] flex items-center justify-center shadow-2xl shadow-red-200">
                  <Droplets size={32} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">Broadcast Request</h2>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Emergency Network Uplink</p>
                </div>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all flex items-center justify-center"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreateRequest} className="space-y-10 relative">
              
              {/* Blood Type Selection - FIXED VISIBILITY */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">1. Select Blood Type</label>
                  <span className="text-[10px] font-black text-primary px-3 py-1 bg-red-50 rounded-full">REQUIRED</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setNewRequest({...newRequest, bloodType: type})}
                      className={`group relative py-5 rounded-[1.5rem] font-black text-lg transition-all border-2 flex flex-col items-center justify-center gap-1 ${
                        newRequest.bloodType === type 
                        ? 'bg-primary border-primary text-white shadow-2xl shadow-red-200 scale-105 z-10' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {type}
                      <span className={`text-[8px] font-bold uppercase tracking-tighter ${newRequest.bloodType === type ? 'text-white/60' : 'text-slate-300'}`}>Type</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">2. Quantity (Units)</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      min="1"
                      className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] outline-none focus:border-primary focus:bg-white font-black text-2xl text-slate-900 transition-all"
                      value={newRequest.units}
                      onChange={(e) => setNewRequest({...newRequest, units: e.target.value})}
                    />
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 font-black text-xs uppercase tracking-widest">350ML</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">3. Urgency Level</label>
                  <div className="flex gap-2 p-1.5 bg-slate-50 rounded-[1.5rem] border-2 border-slate-100">
                    {['NORMAL', 'CRITICAL'].map(level => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setNewRequest({...newRequest, urgency: level})}
                        className={`flex-1 py-4 text-[10px] font-black rounded-xl transition-all ${
                          newRequest.urgency === level 
                          ? (level === 'CRITICAL' ? 'bg-primary text-white shadow-lg shadow-red-200' : 'bg-slate-900 text-white shadow-lg shadow-slate-400') 
                          : 'text-slate-400 hover:text-slate-600'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 p-6 rounded-[2rem] flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Info className="text-primary" size={20} />
                 </div>
                 <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
                   By broadcasting this request, you agree to coordinate with matching facilities. 
                   The nearest <span className="text-white font-bold">42 connected hospitals</span> will be notified instantly.
                 </p>
              </div>

              <button 
                type="submit" 
                className="w-full py-6 bg-primary text-white font-black rounded-[2rem] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-3xl shadow-red-200 uppercase tracking-[0.3em] text-sm mt-4 group"
              >
                <span className="group-hover:tracking-[0.4em] transition-all">ESTABLISH UPLINK</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Global CSS for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}} />
    </div>
  );
};

export default Dashboard;
