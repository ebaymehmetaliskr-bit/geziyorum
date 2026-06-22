import { useState, useRef, useEffect } from 'react';
import { MapPin, GripVertical, Navigation, Trash2, Plus, ArrowRight, Save, Clock, Search, Banknote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TOUR_LISTINGS } from '../data';
import { TourListing } from '../types';

export function RoutePlannerPage() {
  const [routeItems, setRouteItems] = useState<TourListing[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Added default tours for demonstration if list is empty
  useEffect(() => {
    if (routeItems.length === 0) {
      setRouteItems([TOUR_LISTINGS[0], TOUR_LISTINGS[2]]);
    }
  }, []);

  const availableTours = TOUR_LISTINGS.filter(t => !routeItems.find(r => r.id === t.id))
    .filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 t.location.province.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleDragStart = (index: number) => {
    setDraggedItemIndex(index);
  };

  const handleDragEnter = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newRouteItems = [...routeItems];
    const draggedItem = newRouteItems[draggedItemIndex];
    newRouteItems.splice(draggedItemIndex, 1);
    newRouteItems.splice(index, 0, draggedItem);
    
    setRouteItems(newRouteItems);
    setDraggedItemIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  const addStop = (tour: TourListing) => {
    setRouteItems([...routeItems, tour]);
  };

  const removeStop = (id: string) => {
    setRouteItems(routeItems.filter(t => t.id !== id));
  };

  const totalDays = routeItems.reduce((acc, curr) => acc + curr.duration_days, 0);
  const totalPrice = routeItems.reduce((acc, curr) => acc + curr.price_try, 0);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Navigation className="w-8 h-8 text-orange-500" />
              Rota Planlayıcı
            </h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Gezmek istediğiniz noktaları seçin, sürükleyip bırakarak sıralamayı belirleyin ve kendi kusursuz seyahat rotanızı oluşturun.
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-gray-800 transition-colors shadow-sm">
            <Save className="w-4 h-4" />
            Rotayı Kaydet
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sol: Mevcut Rota (Sürükle bırak liste) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Mevcut Rotanız</h2>
                <div className="flex items-center gap-4 text-sm font-medium text-gray-500 bg-gray-50 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    <span>{routeItems.length} Durak</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{totalDays} Gün</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-4 h-4 text-green-500" />
                    <span>{totalPrice.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>
              </div>

              {routeItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-200 rounded-xl">
                  <MapPin className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-lg font-medium text-gray-900">Rotanız henüz boş</p>
                  <p className="text-gray-500 text-sm mt-1">Sağdaki listeden rotanıza durak ekleyebilirsiniz.</p>
                </div>
              ) : (
                <div className="space-y-3 relative">
                  {routeItems.map((item, index) => (
                    <div className="relative group" key={item.id}>
                      {/* Connection Line */}
                      {index < routeItems.length - 1 && (
                        <div className="absolute left-6 top-14 bottom-[-1rem] w-0.5 bg-gradient-to-b from-orange-200 to-transparent -z-10" />
                      )}
                      
                      <div
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`flex items-center gap-4 p-4 bg-white rounded-xl border transition-all ${
                          draggedItemIndex === index 
                            ? 'opacity-50 border-orange-500 shadow-md scale-[1.02]' 
                            : 'border-gray-100 hover:border-gray-200 hover:shadow-sm'
                        }`}
                      >
                        {/* Sürükleme Tutamacı */}
                        <div className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-700 transition-colors">
                          <GripVertical className="w-5 h-5" />
                        </div>

                        {/* Sıra Numarası / Nokta */}
                        <div className="w-8 h-8 shrink-0 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>

                        {/* İçerik */}
                        <div className="flex-grow min-w-0 flex items-center gap-4">
                          <img 
                            src={item.featured_image || "https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=100&h=100&fit=crop"} 
                            alt={item.title}
                            className="w-16 h-16 rounded-lg object-cover shrink-0" 
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900 truncate">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location.district}, {item.location.province}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{item.duration_days} Gün</span>
                            </div>
                          </div>
                        </div>

                        {/* Sil बटonu */}
                        <button 
                          onClick={() => removeStop(item.id)}
                          className="shrink-0 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Rotadan Çıkar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Alt Bilgi */}
            {routeItems.length > 0 && (
               <div className="bg-orange-50 border border-orange-100 rounded-2xl p-5 flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-full text-orange-600 shrink-0">
                  <Navigation className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-medium text-orange-900">Harika bir rota taslağı!</h4>
                  <p className="text-orange-700 text-sm mt-1">Duraklarınızı sürükleyip bırakarak seyahat sıralamanızı optimize edebilirsiniz. Toplamda <strong>{totalDays} gün</strong> sürecek renkli bir gezi sizi bekliyor.</p>
                </div>
               </div>
            )}
          </div>

          {/* Sağ: Nokta Ekleme */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col h-[calc(100vh-12rem)] sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Rota Noktası Ekle</h2>
            
            <div className="relative mb-4 shrink-0">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Destinasyon veya tur ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="flex-grow overflow-y-auto pr-2 -mr-2 space-y-3 custom-scrollbar">
              {availableTours.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  Aramanıza uygun nokta bulunamadı.
                </div>
              ) : (
                availableTours.map(tour => (
                  <div key={tour.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group">
                    <img 
                      src={tour.featured_image || "https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=80&h=80&fit=crop"} 
                      alt={tour.title}
                      className="w-12 h-12 rounded-lg object-cover shrink-0" 
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 truncate leading-tight">{tour.title}</h4>
                      <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {tour.location.province}
                      </p>
                    </div>
                    <button 
                      onClick={() => addStop(tour)}
                      className="shrink-0 p-1.5 text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                      title="Rotaya Ekle"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
