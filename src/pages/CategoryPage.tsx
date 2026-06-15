import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TourListing } from '../types';
import { getToursFromWordPress } from '../services/wp-api';
import { ListingCard } from '../components/ListingCard';
import { Compass, Map, FileText, Bed } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';

// Kategori için özel sayfa tasarımı (Hub Page)
export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [listings, setListings] = useState<TourListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Slug'ı okunabilir başlığa çevirelim (Örn: "ege-bolgesi" -> "Ege Bölgesi")
  const title = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Kategori';

  useEffect(() => {
    setIsLoading(true);
    // Gerçek senaryoda veriyi slug'a veya WP Kategori ID'sine göre filtrelersiniz.
    // Şimdilik ana veriyi çekip, örnek olarak filtreliyoruz.
    getToursFromWordPress(1).then(data => {
      // Örnek filtreleme (Kategorilerinden veya isminden eşleştirme)
      // Normalde API'ye ?categories={id} şeklinde atılır.
      setListings(data);
      setIsLoading(false);
    });
  }, [slug]);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50/50">
      
      {/* Category Hero / SEO Alanı */}
      <div className="bg-white border-b border-gray-200 mb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <span className="inline-block py-1 px-3 rounded-full bg-orange-100 text-orange-600 text-sm font-bold tracking-wider mb-4 uppercase">
            Destinasyon Rehberi
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            {title} Gezi Rehberi & Öneriler
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600">
            {title} bölgesindeki en iyi otel önerileri, gizli kalmış koylar, mutlaka yapılması gereken turlar ve kapsamlı seyahat rehberlerimizi burada bulabilirsiniz.
          </p>
        </div>
      </div>

      {/* AdSense Placeholder - Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="w-full h-[90px] md:h-[120px] bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-mono text-sm">
          Reklam Alanı (Google AdSense Yüksek Tıklama Alanı)
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sol Kolon - Hızlı Filtreler ve Navigasyon */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-28">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Keşfet</h3>
              
              <ul className="space-y-2">
                <li>
                  <a href="#oteller" className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium transition-colors">
                    <Bed className="w-5 h-5 text-gray-400" />
                    Önerilen Oteller
                  </a>
                </li>
                <li>
                  <a href="#turlar" className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium transition-colors">
                    <Map className="w-5 h-5 text-gray-400" />
                    En İyi Turlar
                  </a>
                </li>
                <li>
                  <a href="#rehberler" className="flex items-center gap-3 p-3 rounded-xl hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-medium transition-colors">
                    <FileText className="w-5 h-5 text-gray-400" />
                    Gezi Yazıları
                  </a>
                </li>
              </ul>

              {/* Sidebar AdSense */}
              <div className="w-full h-[250px] bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-mono text-sm mt-8">
                Reklam Alanı Sidaber
              </div>
            </div>
          </aside>

          {/* Sağ Kolon - İçerikler */}
          <div className="lg:col-span-3 space-y-16">
            
            {/* Affiliate Satış Blokları (Oteller & Turlar) */}
            <section id="turlar" className="scroll-mt-28">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Compass className="w-6 h-6 text-orange-500" /> 
                  Premium Turlar & Aktiviteler
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  [1, 2].map((i) => (
                    <div key={i} className="animate-pulse bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                      <div className="aspect-[4/3] bg-gray-200"></div>
                      <div className="p-5 h-32 bg-white"></div>
                    </div>
                  ))
                ) : (
                  listings.slice(0, 4).map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))
                )}
              </div>
            </section>

            {/* In-feed AdSense */}
            <div className="w-full h-[90px] bg-gray-100 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-mono text-sm">
              Reklam Alanı (Okuma Arası)
            </div>

            {/* Bilgilendirici Gezi Blog Yazıları */}
            <section id="rehberler" className="scroll-mt-28">
              <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
                <FileText className="w-6 h-6 text-blue-500" /> 
                {title} Seyahat Rehberleri
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                {/* Gezi yazıları için örnek kartlar (Affiliate linki içermeyen, organik trafik getiren SEO içerikleri) */}
                {[1, 2, 3].map((i) => (
                  <Link key={i} to={`/blog/ornek-gezi-yazisi-${i}`} className="bg-white p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all flex flex-col md:flex-row gap-6 group">
                    <div className="w-full md:w-48 h-48 md:h-auto rounded-lg bg-gray-200 overflow-hidden shrink-0">
                      <LazyImage src={`https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=400&q=80`} alt="Blog" wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="flex flex-col justify-center">
                      <div className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-2">Rehber</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                        {title} Gezilecek Yerler: İlk Kez Gideceklere Tavsiyeler
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        Buraya WordPress'ten çekilen özet metni gelecek. Gezi rehberleri doğrudan yüksek kelime hacmi ile Google'dan trafik çeker. Yazı içerisine yine AdSense ve Affiliate linkler yerleştirilir.
                      </p>
                      <span className="text-sm font-medium text-gray-500">Okuma Süresi: 5 Dk</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
