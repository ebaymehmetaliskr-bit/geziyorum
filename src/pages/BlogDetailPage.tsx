import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Compass, Calendar, Clock, Share2, Facebook, Twitter, MapPin, Bed, ChevronRight } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { NewsletterSubscription } from '../components/NewsletterSubscription';
import { getBlogPostBySlugFromWordPress, BlogPost } from '../services/wp-api';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);
  const articleRef = useRef<HTMLElement>(null);
  const [readingTime, setReadingTime] = useState(5);
  const [headings, setHeadings] = useState<{ id: string, text: string, level: string }[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    window.scrollTo(0, 0);
    async function loadPost() {
      setIsLoading(true);
      if (slug) {
        const fetchedPost = await getBlogPostBySlugFromWordPress(slug);
        setPost(fetchedPost);
      }
      setIsLoading(false);
    }
    loadPost();
  }, [slug]);

  useEffect(() => {
    if (!isLoading && post && articleRef.current) {
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
  }, [isLoading, post]);

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

  if (!post) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center text-center px-4">
         <h1 className="text-3xl tracking-tight font-bold text-gray-900 mb-4">İçerik Bulunamadı</h1>
         <p className="text-gray-500 mb-8 max-w-md mx-auto">Aradığınız sayfaya ulaşılamıyor, yayından kaldırılmış veya URL değişmiş olabilir.</p>
         <Link to="/blog" className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors">
           Blog'a Dön
         </Link>
      </div>
    );
  }

  const generatedTitle = post.title || 'Gezi Rehberi';

  return (
    <div className="pt-20 bg-white">
      
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-orange-500 transition-colors">Blog</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-900 font-medium truncate max-w-[200px] sm:max-w-none">{generatedTitle}</span>
        </div>
      </div>

      {/* Hero Header */}
      <header className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
          <MapPin className="w-3.5 h-3.5" /> {post.categoryName}
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight" dangerouslySetInnerHTML={{ __html: post.title }}>
        </h1>
        <div className="flex items-center justify-center gap-6 text-gray-500 text-sm font-medium">
          <div className="flex items-center gap-2">
            <LazyImage src="https://i.pravatar.cc/100?img=33" alt="Author" wrapperClassName="w-8 h-8 rounded-full border border-gray-200 shrink-0" className="w-full h-full object-cover rounded-full" />
            <span>Geziyorum Ekibi</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" /> {post.date}
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
            src={post.img} 
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
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
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
          <div className="flex flex-wrap justify-center gap-4">
            <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-50 text-blue-600 rounded-full hover:bg-blue-100 transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-sky-50 text-sky-600 rounded-full hover:bg-sky-100 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href={`https://api.whatsapp.com/send?text=${encodeURIComponent(post.title + ' ' + window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-green-50 text-green-600 rounded-full hover:bg-green-100 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
            </a>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Bağlantı kopyalandı!');
            }} className="p-3 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
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
