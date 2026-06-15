import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export function NewsletterSubscription() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('loading');
    
    // Simulating API call to mailchimp or similar service
    setTimeout(() => {
      setStatus('success');
      setEmail('');
      
      // Reset status after a few seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    }, 1500);
  };

  return (
    <div className="bg-orange-50 rounded-3xl p-8 md:p-12 border border-orange-100 flex flex-col items-center text-center max-w-4xl mx-auto my-16 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-[-20%] translate-y-[-20%]"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-[20%] translate-y-[20%]"></div>
      
      <div className="relative z-10 w-full">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
          <Mail className="w-8 h-8 text-orange-500" />
        </div>
        
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 font-sans tracking-tight">Gezi Bülteni'ne Katılın</h3>
        <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
          En yeni rotalar, gizli kalmış koylar ve bütçe dostu seyahat ipuçları her hafta e-posta kutunuza gelsin.
        </p>
        
        <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz..."
              required
              disabled={status === 'loading' || status === 'success'}
              className="flex-1 px-5 py-4 rounded-xl border-0 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-orange-500 bg-white text-gray-900 shadow-sm placeholder:text-gray-400 disabled:opacity-70 transition-shadow outline-none text-base"
            />
            <button
              type="submit"
              disabled={status === 'loading' || status === 'success'}
              className={`px-8 py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center gap-2 ${
                status === 'success' 
                  ? 'bg-green-500 hover:bg-green-600' 
                  : 'bg-orange-500 hover:bg-orange-600 shadow-sm hover:shadow-md'
              }`}
            >
              {status === 'loading' ? (
                <span className="animate-pulse">Kaydediliyor...</span>
              ) : status === 'success' ? (
                <>
                  <CheckCircle2 className="w-5 h-5" /> Kayıt Başarılı
                </>
              ) : (
                <>
                  Abone Ol <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
          {status === 'success' && (
            <p className="text-green-600 text-sm font-medium mt-3 animate-in fade-in slide-in-from-bottom-2">
              Teşekkürler! Seyahat maceralarına hazırlanın.
            </p>
          )}
        </form>
        <p className="text-xs text-gray-400 mt-6 max-w-xs mx-auto">
          İstediğiniz zaman abonelikten ayrılabilirsiniz. Spam göndermeyiz, sadece iyi içerik.
        </p>
      </div>
    </div>
  );
}
