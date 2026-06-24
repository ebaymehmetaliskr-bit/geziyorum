import { Menu, User, Compass, ChevronDown, Search, Map as MapIcon, Plus } from 'lucide-react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { TourDetailPage } from './pages/TourDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { BlogCategoryPage } from './pages/BlogCategoryPage';
import { MapPage } from './pages/MapPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { ProfilePage } from './pages/ProfilePage';
import { SmartSearchModal } from './components/SmartSearchModal';
import { Footer } from './components/Footer';
import { UserMenu } from './components/UserMenu';
import { getSiteSettings, SiteSettings } from './services/wp-api';

function PublicLayout() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>({
    name: 'Geziyorum Türkiye',
    description: 'Gezi Rehberi',
    site_logo_url: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=100&h=100&fit=crop',
    top_links: [
        { title: 'Destinasyonlar', url: '/destinasyon/ege-bolgesi' },
        { title: 'Harita', url: '/harita' },
        { title: 'Rota Planla', url: '/rota-planlayici' },
        { title: 'Tüm Öneriler', url: '/' },
        { title: 'Blog', url: '/blog' }
    ]
  });

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
                <img src={siteSettings.site_logo_url} alt="Logo" referrerPolicy="no-referrer" className="h-8 w-auto object-contain" />
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
              {siteSettings?.top_links && siteSettings.top_links.map((link, idx) => {
                if (link.title === 'Destinasyonlar') {
                  return (
                    <div key={idx} className="relative group">
                      <button className="flex items-center gap-1 font-medium text-gray-600 hover:text-gray-900 transition-colors py-2">
                        {link.title}
                        <ChevronDown className="w-4 h-4 opacity-50 group-hover:rotate-180 transition-transform duration-200" />
                      </button>
                      <div className="absolute top-full left-0 w-48 bg-white border border-gray-100 shadow-xl rounded-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-50">
                        <Link to="/destinasyon/ege-bolgesi" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Ege Bölgesi</Link>
                        <Link to="/destinasyon/akdeniz" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Akdeniz</Link>
                        <Link to="/destinasyon/marmara" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Marmara</Link>
                        <Link to="/destinasyon/karadeniz" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Karadeniz</Link>
                        <Link to="/destinasyon/ic-anadolu" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">İç Anadolu</Link>
                        <Link to="/destinasyon/kapadokya" className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600">Kapadokya</Link>
                      </div>
                    </div>
                  );
                }
                if (link.title === 'Rota Planla') {
                  return (
                    <Link key={idx} to={link.url} className="flex items-center gap-1.5 font-medium text-orange-600 hover:text-orange-700 transition-colors">
                      <MapIcon className="w-4 h-4" />
                      {link.title}
                    </Link>
                  );
                }
                if (link.title === 'Harita') {
                  return (
                    <Link key={idx} to={link.url} className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition-colors">
                      <Compass className="w-4 h-4" />
                      {link.title}
                    </Link>
                  );
                }
                return (
                  <Link key={idx} to={link.url} className="font-medium text-gray-600 hover:text-gray-900 transition-colors">
                    {link.title}
                  </Link>
                );
              })}
              
              {/* Ensure Harita is shown if missing from wp settings */}
              {!siteSettings?.top_links?.some(l => l.title === 'Harita') && (
                <Link to="/harita" className="flex items-center gap-1.5 font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  <Compass className="w-4 h-4" />
                  Harita
                </Link>
              )}
              
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

              <UserMenu />
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                title="Arama Yap"
              >
                <Search className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 shadow-lg absolute top-full left-0 right-0 py-4 px-4 flex flex-col gap-4">
            {siteSettings?.top_links && siteSettings.top_links.map((link, idx) => {
              if (link.title === 'Destinasyonlar') {
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <span className="font-medium text-gray-900 px-2 py-1 border-b border-gray-100">{link.title}</span>
                    <Link to="/destinasyon/ege-bolgesi" onClick={() => setIsMobileMenuOpen(false)} className="pl-6 font-medium text-gray-500 hover:text-gray-900 transition-colors py-1">Ege Bölgesi</Link>
                    <Link to="/destinasyon/akdeniz" onClick={() => setIsMobileMenuOpen(false)} className="pl-6 font-medium text-gray-500 hover:text-gray-900 transition-colors py-1">Akdeniz</Link>
                    <Link to="/destinasyon/marmara" onClick={() => setIsMobileMenuOpen(false)} className="pl-6 font-medium text-gray-500 hover:text-gray-900 transition-colors py-1">Marmara</Link>
                    <Link to="/destinasyon/karadeniz" onClick={() => setIsMobileMenuOpen(false)} className="pl-6 font-medium text-gray-500 hover:text-gray-900 transition-colors py-1">Karadeniz</Link>
                    <Link to="/destinasyon/ic-anadolu" onClick={() => setIsMobileMenuOpen(false)} className="pl-6 font-medium text-gray-500 hover:text-gray-900 transition-colors py-1">İç Anadolu</Link>
                    <Link to="/destinasyon/kapadokya" onClick={() => setIsMobileMenuOpen(false)} className="pl-6 font-medium text-gray-500 hover:text-gray-900 transition-colors py-1">Kapadokya</Link>
                  </div>
                );
              }
              if (link.title === 'Rota Planla') {
                return (
                  <Link key={idx} to={link.url} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-medium text-orange-600 hover:text-orange-700 transition-colors px-2 py-1">
                    <MapIcon className="w-5 h-5" />
                    {link.title}
                  </Link>
                );
              }
              if (link.title === 'Harita') {
                return (
                  <Link key={idx} to={link.url} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1">
                    <Compass className="w-5 h-5" />
                    {link.title}
                  </Link>
                );
              }
              return (
                <Link key={idx} to={link.url} onClick={() => setIsMobileMenuOpen(false)} className="font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1">
                  {link.title}
                </Link>
              );
            })}
            
            {/* Ensure Harita is shown if missing from wp settings */}
            {!siteSettings?.top_links?.some(l => l.title === 'Harita') && (
              <Link to="/harita" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 font-medium text-gray-600 hover:text-gray-900 transition-colors px-2 py-1">
                <Compass className="w-5 h-5" />
                Harita
              </Link>
            )}
            <div className="border-t border-gray-100 pt-4 mt-2">
              <div className="flex justify-center mb-4">
                <UserMenu />
              </div>
            </div>
          </div>
        )}
      </nav>

      <SmartSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Main Content Areas */}
      <main className="flex-grow pt-16">
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
        <Route path="/rota-planlayici" element={<RoutePlannerPage />} />
        <Route path="/destinasyon/:slug" element={<CategoryPage />} />
        <Route path="/blog" element={<BlogCategoryPage />} />
        <Route path="/blog/kategori/:categorySlug" element={<BlogCategoryPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/profil/*" element={<ProfilePage />} />
      </Route>
      
      <Route path="/admin/*" element={<AdminDashboard />} />
    </Routes>
  );
}

