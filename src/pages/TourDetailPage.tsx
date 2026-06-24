import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TourListing } from '../types';
import { getTourByIdFromWordPress } from '../services/wp-api';
import { ArrowLeft, MapPin, Clock, Star, ExternalLink, Calendar, Users, Share2 } from 'lucide-react';

export function TourDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [listing, setListing] = useState<TourListing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      getTourByIdFromWordPress(id).then(data => {
        setListing(data);
        setIsLoading(false);
      });
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Tur Bulunamadı</h2>
        <p className="text-gray-500 mb-8">Aradığınız tur sayfası mevcut değil veya kaldırılmış olabilir.</p>
        <button onClick={() => navigate('/')} className="px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[500px] w-full bg-gray-900">
        <img 
          src={listing.featured_image} 
          alt={listing.title}
          className="w-full h-full object-cover opacity-80"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        
        {/* Navigation Bar inside Hero */}
        <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 max-w-7xl mx-auto w-full">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <button className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors">
            <Share2 className="w-5 h-5" />
          </button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 max-w-7xl mx-auto w-full flex flex-col items-start">
          <div className="flex flex-wrap gap-2 mb-4">
            {listing.categories.map((cat, idx) => (
              <span key={idx} className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold tracking-wide uppercase">
                {cat}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
            {listing.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-400" />
              <span>{listing.location.province}{listing.location.district ? `, ${listing.location.district}` : ''}</span>
            </div>
            {listing.duration_days && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-orange-400" />
                <span>{listing.duration_days}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-orange-400 fill-orange-400" />
              <span>{listing.rating} Puan</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Tur Hakkında</h2>
              
              {/* WordPress Content Render */}
              {listing.content ? (
                <div 
                  className="prose prose-lg prose-orange max-w-none text-gray-600 prose-headings:text-gray-900 prose-a:text-orange-600 hover:prose-a:text-orange-700"
                  dangerouslySetInnerHTML={{ __html: listing.content }}
                />
              ) : (
                <p className="text-gray-600 text-lg leading-relaxed">{listing.description}</p>
              )}

              {/* Affiliate Banner in Content (if exists) */}
              {listing.affiliate_link && (
                <div className="mt-12 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-8 border border-orange-200 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Bu Turu Rezerve Etmek İster Misiniz?</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Partner sitemiz üzerinden güvenle rezervasyon yapabilir, en uygun fiyat garantisinden yararlanabilirsiniz.
                  </p>
                  <a 
                    href={listing.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-lg font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-1 w-full sm:w-auto"
                  >
                    <span>Hemen Rezervasyon Yap</span>
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24">
              <div className="bg-white rounded-3xl p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
                
                <div className="mb-8">
                  <span className="text-gray-500 text-sm font-bold tracking-wider uppercase mb-1 block">Fiyat</span>
                  <div className="text-4xl font-extrabold text-gray-900">
                    {listing.display_price || `₺${listing.price_try}`}
                  </div>
                  {listing.price_try > 0 && !listing.display_price && (
                    <div className="text-sm text-gray-500 mt-1">kişi başı başlangıç fiyatı</div>
                  )}
                </div>

                <hr className="border-gray-100 mb-8" />

                <div className="space-y-6 mb-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Clock className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-bold mb-0.5">Süre</div>
                      <div className="text-gray-900 font-medium">{listing.duration_days}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Calendar className="w-6 h-6 text-orange-500" />
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 font-bold mb-0.5">Tarihler</div>
                      <div className="text-gray-900 font-medium">Esnek / İsteğe Bağlı</div>
                    </div>
                  </div>
                </div>

                {listing.affiliate_link ? (
                  <a 
                    href={listing.affiliate_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white text-lg font-bold py-4 px-6 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group"
                  >
                    <span>Hemen Rezervasyon Yap</span>
                    <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </a>
                ) : (
                  <button className="w-full bg-gray-200 text-gray-500 text-lg font-bold py-4 px-6 rounded-xl cursor-not-allowed">
                    Rezervasyon Kapalı
                  </button>
                )}
                
                {listing.affiliate_link && (
                  <p className="text-xs text-center text-gray-400 mt-4">
                    Bu butona tıkladığınızda partner sitesine yönlendirileceksiniz.
                  </p>
                )}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
