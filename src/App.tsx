import { Menu, User, Compass, ChevronDown, Search } from 'lucide-react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { TourDetailPage } from './pages/TourDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogCategoryPage } from './pages/BlogCategoryPage';
import { MapPage } from './pages/MapPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SmartSearchModal } from './components/SmartSearchModal';
import { Footer } from './components/Footer';
import { getSiteSettings, SiteSettings } from './services/wp-api';

function PublicLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    getSiteSettings().then(settings => {
      if (settings) {
        setSiteSettings(settings);
        if (settings.site_icon_url) {
          // Update favicon
          let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
          if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
          }
          link.href = settings.site_icon_url;
        }
        if (settings.name) {
          document.title = settings.name;
        }
      }
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle search with Cmd+K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 text-gray-900 font-sans selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              {siteSettings?.site_logo_url ? (
                <img src={siteSettings.site_logo_url} alt="Logo" className="h-8 w-auto object-contain" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-semibold text-xl tracking-tight text-gray-900">
                {siteSettings?.name || 'Geziyorum Türkiye'}
              </span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8">
              {/* Dropdown - Destinasyonlar */}
              <div className="relative group">
                <button className="flex items-center gap-1 font-medium text-gray-900 hover:text-orange-600 transition-colors py-4">
                  Destinasyonlar <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform" />
                </button>
                <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -translate-y-2 group-hover:translate-y-0 overflow-hidden">
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Türkiye</div>
                    <Link to="/destinasyon/ege-bolgesi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Ege Bölgesi</Link>
                    <Link to="/destinasyon/akdeniz" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Akdeniz Kıyıları</Link>
                    <Link to="/destinasyon/kapadokya" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Kapadokya</Link>
                    <div className="max-w-full border-t border-gray-50 my-2"></div>
                    <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Yurtdışı</div>
                    <Link to="/destinasyon/balkanlar" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Balkanlar</Link>
                    <Link to="/destinasyon/avrupa" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors">Klasik Avrupa</Link>
                  </div>
                </div>
              </div>

              <Link to="/harita" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">Harita</Link>
              <Link to="/" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">Tüm Öneriler</Link>
              <Link to="/blog" className="font-medium text-gray-600 hover:text-gray-900 transition-colors">Blog</Link>
              
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100/50 hover:bg-gray-100 text-gray-600 hover:text-gray-900 transition-colors"
                title="Arama Yap (Cmd+K)"
              >
                <Search className="w-4 h-4" />
                <span className="text-sm font-medium">Arama</span>
                <kbd className="hidden lg:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-gray-200 bg-white text-[10px] font-medium text-gray-400 ml-1">
                  <span className="text-xs">⌘</span>K
                </kbd>
              </button>

              <Link to="/admin" className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 text-white hover:bg-gray-800 transition-all text-sm font-medium">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <SmartSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Content Areas */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/tour/:id" element={<TourDetailPage />} />
        <Route path="/harita" element={<MapPage />} />
        <Route path="/destinasyon/:slug" element={<CategoryPage />} />
        <Route path="/blog" element={<BlogCategoryPage />} />
        <Route path="/blog/kategori/:categorySlug" element={<BlogCategoryPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
      </Route>
      
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}

