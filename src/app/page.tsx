"use client";

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HeroSection } from '../components/HeroSection';
import { RouteWizard } from '../components/RouteWizard';
import { DirectoryGrid } from '../components/DirectoryGrid';
import { TourListing } from '../types';
import { getToursFromWordPress, getBlogPostsFromWordPress, getSiteSettings } from '../services/wp-api';
import { MapPin, ArrowRight, Mail } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [listings, setListings] = useState<TourListing[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [siteSettings, setSiteSettings] = useState<any>(null);

  // Sayfa parametresini güvenli bir şekilde alıyoruz
  const pageParamString = searchParams.get('page');
  const pageParam = parseInt(pageParamString || '1', 10);

  useEffect(() => {
    // Ayarları localstorage'dan okumayı dene
    try {
        const saved = localStorage.getItem('geziyorum_settings');
        if (saved) {
            setSiteSettings(JSON.parse(saved));
        }
    } catch(e) {}

    setIsLoading(true);
    getToursFromWordPress(pageParam).then(data => {
      if (pageParam === 1) {
        setListings(data);
      } else {
        setListings(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 9);
      setIsLoading(false);
    });

    getBlogPostsFromWordPress(3).then(data => {
      setBlogPosts(data);
    });

    getSiteSettings().then(settings => {
      if (settings) {
        setSiteSettings(settings);
      }
    });
  }, [pageParam]);

  const handleSelectListing = (listing: TourListing) => {
    router.push(`/tour/${listing.id}`);
  };

  return (
    <>
      <HeroSection heroImageUrl={siteSettings?.hero_image_url} />

      {/* Rota Sihirbazı Section */}
      <section className="py-16 bg-gray-50/50 pt-24 -mt-8 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <RouteWizard />
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <span className="text-orange-500 font-bold uppercase tracking-wider text-sm mb-2 block">Popüler Rotalar</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">Öne Çıkan Destinasyonlar</h2>
            </div>
            <Link href="/destinasyon/turkiye" className="hidden md:flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition-colors">
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/destinasyon/ege-bolgesi" className="relative h-80 rounded-2xl overflow-hidden group block">
              <LazyImage src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80" alt="Ege Bölgesi" wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                  <MapPin className="w-4 h-4" /> Türkiye
                </div>
                <h3 className="text-2xl font-bold text-white">Ege Bölgesi</h3>
              </div>
            </Link>

            <Link href="/destinasyon/kapadokya" className="relative h-80 rounded-2xl overflow-hidden group block">
              <LazyImage src="https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80" alt="Kapadokya" wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex items-center gap-2 text-white/80 mb-2 text-sm font-medium">
                  <MapPin className="w-4 h-4" /> Nevşehir
                </div>
                <h3 className="text-2xl font-bold text-white">Kapadokya</h3>
              </div>
            </Link>

            <div className="flex flex-col gap-6">
              <Link href="/destinasyon/akdeniz" className="relative h-[150px] rounded-2xl overflow-hidden group block">
                <LazyImage src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80" alt="Akdeniz" wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-xl font-bold text-white">Akdeniz Kıyıları</h3>
                </div>
              </Link>
              <Link href="/destinasyon/balkanlar" className="relative h-[150px] rounded-2xl overflow-hidden group block">
                <LazyImage src="https://images.unsplash.com/photo-1613524458514-419b139deae2?auto=format&fit=crop&w=800&q=80" alt="Balkanlar" wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/70 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 p-5 w-full">
                  <h3 className="text-xl font-bold text-white">Balkan Rotaları</h3>
                </div>
              </Link>
            </div>
          </div>
          
          <div className="mt-6 text-center md:hidden">
            <Link href="/destinasyon/turkiye" className="inline-flex items-center gap-2 text-orange-600 font-bold transition-colors">
              Tümünü Gör <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AdSense Placement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full h-[120px] bg-gray-50 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 font-mono text-sm leading-relaxed text-center">
          Reklam Alanı<br/>(AdSense - Ana Sayfa Geniş)
        </div>
      </div>

      <div className="py-12 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
           <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Önerilen Otel ve Turlar</h2>
           <p className="text-gray-500 mt-2">Partnerlerimizin sunduğu ve editörlerimizin seçtiği en iyi seçenekler.</p>
        </div>
        <DirectoryGrid 
          listings={listings} 
          onSelectListing={handleSelectListing} 
          isLoading={isLoading}
          hasMore={hasMore}
        />
      </div>

      {/* Latest Blog Posts / Travel Guides */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-blue-500 font-bold uppercase tracking-wider text-sm mb-2 block">Gezi Rehberi</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Seyahate İlham Veren Yazılar</h2>
            <p className="text-gray-600 text-lg">Nereye gideceksiniz, nerede kalacaksınız, neler yiyeceksiniz? Tüm cevaplar güncel rehberlerimizde.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {blogPosts.length > 0 ? blogPosts.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="group flex flex-col">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-5 bg-gray-100">
                  <LazyImage src={post.img} alt={post.title} wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="flex-1 flex flex-col">
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">{post.categoryName || 'Rehber'}</span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug">
                    {post.title}
                  </h3>
                  <div className="mt-auto flex items-center text-gray-500 text-sm font-medium">
                    <span>Okumaya devam et</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                  </div>
                </div>
              </Link>
            )) : (
              <div className="col-span-3 text-center text-gray-500 py-10">Blog yazıları yükleniyor veya bulunamadı...</div>
            )}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-orange-500/20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Gizli Rotalar Posta Kutuna Gelsin
          </h2>
          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Ayda 2 kez gönderdiğimiz bültenimizle yeni yerler keşfet, partner butik otellerde indirimler kazan.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input 
              type="email" 
              placeholder="E-posta adresiniz..." 
              required
              className="flex-1 px-5 py-4 rounded-xl md:rounded-full bg-white/10 border border-white/20 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            />
            <button type="submit" className="px-8 py-4 rounded-xl md:rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold transition-colors">
              Abone Ol
            </button>
          </form>
          <p className="text-xs text-gray-500 mt-4">İstediğiniz zaman abonelikten çıkabilirsiniz. Spam yapmayız.</p>
        </div>
      </section>
    </>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>}>
      <HomeContent />
    </Suspense>
  );
}