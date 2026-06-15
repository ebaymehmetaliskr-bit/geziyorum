import { LazyImage } from './LazyImage';
import { TourListing } from '../types';
import { MapPin, Star, Share, Heart, Clock, Users, Map, ChevronDown } from 'lucide-react';
import { APIProvider, Map as GoogleMap, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';
import { useState, useEffect, useRef } from 'react';

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'YOUR_API_KEY';

function MarkerWithInfoWindow({ position, title, subtitle, color }: {
  position: google.maps.LatLngLiteral;
  title: string;
  subtitle?: string;
  color: string;
}) {
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [open, setOpen] = useState(false);

  return (
    <>
      <AdvancedMarker ref={markerRef} position={position} onClick={() => setOpen(true)}>
        <Pin background={color} glyphColor="#fff" borderColor="rgba(0,0,0,0.2)" />
      </AdvancedMarker>
      {open && (
        <InfoWindow anchor={marker} onCloseClick={() => setOpen(false)}>
          <div className="py-1 px-2">
            <strong className="block text-gray-900 mb-1">{title}</strong>
            {subtitle && <p className="text-sm text-gray-500 m-0">{subtitle}</p>}
          </div>
        </InfoWindow>
      )}
    </>
  );
}

function RouteDisplay({ origin, destination }: {
  origin: google.maps.LatLngLiteral;
  destination: google.maps.LatLngLiteral;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;
    // Clear previous route
    polylinesRef.current.forEach(p => p.setMap(null));

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => {
          p.setOptions({ strokeColor: '#f97316', strokeOpacity: 0.8, strokeWeight: 5 });
          p.setMap(map);
        });
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) map.fitBounds(routes[0].viewport);
      }
    });

    return () => polylinesRef.current.forEach(p => p.setMap(null));
  }, [routesLib, map, origin, destination]);

  return null;
}

function ListingMap({ listing }: { listing: TourListing }) {
  if (!hasValidKey) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-gray-50 flex-col text-center p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Google Maps API Anahtarı Gerekli</h3>
        <p className="text-sm text-gray-600 mb-4 max-w-sm">
          Haritayı görüntülemek için lütfen AI Studio üzerinden <code>GOOGLE_MAPS_PLATFORM_KEY</code> secret'ını ekleyin ve yeniden oluşturun.
        </p>
      </div>
    );
  }

  // Generate a mock destination based on the main coordinate to simulate a tour route
  const origin = listing.coordinates;
  const destination = {
    lat: origin.lat + 0.05,
    lng: origin.lng + 0.05
  };

  return (
    <APIProvider apiKey={API_KEY} version="weekly">
      <GoogleMap
        defaultCenter={origin}
        defaultZoom={11}
        mapId="DEMO_MAP_ID"
        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
        style={{width: '100%', height: '100%'}}
      >
        <RouteDisplay origin={origin} destination={destination} />
        <MarkerWithInfoWindow 
          position={origin} 
          title="Buluşma Noktası" 
          subtitle={`${listing.title} Başlangıcı`}
          color="#f97316" 
        />
        <MarkerWithInfoWindow 
          position={destination} 
          title="Varış Noktası" 
          subtitle="Tur Bitiş Konumu"
          color="#3b82f6" 
        />
      </GoogleMap>
    </APIProvider>
  );
}

interface SingleListingLayoutProps {
  listing: TourListing;
  onBack: () => void;
}

export function SingleListingLayout({ listing, onBack }: SingleListingLayoutProps) {
  // Placeholder gallery images
  const gallery = [
    listing.featured_image,
    "https://images.unsplash.com/photo-1527838832700-5059252407fa?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=800&q=80"
  ];

  return (
    <div className="bg-white min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back */}
        <button onClick={onBack} className="text-gray-500 hover:text-gray-900 mb-6 flex items-center gap-2 font-medium text-sm transition-colors">
          &larr; Ana Sayfaya Dön
        </button>

        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3 tracking-tight">{listing.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-600">
              <span className="flex items-center gap-1">
                <Star className="w-5 h-5 text-orange-500 fill-orange-500" />
                {listing.rating} <span className="font-normal underline underline-offset-2 ml-1 cursor-pointer">(120+ Değerlendirme)</span>
              </span>
              <span className="flex items-center gap-1 text-gray-300">&bull;</span>
              <span className="flex items-center gap-1 underline underline-offset-2 cursor-pointer">
                <MapPin className="w-4 h-4 text-gray-400" />
                {listing.location.district}, {listing.location.province}
              </span>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm border border-gray-200/0 hover:border-gray-200">
              <Share className="w-4 h-4" /> Paylaş
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-sm border border-gray-200/0 hover:border-gray-200">
              <Heart className="w-4 h-4" /> Kaydet
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[45vh] md:h-[60vh] rounded-2xl overflow-hidden mb-12">
          <div className="md:col-span-2 row-span-2 relative group cursor-pointer h-full">
            <LazyImage src={gallery[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" wrapperClassName="w-full h-full" alt="Main" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden h-full">
             <LazyImage src={gallery[1]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" wrapperClassName="w-full h-full" alt="Gallery 1" />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden h-full">
             <LazyImage src={gallery[2]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" wrapperClassName="w-full h-full" alt="Gallery 2" />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden h-full">
             <LazyImage src={gallery[3]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" wrapperClassName="w-full h-full" alt="Gallery 3" />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
          </div>
          <div className="hidden md:block relative group cursor-pointer overflow-hidden h-full">
             <LazyImage src={gallery[4]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" wrapperClassName="w-full h-full" alt="Gallery 4" />
             <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors pointer-events-none"></div>
          </div>
        </div>

        {/* Main Content Split */}
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Column (Content) */}
          <div className="w-full lg:w-2/3">
            
            {/* Quick Facts */}
            <div className="flex flex-wrap gap-8 mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Clock className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 font-medium">Süre</div>
                  <div className="font-bold text-gray-900">{listing.duration_days} Gün</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 font-medium">Grup Boyutu</div>
                  <div className="font-bold text-gray-900">Maks. 15 Kişi</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Map className="w-6 h-6 text-gray-400" />
                <div>
                  <div className="text-sm text-gray-500 font-medium">Kategori</div>
                  <div className="font-bold text-gray-900">{listing.categories[0]}</div>
                </div>
              </div>
            </div>

            {/* AdSense Placeholder - In Content */}
            <div className="w-full h-[90px] md:h-[120px] bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-mono text-sm mb-10">
              Reklam Alanı (Google AdSense)
            </div>

            {/* Overview */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Genel Bakış</h2>
              <div className="prose prose-lg text-gray-600 max-w-none leading-relaxed">
                <p>{listing.description}</p>
                <p>Türkiye'nin eşsiz güzelliklerini keşfederken kendinizi doğanın ve tarihin kollarına bırakın. Profesyonel rehberlerimiz eşliğinde unutulmaz bir deneyim yaşayacaksınız. Konforlu ulaşım, özenle seçilmiş konaklama ve yöresel lezzetlerle dolu bu turda sadece anın tadını çıkarın.</p>
              </div>
            </section>

            {/* Route Details */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Rota Detayları</h2>
              <div className="space-y-8">
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-orange-500 z-10 shrink-0 outline outline-4 outline-orange-100"></div>
                    <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                  </div>
                  <div className="pb-8">
                    <h4 className="font-bold text-gray-900 text-lg mb-2">1. Gün: Buluşma ve Başlangıç</h4>
                    <p className="text-gray-600 leading-relaxed">Turumuza sabahın erken saatlerinde belirlenen noktada buluşarak başlıyoruz. İlk durağımız olan tarihi mekanlara doğru yola çıkarken rehberimiz bölge hakkında detaylı bir bilgilendirme yapıyor.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-orange-500 z-10 shrink-0 outline outline-4 outline-orange-100"></div>
                    <div className="w-0.5 h-full bg-transparent mt-2"></div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-2">2. Gün: Serbest Zaman ve Dönüş</h4>
                    <p className="text-gray-600 leading-relaxed">Yöresel kahvaltımızın ardından doğa içinde kısa bir yürüyüş ve serbest zaman. Öğleden sonra bölgeden ayrılarak çeşitli yerel dükkanları ziyaret ediyor ve dönüş yoluna geçiyoruz.</p>
                  </div>
                </div>
              </div>
            </section>
            
              {/* Map */}
            <section className="mb-10 pb-10 border-b border-gray-100">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Harita ve Konum</h2>
               <div className="h-[400px] bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200 relative overflow-hidden">
                  <ListingMap listing={listing} />
               </div>
            </section>

             {/* FAQ */}
             <section className="mb-10 pb-10 border-b border-gray-100">
               <h2 className="text-2xl font-bold text-gray-900 mb-6">Sıkça Sorulan Sorular</h2>
               <div className="space-y-4">
                  {[
                    "Fiyata neler dahil, neler hariç?", 
                    "Tur için iptal ve iade politikası nedir?", 
                    "Yanımda ne tür kıyafetler ve ekipmanlar getirmeliyim?"
                  ].map((q, i) => (
                    <div key={i} className="border border-gray-200 rounded-xl p-5 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all">
                      <div className="flex justify-between items-center font-bold text-gray-900">
                        {q}
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  ))}
               </div>
            </section>

            {/* Reviews Section */}
            <section className="mb-10">
               <div className="flex items-center gap-3 mb-8">
                 <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center font-bold text-xl">
                   {listing.rating}
                 </div>
                 <div>
                   <h2 className="text-2xl font-bold text-gray-900">Kullanıcı Değerlendirmeleri</h2>
                   <p className="text-gray-500 font-medium">128 Doğrulanmış Misafir Yorumu</p>
                 </div>
               </div>

               {/* Rating Breakdown */}
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                 {[
                   { label: 'Rehberlik ve Hizmet', score: '9.8' },
                   { label: 'Fiyat / Performans', score: '9.5' },
                   { label: 'Konum & Rota', score: '9.2' },
                   { label: 'Konaklama Kalitesi', score: '9.0' }
                 ].map((item, idx) => (
                   <div key={idx} className="flex flex-col gap-2">
                     <div className="flex justify-between text-sm font-bold text-gray-800">
                       <span>{item.label}</span>
                       <span>{item.score} / 10</span>
                     </div>
                     <div className="w-full bg-gray-200 rounded-full h-1.5">
                       <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${parseFloat(item.score) * 10}%` }}></div>
                     </div>
                   </div>
                 ))}
               </div>

               {/* Mock Comments */}
               <div className="space-y-6">
                 {[
                   {
                     name: 'Ayşe Yılmaz',
                     date: 'Geçen Ay',
                     comment: 'Harika bir deneyimdi. Özellikle rehberimizin bilgisi ve anlattığı hikayeler turu çok daha keyifli kıldı. Konakladığımız otelin manzarası da tek kelimeyle efsaneydi.',
                     avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d'
                   },
                   {
                     name: 'Caner K.',
                     date: '2 Ay Önce',
                     comment: 'Eşimle birlikte katıldık ve her anından çok keyif aldık. Fiyatına göre sunduğu olanaklar gerçekten tatmin edici. Fotoğraf çekimi için gittiğimiz koylara bayıldık. Kesinlikle tavsiye ediyoruz!',
                     avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d'
                   }
                 ].map((review, idx) => (
                   <div key={idx} className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm">
                     <div className="flex items-start gap-4 mb-3">
                       <LazyImage src={review.avatar} alt={review.name} wrapperClassName="w-12 h-12 rounded-full border border-gray-200 shrink-0" className="w-full h-full object-cover rounded-full" />
                       <div className="flex-1">
                         <div className="font-bold text-gray-900">{review.name}</div>
                         <div className="text-sm text-gray-500">{review.date}</div>
                       </div>
                       <div className="flex gap-1 text-orange-500">
                         {Array.from({ length: 5 }).map((_, i) => (
                           <Star key={i} className="w-4 h-4 fill-current" />
                         ))}
                       </div>
                     </div>
                     <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                   </div>
                 ))}
               </div>
               
               <button className="mt-8 w-full py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-900 font-bold rounded-xl transition-colors">
                 Tüm Yorumları Gör (128)
               </button>
            </section>

          </div>

          {/* Right Column (Widget) */}
          <div className="w-full lg:w-1/3 relative">
            <div className="sticky top-24 bg-white border border-gray-200 rounded-2xl shadow-xl shadow-gray-200/50 p-6">
              
              {/* Header */}
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="text-gray-500 text-sm font-medium">Kişi başı</span>
                  <div className="text-3xl font-extrabold text-gray-900 mt-1">₺{listing.price_try}</div>
                </div>
                <div className="text-sm font-bold flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1.5 rounded-lg border border-green-100">
                  <Star className="w-4 h-4 fill-green-700" /> {listing.rating}
                </div>
              </div>

              {/* Date & Guests Picker */}
              <div className="border border-gray-300 rounded-xl overflow-hidden mb-6">
                <div className="flex border-b border-gray-300">
                  <div className="flex-1 p-3 border-r border-gray-300 hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-1">Giriş</div>
                    <div className="text-gray-500 text-sm group-hover:text-gray-900 transition-colors">Tarih Seçin</div>
                  </div>
                  <div className="flex-1 p-3 hover:bg-gray-50 cursor-pointer transition-colors group">
                    <div className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-1">Çıkış</div>
                    <div className="text-gray-500 text-sm group-hover:text-gray-900 transition-colors">Tarih Seçin</div>
                  </div>
                </div>
                <div className="p-3 hover:bg-gray-50 cursor-pointer transition-colors flex justify-between items-center">
                  <div>
                    <div className="text-[11px] font-bold text-gray-900 uppercase tracking-widest mb-1">Misafirler</div>
                    <div className="text-gray-900 text-sm">1 Yetişkin</div>
                  </div>
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Action Button */}
              {listing.affiliate_link ? (
                <a 
                  href={listing.affiliate_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-xl transition-colors shadow-lg shadow-orange-500/30 mb-4 flex items-center justify-center text-center"
                >
                  Partner Sitesinde İncele
                </a>
              ) : (
                <button className="w-full bg-gray-300 cursor-not-allowed text-gray-600 font-bold text-lg py-4 rounded-xl transition-colors mb-4">
                  Rezervasyon Kapalı
                </button>
              )}

              <div className="text-center text-sm text-gray-500 font-medium mb-6">
                Sizi güvenilir partner platformuna yönlendireceğiz.
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 text-gray-600 border-b border-gray-200 pb-5 mb-5 text-sm">
                <div className="flex justify-between">
                  <span className="underline underline-offset-4 cursor-pointer">₺{listing.price_try} x 1 yetişkin</span>
                  <span>₺{listing.price_try}</span>
                </div>
                <div className="flex justify-between">
                  <span className="underline underline-offset-4 cursor-pointer">Rehberlik & Servis Bedeli</span>
                  <span>₺{Math.round(listing.price_try * 0.1)}</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center font-extrabold text-lg text-gray-900">
                <span>Toplam (TRY)</span>
                <span>₺{listing.price_try + Math.round(listing.price_try * 0.1)}</span>
              </div>
            </div>

            {/* AdSense Placeholder - Sidebar */}
            <div className="w-full h-[250px] bg-gray-100 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 font-mono text-sm mt-6">
              Reklam Alanı
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
