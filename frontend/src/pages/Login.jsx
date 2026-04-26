import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeartPulse, Building2, UserCircle } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState('HOSPITAL');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate login for now
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <div className="card text-center mb-8">
        <HeartPulse size={48} className="mx-auto text-primary mb-4" />
        <h2 className="text-3xl font-black text-primary mb-2 uppercase tracking-tight">HemoLink</h2>
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Global Blood Logistics & Distribution</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-50 p-10 overflow-hidden relative">
        {/* Accent blur */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-full blur-3xl -mr-16 -mt-16"></div>

        <div className="flex gap-4 mb-8 relative">
          <button 
            className={`flex-1 py-4 font-black rounded-2xl transition-all uppercase tracking-widest text-[10px] ${isLogin ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
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
              className={`flex-1 py-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${role === 'HOSPITAL' ? 'border-primary text-primary bg-red-50' : 'border-slate-100 text-slate-300'}`}
              onClick={() => setRole('HOSPITAL')}
            >
              <Building2 size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Hospital</span>
            </button>
            <button 
              className={`flex-1 py-4 border-2 rounded-2xl flex flex-col items-center gap-2 transition-all ${role === 'DONOR' ? 'border-primary text-primary bg-red-50' : 'border-slate-100 text-slate-300'}`}
              onClick={() => setRole('DONOR')}
            >
              <UserCircle size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Donor</span>
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          {!isLogin && role === 'HOSPITAL' && (
            <>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hospital Name</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900" placeholder="City General Hospital" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">License Number</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900" placeholder="LIC-123456" required />
              </div>
            </>
          )}

          {!isLogin && role === 'DONOR' && (
            <>
               <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                <input type="text" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900" placeholder="+1 234 567 8900" required />
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Blood Group</label>
                <select className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900 appearance-none" required>
                  <option value="">Select Group</option>
                  {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
            <input type="email" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900" placeholder="you@example.com" required />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
            <input type="password" spellCheck="false" className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl outline-none focus:border-primary font-bold text-slate-900" placeholder="••••••••" required />
          </div>

          <button type="submit" className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-red-200 uppercase tracking-[0.2em] text-sm mt-8">
            {isLogin ? 'ESTABLISH SESSION' : 'INITIALIZE ACCOUNT'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
