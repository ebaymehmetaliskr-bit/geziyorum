import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { TourListing } from '../types';
import { getTourByIdFromWordPress } from '../services/wp-api';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Calendar, Clock, MapPin, User, LogOut, LayoutDashboard, CreditCard, Settings } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

export function UserDashboard() {
  const { user, loading, logOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('favorites');

  const [favorites, setFavorites] = useState<TourListing[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoadingContent, setIsLoadingContent] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;

    const fetchContent = async () => {
      setIsLoadingContent(true);
      try {
        if (activeTab === 'favorites') {
          const favRef = collection(db, 'users', user.uid, 'favorites');
          const snap = await getDocs(favRef);
          const tourIds = snap.docs.map(d => d.data().tourId);
          
          const loadedTours: TourListing[] = [];
          for (const tId of tourIds) {
            const tour = await getTourByIdFromWordPress(tId);
            if (tour) loadedTours.push(tour);
          }
          setFavorites(loadedTours);
        } else if (activeTab === 'bookings') {
          const q = query(collection(db, 'bookings'), where('userId', '==', user.uid));
          const snap = await getDocs(q);
          const loadedBookings = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          setBookings(loadedBookings);
        }
      } catch (e) {
        console.error('Error fetching profile content', e);
      } finally {
        setIsLoadingContent(false);
      }
    };
    
    fetchContent();
  }, [user, activeTab]);

  const removeFavorite = async (tourId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'favorites', tourId));
      setFavorites(favorites.filter(t => t.id !== tourId));
    } catch (e) {
      console.error('Could not remove favorite', e);
    }
  };

  const handleLogout = async () => {
    try {
      if (logOut) await logOut();
      navigate('/');
    } catch(e) {}
  };

  if (loading || !user) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/" className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Geziyorum
          </Link>
        </div>

        <div className="p-4 flex-1">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Hesabım</div>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('favorites')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'favorites' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <Heart className="w-5 h-5" />
              Favorilerim
            </button>
            <button 
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'bookings' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <Calendar className="w-5 h-5" />
              Rezervasyonlarım
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <Settings className="w-5 h-5" />
              Hesap Ayarları
            </button>
          </nav>
        </div>
        
        {/* User Info */}
        <div className="p-4 border-t border-gray-800">
            <div className="flex items-center gap-3 mb-4">
               <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold shrink-0 uppercase">
                  {user.email?.[0] || 'U'}
               </div>
               <div className="overflow-hidden">
                 <p className="text-sm font-bold text-white truncate">{user.email}</p>
                 <p className="text-xs text-gray-500 truncate">Kullanıcı</p>
               </div>
            </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <h1 className="text-xl font-bold text-gray-900">
            {activeTab === 'favorites' && 'Favori Turlarım'}
            {activeTab === 'bookings' && 'Rezervasyonlarım'}
            {activeTab === 'settings' && 'Hesap Ayarları'}
          </h1>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
              Ana Sayfaya Dön
            </Link>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            
            {activeTab === 'favorites' && (
              <div className="space-y-6">
                {isLoadingContent ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : favorites.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Heart className="w-10 h-10 text-orange-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Favori Turunuz Yok</h3>
                    <p className="text-gray-500 mb-6">Beğendiğiniz turları favorilere ekleyerek burada listeleyebilirsiniz.</p>
                    <Link to="/tours" className="inline-block px-6 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors">
                      Turları Keşfet
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {favorites.map(tour => (
                      <div key={tour.id} className="bg-white group rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col relative">
                        <button onClick={() => removeFavorite(tour.id)} className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-md z-10 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all">
                          <Heart className="w-5 h-5 fill-current" />
                        </button>
                        <Link to={`/tour/${tour.id}`} className="block aspect-[4/3] relative overflow-hidden bg-gray-100">
                          <LazyImage src={tour.featured_image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" wrapperClassName="w-full h-full" />
                        </Link>
                        <div className="p-5 flex flex-col flex-grow">
                           <div className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                             <MapPin className="w-3 h-3" /> {tour.location.province}
                           </div>
                           <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">{tour.title}</h3>
                           <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium mb-4">
                             <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {tour.duration_days} Gün</span>
                           </div>
                           <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                             <span className="text-gray-900 font-extrabold text-lg">₺{tour.price_try}</span>
                             <Link to={`/tour/${tour.id}`} className="text-sm font-bold text-orange-600 hover:text-orange-700">İncele &rarr;</Link>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="space-y-6">
                 {isLoadingContent ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <div className="bg-white p-12 rounded-2xl border border-gray-200 shadow-sm text-center">
                    <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                       <Calendar className="w-10 h-10 text-blue-300" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Rezervasyonunuz Yok</h3>
                    <p className="text-gray-500 mb-6">Henüz bir tur rezervasyonu yapmamışsınız.</p>
                    <Link to="/tours" className="inline-block px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                      Turları İncele
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {bookings.map(booking => (
                      <div key={booking.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center shrink-0">
                            <CreditCard className="w-6 h-6 text-orange-500" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700">Onaylandı</span>
                              <span className="text-sm text-gray-500 font-medium">Sipariş: #{booking.id.substring(0,8).toUpperCase()}</span>
                            </div>
                            <Link to={`/tour/${booking.tourId}`} className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors mb-2 block">{booking.tourName}</Link>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-gray-400" /> Tarih: {booking.date}</span>
                              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-gray-400" /> {booking.guests} Kişi</span>
                            </div>
                          </div>
                        </div>
                        <div className="md:text-right border-t md:border-t-0 border-gray-100 pt-4 md:pt-0">
                          <div className="text-sm text-gray-500 font-medium mb-1">Ödenen Tutar</div>
                          <div className="text-2xl font-extrabold text-gray-900">₺{booking.totalPrice}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-900">Hesap Bilgileri</h3>
                </div>
                <div className="p-8">
                  <div className="max-w-md space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">E-Posta Adresi</label>
                      <input 
                        type="email" 
                        value={user.email || ''} 
                        disabled 
                        className="w-full px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 text-gray-500 cursor-not-allowed"
                      />
                      <p className="text-xs text-gray-500 mt-2">E-posta adresiniz Google hesabınızla bağlantılıdır.</p>
                    </div>
                    <div>
                      <button onClick={handleLogout} className="px-6 py-3 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2">
                         <LogOut className="w-4 h-4" /> Çıkış Yap
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
