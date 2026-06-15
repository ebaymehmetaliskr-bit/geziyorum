import React, { useState, useEffect, useRef } from 'react';
import { Search, X, MapPin, Compass, FileText, ChevronRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

interface SmartSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MOCK_DATA = [
  { id: 1, type: 'tour', title: 'Ege Kıyıları ve Gizli Koylar', desc: 'İzmir - Muğla Rotaları', link: '/tour/1', icon: Compass },
  { id: 2, type: 'tour', title: 'Kapadokya Peri Bacaları', desc: 'Nevşehir - Avanos - Ürgüp', link: '/tour/2', icon: Compass },
  { id: 3, type: 'route', title: 'Likya Yolu Yürüyüş Rotaları', desc: 'Antalya Çevresi Geniş Rehber', link: '/destinasyon/akdeniz', icon: MapPin },
  { id: 4, type: 'route', title: 'Balkanlar Otobüs Turu Rotaları', desc: 'Sınır Ötesi Rotalar', link: '/destinasyon/balkanlar', icon: MapPin },
  { id: 5, type: 'blog', title: 'Ege Köylerinde Gizli Kalmış 5 Butik Otel', desc: 'Konaklama Rehberi', link: '/blog/ege-koylerinde-gizli-kalmis-5-butik-otel', icon: FileText },
  { id: 6, type: 'blog', title: 'Mavi Yolculuk: En İyi Rotalar ve Bütçe Planlaması', desc: 'Tekne Turu Tavsiyeleri', link: '/blog/mavi-yolculuk-en-iyi-rotalar', icon: FileText },
  { id: 7, type: 'blog', title: 'Göcek Koyları İçin Tekne Turu Tavsiyeleri', desc: 'Rehber', link: '/blog/gocek-koylari-tekne-turu-tavsiyeleri', icon: FileText },
];

export function SmartSearchModal({ isOpen, onClose }: SmartSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      setQuery('');
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const filteredResults = query.trim() === '' 
    ? [] 
    : MOCK_DATA.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.desc.toLowerCase().includes(query.toLowerCase())
      );

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] bg-gray-900/40 backdrop-blur-sm flex items-start justify-center pt-20 sm:pt-32 px-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="relative flex items-center px-4 py-4 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            className="w-full px-4 text-lg text-gray-900 bg-transparent border-0 focus:ring-0 focus:outline-none placeholder:text-gray-300"
            placeholder="Rota, mekan veya blog yazısı arayın..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {query.trim() !== '' && (
          <div className="max-h-[60vh] overflow-y-auto p-2">
            {filteredResults.length > 0 ? (
              <div className="space-y-1">
                {filteredResults.map(result => {
                  const Icon = result.icon;
                  return (
                    <button
                      key={result.id}
                      onClick={() => {
                        navigate(result.link);
                        onClose();
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg ${
                          result.type === 'tour' ? 'bg-orange-100 text-orange-600' :
                          result.type === 'route' ? 'bg-blue-100 text-blue-600' :
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{result.title}</div>
                          <div className="text-sm text-gray-500">{result.desc}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4">
                <Search className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-1">Sonuç Bulunamadı</h3>
                <p className="text-gray-500">"{query}" için bir eşleşme bulamadık. Farklı kelimelerle arama yapmayı deneyin.</p>
              </div>
            )}
          </div>
        )}

        {query.trim() === '' && (
          <div className="p-6 bg-gray-50/50">
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Önerilen Aramalar</h4>
            <div className="flex flex-wrap gap-2">
              {['Kapadokya', 'Ege Koyları', 'Mavi Rota', 'Bungalov', 'Otobüs Turu'].map(suggestion => (
                <button 
                  key={suggestion}
                  onClick={() => setQuery(suggestion)}
                  className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-orange-500 hover:text-orange-600 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
