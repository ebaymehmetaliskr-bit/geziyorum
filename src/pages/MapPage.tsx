import React, { useEffect, useState } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { Link } from 'react-router-dom';
import { Compass, MapPin } from 'lucide-react';
import { getToursFromWordPress } from '../services/wp-api';
import { TourListing } from '../types';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function TourMarker({ tour }: { tour: TourListing }) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  if (!tour.coordinates) return null;

  return (
    <>
      <AdvancedMarker 
        ref={markerRef} 
        position={{ lat: tour.coordinates.lat, lng: tour.coordinates.lng }} 
        title={tour.title}
        onClick={() => setOpen(true)}
      >
        <Pin background="#f97316" glyphColor="#fff" borderColor="#c2410c" />
      </AdvancedMarker>
      
      {open && (
        <InfoWindow 
          anchor={marker} 
          onCloseClick={() => setOpen(false)}
          headerDisabled
        >
          <div className="w-56 flex flex-col p-1">
            <div className="h-32 w-full relative rounded-lg overflow-hidden mb-3">
              <img 
                src={tour.featured_image} 
                alt={tour.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2 right-2 bg-white text-gray-900 px-2 py-0.5 rounded text-xs font-bold shadow-sm">
                ₺{tour.price_try}
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-orange-500 mb-1">
              <MapPin className="w-3 h-3" />
              {tour.location.province}, {tour.location.district}
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2">
              {tour.title}
            </h3>
            <Link 
              to={`/tour/${tour.id}`}
              className="block w-full text-center bg-gray-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              İncele
            </Link>
          </div>
        </InfoWindow>
      )}
    </>
  );
}

export function MapPage() {
  const [tours, setTours] = React.useState<TourListing[]>([]);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    getToursFromWordPress().then((data) => {
      setTours(data);
      setLoading(false);
    });
  }, []);

  if (!hasValidKey) {
    return (
      <div className="flex flex-col h-[calc(100vh-64px)] items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 max-w-lg w-full text-center">
          <Compass className="w-12 h-12 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Google Maps API Anahtarı Gerekli</h2>
          <div className="text-left space-y-4 text-gray-600 text-sm bg-gray-50 p-6 rounded-xl border border-gray-100">
            <p><strong>Adım 1:</strong> <a href="https://console.cloud.google.com/google/maps-apis/start?utm_campaign=gmp-code-assist-ais" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline font-medium">Google Cloud'dan API Anahtarı Alın</a></p>
            <p><strong>Adım 2:</strong> AI Studio'da sisteme ekleyin:</p>
            <ul className="list-none space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5">1</span>
                Sağ üstteki <strong>Ayarlar (⚙️)</strong> girip <strong>Secrets</strong> seçin.
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5">2</span>
                İsim: <code className="bg-gray-200 px-1 py-0.5 rounded text-gray-800">VITE_GOOGLE_MAPS_PLATFORM_KEY</code> yazıp Enter yapın.
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-gray-200 text-gray-700 w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-xs mt-0.5">3</span>
                Değer kısmına anahtarı yapıştırıp tekrar Enter yapın.
              </li>
            </ul>
            <p className="text-xs text-gray-500 pt-2 border-t border-gray-200">Sistem otomatik olarak güncellenecektir. Sayfayı yenilemenize gerek yoktur.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative">
      <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur shadow-lg border border-gray-100 p-5 rounded-2xl max-w-md">
        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900">
          <Compass className="w-5 h-5 text-orange-500" />
          İnteraktif Türkiye Haritası
        </h1>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Harita üzerindeki turuncu noktalara tıklayarak turları ve rotaları detaylıca inceleyebilirsiniz.
        </p>
      </div>
      
      <div className="flex-1 w-full bg-gray-100 relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-20">
            <div className="flex flex-col items-center">
              <Compass className="w-8 h-8 text-orange-500 animate-spin" />
              <span className="mt-4 text-sm font-bold text-gray-900 uppercase tracking-widest">Harita Yükleniyor</span>
            </div>
          </div>
        ) : (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={{ lat: 39.0, lng: 35.0 }}
              defaultZoom={6}
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling="greedy"
              disableDefaultUI={true}
              zoomControl={true}
            >
              {tours.map((tour) => (
                <TourMarker key={tour.id} tour={tour} />
              ))}
            </Map>
          </APIProvider>
        )}
      </div>
    </div>
  );
}
