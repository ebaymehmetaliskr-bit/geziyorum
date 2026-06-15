import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Calendar, Clock, Share2, Facebook, Twitter, MapPin, Bed, ChevronRight } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { NewsletterSubscription } from '../components/NewsletterSubscription';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const articleRef = useRef<HTMLElement>(null);
  const [readingTime, setReadingTime] = useState(5);
  const [headings, setHeadings] = useState<{ id: string, text: string, level: string }[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // We are simulating fetching the blog post data based on the slug.
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [slug]);

  useEffect(() => {
    if (!isLoading && articleRef.current) {
      // Create TOC
      const elements = Array.from(articleRef.current.querySelectorAll('h2, h3'));
      const parsedHeadings = elements.map((el, index) => {
        let id = el.id;
        if (!id) {
          id = `heading-${index}`;
          el.id = id;
        }
        return {
          id,
          text: el.textContent || '',
          level: el.tagName.toLowerCase()
        };
      });
      setHeadings(parsedHeadings);

      // Read time
      const text = articleRef.current.innerText || '';
      const wordCount = text.trim().split(/\s+/).length;
      const wpm = 220; // Average reading speed
      const time = Math.ceil(wordCount / wpm);
      setReadingTime(time > 0 ? time : 1);
    }
  }, [isLoading]);

  // Handle Scroll Spy for TOC
  useEffect(() => {
    const handleScroll = () => {
      const headingElements = headings.map(h => document.getElementById(h.id)).filter(Boolean);
      const scrollPosition = window.scrollY + 120; // Offset for fixed headers
      
      let currentActiveId = '';
      for (const el of headingElements) {
        if (el && el.offsetTop <= scrollPosition) {
          currentActiveId = el.id;
        }
      }
      
      if (currentActiveId && currentActiveId !== activeId) {
        setActiveId(currentActiveId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Call once to set initial active state
    return () => window.removeEventListener('scroll', handleScroll);
  }, [headings, activeId]);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const generatedTitle = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Gezi Rehberi';

  return (
    <div className="pt-20 bg-white">
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/destinasyon/turkiye" className="hover:text-orange-500 transition-colors">Türkiye</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{generatedTitle} Gezilecek Yerler</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <MapPin className="w-3.5 h-3.5" /> Bölge Rehberi
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
          {generatedTitle}: Nereye Gidilir, Ne Yenir? Kapsamlı Rehber
        </h1>
        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <LazyImage src="https://i.pravatar.cc/100?img=33" alt="Author" wrapperClassName="w-8 h-8 rounded-full border border-gray-200 shrink-0" className="w-full h-full object-cover rounded-full" />
            <span>Geziyorum Ekibi</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> 12 Ağustos 2024
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" /> {readingTime} Dk Okuma
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="aspect-[21/9] md:aspect-[21/8] bg-gray-200 rounded-2xl overflow-hidden shadow-sm relative">
          <LazyImage 
            src="https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=1600&q=80" 
            alt="Hero Background" 
            wrapperClassName="w-full h-full"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content Area */}
          <article ref={articleRef} className="lg:w-2/3 prose prose-lg prose-orange max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-orange-600 hover:prose-a:text-orange-700 prose-img:rounded-xl">
            
            <p className="text-xl text-gray-600 leading-relaxed mb-8">
              Türkiye'nin en popüler tatil rotalarından biri olan {generatedTitle}, sadece muhteşem doğası ve plajlarıyla değil, aynı zamanda tarihi zenginlikleriyle de öne çıkıyor. Bu rehberde, bölgeyi bir yerli gibi keşfetmeniz için bilmeniz gereken her şeyi derledik.
            </p>

            {/* AdSense In-Content Banner 1 */}
            <div className="not-prose my-10 w-full h-[120px] bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-mono text-sm leading-relaxed text-center px-4">
              Reklam Alanı<br/>(AdSense - İçerik İçi Yatay Banner)
            </div>

            <h2 id="genel-bakis">1. Genel Bakış ve Ulaşım</h2>
            <p>
              Bölgeye ulaşım genel olarak oldukça rahattır. Havalimanı transferleri, özel araç kiralama veya otobüs seferleri ile kolayca erişim sağlayabilirsiniz. En yakın havalimanı merkeze sadece 45 dakika uzaklıktadır. Uzun yolculukları sevenler için şahsi araçla sahil yolundan gelmek, eşsiz manzaralar sunar.
            </p>
            <p>
              İç ulaşımda ise minibüs (dolmuş) ağı çok gelişmiştir. Ancak gizli koyları keşfetmek istiyorsanız mutlaka bir araç kiralamanızı tavsiye ederiz.
            </p>

            <LazyImage src="https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80" alt="Harika bir koy" wrapperClassName="w-full h-auto rounded-xl" className="w-full h-auto rounded-xl" />
            <span className="text-sm text-gray-500 italic block text-center mt-2 mb-8">Sabah erken saatlerde ıssız bir koy manzarası.</span>

            <h2 id="gezilecek-yerler">2. Mutlaka Görmeniz Gereken Yerler</h2>
            <p>Tarihi kalıntılardan doğa harikalarına kadar uzanan listede öncelik vermeniz gerekenler:</p>
            <ul>
              <li><strong>Eski Çarşı ve Tarihi Sokaklar:</strong> Yöresel ürünlerin satıldığı, taş evlerin arasında kaybolacağınız dar sokaklar.</li>
              <li><strong>Antik Tiyatro:</strong> Günbatımını izlemek için en iyi konumlardan biri. MÖ 3. yüzyıldan kalma bu yapı hala bazı etkinliklere ev sahipliği yapıyor.</li>
              <li><strong>Saklı Kanyon:</strong> Biraz macera arayanlar için buz gibi suyuyla mükemmel bir yürüyüş rotası.</li>
            </ul>

            {/* Affiliate Block - Interactive Native Looking Ad */}
            <div className="not-prose my-12 bg-orange-50 border border-orange-100 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center shadow-sm">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-orange-600 font-bold mb-2">
                  <Compass className="w-5 h-5" /> 
                  Rehberin Tavsiyesi: Tekne Turu
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Tüm Gün Adalar ve Koylar Turu</h3>
                <p className="text-gray-700 mb-5">
                  Buraya kadar gelmişken adaları görmeden dönmek olmaz. Öğle yemeği dahil, 5 farklı koyda yüzme molası veren bu turu önceden rezerve edip indirimden faydalanabilirsiniz.
                </p>
                <a href="#" className="inline-block bg-orange-500 text-white font-bold px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20">
                  Rezervasyon Durumunu Kontrol Et
                </a>
              </div>
              <div className="w-full md:w-1/3 aspect-square bg-gray-200 rounded-xl overflow-hidden shrink-0">
                <LazyImage src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=400&q=80" alt="Tekne turu" wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
              </div>
            </div>

            <h2 id="konaklama">3. Nerede Kalınır? (Otel Tavsiyeleri)</h2>
            <p>
              Bütçenize ve beklentinize göre bölgede çok sayıda butik otel ve tatil köyü bulunuyor. Kendi konakladığımız ve ziyaretçilerin memnun puanlar bıraktığı otellerden bir derleme yaptık:
            </p>

            {/* Affiliate Block - Hotel Cards */}
            <div className="not-prose my-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { name: "Sunset Boutique Hotel", desc: "Merkeze yakın, harika manzaralı ve uygun fiyatlı.", rating: 9.2, price: "₺2.500" },
                { name: "Olive Garden Resort", desc: "Doğa ile iç içe, havuzlu ve lüks aile konaklaması.", rating: 8.9, price: "₺4.500" }
              ].map((hotel, idx) => (
                <div key={idx} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-40 bg-gray-200 relative">
                    <LazyImage src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80&sig=${idx}`} alt={hotel.name} wrapperClassName="w-full h-full" className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur text-gray-900 font-bold text-sm px-2 py-1 rounded">
                      ⭐ {hotel.rating}
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 text-lg mb-1">{hotel.name}</h4>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{hotel.desc}</p>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900">Gecelik {hotel.price}</span>
                      <a href="#" className="text-orange-600 bg-orange-50 px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-orange-100 transition-colors">
                        Fiyatlara Bak
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h2 id="yeme-icme">4. Ne Yenir?</h2>
            <p>
              Zeytinyağlılar, deniz ürünleri ve yöresel otlarla yapılmış mezeleri denemelisiniz. Sahil şeridindeki restoranlar akşam yemekleri için oldukça idealdir ancak biraz tuzlu olabilir. Mahalle aralarındaki "esnaf lokantaları" ise yerel lezzetleri en uygun fiyata bulabileceğiniz yerler.
            </p>

            {/* AdSense In-Content Banner 2 */}
             <div className="not-prose my-10 w-full h-[250px] bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-mono text-sm leading-relaxed text-center px-4">
              Reklam Alanı<br/>(AdSense - Kale Blok Büyük)
            </div>

          </article>


          {/* Right Sidebar (Sticky Options & Ads) */}
          <aside className="lg:w-1/3">
            <div className="sticky top-28 space-y-8">
              
              {/* Table of Contents (İçindekiler) */}
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Bu Yazıda Neler Var?</h3>
                <nav className="space-y-3">
                  {headings.length > 0 ? (
                    headings.map(h => (
                      <a 
                        key={h.id}
                        href={`#${h.id}`} 
                        className={`block transition-colors font-medium text-sm ${
                          h.level === 'h3' ? 'pl-4' : ''
                        } ${
                          activeId === h.id ? 'text-orange-600 font-bold' : 'text-gray-600 hover:text-orange-600'
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          const el = document.getElementById(h.id);
                          if (el) {
                            window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
                          }
                        }}
                      >
                        {h.text}
                      </a>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">İçerik başlıkları aranıyor...</p>
                  )}
                </nav>
              </div>

              {/* Sidebar AdSense */}
              <div className="w-full h-[600px] bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 font-mono text-sm leading-relaxed text-center px-4">
                Reklam Alanı<br/>(AdSense - Dikey Uzun Format)
              </div>

              {/* Top Rated Tours Widget (Affiliate) */}
              <div className="bg-white border text-center border-gray-200 p-6 rounded-2xl shadow-sm">
                 <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                   <MapPin className="w-6 h-6" />
                 </div>
                 <h4 className="font-bold text-lg text-gray-900 mb-2">Bölgedeki En İyi Etkinlikler</h4>
                 <p className="text-gray-500 text-sm mb-5">Hızlı tükenen biletleri önceden alın, tatilinizde sürpriz çıkmasın.</p>
                 <a href="#" className="block w-full py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-gray-800 transition-colors">
                   Biletleri İncele
                 </a>
              </div>

            </div>
          </aside>
        </div>

        {/* Social Sharing & Footer Area */}
        <div className="max-w-4xl mt-16 pt-8 border-t border-gray-100 flex flex-col items-center">
          <h4 className="font-bold text-gray-900 mb-4">Bu yazıyı faydalı buldun mu? Paylaş:</h4>
          <div className="flex gap-4">
            <button className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
              <Facebook className="w-5 h-5" />
            </button>
            <button className="p-3 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors">
              <Twitter className="w-5 h-5" />
            </button>
            <button className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Related Posts (Benzer İçerikler) */}
        <div className="mt-20 border-t border-gray-100 pt-16">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">İlginizi Çekebilecek Diğer Yazılar</h3>
            <Link to="/blog" className="hidden sm:flex items-center gap-1 text-orange-600 font-bold hover:text-orange-700 transition-colors">
              Tüm Yazıları Gör <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 1,
                title: 'Ege Köylerinde Gizli Kalmış 5 Butik Otel',
                tag: 'Konaklama',
                slug: 'ege-koylerinde-gizli-kalmis-5-butik-otel',
                img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'
              },
              {
                id: 2,
                title: 'Göcek Koyları İçin Tekne Turu Tavsiyeleri',
                tag: 'Rehber',
                slug: 'gocek-koylari-tekne-turu-tavsiyeleri',
                img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80'
              },
              {
                id: 3,
                title: 'Mavi Yolculuk: En İyi Rotalar ve Bütçe Planlaması',
                tag: 'Rotalar',
                slug: 'mavi-yolculuk-en-iyi-rotalar',
                img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=600&q=80'
              }
            ].map((post) => (
              <Link to={`/blog/${post.slug}`} key={post.id} className="group flex flex-col">
                <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-4 bg-gray-100 relative">
                  <LazyImage src={post.img} alt={post.title} wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-gray-900 shadow-sm">
                      {post.tag}
                    </span>
                  </div>
                </div>
                <h4 className="text-lg font-bold text-gray-900 group-hover:text-orange-600 transition-colors leading-snug mb-2">
                  {post.title}
                </h4>
                <div className="mt-auto flex items-center text-gray-500 text-sm font-medium">
                  Hemen Oku <ChevronRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center sm:hidden">
            <Link to="/blog" className="inline-flex items-center gap-1 text-orange-600 font-bold">
              Tüm Yazıları Gör <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <NewsletterSubscription />

      </div>
    </div>
  );
}
