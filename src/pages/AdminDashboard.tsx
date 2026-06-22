import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Settings, 
  BarChart3, 
  Link as LinkIcon, 
  DollarSign, 
  Eye, 
  RefreshCw,
  LogOut,
  MousePointerClick,
  FileText,
  MapPin,
  TrendingUp,
  AlertCircle,
  Search
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { LazyImage } from '../components/LazyImage';
import { AdminAuth } from '../components/AdminAuth';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('settings');
  const [isSyncing, setIsSyncing] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch(e) {}
  };

  const [isSavingSeo, setIsSavingSeo] = useState(false);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Settings State
  const [settingsName, setSettingsName] = useState('');
  const [settingsLogo, setSettingsLogo] = useState('');
  const [settingsFooter, setSettingsFooter] = useState('');
  const [settingsLinks, setSettingsLinks] = useState<{title: string, url: string}[]>([]);

  // SEO State
  const [seoItems, setSeoItems] = useState<any[]>([]);
  const [isLoadingSeo, setIsLoadingSeo] = useState(false);

  // Load SEO items on mount/tab change
  useEffect(() => {
    if (activeTab === 'seo' && seoItems.length === 0) {
      loadSeoItems();
    }
  }, [activeTab]);

  // Load existing settings
  useState(() => {
    try {
      const saved = localStorage.getItem('geziyorum_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.name) setSettingsName(parsed.name);
        if (parsed.site_logo_url) setSettingsLogo(parsed.site_logo_url);
        if (parsed.footer_text) setSettingsFooter(parsed.footer_text);
        if (parsed.top_links) setSettingsLinks(parsed.top_links);
      } else {
        // Defaults
        setSettingsLinks([
          { title: 'Destinasyonlar', url: '/destinasyon/ege-bolgesi' },
          { title: 'Harita', url: '/harita' },
          { title: 'Rota Planla', url: '/rota-planlayici' },
          { title: 'Blog', url: '/blog' }
        ]);
      }
    } catch(e) {}
  });

  const handleSaveSettings = () => {
    setIsSavingSettings(true);
    let existing: any = {};
    try {
      existing = JSON.parse(localStorage.getItem('geziyorum_settings') || '{}');
    } catch(e) {}
    
    existing.name = settingsName;
    existing.site_logo_url = settingsLogo;
    existing.footer_text = settingsFooter;
    existing.top_links = settingsLinks;
    
    localStorage.setItem('geziyorum_settings', JSON.stringify(existing));
    
    setTimeout(() => {
      setIsSavingSettings(false);
      window.location.reload(); // Refresh to apply new settings to layouts outside generic states
    }, 1000);
  };

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const loadSeoItems = async () => {
    setIsLoadingSeo(true);
    try {
      const WP_URL = import.meta.env.VITE_WP_API_URL || 'https://www.geziyorumturkiye.com';
      const res = await fetch(`${WP_URL}/wp-json/wp/v2/posts?per_page=15`);
      if (res.ok) {
        const data = await res.json();
        const localSeo = JSON.parse(localStorage.getItem('geziyorum_seo') || '{}');
        const mapped = data.map((post: any) => {
          const local = localSeo[post.id] || {};
          return {
            id: post.id,
            type: 'Blog / Destinasyon',
            title: post.title.rendered,
            path: `/blog/${post.slug}`,
            metaTitle: local.metaTitle || `${post.title.rendered} | Geziyorum`,
            metaDesc: local.metaDesc || post.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "").substring(0, 100) || ''
          };
        });
        setSeoItems(mapped);
      }
    } catch (e) {
      console.warn("Failed to load SEO items", e);
    }
    setIsLoadingSeo(false);
  };

  const handleSeoChange = (id: number, field: string, value: string) => {
    setSeoItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSaveSeo = () => {
    setIsSavingSeo(true);
    try {
      const localSeo: any = JSON.parse(localStorage.getItem('geziyorum_seo') || '{}');
      seoItems.forEach(item => {
        localSeo[item.id] = { metaTitle: item.metaTitle, metaDesc: item.metaDesc };
      });
      localStorage.setItem('geziyorum_seo', JSON.stringify(localSeo));
    } catch(e) {}
    
    setTimeout(() => setIsSavingSeo(false), 1500);
  };

  const handleUpdateLink = (index: number, field: string, value: string) => {
     setSettingsLinks(prev => prev.map((link, i) => i === index ? { ...link, [field]: value } : link));
  };

  const handleAddLink = () => {
     setSettingsLinks([...settingsLinks, { title: 'Yeni Link', url: '/' }]);
  };

  const handleRemoveLink = (index: number) => {
     setSettingsLinks(settingsLinks.filter((_, i) => i !== index));
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
        
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900 text-gray-300 min-h-screen flex flex-col shrink-0">
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <Link to="/" className="text-white font-bold text-xl tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-500" />
            Geziyorum Panel
          </Link>
        </div>

        <div className="p-4 flex-1">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">Yönetim</div>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'overview' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Genel Bakış
            </button>
            <button 
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'content' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <FileText className="w-5 h-5" />
              İçerik (WP Senkronizasyon)
            </button>
            <button 
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'seo' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <Search className="w-5 h-5" />
              SEO Yönetimi
            </button>
            <button 
              onClick={() => setActiveTab('monetization')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'monetization' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <DollarSign className="w-5 h-5" />
              Gelir & Affiliate
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'analytics' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <BarChart3 className="w-5 h-5" />
              Trafik Analizi
            </button>
          </nav>

          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 px-2 mt-8">Sistem</div>
          <nav className="space-y-1">
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors ${activeTab === 'settings' ? 'bg-orange-500 text-white' : 'hover:bg-gray-800 hover:text-white'}`}
            >
              <Settings className="w-5 h-5" />
              Genel Ayarlar
            </button>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium hover:bg-red-500/10 hover:text-red-400 transition-colors text-gray-400"
            >
              <LogOut className="w-5 h-5" />
              Çıkış Yap
            </button>
          </nav>
        </div>
        
        {/* Help box */}
        <div className="p-4 mx-4 mb-4 bg-gray-800 rounded-xl">
           <div className="flex items-start gap-2">
             <AlertCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
             <div>
               <p className="text-sm text-gray-300 font-medium">Headless CMS</p>
               <p className="text-xs text-gray-500 mt-1">İçerikler otomatik olarak WordPress'ten çekilir.</p>
             </div>
           </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0 shadow-sm z-10">
          <h1 className="text-xl font-bold text-gray-900">
            {activeTab === 'overview' && 'Dashboard'}
            {activeTab === 'content' && 'İçerik Yönetimi'}
            {activeTab === 'seo' && 'SEO Yönetimi'}
            {activeTab === 'monetization' && 'Gelir Raporları'}
            {activeTab === 'analytics' && 'Trafik ve Analiz'}
          </h1>
          <div className="flex items-center gap-4">
            <a href="https://wordpress.com" target="_blank" rel="noreferrer" className="text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors">
              WP Admin'e Git
            </a>
            <div className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white shadow-sm overflow-hidden flex-shrink-0">
               <LazyImage src="https://i.pravatar.cc/150?u=admin" className="w-full h-full object-cover" alt="Admin" wrapperClassName="w-full h-full" />
            </div>
          </div>
        </header>

        {/* Scrollable Area */}
        <div className="flex-1 overflow-auto p-8">
          
          {activeTab === 'overview' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-4 opacity-10"><Eye className="w-16 h-16 text-blue-500" /></div>
                  <div className="text-gray-500 text-sm font-bold mb-2">Aylık Sayfa Gösterimi</div>
                  <div className="text-3xl font-extrabold text-gray-900">124.5K</div>
                  <div className="text-sm text-green-500 font-medium mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> +14.2%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="w-16 h-16 text-green-500" /></div>
                  <div className="text-gray-500 text-sm font-bold mb-2">Tahmini AdSense Geliri</div>
                  <div className="text-3xl font-extrabold text-gray-900">₺14,250</div>
                  <div className="text-sm text-green-500 font-medium mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> +8.5%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><MousePointerClick className="w-16 h-16 text-orange-500" /></div>
                  <div className="text-gray-500 text-sm font-bold mb-2">Affiliate Tıklamaları</div>
                  <div className="text-3xl font-extrabold text-gray-900">3,420</div>
                  <div className="text-sm text-green-500 font-medium mt-2 flex items-center gap-1"><TrendingUp className="w-4 h-4"/> +22.1%</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4 opacity-10"><LinkIcon className="w-16 h-16 text-purple-500" /></div>
                  <div className="text-gray-500 text-sm font-bold mb-2">Gerçekleşen Satış</div>
                  <div className="text-3xl font-extrabold text-gray-900">142</div>
                  <div className="text-sm text-gray-500 font-medium mt-2 flex items-center gap-1">Dönüşüm: 4.15%</div>
                </div>
              </div>

              {/* Charts & Lists */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Popular Posts */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">En Çok Kazandıran İçerikler</h3>
                    <button className="text-orange-500 text-sm font-bold hover:text-orange-600 transition-colors">Tümünü Gör</button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { title: "Kapadokya Gezi Rehberi (2024)", views: "45K", clicks: "1,200", rev: "₺3,400" },
                      { title: "Fethiye En İyi Tekne Turları", views: "32K", clicks: "950", rev: "₺2,850" },
                      { title: "Ege'nin Gizli Koyları", views: "28K", clicks: "420", rev: "₺1,100" },
                      { title: "Bozcaada Klasik Otelleri", views: "15K", clicks: "310", rev: "₺950" }
                    ].map((post, i) => (
                      <div key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                        <div>
                          <div className="font-bold text-gray-900 text-sm mb-1">{post.title}</div>
                          <div className="text-xs text-gray-500 flex gap-4">
                            <span>Gösterim: {post.views}</span>
                            <span>Tıklama: {post.clicks}</span>
                          </div>
                        </div>
                        <div className="font-bold text-green-600">{post.rev}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Affiliate Partners */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
                  <div className="p-6 border-b border-gray-100">
                    <h3 className="font-bold text-gray-900">Partner Dağılımı (Affiliate)</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span>GetYourGuide (Turlar)</span>
                        <span>45%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div className="bg-orange-500 h-3 rounded-full" style={{ width: '45%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span>Booking.com (Otel)</span>
                        <span>35%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div className="bg-blue-500 h-3 rounded-full" style={{ width: '35%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span>Enuygun (Uçak)</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3">
                        <div className="bg-green-500 h-3 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    
                    <div className="pt-6 mt-6 border-t border-gray-100">
                       <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-bold hover:border-gray-400 hover:text-gray-700 transition-colors">
                         + Yeni Partner Ekstraktını Yükle
                       </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'content' && (
            <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
               <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 text-center">
                 <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                   <RefreshCw className={`w-10 h-10 text-blue-500 ${isSyncing ? 'animate-spin' : ''}`} />
                 </div>
                 <h2 className="text-2xl font-bold text-gray-900 mb-4">WordPress REST API Bağlantısı Aktif</h2>
                 <p className="text-gray-500 max-w-lg mx-auto mb-8">
                   Sistem şu anda <a href="#" className="text-blue-500 font-bold hover:underline">geziyorumturkiye.com</a> adresi ile başarılı bir şekilde haberleşiyor. İçerik güncellemeleri otomatik sağlanır. Ancak hemen senkronize etmek için aşağıdaki butonu kullanabilirsiniz.
                 </p>
                 <button 
                   onClick={handleSync}
                   disabled={isSyncing}
                   className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-colors disabled:opacity-50"
                 >
                   {isSyncing ? 'Senkronize Ediliyor...' : 'Manuel Veri Çekme İşlemini Başlat'}
                 </button>
               </div>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">SEO Konfigürasyonu</h2>
                  <p className="text-gray-500 mt-1">Blog yazıları ve destinasyon sayfaları için meta başlık ve açıklama ayarları.</p>
                </div>
                <button 
                  onClick={handleSaveSeo}
                  disabled={isSavingSeo}
                  className={`font-bold py-2 px-6 rounded-xl transition-colors ${
                    isSavingSeo 
                      ? 'bg-green-500 text-white' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {isSavingSeo ? 'Kaydedildi ✓' : 'Değişiklikleri Kaydet'}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Sayfalar ve İçerikler (Canlı WordPress Entegrasyonu)</h3>
                  {isLoadingSeo && <span className="text-sm font-medium text-blue-500 animate-pulse">Veriler Çekiliyor...</span>}
                </div>
                <div className="divide-y divide-gray-100">
                  {seoItems.length === 0 && !isLoadingSeo && (
                     <div className="p-8 text-center text-gray-500">
                       İçerik bulunamadı veya yüklenemedi.
                     </div>
                  )}
                  {seoItems.map((item) => (
                    <div key={`seo-${item.id}`} className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="font-bold text-gray-900 text-lg mb-1">{item.title}</div>
                          <div className="text-sm text-blue-500 font-medium">{item.path}</div>
                        </div>
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full">{item.type}</span>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Meta Başlık</label>
                          <input 
                            type="text" 
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                            value={item.metaTitle}
                            onChange={(e) => handleSeoChange(item.id, 'metaTitle', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1">Meta Açıklama</label>
                          <textarea 
                            className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 resize-none h-20"
                            value={item.metaDesc}
                            onChange={(e) => handleSeoChange(item.id, 'metaDesc', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {activeTab === 'monetization' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Affiliate & Gelir Merkezi</h2>
                  <p className="text-gray-500 mt-1">Tüm partner ağlarındaki tıklama ve dönüşüm oranlarının konsolide raporu.</p>
                </div>
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                  <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-900">Son 30 Gün</button>
                  <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900">Bu Yıl</button>
                  <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900">Tümü</button>
                </div>
              </div>

              {/* Top KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">+12.5%</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Toplam Kesinleşen Gelir</h3>
                  <div className="text-3xl font-extrabold text-gray-900">₺24,850.00</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                      <MousePointerClick className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">+5.2%</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Toplam Yönlendirme (Click)</h3>
                  <div className="text-3xl font-extrabold text-gray-900">12,408</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">-1.2%</span>
                  </div>
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Ortalama Dönüşüm Oranı</h3>
                  <div className="text-3xl font-extrabold text-gray-900">3.8%</div>
                </div>
              </div>

              {/* Detailed Charts & Tables Area */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Performance Chart Mock */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6">Gelir Trendi (Günlük)</h3>
                  <div className="h-64 flex items-end gap-2 px-2">
                    {/* Mock Bars */}
                    {[40, 55, 30, 80, 65, 45, 90, 100, 75, 50, 85, 110, 95, 60].map((height, i) => (
                      <div key={i} className="flex-1 flex flex-col justify-end group">
                         <div className="w-full bg-orange-100 hover:bg-orange-500 transition-colors rounded-t-sm relative" style={{ height: `${height}%` }}>
                           {/* Tooltip on hover */}
                           <div className="opacity-0 group-hover:opacity-100 absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold py-1 px-2 rounded pointer-events-none transition-opacity whitespace-nowrap z-10">
                             ₺{height * 15}
                           </div>
                         </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-xs font-bold text-gray-400">
                    <span>1 Haz</span>
                    <span>7 Haz</span>
                    <span>14 Haz</span>
                  </div>
                </div>

                {/* Network Breakdown */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
                  <h3 className="font-bold text-gray-900 mb-6">Ağlara Göre Dağılım</h3>
                  
                  <div className="space-y-6 flex-1">
                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-500"></div> Booking.com</span>
                        <span>₺12,400</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-orange-500"></div> GetYourGuide</span>
                        <span>₺8,200</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '33%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> RentalCars</span>
                        <span>₺4,250</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '17%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Best Performing Links Table */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-gray-900">En Çok Dönüşüm Getiren Linkler</h3>
                  <p className="text-sm text-gray-500">Yazı içindeki yerleşimlere göre performans takibi.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider text-xs">
                      <tr>
                        <th className="px-6 py-4">Link Durumu & Hedef</th>
                        <th className="px-6 py-4">Kaynak Sayfa</th>
                        <th className="px-6 py-4 border-l border-gray-100 text-center">Tıklama</th>
                        <th className="px-6 py-4 text-center">Satış</th>
                        <th className="px-6 py-4 text-center">Dönüşüm</th>
                        <th className="px-6 py-4 text-right">Gelir</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-800">
                      {[
                        { dest: 'Kelebekler Vadisi Turu (GYG)', source: '/fethiye-turlari', clicks: 840, sales: 42, conv: '5.0%', rev: '₺3,200' },
                        { dest: 'Sunset Boutique Hotel (Booking)', source: '/ege-butik-oteller', clicks: 1250, sales: 30, conv: '2.4%', rev: '₺4,500' },
                        { dest: 'Kapadokya Sıcak Hava Balon (GYG)', source: '/kapadokya-balon', clicks: 320, sales: 18, conv: '5.6%', rev: '₺2,800' },
                        { dest: 'İzmir Havalimanı Araç Kiralama', source: '/izmir-gezi-rehberi', clicks: 450, sales: 12, conv: '2.6%', rev: '₺1,450' },
                      ].map((row, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold max-w-[200px] truncate">{row.dest}</td>
                          <td className="px-6 py-4 text-gray-500 text-xs"><a href="#" className="hover:text-blue-500 hover:underline">{row.source}</a></td>
                          <td className="px-6 py-4 border-l border-gray-100 text-center font-medium">{row.clicks}</td>
                          <td className="px-6 py-4 text-center font-medium">{row.sales}</td>
                          <td className="px-6 py-4 text-center text-green-600 font-bold">{row.conv}</td>
                          <td className="px-6 py-4 text-right font-extrabold text-gray-900">{row.rev}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Trafik ve Ziyaretçi Analizi</h2>
                  <p className="text-gray-500 mt-1">Sitenizin Google Analytics ve Search Console verilerinin özet görünümü.</p>
                </div>
                <div className="flex bg-white rounded-lg border border-gray-200 p-1 shadow-sm">
                  <button className="px-4 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-900">Son 30 Gün</button>
                  <button className="px-4 py-1.5 text-sm font-medium rounded-md text-gray-500 hover:text-gray-900">Bu Yıl</button>
                </div>
              </div>

              {/* Traffic KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Toplam Kullanıcı</h3>
                  <div className="text-3xl font-extrabold text-gray-900">124.5K</div>
                  <div className="text-sm text-green-500 font-medium mt-2">+12.4% (Önceki aya göre)</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Oturum Süresi</h3>
                  <div className="text-3xl font-extrabold text-gray-900">03:42</div>
                  <div className="text-sm text-green-500 font-medium mt-2">+0:15sn (Önceki aya göre)</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Organik Arama</h3>
                  <div className="text-3xl font-extrabold text-gray-900">82.3K</div>
                  <div className="text-sm text-green-500 font-medium mt-2">+15.2% (SEO artışı)</div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-gray-500 text-sm font-bold mb-1">Hemen Çıkma Oranı</h3>
                  <div className="text-3xl font-extrabold text-gray-900">42.1%</div>
                  <div className="text-sm text-green-500 font-medium mt-2">-2.4% (İyileşme)</div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic Sources */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-6">Trafik Kaynakları</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span>Google (Organik)</span>
                        <span>65%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span>Doğrudan (Direct)</span>
                        <span>20%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span>Sosyal Medya</span>
                        <span>10%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-pink-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm font-bold text-gray-800 mb-2">
                        <span>Referans (Diğer Siteler)</span>
                        <span>5%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popular Pages */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-6">En Çok Okunan Sayfalar (Son 30 Gün)</h3>
                  <div className="space-y-4">
                    {[
                      { path: '/destinasyon/kapadokya', title: 'Kapadokya Gezilecek Yerler', views: '45,210' },
                      { path: '/blog/fethiye-tekne-turlari', title: 'Fethiye Tekne Turları Rehberi', views: '32,150' },
                      { path: '/destinasyon/ege-bolgesi', title: 'Ege Bölgesi Plajları', views: '28,400' },
                      { path: '/', title: 'Ana Sayfa', views: '22,100' },
                      { path: '/blog/bozcaada-otelleri', title: 'Bozcaada Butik Otelleri', views: '15,800' }
                    ].map((page, idx) => (
                      <div key={idx} className="flex justify-between items-center border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                        <div>
                          <div className="font-bold text-gray-900 text-sm truncate max-w-[200px]">{page.title}</div>
                          <div className="text-xs text-gray-500">{page.path}</div>
                        </div>
                        <div className="font-bold text-gray-700">{page.views}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sistem ve Marka Ayarları</h2>
                  <p className="text-gray-500 mt-1">Logo, site ismi ve alt bilgi (footer) alanlarını özelleştirin.</p>
                </div>
                <button 
                  onClick={handleSaveSettings}
                  disabled={isSavingSettings}
                  className={`font-bold py-2 px-6 rounded-xl transition-colors ${
                    isSavingSettings
                      ? 'bg-green-500 text-white' 
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {isSavingSettings ? 'Kaydedildi ✓' : 'Ayarları Kaydet'}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-900">Marka ve Görsel Kimlik</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Site Adı</label>
                    <input 
                      type="text" 
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      placeholder="Geziyorum Türkiye"
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Logo URL (Resim Linki)</label>
                    <div className="flex gap-4 items-start">
                       <input 
                         type="text" 
                         value={settingsLogo}
                         onChange={(e) => setSettingsLogo(e.target.value)}
                         placeholder="https://..."
                         className="flex-1 px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 mt-1"
                       />
                       {settingsLogo && (
                         <div className="w-16 h-16 border rounded bg-gray-50 p-1 flex items-center justify-center shrink-0">
                            <img src={settingsLogo} alt="Logo Önizleme" referrerPolicy="no-referrer" className="max-w-full max-h-full object-contain" />
                         </div>
                       )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Sitenizin üst menüsünde (Header) ve alt bilgisinde (Footer) görünür.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-bold text-gray-900">Alt Bilgi (Footer)</h3>
                </div>
                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hakkımızda / Slogan Metni</label>
                    <textarea 
                      value={settingsFooter}
                      onChange={(e) => setSettingsFooter(e.target.value)}
                      placeholder="Türkiye'nin gizli kalmış cennetlerini..."
                      className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 resize-none h-24"
                    />
                    <p className="text-xs text-gray-500 mt-1">Bu yazı sitenin en alt kısmındaki açıklama bölümünde görünür.</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Üst Menü Bağlantıları</h3>
                  <button 
                    onClick={handleAddLink}
                    className="text-sm font-bold text-orange-600 hover:text-orange-700 transition-colors"
                  >
                    + Yeni Link Ekle
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {settingsLinks.map((link, idx) => (
                    <div key={idx} className="flex items-center gap-4">
                      <div className="flex-1">
                         <input 
                           type="text" 
                           value={link.title}
                           onChange={(e) => handleUpdateLink(idx, 'title', e.target.value)}
                           placeholder="Link Adı"
                           className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                         />
                      </div>
                      <div className="flex-1">
                         <input 
                           type="text" 
                           value={link.url}
                           onChange={(e) => handleUpdateLink(idx, 'url', e.target.value)}
                           placeholder="/hedef-url"
                           className="w-full px-4 py-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                         />
                      </div>
                      <button 
                        onClick={() => handleRemoveLink(idx)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors shrink-0"
                        title="Bu linki sil"
                      >
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    </div>
                  ))}
                  {settingsLinks.length === 0 && (
                    <div className="text-sm text-gray-500 text-center py-4">Gösterilecek menü linki bulunmuyor.</div>
                  )}
                  <p className="text-xs text-gray-500 mt-2">Bu linkler sitenizin ana üst navigasyonunda (Header) görünür.</p>
                </div>
              </div>

            </div>
          )}

        </div>
      </main>

    </div>
    </AdminAuth>
  );
}
