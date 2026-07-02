import { TourListing } from '../types';
import { TOUR_LISTINGS } from '../data';

// Next.js entegrasyonu için WordPress API base adresini doğrudan canlı sunucuna bağlıyoruz.
const WP_LIVE_URL = 'https://www.geziyorumturkiye.com';
const WP_API_BASE = `${WP_LIVE_URL}/wp-json/wp/v2`;

export interface SiteSettings {
  name: string;
  description: string;
  site_icon_url?: string;
  site_logo_url?: string;
  top_links?: { title: string; url: string }[];
  footer_links?: { title: string; url: string }[];
  footer_text?: string;
  seo_title?: string;
  seo_description?: string;
  contact_address?: string;
  contact_phone?: string;
  contact_email?: string;
  legal_links?: { title: string; url: string }[];
  social_instagram?: string;
  social_facebook?: string;
  social_twitter?: string;
  hero_image_url?: string;
}

// Sunucu taraflı derlemede DOMParser olmadığı için güvenli HTML Entity çözücü
export const decodeHtmlEntities = (text: string): string => {
  if (!text) return '';
  if (typeof window === 'undefined') {
    // Sunucu tarafında (SSR) regex ile basit temizlik
    return text
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'");
  }
  try {
    const doc = new DOMParser().parseFromString(text, 'text/html');
    return doc.documentElement.textContent || text;
  } catch (e) {
    return text;
  }
};

export async function getSiteSettings(): Promise<SiteSettings | null> {
  let localSettings: Partial<SiteSettings> = {};
  try {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('geziyorum_settings');
      if (saved) {
        localSettings = JSON.parse(saved);
      }
    }
  } catch (e) {}

  const defaults = {
    top_links: [
      { title: 'Destinasyonlar', url: '/destinasyon/ege-bolgesi' },
      { title: 'Rota Planla', url: '/rota-planlayici' },
      { title: 'Blog', url: '/blog' }
    ],
    footer_links: [
      { title: 'Ege Kıyıları', url: '/destinasyon/ege-bolgesi' },
      { title: 'Akdeniz Rotaları', url: '/destinasyon/akdeniz' },
      { title: 'Kapadokya Turu', url: '/destinasyon/kapadokya' },
      { title: 'Gezi Rehberleri', url: '/blog' },
      { title: 'Konaklama Tavsiyeleri', url: '/blog' }
    ],
    footer_text: 'Doğu\'dan Batı\'ya Türkiye\'nin gizli kalmış cennetlerini ve en popüler seyahat rotalarını keşfedin.',
    site_logo_url: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=100&h=100&fit=crop',
    contact_address: 'Beşiktaş, İstanbul\nTürkiye',
    contact_phone: '+90 (212) 555 0123',
    contact_email: 'iletisim@geziyorum.com',
    legal_links: [
      { title: 'Kullanım Koşulları', url: '/kullanim-kosullari' },
      { title: 'Gizlilik Politikası', url: '/gizlilik' },
      { title: 'Çerez Politikası', url: '/cerezler' },
      { title: 'KVKK Aydınlatma Metni', url: '/kvkk' }
    ],
    social_instagram: 'https://instagram.com/geziyorum',
    social_facebook: 'https://facebook.com/geziyorum',
    social_twitter: 'https://twitter.com/geziyorum',
    hero_image_url: 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&q=80',
  };

  try {
    const response = await fetch(`${WP_LIVE_URL}/wp-json/`);
    if (!response.ok) {
       return {
         name: localSettings.name || 'Geziyorum',
         description: localSettings.description || 'Gezi Rehberi',
         site_icon_url: localSettings.site_icon_url || '',
         site_logo_url: localSettings.site_logo_url || defaults.site_logo_url,
         top_links: localSettings.top_links || defaults.top_links,
         footer_links: localSettings.footer_links || defaults.footer_links,
         footer_text: localSettings.footer_text || defaults.footer_text,
         seo_title: localSettings.seo_title,
         seo_description: localSettings.seo_description,
         contact_address: localSettings.contact_address || defaults.contact_address,
         contact_phone: localSettings.contact_phone || defaults.contact_phone,
         contact_email: localSettings.contact_email || defaults.contact_email,
         legal_links: localSettings.legal_links || defaults.legal_links,
         social_instagram: localSettings.social_instagram || defaults.social_instagram,
         social_facebook: localSettings.social_facebook || defaults.social_facebook,
         social_twitter: localSettings.social_twitter || defaults.social_twitter,
         hero_image_url: localSettings.hero_image_url || defaults.hero_image_url,
       };
    }
    
    const data = await response.json();
    let site_logo_url = undefined;
    
    if (data.site_icon_url) {
        site_logo_url = data.site_icon_url; 
    }

    if (data.site_logo) {
      if (typeof data.site_logo === 'string') {
        site_logo_url = data.site_logo;
      } else if (typeof data.site_logo === 'number') {
        try {
          const mediaRes = await fetch(`${WP_API_BASE}/media/${data.site_logo}`);
          if (mediaRes.ok) {
            const mediaData = await mediaRes.json();
            if (mediaData.source_url) {
                site_logo_url = mediaData.source_url;
            }
          }
        } catch (e) {}
      }
    }

    return {
      name: localSettings.name || data.name,
      description: localSettings.description || data.description,
      site_icon_url: localSettings.site_icon_url || data.site_icon_url,
      site_logo_url: localSettings.site_logo_url || site_logo_url || defaults.site_logo_url,
      top_links: localSettings.top_links || defaults.top_links,
      footer_links: localSettings.footer_links || defaults.footer_links,
      footer_text: localSettings.footer_text || defaults.footer_text,
      seo_title: localSettings.seo_title,
      seo_description: localSettings.seo_description,
      contact_address: localSettings.contact_address || defaults.contact_address,
      contact_phone: localSettings.contact_phone || defaults.contact_phone,
      contact_email: localSettings.contact_email || defaults.contact_email,
      legal_links: localSettings.legal_links || defaults.legal_links,
      social_instagram: localSettings.social_instagram || defaults.social_instagram,
      social_facebook: localSettings.social_facebook || defaults.social_facebook,
      social_twitter: localSettings.social_twitter || defaults.social_twitter,
      hero_image_url: localSettings.hero_image_url || defaults.hero_image_url,
    };
  } catch (error) {
    console.warn("Could not fetch site settings from WordPress.", error);
    return {
      name: localSettings.name || 'Geziyorum',
      description: localSettings.description || '',
      site_icon_url: localSettings.site_icon_url || '',
      site_logo_url: localSettings.site_logo_url || defaults.site_logo_url,
      top_links: localSettings.top_links || defaults.top_links,
      footer_links: localSettings.footer_links || defaults.footer_links,
      footer_text: localSettings.footer_text || defaults.footer_text,
      seo_title: localSettings.seo_title,
      seo_description: localSettings.seo_description,
      contact_address: localSettings.contact_address || defaults.contact_address,
      contact_phone: localSettings.contact_phone || defaults.contact_phone,
      contact_email: localSettings.contact_email || defaults.contact_email,
      legal_links: localSettings.legal_links || defaults.legal_links,
      social_instagram: localSettings.social_instagram || defaults.social_instagram,
      social_facebook: localSettings.social_facebook || defaults.social_facebook,
      social_twitter: localSettings.social_twitter || defaults.social_twitter,
      hero_image_url: localSettings.hero_image_url || defaults.hero_image_url,
    };
  }
}

export async function getToursFromWordPress(page: number = 1): Promise<TourListing[]> {
  try {
    const response = await fetch(`${WP_API_BASE}/tours?_embed&per_page=9&page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`WordPress API Hatası: ${response.status} ${response.statusText}`);
      return TOUR_LISTINGS;
    }

    const wpTours = await response.json();

    return wpTours.map((tour: any) => {
      const cleanDescription = tour.excerpt?.rendered 
        ? tour.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "..." 
        : tour.content?.rendered?.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...";
      
      const acf = tour.acf || {};

      const wpTerms = tour._embedded?.['wp:term'];
      let categories: string[] = ["Bilinmeyen Kategori"];
      if (wpTerms && Array.isArray(wpTerms)) {
        const allTerms = wpTerms.flat();
        const categoryTerms = allTerms.filter((term: any) => term.taxonomy === 'category' || term.taxonomy === 'post_tag' || term.taxonomy === 'tour_category');
        if (categoryTerms.length > 0) {
          categories = categoryTerms.map((term: any) => term.name);
        }
      }

      const rawPrice = tour.tour_price || acf.price_try || "0";
      const numericPrice = parseInt(String(rawPrice).replace(/[^0-9]/g, '')) || 0;

      return {
        id: tour.id.toString(),
        title: tour.title?.rendered || 'İsimsiz Rota',
        slug: tour.slug,
        description: cleanDescription || '',
        location: {
          province: tour.tour_location || acf.province || "Bilinmiyor",
          district: acf.district || ""
        },
        coordinates: { 
          lat: parseFloat(acf.latitude) || 39.92077, 
          lng: parseFloat(acf.longitude) || 32.85411 
        },
        categories: categories,
        tags: [],
        price_try: numericPrice, 
        display_price: tour.tour_price || "Fiyat Belirtilmemiş",
        duration_days: tour.tour_duration || acf.duration_days || "Süre Belirtilmemiş", 
        rating: parseFloat(acf.rating) || 5.0,
        featured_image: tour._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=800&q=80',
        gallery_images: [],
        affiliate_link: tour.tour_affiliate_link || acf.affiliate_link || ''
      } as TourListing;
    });

  } catch (error) {
    console.warn("Mevcut WordPress sitesine bağlanılamadı. Geçici mock veriler kullanılıyor.");
    return TOUR_LISTINGS;
  }
}

export async function getBlogPostsFromWordPress(perPage = 10, categorySlug = ''): Promise<BlogPost[]> {
  try {
    let url = `${WP_API_BASE}/posts?_embed&per_page=${perPage}`;
    if (categorySlug) {
       const catRes = await fetch(`${WP_API_BASE}/categories?slug=${categorySlug}`);
       if (catRes.ok) {
         const cats = await catRes.json();
         if (cats && cats.length > 0) {
           url += `&categories=${cats[0].id}`;
         }
       }
    }

    const response = await fetch(url);
    if (!response.ok) return [];

    const posts = await response.json();
    return posts.map((post: any) => {
      const excerpt = post.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || '';
      const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=800&q=80';
      const termInfo = post._embedded?.['wp:term']?.[0]?.[0];
      return {
        id: post.id,
        slug: post.slug,
        title: decodeHtmlEntities(post.title?.rendered || ''),
        excerpt: decodeHtmlEntities(excerpt.length > 150 ? excerpt.substring(0, 150) + "..." : excerpt),
        content: post.content?.rendered,
        date: new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        categoryName: termInfo?.name || 'Genel',
        categorySlug: termInfo?.slug || 'genel',
        img
      };
    });
  } catch (error) {
    console.error("WP API: Blog posts couldn't be loaded", error);
    return [];
  }
}

export async function getBlogPostBySlugFromWordPress(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${WP_API_BASE}/posts?_embed&slug=${slug}`);
    if (!response.ok) return null;
    const posts = await response.json();
    if (!posts || posts.length === 0) return null;
    
    const post = posts[0];
    const excerpt = post.excerpt?.rendered?.replace(/(<([^>]+)>)/gi, "") || '';
    const img = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?w=1600&q=80';
    const termInfo = post._embedded?.['wp:term']?.[0]?.[0];

    return {
      id: post.id,
      slug: post.slug,
      title: decodeHtmlEntities(post.title?.rendered || ''),
      excerpt: decodeHtmlEntities(excerpt),
      content: post.content?.rendered,
      date: new Date(post.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
      categoryName: termInfo?.name || 'Genel',
      categorySlug: termInfo?.slug || 'genel',
      img
    };
  } catch (error) {
    console.error("WP API: Blog post couldn't be loaded", error);
    return null;
  }
}

export async function getTourByIdFromWordPress(id: string): Promise<TourListing | null> {
  try {
    const response = await fetch(`${WP_API_BASE}/tours/${id}?_embed`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.warn(`WordPress API Hatası: ${response.status} ${response.statusText}`);
      const mockTour = TOUR_LISTINGS.find(t => t.id === id);
      return mockTour || null;
    }

    const tour = await response.json();

    const cleanDescription = tour.excerpt?.rendered 
        ? tour.excerpt.rendered.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "..." 
        : tour.content?.rendered?.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...";
    const acf = tour.acf || {};

    const wpTerms = tour._embedded?.['wp:term'];
    let categories: string[] = ["Bilinmeyen Kategori"];
    if (wpTerms && Array.isArray(wpTerms)) {
      const allTerms = wpTerms.flat();
      const categoryTerms = allTerms.filter((term: any) => term.taxonomy === 'category' || term.taxonomy === 'post_tag' || term.taxonomy === 'tour_category');
      if (categoryTerms.length > 0) {
        categories = categoryTerms.map((term: any) => term.name);
      }
    }

    const rawPrice = tour.tour_price || acf.price_try || "0";
    const numericPrice = parseInt(String(rawPrice).replace(/[^0-9]/g, '')) || 0;

    return {
      id: tour.id.toString(),
      title: tour.title?.rendered || 'İsimsiz Rota',
      slug: tour.slug,
      description: cleanDescription || '',
      content: tour.content?.rendered || '',
      location: {
        province: tour.tour_location || acf.province || "Bilinmiyor",
        district: acf.district || ""
      },
      coordinates: { 
        lat: parseFloat(acf.latitude) || 39.92077, 
        lng: parseFloat(acf.longitude) || 32.85411 
      },
      categories: categories,
      tags: [],
      price_try: numericPrice, 
      display_price: tour.tour_price || "Fiyat Belirtilmemiş",
      duration_days: tour.tour_duration || acf.duration_days || "Süre Belirtilmemiş", 
      rating: parseFloat(acf.rating) || 5.0,
      featured_image: tour._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1524230757912-21f4fe3a0837?auto=format&fit=crop&w=800&q=80',
      gallery_images: [],
      affiliate_link: tour.tour_affiliate_link || acf.affiliate_link || ''
    } as TourListing;

  } catch (error) {
    console.warn("Mevcut WordPress sitesine bağlanılamadı. Geçici mock veriler kullanılıyor.");
    const mockTour = TOUR_LISTINGS.find(t => t.id === id);
    return mockTour || null;
  }
}