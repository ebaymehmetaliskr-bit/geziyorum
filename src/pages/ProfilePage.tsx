import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { TourListing } from '../types';
import { getTourByIdFromWordPress } from '../services/wp-api';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, Calendar, Clock, Trash2, MapPin } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

export function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.includes('/rezervasyonlar') ? 'bookings' : 'favorites';

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
        } else {
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

  if (loading || !user) return null;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">Hesabım</h1>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sticky top-24">
              <div className="flex flex-col gap-2">
                <Link 
                  to="/profil/favoriler"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'favorites' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Heart className="w-5 h-5" /> Favorilerim
                </Link>
                <Link 
                  to="/profil/rezervasyonlar"
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${activeTab === 'bookings' ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
                >
                  <Calendar className="w-5 h-5" /> Rezervasyonlarım
                </Link>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-3/4">
            {isLoadingContent ? (
              <div className="flex items-center justify-center h-64">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : activeTab === 'favorites' ? (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Favori Turların ({favorites.length})</h2>
                {favorites.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
                    Henüz favorilere eklenmiş bir turunuz bulunmuyor.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {favorites.map(tour => (
                      <div key={tour.id} className="bg-white group rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col relative">
                        <button onClick={() => removeFavorite(tour.id)} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md z-10 text-orange-500 hover:bg-orange-50 transition-colors">
                          <Heart className="w-4 h-4 fill-current" />
                        </button>
                        <Link to={`/tour/${tour.id}`} className="block aspect-[4/3] relative overflow-hidden bg-gray-100">
                          <LazyImage src={tour.featured_image} alt={tour.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" wrapperClassName="w-full h-full" />
                        </Link>
                        <div className="p-5 flex flex-col flex-grow">
                           <div className="flex items-center gap-1 text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">
                             <MapPin className="w-3 h-3" /> {tour.location.province}
                           </div>
                           <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">{tour.title}</h3>
                           <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 font-medium mb-4">
                             <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {tour.duration_days} Gün</span>
                           </div>
                           <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                             <span className="text-gray-900 font-extrabold">₺{tour.price_try}</span>
                             <Link to={`/tour/${tour.id}`} className="text-sm font-bold text-orange-600 hover:text-orange-700">İncele &rarr;</Link>
                           </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                 <h2 className="text-xl font-bold text-gray-900 mb-4">Geçmiş ve Gelecek Rezervasyonların ({bookings.length})</h2>
                 {bookings.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center text-gray-500">
                    Henüz bir rezervasyonunuz bulunmuyor.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map(booking => (
                      <div key={booking.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-yellow-100 text-yellow-700">Beklemede</span>
                            <span className="text-sm text-gray-500 font-medium">Satın Alım Tarihi: {new Date(booking.createdAt?.toMillis() || Date.now()).toLocaleDateString('tr-TR')}</span>
                          </div>
                          <Link to={`/tour/${booking.tourId}`} className="text-lg font-bold text-gray-900 hover:text-orange-600 transition-colors mb-2 block">{booking.tourName}</Link>
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600 font-medium">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {booking.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {booking.guests} Yetişkin</span>
                          </div>
                        </div>
                        <div className="sm:text-right">
                          <div className="text-sm text-gray-500 font-medium mb-1">Toplam Tutar</div>
                          <div className="text-2xl font-extrabold text-gray-900">₺{booking.totalPrice}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}
