import React, { useState } from 'react';
import { Compass, Leaf, Landmark, Utensils, PartyPopper, Calendar, ArrowRight, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

const INTERESTS = [
  { id: 'doga', label: 'Doğa & Karavan', icon: Leaf, color: 'text-green-500', bg: 'bg-green-50' },
  { id: 'tarih', label: 'Tarih & Kültür', icon: Landmark, color: 'text-amber-600', bg: 'bg-amber-50' },
  { id: 'gastronomi', label: 'Gastronomi', icon: Utensils, color: 'text-red-500', bg: 'bg-red-50' },
  { id: 'eglence', label: 'Eğlence & Deniz', icon: PartyPopper, color: 'text-purple-500', bg: 'bg-purple-50' }
];

const DURATIONS = [
  { id: 'haftasonu', label: 'Hafta Sonu (1-2 Gün)', icon: Calendar },
  { id: 'kisatatil', label: 'Kısa Kaçamak (3-4 Gün)', icon: Calendar },
  { id: 'uzuntatil', label: 'Uzun Tatil (1 Hafta+)', icon: Calendar }
];

const ROUTES = {
  'doga': {
    title: 'Likya Yolu Doğa Yürüyüşü',
    desc: 'Akdeniz\'in eşsiz doğasında kamp ve karavanla konaklama noktalarıyla dolu bir rota.',
    link: '/destinasyon/akdeniz',
    img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=400&q=80'
  },
  'tarih': {
    title: 'Kapadokya ve Ihlara Vadisi',
    desc: 'Peri bacaları, yeraltı şehirleri ve tarihi vadilerde unutulmaz bir kültürel gezi.',
    link: '/destinasyon/kapadokya',
    img: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=400&q=80'
  },
  'gastronomi': {
    title: 'Gaziantep & Hatay Lezzet Rotası',
    desc: 'Güneydoğu Anadolu\'nun en iyi sokak lezzetleri ve yöresel mutfakları.',
    link: '/destinasyon/turkiye',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80'
  },
  'eglence': {
    title: 'Çeşme & Alaçatı',
    desc: 'Ege\'nin serin sularında gündüz plaj partileri, gece hareketli sokaklar.',
    link: '/destinasyon/ege-bolgesi',
    img: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=400&q=80'
  }
};

export function RouteWizard() {
  const [step, setStep] = useState(1);
  const [interest, setInterest] = useState('');
  const [duration, setDuration] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () => {
    if (step === 2) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
      }, 1000);
    } else {
      setStep(step + 1);
    }
  };

  const handleReset = () => {
    setStep(1);
    setInterest('');
    setDuration('');
  };

  const routeResult = interest ? ROUTES[interest as keyof typeof ROUTES] : ROUTES.doga;

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
      <div className="p-8 md:p-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Compass className="w-6 h-6 text-orange-500" />
              Akıllı Rota Sihirbazı
            </h3>
            <p className="text-gray-500 mt-1 text-sm md:text-base">İlgi alanlarınıza en uygun seyahat rotasını saniyeler içinde planlayın.</p>
          </div>
          <div className="hidden sm:flex space-x-2">
            {[1, 2, 3].map((s) => (
              <div 
                key={s} 
                className={`h-2 w-8 rounded-full ${s <= step ? 'bg-orange-500' : 'bg-gray-200'}`} 
              />
            ))}
          </div>
        </div>

        {/* Step 1: Interests */}
        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Öncelikli tatil tercihiniz nedir?</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {INTERESTS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setInterest(item.id)}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${
                      interest === item.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className={`p-3 rounded-xl ${item.bg}`}>
                      <Icon className={`w-6 h-6 ${item.color}`} />
                    </div>
                    <span className="font-bold text-gray-900 text-lg">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleNext} 
                disabled={!interest}
                className="bg-gray-900 hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                Sonraki Adım <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Duration */}
        {step === 2 && !isLoading && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h4 className="text-lg font-bold text-gray-900 mb-4">Ne kadar vaktiniz var?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {DURATIONS.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setDuration(item.id)}
                    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 text-center transition-all ${
                      duration === item.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className={`w-8 h-8 ${duration === item.id ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className="font-bold text-gray-900">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex justify-between">
              <button 
                onClick={() => setStep(1)} 
                className="text-gray-500 hover:text-gray-900 px-6 py-3 font-medium transition-colors"
              >
                Geri Dön
              </button>
              <button 
                onClick={handleNext} 
                disabled={!duration}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold transition-colors flex items-center gap-2"
              >
                Rotamı Oluştur
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="py-16 text-center animate-in fade-in duration-300">
            <Compass className="w-16 h-16 text-orange-500 mx-auto animate-spin mb-6" />
            <h4 className="text-xl font-bold text-gray-900 mb-2">Size özel rota hazırlanıyor...</h4>
            <p className="text-gray-500">Seçimlerinize en uygun destinasyonlar filtreleniyor.</p>
          </div>
        )}

        {/* Step 3: Result */}
        {step === 3 && !isLoading && routeResult && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
             <div className="bg-gray-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 items-center border border-gray-100">
               <div className="w-full md:w-1/3 aspect-square rounded-2xl overflow-hidden shrink-0 shadow-sm relative group">
                 <img src={routeResult.img} alt={routeResult.title} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
               </div>
               <div className="flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">
                   <Leaf className="w-3.5 h-3.5" /> 98% Eşleşme
                 </div>
                 <h4 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">{routeResult.title}</h4>
                 <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                   {routeResult.desc} Tercihlerinize ({INTERESTS.find(i => i.id === interest)?.label}) ve vaktinize ({DURATIONS.find(d => d.id === duration)?.label}) en uygun rotayı sizin için seçtik.
                 </p>
                 <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                   <Link to={routeResult.link} className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-sm hover:shadow-md text-center">
                     Rotayı İncele
                   </Link>
                   <button onClick={handleReset} className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-500 hover:text-gray-900 px-6 py-3 font-medium transition-colors">
                     <RefreshCw className="w-4 h-4" /> Yeniden Başla
                   </button>
                 </div>
               </div>
             </div>
          </div>
        )}

      </div>
    </div>
  );
}
