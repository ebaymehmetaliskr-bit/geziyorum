"use client";

import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  GripVertical, 
  Navigation, 
  Trash2, 
  Plus, 
  Save, 
  Clock, 
  Search, 
  Banknote, 
  Calendar, 
  Layers,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { getToursFromWordPress } from '@/services/wp-api';
import { TourListing } from '@/types';
import { SEO } from '@/components/SEO';

export default function RoutePlannerPage() {
  const [routeItems, setRouteItems] = useState<TourListing[]>([]);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [tours, setTours] = useState<TourListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDayTab, setActiveDayTab] = useState<number>(1);

  useEffect(() => {
    getToursFromWordPress().then(data => {
      setTours(data);
      if (data.length > 1) {
        setRouteItems([data[0], data[1]]);
      } else if (data.length === 1) {
        setRouteItems([data[0]]);
      }
      setLoading(false);
    });
  }, []);

  const availableTours = tours
    .filter(t => !routeItems.find(r => r.id === t.id))
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
    <div className="pt-24 pb-16 min-h-screen bg-slate-50/50 font-sans">
      <SEO id="page_planner" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Üst Başlık & Dünya Standartlarında Aksiyon Barı */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-orange-600 font-bold text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4 animate-pulse" /> Akıllı Seyahat Asistanı
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <Navigation className="w-8 h-8 text-orange-500" />
              Gelişmiş Rota Planlayıcı
            </h1>
            <p className="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed">
              Wanderlog ve TripIt mimarisinden esinlenilen yeni nesil planlayıcı. Duraklarınızı ekleyin, sürükleyerek günleri optimize edin ve bütçenizi anlık takip edin.
            </p>
          </div>
          
          <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl font-semibold hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10 hover:-translate-y-0.5">
            <Save className="w-4 h-4" />
            Rotayı Senkronize Et
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Sol Kolon: İnteraktif Zaman Çizelgesi ve Duraklar */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Küresel Özet Kartı */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-slate-400" /> Rota Zaman Akışı
                </h2>
                <div className="flex items-center gap-3 text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200/50 px-4 py-2.5 rounded-xl shadow-inner">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-orange-500" />
                    <span>{routeItems.length} Durak</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    <span>{totalDays} Gün</span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{totalPrice.toLocaleString('tr-TR')} ₺</span>
                  </div>
                </div>
              </div>

              {/* Gün Sekmeleri (Wanderlog Tarzı Gün Bazlı İnceleme) */}
              {totalDays > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-100 scrollbar-hide">
                  {Array.from({ length: Math.max(totalDays, 1) }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveDayTab(idx + 1)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                        activeDayTab === idx + 1
                          ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/20'
                          : 'bg-slate-50 text-slate-600 border border-slate-200/60 hover:bg-slate-100'
                      }`}
                    >
                      {idx + 1}. Gün
                    </button>
                  ))}
                </div>
              )}

              {routeItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <MapPin className="w-12 h-12 text-slate-300 mb-3 animate-bounce" />
                  <p className="text-base font-bold text-slate-900">Mevcut rotanız boş görünüyor</p>
                  <p className="text-slate-400 text-xs mt-1 max-w-sm">Sağ paneldeki akıllı arama motorunu kullanarak rotanıza duraklar, gizli rotalar veya turlar ekleyebilirsiniz.</p>
                </div>
              ) : (
                <div className="space-y-4 relative">
                  {routeItems.map((item, index) => (
                    <div className="relative group" key={item.id}>
                      {index < routeItems.length - 1 && (
                        <div className="absolute left-6 top-16 bottom-[-1.5rem] w-0.5 bg-gradient-to-b from-orange-200 via-slate-200 to-transparent -z-10" />
                      )}
                      
                      <div
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={(e) => handleDragEnter(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`flex items-center gap-4 p-4 bg-white rounded-xl border transition-all duration-200 ${
                          draggedItemIndex === index 
                            ? 'opacity-40 border-orange-500 shadow-lg scale-[1.01]' 
                            : 'border-slate-100 hover:border-slate-200 hover:shadow-md hover:shadow-slate-100/80'
                        }`}
                      >
                        <div className="cursor-grab active:cursor-grabbing p-1.5 text-slate-400 hover:text-slate-700 transition-colors">
                          <GripVertical className="w-4 h-4" />
                        </div>

                        <div className="w-8 h-8 shrink-0 rounded-full bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center font-extrabold text-xs shadow-sm">
                          {index + 1}
                        </div>

                        <div className="flex-grow min-w-0 flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-slate-200/60 shrink-0 shadow-inner relative">
                            <img 
                              src={item.featured_image || "https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=120&h=120&fit=crop"} 
                              alt={item.title}
                              className="w-full h-full object-cover" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm truncate leading-snug group-hover:text-orange-600 transition-colors">{item.title}</h3>
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 font-medium">
                              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{item.location.district}, {item.location.province}</span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="flex items-center gap-1"><Calendar className="w-3 h-3 text-slate-400" />{item.duration_days} Gün</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-slate-900 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg shadow-sm">
                            ₺{item.price_try.toLocaleString('tr-TR')}
                          </span>
                          <button 
                            onClick={() => removeStop(item.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                            title="Rotadan Çıkar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {routeItems.length > 0 && (
               <div className="bg-gradient-to-r from-orange-500/10 to-transparent border border-orange-500/20 rounded-2xl p-5 flex items-start gap-4">
                <div className="bg-orange-500 text-white p-2.5 rounded-xl shrink-0 shadow-sm shadow-orange-500/10">
                  <Navigation className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-orange-950 text-sm">Akıllı Optimizasyon Aktif</h4>
                  <p className="text-orange-800/90 text-xs mt-1 leading-relaxed font-medium">Duraklarınızı haritadaki coğrafi yakınlıklarına göre sürükleyip bırakarak sıralayabilirsiniz. Toplam <strong>{totalDays} günlük</strong> harika bir seyahat planı derlediniz.</p>
                </div>
               </div>
            )}
          </div>

          {/* Sağ Kolon: Gelişmiş Nokta Arama / Keşif Motoru */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 flex flex-col h-[calc(100vh-14rem)] sticky top-24">
            <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
               Keşif & Nokta Ekleme
            </h2>
            <p className="text-slate-400 text-xs font-medium mb-4">Canlı sistemdeki popüler rotaları seyahatinize ekleyin.</p>
            
            <div className="relative mb-4 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Destinasyon veya lokasyon ara..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all text-slate-800"
              />
            </div>

            <div className="flex-grow overflow-y-auto pr-1 -mr-1 space-y-2 custom-scrollbar">
              {loading ? (
                <div className="text-center py-8 text-xs font-bold text-slate-400 animate-pulse">Destinasyonlar Yükleniyor...</div>
              ) : availableTours.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs font-medium">
                  Kriterlere uygun yeni bir nokta bulunamadı.
                </div>
              ) : (
                availableTours.map(tour => (
                  <div key={tour.id} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50/80 border border-transparent hover:border-slate-100 transition-all group">
                    <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden border border-slate-200/40 shrink-0 relative">
                      <img 
                        src={tour.featured_image || "https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=80&h=80&fit=crop"} 
                        alt={tour.title}
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-xs text-slate-900 truncate leading-tight group-hover:text-orange-600 transition-colors">{tour.title}</h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-300" /> {tour.location.province}
                      </p>
                    </div>
                    <button 
                      onClick={() => addStop(tour)}
                      className="shrink-0 p-2 text-orange-600 bg-orange-50 hover:bg-orange-500 hover:text-white rounded-xl transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                      title="Rotaya Ekle"
                    >
                      <Plus className="w-3.5 h-3.5" />
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