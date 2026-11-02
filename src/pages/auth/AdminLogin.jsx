import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2, ShieldCheck, Mail, Lock, ArrowLeft } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('لو سمحت املأ كل الخانات.');
      return;
    }
    
    setErrorMsg('');
    setIsSubmitting(true);
    
    const result = await login(email, password, 'Admin');
    if (result.success) {
      navigate('/admin/staff');
    } else {
      setErrorMsg(result.error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-brand-black p-4 relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-neutral-400 hover:text-white bg-brand-softBlack px-4 py-2 rounded-xl border border-neutral-800 transition-colors font-bold text-sm"
      >
        <ArrowLeft size={18} />
        ارجع للموقع
      </Link>
      <div className="w-full max-w-md bg-brand-softBlack rounded-2xl shadow-2xl p-8 border border-neutral-800 animate-in fade-in zoom-in-95 duration-300">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-primary/10 text-primary mb-6">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">ONE MORE</h1>
          <p className="text-primary font-medium tracking-wide">بوابة الإدارة</p>
          <p className="text-neutral-400 text-sm mt-3 italic">"One Bite , One More"</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-semantic-danger/10 border border-semantic-danger/20 text-semantic-danger text-sm font-medium flex items-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">البريد الإلكتروني</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                <Mail size={20} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-neutral-600"
                placeholder="admin@onemore.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2">كلمة السر</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500">
                <Lock size={20} />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-brand-black border border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-white placeholder:text-neutral-600"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 mt-4 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-lg transition-all shadow-[0_4px_14px_0_rgba(255,106,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,106,0,0.23)] disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                جاري الدخول...
              </>
            ) : (
              'دخول للوحة التحكم'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
