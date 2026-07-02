"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Link from 'next/link';
import { Compass, MapPin, Route } from 'lucide-react';
import { getToursFromWordPress } from '@/services/wp-api';
import { TourListing } from '@/types';
import { SEO } from '@/components/SEO';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const TourMarker: React.FC<{ tour: TourListing }> = ({ tour }) => {
  if (!tour.coordinates) return null;

  return (
    <Marker position={[tour.coordinates.lat, tour.coordinates.lng]} icon={customIcon}>
      <Popup closeButton={false} className="custom-popup">
        <div className="w-56 flex flex-col p-0 pb-1 m-[-14px]">
          <div className="h-32 w-full relative rounded-t-lg overflow-hidden mb-3">
            <img src={tour.featured_image} alt={tour.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            <div className="absolute top-2 right-2 bg-white text-gray-900 px-2 py-0.5 rounded text-xs font-bold shadow-sm">
              ₺{tour.price_try}
            </div>
          </div>
          <div className="px-3">
            <div className="flex items-center gap-1 text-xs font-medium text-orange-500 mb-1">
              <MapPin className="w-3 h-3" />
              {tour.location.province}, {tour.location.district}
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-3 line-clamp-2">{tour.title}</h3>
            <Link href={`/tour/${tour.id}`} className="block w-full text-center bg-gray-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-gray-800 transition-colors">
              İncele
            </Link>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

export default function MapComponent() {
  const [tours, setTours] = useState<TourListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRoute, setShowRoute] = useState(false);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    getToursFromWordPress().then((data) => {
      setTours(data);
      setLoading(false);
    });
  }, []);

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
        if (map) {
          map.flyTo([latitude, longitude], 9, { animate: true, duration: 1.5 });
        }
      },
      () => {
        setIsLocating(false);
        alert('Konum alınamadı.');
      }
    );
  };

  const routePositions = React.useMemo(() => {
    if (!showRoute) return [];
    return [...tours]
      .filter(t => t.coordinates)
      .sort((a, b) => a.coordinates!.lng - b.coordinates!.lng)
      .map(t => [t.coordinates!.lat, t.coordinates!.lng] as [number, number]);
  }, [tours, showRoute]);

  const userIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] relative">
      <SEO id="page_map" />
      <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur shadow-lg border border-gray-100 p-5 rounded-2xl max-w-md pointer-events-auto">
        <h1 className="text-xl font-bold flex items-center gap-2 text-gray-900">
          <Compass className="w-5 h-5 text-orange-500" />
          İnteraktif Türkiye Haritası
        </h1>
        <p className="text-slate-500 text-sm mt-2 leading-relaxed mb-4">
          Harita üzerindeki noktalara tıklayarak turları ve rotaları detaylıca inceleyebilirsiniz.
        </p>
        <div className="flex flex-col gap-2">
          <button onClick={() => setShowRoute(!showRoute)} className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold transition-all ${showRoute ? 'bg-orange-100 text-orange-600 border border-orange-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
            <Route className="w-4 h-4" />
            {showRoute ? 'Güzergah Çizgisini Gizle' : 'Tur Güzergahını Göster'}
          </button>
          <button onClick={handleLocateMe} disabled={isLocating} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold bg-gray-900 text-white hover:bg-gray-800 transition-all disabled:opacity-70">
            <MapPin className={`w-4 h-4 ${isLocating ? 'animate-bounce' : ''}`} />
            {isLocating ? 'Konum Bulunuyor...' : 'Etrafımda Neler Var?'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 w-full bg-gray-100 relative z-0">
        <MapContainer center={[39.0, 35.0]} zoom={6} style={{ height: '100%', width: '100%' }} zoomControl={true} ref={setMap}>
          <TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {showRoute && routePositions.length > 1 && <Polyline positions={routePositions} pathOptions={{ color: '#f97316', weight: 4, opacity: 0.8, dashArray: '10, 10' }} />}
          {tours.map((tour) => <TourMarker key={tour.id} tour={tour} />)}
          {userLocation && (
            <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
              <Popup closeButton={false} className="custom-popup"><div className="p-3 text-center"><div className="font-bold text-gray-900 text-sm">Sizin Konumunuz</div></div></Popup>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}