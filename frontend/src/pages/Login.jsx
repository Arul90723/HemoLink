import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Building2, UserCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('HOSPITAL');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login for now - in production this would set a token
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-slate-50/50 p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary text-white rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-red-200 animate-bounce-slow">
            <HeartPulse size={40} />
          </div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase">HemoLink</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Intelligent Logistics Network</p>
        </div>

        <div className="bg-white rounded-[3rem] shadow-3xl shadow-slate-200/60 border border-slate-100 p-10 overflow-hidden relative">
          {/* Decorative accent */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-red-50 rounded-full blur-[80px] -mr-20 -mt-20"></div>

          <div className="flex gap-4 mb-10 relative">
            <button 
              className={`flex-1 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] ${isLogin ? 'bg-slate-900 text-white shadow-xl shadow-slate-300' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              onClick={() => setIsLogin(true)}
            >
              Sign In
            </button>
            <button 
              className={`flex-1 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] ${!isLogin ? 'bg-primary text-white shadow-xl shadow-red-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>

          {!isLogin && (
            <div className="flex gap-4 mb-8 relative">
              <button 
                className={`flex-1 py-5 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${role === 'HOSPITAL' ? 'border-primary text-primary bg-red-50/50' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                onClick={() => setRole('HOSPITAL')}
              >
                <Building2 size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Hospital</span>
              </button>
              <button 
                className={`flex-1 py-5 border-2 rounded-2xl flex flex-col items-center gap-3 transition-all ${role === 'DONOR' ? 'border-primary text-primary bg-red-50/50' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                onClick={() => setRole('DONOR')}
              >
                <UserCircle size={24} />
                <span className="text-[10px] font-black uppercase tracking-widest">Donor</span>
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            {!isLogin && role === 'HOSPITAL' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hospital Name</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="City General Hospital" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License ID</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="HL-123456" required />
                </div>
              </>
            )}

            {!isLogin && role === 'DONOR' && (
              <>
                 <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                  <input type="text" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="+1 234 567 8900" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Select Blood Group</label>
                  <select className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl outline-none focus:border-primary font-black text-slate-900 transition-all appearance-none" required>
                    <option value="">CHOOSE CATEGORY...</option>
                    {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(t => (
                      <option key={t} value={t} className="font-black">{t}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <input type="email" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="admin@hospital.com" required />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
              <input type="password" underline="false" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900 transition-all" placeholder="••••••••" required />
            </div>

            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-4 rounded-2xl border border-green-100">
               <ShieldCheck size={18} />
               <p className="text-[10px] font-bold uppercase tracking-tight">Enterprise grade encryption active</p>
            </div>

            <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-red-200 uppercase tracking-[0.2em] text-sm mt-4 flex items-center justify-center gap-2">
              {isLogin ? 'ENTER CONTROL CENTER' : 'INITIALIZE PROTOCOL'}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
