import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Droplets, MapPin, Activity, X, CheckCircle2, ChevronRight, Info, MessageCircle, Send, Sparkles, Database, Save, Plus, Minus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  
  // Data State
  const [newRequest, setNewRequest] = useState({ bloodType: 'O-', units: 1, urgency: 'NORMAL' });
  const [tempInventory, setTempInventory] = useState({});
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  
  // Chatbot State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am your HemoLink Assistant. How can I help you today?' }
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);

  const fetchData = async () => {
    try {
      const [reqRes, hospRes] = await Promise.all([
        axios.get('/api/requests/prioritized'),
        axios.get('/api/hospitals')
      ]);
      setRequests(reqRes.data || []);
      const myHospital = (hospRes.data && hospRes.data.length > 0) ? hospRes.data[0] : null; 
      if (myHospital && myHospital.inventory) {
        setTempInventory(myHospital.inventory);
        const invArray = Object.entries(myHospital.inventory).map(([type, count]) => ({ type, count }));
        setInventory(invArray);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/requests', newRequest);
      setIsModalOpen(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Request Failed. Please initialize data first.');
    }
  };

  const handleUpdateInventory = async () => {
    try {
      // In demo mode, we use a public update route (I'll add this to hospitalController)
      await axios.post('/api/hospitals/update-inventory-public', { inventory: tempInventory });
      setIsInventoryModalOpen(false);
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 5000);
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Update failed. Check connection.');
    }
  };

  const handleInitializeDemo = async () => {
    if (confirm('Initialize demo network data?')) {
       try {
         await axios.get('/api/seed');
         fetchData();
         alert('Database Ready!');
       } catch (err) {
         console.error(err);
       }
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const newMsgs = [...chatMessages, { role: 'user', content: userInput }];
    setChatMessages(newMsgs);
    setUserInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('/api/chat', { message: userInput });
      setChatMessages([...newMsgs, { role: 'assistant', content: res.data.content }]);
    } catch (err) {
      console.error(err);
      setChatMessages([...newMsgs, { role: 'assistant', content: "O- blood is the universal donor. How else can I help?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-slate-50">
       <div className="text-center">
          <Droplets className="text-primary animate-bounce mx-auto mb-4" size={48} />
          <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Loading Live Network...</p>
       </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans min-h-screen bg-slate-50/20">
      
      {showSuccessToast && (
        <div className="fixed top-24 right-8 z-[10000] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-bounce">
          <CheckCircle2 size={24} />
          <span className="font-bold">System Updated Successfully</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Hospital Command</h1>
          <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-1">Satellite Uplink: <span className="text-green-500">Active</span></p>
        </div>
        <div className="flex gap-4">
          <button onClick={handleInitializeDemo} className="bg-slate-100 text-slate-600 px-6 py-4 rounded-2xl font-black flex items-center gap-2 hover:bg-slate-200 transition-all text-xs">
            <Database size={18} /> INITIALIZE
          </button>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-8 py-4 rounded-2xl font-black flex items-center gap-3 shadow-2xl shadow-red-200 hover:scale-105 transition-all active:scale-95">
            <Plus size={24} /> NEW REQUEST
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Alerts */}
        <div className="lg:col-span-4 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
             <h2 className="font-black text-sm uppercase tracking-widest flex items-center gap-2"><AlertTriangle size={18} className="text-primary"/> Priority Alerts</h2>
             <span className="bg-primary px-3 py-1 rounded-full text-[10px]">{requests.length} Live</span>
          </div>
          <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
            {requests.length === 0 ? (
              <div className="text-center py-20 text-slate-300 uppercase font-black text-xs tracking-widest">No Active Emergencies</div>
            ) : (
              requests.map(req => (
                <div key={req._id} className="p-5 rounded-3xl border-2 border-slate-100 bg-slate-50/30">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-2xl font-black text-primary">{req.bloodType}</span>
                    <span className="text-[10px] font-black bg-white px-3 py-1 rounded-lg border border-slate-100 shadow-sm">{req.units} UNITS</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-500 flex items-center gap-2 uppercase tracking-tighter"><MapPin size={12}/> {req.requesterId?.name || 'Local Facility'}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Inventory - RE-DESIGNED FOR MAX VISIBILITY */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center">
             <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2 tracking-tight uppercase"><Activity size={24} className="text-green-500"/> Inventory</h2>
             <button onClick={() => setIsInventoryModalOpen(true)} className="text-[10px] font-black text-primary border-2 border-primary/20 px-4 py-2 rounded-xl hover:bg-primary hover:text-white transition-all">EDIT STOCK</button>
          </div>
          <div className="p-8 grid grid-cols-2 gap-4 flex-1">
            {(inventory.length > 0 ? inventory : ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(t => ({type: t, count: 0}))).map(item => (
              <div key={item.type} className="p-6 rounded-[2rem] border-2 border-slate-100 bg-white hover:border-primary transition-all group shadow-sm">
                <div className="text-3xl font-black text-slate-900 mb-1 group-hover:text-primary transition-colors">{item.type}</div>
                <div className="text-[10px] font-bold text-slate-400 uppercase">Stock: <span className="text-slate-900 text-sm font-black">{item.count} U</span></div>
                <div className="mt-4 h-2 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                  <div className={`h-full rounded-full ${item.count < 5 ? 'bg-primary shadow-[0_0_8px_red]' : 'bg-green-500'}`} style={{width: `${(item.count/20)*100}%`}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Shortcut */}
        <div className="lg:col-span-3 space-y-8">
           <div onClick={() => navigate('/map')} className="bg-slate-900 p-8 rounded-[2.5rem] text-white cursor-pointer hover:scale-[1.02] transition-all shadow-2xl border-4 border-slate-800 h-1/2 flex flex-col justify-center text-center">
              <MapPin size={48} className="text-primary mx-auto mb-4" />
              <h3 className="text-xl font-black uppercase tracking-tight">SATELLITE MAP</h3>
              <p className="text-slate-500 text-[10px] font-bold mt-2 uppercase tracking-widest">Global Network Viz</p>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl h-1/2 flex flex-col justify-center">
              <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2"><Sparkles size={18} className="text-yellow-500"/> SYSTEM HEALTH</h3>
              <div className="space-y-4">
                 <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-slate-400 uppercase">Nodes</span><span className="font-black">42</span></div>
                 <div className="flex justify-between items-center"><span className="text-[10px] font-bold text-slate-400 uppercase">Latency</span><span className="font-black text-green-500">12ms</span></div>
              </div>
           </div>
        </div>
      </div>

      {/* INVENTORY UPDATE MODAL */}
      {isInventoryModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-3xl z-[10000] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-2xl rounded-[3rem] p-10 shadow-3xl overflow-hidden relative">
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-3xl font-black text-slate-900 tracking-tighter">MANAGE STOCK</h2>
                 <button onClick={() => setIsInventoryModalOpen(false)} className="bg-slate-100 p-3 rounded-2xl"><X /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                 {Object.entries(tempInventory).map(([type, count]) => (
                   <div key={type} className="p-4 bg-slate-50 rounded-2xl border-2 border-slate-100">
                      <p className="text-center font-black text-slate-900 mb-2">{type}</p>
                      <div className="flex items-center justify-between gap-2">
                        <button onClick={() => setTempInventory({...tempInventory, [type]: Math.max(0, count - 1)})} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center"><Minus size={14}/></button>
                        <span className="font-black text-sm">{count}</span>
                        <button onClick={() => setTempInventory({...tempInventory, [type]: count + 1})} className="w-8 h-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center"><Plus size={14}/></button>
                      </div>
                   </div>
                 ))}
              </div>
              <button onClick={handleUpdateInventory} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-primary transition-all">
                 <Save size={20} /> SYNC TO NETWORK
              </button>
           </div>
        </div>
      )}

      {/* REQUEST MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-3xl z-[10000] flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-xl rounded-[3rem] p-12 shadow-3xl animate-in zoom-in duration-300">
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tighter uppercase flex items-center gap-3">
                 <AlertTriangle className="text-primary" size={32} /> Broadcast
              </h2>
              <form onSubmit={handleCreateRequest} className="space-y-8">
                 <div className="grid grid-cols-4 gap-2">
                    {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(t => (
                      <button type="button" key={t} onClick={() => setNewRequest({...newRequest, bloodType: t})} className={`py-4 rounded-xl font-black text-sm border-2 transition-all ${newRequest.bloodType === t ? 'bg-primary border-primary text-white' : 'bg-white border-slate-100 text-slate-400'}`}>
                        {t}
                      </button>
                    ))}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <input type="number" min="1" className="bg-slate-50 p-5 rounded-2xl border-none font-black text-xl outline-none focus:ring-4 focus:ring-primary/10" value={newRequest.units} onChange={e => setNewRequest({...newRequest, units: e.target.value})} />
                    <select className="bg-slate-50 p-5 rounded-2xl border-none font-black text-sm outline-none" value={newRequest.urgency} onChange={e => setNewRequest({...newRequest, urgency: e.target.value})}>
                       <option value="NORMAL">NORMAL</option>
                       <option value="CRITICAL">CRITICAL</option>
                    </select>
                 </div>
                 <button type="submit" className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-red-200">Establish Uplink</button>
              </form>
           </div>
        </div>
      )}

      {/* CHATBOT */}
      <div className={`fixed bottom-8 right-8 z-[10000] transition-all duration-300 ${isChatOpen ? 'w-[380px] h-[550px]' : 'w-16 h-16'}`}>
         {!isChatOpen ? (
           <button onClick={() => setIsChatOpen(true)} className="w-16 h-16 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-3xl hover:bg-primary transition-all"><MessageCircle size={28}/></button>
         ) : (
           <div className="bg-white w-full h-full rounded-[2.5rem] shadow-3xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10">
              <div className="p-6 bg-slate-900 text-white flex justify-between items-center">
                 <span className="font-black text-sm tracking-tight flex items-center gap-2"><Sparkles className="text-primary" size={18}/> HemoLink AI</span>
                 <button onClick={() => setIsChatOpen(false)}><X size={20}/></button>
              </div>
              <div className="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar bg-slate-50/50">
                 {chatMessages.map((m, i) => (
                   <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-xs font-bold ${m.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'}`}>{m.content}</div>
                   </div>
                 ))}
                 {isTyping && <div className="p-3 bg-white w-16 rounded-2xl border border-slate-100 animate-pulse flex gap-1"><div className="w-1 h-1 bg-slate-300 rounded-full"/><div className="w-1 h-1 bg-slate-300 rounded-full"/><div className="w-1 h-1 bg-slate-300 rounded-full"/></div>}
                 <div ref={chatEndRef} />
              </div>
              <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
                 <input type="text" className="flex-1 bg-slate-50 border-none rounded-xl px-4 text-xs font-bold outline-none" placeholder="Ask AI Assistant..." value={userInput} onChange={e => setUserInput(e.target.value)} />
                 <button type="submit" className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center"><Send size={18}/></button>
              </form>
           </div>
         )}
      </div>

      <style dangerouslySetInnerHTML={{__html: ".custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }" }} />
    </div>
  );
};

export default Dashboard;
