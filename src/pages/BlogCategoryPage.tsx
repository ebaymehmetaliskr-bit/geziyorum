import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowRight, Rss, TrendingUp } from 'lucide-react';
import { LazyImage } from '../components/LazyImage';
import { NewsletterSubscription } from '../components/NewsletterSubscription';

const CATEGORIES = [
  { id: 'all', name: 'Tüm Yazılar', slug: '' },
  { id: 'rehber', name: 'Gezi Rehberi', slug: 'gezi-rehberi' },
  { id: 'konaklama', name: 'Otel & Konaklama', slug: 'konaklama' },
  { id: 'yeme-icme', name: 'Yeme & İçme', slug: 'yeme-icme' },
  { id: 'rotalar', name: 'Gizli Rotalar', slug: 'gizli-rotalar' },
];

const MOCK_POSTS = [
  {
    id: 1,
    title: 'Kapadokya\'da Balon Turu: Bilmeniz Gereken Her Şey',
    excerpt: 'Hayatınızda bir kez yapacağınız bu harika deneyim öncesi biletinizi alırken nelere dikkat etmelisiniz?',
    img: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80',
    categorySlug: 'gezi-rehberi',
    categoryName: 'Gezi Rehberi',
    date: '12 Ağustos 2024',
    slug: 'kapadokya-balon-turu-rehberi'
  },
  {
    id: 2,
    title: 'Ege\'nin Maldivleri: Kalem Adası',
    excerpt: 'İzmir Dikili açıklarındaki bu gizli cennet, henüz keşfedilmemiş yerli turistler için harika bir hafta sonu kaçamağı.',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    categorySlug: 'gizli-rotalar',
    categoryName: 'Gizli Rotalar',
    date: '5 Ağustos 2024',
    slug: 'ege-maldivleri-kalem-adasi'
  },
  {
    id: 3,
    title: 'Fethiye\'de Nerede Kalınır? En İyi 5 Butik Otel',
    excerpt: 'Deniz manzaralı, doğa ile iç içe ve sakin bir tatil arayanlar için fiyat/performans açısından en iyi butik oteller.',
    img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    categorySlug: 'konaklama',
    categoryName: 'Otel & Konaklama',
    date: '28 Temmuz 2024',
    slug: 'fethiye-butik-otel-tavsiyeleri'
  },
  {
    id: 4,
    title: 'Bodrum Akşamlarının Vazgeçilmezi: 10 En İyi Balıkçı',
    excerpt: 'Taze deniz ürünleri ve harika Ege mezelerini denemek için rotanızı çevirmeniz gereken en popüler yerel restoranlar.',
    img: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=800&q=80',
    categorySlug: 'yeme-icme',
    categoryName: 'Yeme & İçme',
    date: '15 Temmuz 2024',
    slug: 'bodrum-en-iyi-balik-restoranlari'
  },
  {
    id: 5,
    title: 'Kazdağları Kamp Rehberi ve Doğaya Dönüş',
    excerpt: 'Bol oksijen, doğa ile baş başa bir deneyim. Kazdağları eteklerinde çadırınızı kurabileceğiniz en iyi kamp alanları.',
    img: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=800&q=80',
    categorySlug: 'gezi-rehberi',
    categoryName: 'Gezi Rehberi',
    date: '10 Temmuz 2024',
    slug: 'kazdaglari-kamp-rehberi'
  },
  {
    id: 6,
    title: 'Balkanlarda Vizesiz Rota: Saraybosna\'dan Belgrad\'a',
    excerpt: 'Hem ekonomik hem de vizesiz! Araba kiralayarak yapabileceğiniz enfes bir Balkanlar seyahat rotası planlıyoruz.',
    img: 'https://images.unsplash.com/photo-1613524458514-419b139deae2?auto=format&fit=crop&w=800&q=80',
    categorySlug: 'rotalar',
    categoryName: 'Gizli Rotalar',
    date: '1 Temmuz 2024',
    slug: 'balkanlar-vizesiz-rota-rehberi'
  }
];

export function BlogCategoryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  
  const activeCategory = CATEGORIES.find(c => c.slug === categorySlug) || CATEGORIES[0];
  
  const filteredPosts = categorySlug 
    ? MOCK_POSTS.filter(post => post.categorySlug === categorySlug)
    : MOCK_POSTS;

  return (
    <div className="pt-20 bg-gray-50/50 min-h-screen">
      
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-start gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-orange-500 transition-colors">Ana Sayfa</Link>
          <ChevronRight className="w-3 h-3" />
          <Link to="/blog" className="hover:text-orange-500 transition-colors">Blog</Link>
          {categorySlug && (
            <>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-900 font-medium">{activeCategory.name}</span>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-white px-4 sm:px-6 lg:px-8 py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
            {activeCategory.name === 'Tüm Yazılar' ? 'Seyahat Blogu & Rehberler' : activeCategory.name}
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            {activeCategory.slug === '' 
              ? 'Seyahatlerinizi planlarken işinize yarayacak en güncel tüyolar, konaklama tavsiyeleri ve lezzet durakları.'
              : `${activeCategory.name} ile ilgili en yeni ve detaylı içerikleri buradan okuyabilirsiniz.`}
          </p>
        </div>
      </div>
      
      {/* AdSense Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full h-[90px] md:h-[120px] bg-gray-100 border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 font-mono text-sm leading-relaxed text-center">
          Reklam Alanı<br/>(AdSense - Yatay Banner)
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        
        {/* Category Pills (Filters) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-6 mb-8 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link 
              key={cat.id} 
              to={cat.slug ? `/blog/kategori/${cat.slug}` : '/blog'}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full font-bold text-sm transition-colors ${
                (categorySlug || '') === cat.slug 
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Main Content (Post Grid) */}
          <div className="lg:w-2/3">
            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredPosts.map(post => (
                  <Link to={`/blog/${post.slug}`} key={post.id} className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all">
                    <div className="aspect-[4/3] w-full bg-gray-100 relative overflow-hidden">
                      <LazyImage src={post.img} alt={post.title} wrapperClassName="w-full h-full" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-4 left-4 pointer-events-none">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-orange-600 uppercase tracking-widest shadow-sm">
                          {post.categoryName}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 leading-snug mb-3 group-hover:text-orange-600 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-600 text-sm line-clamp-3 mb-6">
                        {post.excerpt}
                      </p>
                      
                      <div className="mt-auto flex items-center font-bold text-orange-600 text-sm">
                        <span>Yazıyı Oku</span>
                        <ArrowRight className="w-4 h-4 ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
               <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                 <Rss className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Bu kategoride henüz yazı yok</h3>
                 <p className="text-gray-500 mb-6">Editörlerimiz sizin için yepyeni içerikler hazırlıyor.</p>
                 <Link to="/blog" className="inline-block px-6 py-3 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-100 transition-colors">
                   Tüm Yazılara Dön
                 </Link>
               </div>
            )}

            {/* Pagination Mock */}
            {filteredPosts.length > 0 && (
              <div className="mt-12 flex justify-center">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-400 cursor-not-allowed">
                    1
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-50 text-orange-600 font-bold">
                    2
                  </button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <span className="px-2 text-gray-400">...</span>
                  <button className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors">
                    12
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3 space-y-8">
            
            {/* Sidebar AdSense */}
            <div className="w-full h-[250px] bg-white border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 font-mono text-sm">
              Kare Reklam (300x250)
            </div>

            {/* Popular Posts Widget */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold text-gray-900 text-lg">En Çok Okunanlar</h3>
              </div>
              
              <div className="space-y-6">
                {MOCK_POSTS.slice(0,4).map((post, i) => (
                  <Link key={i} to={`/blog/${post.slug}`} className="flex gap-4 group">
                    <span className="text-3xl font-extrabold text-gray-200 group-hover:text-orange-500 transition-colors shrink-0">
                      0{i + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm group-hover:text-orange-600 transition-colors line-clamp-2 leading-snug mb-1">
                        {post.title}
                      </h4>
                      <span className="text-xs text-gray-500 font-medium">{post.date}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Side Widget */}
            <div className="bg-gray-900 rounded-2xl p-6 text-center text-white relative overflow-hidden">
               {/* Decorative blob */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/30 rounded-full blur-2xl"></div>
               
               <h3 className="relative z-10 text-xl font-bold mb-2">Haftalık Rota Bülteni</h3>
               <p className="relative z-10 text-gray-400 text-sm mb-6">
                 Gizli kalmış yerleri ve yeni yazılarımızı ilk siz öğrenin.
               </p>
               
               <form className="relative z-10 space-y-3">
                 <input 
                   type="email" 
                   placeholder="E-posta adresiniz" 
                   className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-gray-400 focus:outline-none focus:border-orange-500 transition-colors text-sm"
                 />
                 <button className="w-full py-3 bg-orange-500 hover:bg-orange-600 transition-colors font-bold rounded-xl text-sm">
                   Abone Ol
                 </button>
               </form>
            </div>

            {/* Sticky AdSense */}
            <div className="sticky top-24 w-full h-[600px] bg-white border border-dashed border-gray-300 rounded-2xl flex items-center justify-center text-gray-400 font-mono text-sm leading-relaxed text-center">
              Dikey Reklam<br/>(AdSense - 300x600)
            </div>

          </aside>

        </div>

        <NewsletterSubscription />

      </div>
    </div>
  );
}
