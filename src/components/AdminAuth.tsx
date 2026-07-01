import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Link from 'next/link';

export function AdminAuth({ children }: { children: React.ReactNode }) {
  const { user, loading, signInWithGoogle } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLocalAdmin, setIsLocalAdmin] = useState(() => localStorage.getItem('admin_auth') === 'true');
  const [authMethod, setAuthMethod] = useState<'google' | 'password'>('google');
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Sadece bu maile admin yetkisi
  const isGoogleAdmin = user && user.email === 'mehmetaliskr@gmail.com';
  const isAdmin = isGoogleAdmin || isLocalAdmin;

  const handlePasswordAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsLocalAdmin(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      setError('Hatalı şifre. Lütfen tekrar deneyin.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setError('');
      await signInWithGoogle();
    } catch (err: any) {
      console.error(err);
      setError('Google ile giriş başarısız oldu. Lütfen manuel giriş yapmayı deneyin.');
    }
  };

  if (!isAdmin) {
    if (user && !isGoogleAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-red-500">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erişim Reddedildi</h2>
            <p className="text-gray-500 text-sm mb-6">Bu sayfayı görüntüleme yetkiniz bulunmamaktadır.</p>
            <div className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg mb-8">
              Giriş yapılan hesap: <br/><strong className="text-gray-700">{user.email}</strong>
            </div>
            
            <Link href="/" className="w-full inline-block py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors">
              Ana Sayfaya Dön
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 font-sans p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Paneli</h2>
          <p className="text-gray-500 text-sm mb-6">Erişim sağlamak için giriş yapmalısınız.</p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {authMethod === 'google' ? (
            <>
              <button 
                onClick={handleGoogleLogin}
                className="w-full py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 mb-4"
              >
                Google ile Giriş Yap
              </button>
              <button 
                onClick={() => setAuthMethod('password')}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium mb-6"
              >
                Şifre ile giriş yap (Alternatif)
              </button>
            </>
          ) : (
            <form onSubmit={handlePasswordAuth} className="space-y-4 mb-6 text-left">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none"
                  placeholder="••••••••"
                />
              </div>
              <button 
                type="submit" 
                className="w-full py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
              >
                Giriş Yap
              </button>
              <div className="text-center">
                <button 
                  type="button"
                  onClick={() => setAuthMethod('google')}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Google girişine dön
                </button>
              </div>
            </form>
          )}

          <div className="pt-4 border-t border-gray-100">
            <Link href="/" className="text-sm text-gray-400 hover:text-gray-600 font-medium">Ana Sayfaya Dön</Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

