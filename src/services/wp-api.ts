import { TourListing } from '../types';
import { TOUR_LISTINGS } from '../data';

const WP_URL = import.meta.env.VITE_WP_API_URL || 'https://www.geziyorumturkiye.com';
const WP_API_BASE = `${WP_URL}/wp-json/wp/v2`;

export interface SiteSettings {
  name: string;
  description: string;
  site_icon_url?: string;
  site_logo_url?: string;
}

export async function getSiteSettings(): Promise<SiteSettings | null> {
  try {
    const response = await fetch(`${WP_URL}/wp-json/`);
    if (!response.ok) return null;
    const data = await response.json();
    
    let site_logo_url = undefined;
    
    // Fallbacks since WP API can be inconsistent
    if (data.site_icon_url) {
        site_logo_url = data.site_icon_url; // Use as fallback initially
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
        } catch (e) {
          console.warn("Could not fetch media info for site_logo", e);
        }
      }
    }

    return {
      name: data.name,
      description: data.description,
      site_icon_url: data.site_icon_url,
      site_logo_url: site_logo_url
    };
  } catch (error) {
    console.warn("Could not fetch site settings from WordPress.", error);
    return null;
  }
}

export async function getToursFromWordPress(page: number = 1): Promise<TourListing[]> {
  try {
    // Asıl senaryoda Rehub temasının özel post type'ını çağırıyoruz (örn: 'tours' veya standart 'posts')
    // ?_embed parametresi ile öne çıkan görselleri (embedded media) de veriye dahil ediyoruz.
    const response = await fetch(`${WP_API_BASE}/posts?_embed&per_page=9&page=${page}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.warn(`WordPress API Hatası: ${response.status} ${response.statusText}`);
      return TOUR_LISTINGS;
    }

    const wpPosts = await response.json();

    // WordPress'ten gelen API verisini projemizdeki TourListing arayüzüne (interface) haritalandırıyoruz (Mapping).
    return wpPosts.map((post: any) => {
      // İçerikteki HTML taglerini temizliyoruz
      const cleanDescription = post.content?.rendered?.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...";
      
      const acf = post.acf || {};

        const wpTerms = post._embedded?.['wp:term'];
        let categories: string[] = ["Bilinmeyen Kategori"];
        if (wpTerms && Array.isArray(wpTerms)) {
          // Flatten all terms and filter the categories
          const allTerms = wpTerms.flat();
          const categoryTerms = allTerms.filter((term: any) => term.taxonomy === 'category' || term.taxonomy === 'post_tag');
          if (categoryTerms.length > 0) {
            categories = categoryTerms.map((term: any) => term.name);
          }
        }

      return {
        id: post.id.toString(),
        title: post.title?.rendered || 'İsimsiz Rota',
        slug: post.slug,
        description: cleanDescription || '',
        location: {
          province: acf.province || "Bilinmiyor",
          district: acf.district || ""
        },
        coordinates: { 
          lat: parseFloat(acf.latitude) || 39.92077, 
          lng: parseFloat(acf.longitude) || 32.85411 
        },
        categories: categories,
        tags: [],
        price_try: parseInt(acf.price_try) || 1200, 
        duration_days: parseInt(acf.duration_days) || 1, 
        rating: parseFloat(acf.rating) || 4.8,
        featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=800&q=80',
        gallery_images: [],
        affiliate_link: acf.affiliate_link || ''
      } as TourListing;
    });

  } catch (error) {
    console.warn("Mevcut WordPress sitesine bağlanılamadı. Geçici mock veriler kullanılıyor.");
    return TOUR_LISTINGS;
  }
}

export async function getTourByIdFromWordPress(id: string): Promise<TourListing | null> {

  try {
    const response = await fetch(`${WP_API_BASE}/posts/${id}?_embed`, {
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

    const post = await response.json();

    const cleanDescription = post.content?.rendered?.replace(/(<([^>]+)>)/gi, "").substring(0, 150) + "...";
    const acf = post.acf || {};

    const wpTerms = post._embedded?.['wp:term'];
    let categories: string[] = ["Bilinmeyen Kategori"];
    if (wpTerms && Array.isArray(wpTerms)) {
      const allTerms = wpTerms.flat();
      const categoryTerms = allTerms.filter((term: any) => term.taxonomy === 'category' || term.taxonomy === 'post_tag');
      if (categoryTerms.length > 0) {
        categories = categoryTerms.map((term: any) => term.name);
      }
    }

    return {
      id: post.id.toString(),
      title: post.title?.rendered || 'İsimsiz Rota',
      slug: post.slug,
      description: cleanDescription || '',
      location: {
        province: acf.province || "Bilinmiyor",
        district: acf.district || ""
      },
      coordinates: { 
        lat: parseFloat(acf.latitude) || 39.92077, 
        lng: parseFloat(acf.longitude) || 32.85411 
      },
      categories: categories,
      tags: [],
      price_try: parseInt(acf.price_try) || 1200, 
      duration_days: parseInt(acf.duration_days) || 1, 
      rating: parseFloat(acf.rating) || 4.8,
      featured_image: post._embedded?.['wp:featuredmedia']?.[0]?.source_url || 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=800&q=80',
      gallery_images: [],
      affiliate_link: acf.affiliate_link || ''
    } as TourListing;

  } catch (error) {
    console.warn("Mevcut WordPress sitesine bağlanılamadı. Geçici mock veriler kullanılıyor.");
    const mockTour = TOUR_LISTINGS.find(t => t.id === id);
    return mockTour || null;
  }
}

