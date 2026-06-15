import { TourListing } from './types';

export const TOUR_LISTINGS: TourListing[] = [
  {
    id: "1",
    title: "Kapadokya Sıcak Hava Balonu Turu",
    slug: "kapadokya-sicak-hava-balonu-turu",
    description: "Peri bacalarının eşsiz manzarasına karşı şafak vakti efsanevi bir uçuş deneyimi. Vadilerin ve volkanik oluşumların üzerinden süzüleceksiniz.",
    location: {
      province: "Nevşehir",
      district: "Göreme"
    },
    coordinates: { lat: 38.6431, lng: 34.8299 },
    categories: ["Kültür & Tarih", "Doğa & Macera"],
    tags: ["balon", "peri bacaları", "şafak vakti"],
    price_try: 3500,
    duration_days: 1,
    rating: 4.9,
    featured_image: "https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?auto=format&fit=crop&w=800&q=80",
    gallery_images: []
  },
  {
    id: "2",
    title: "Fethiye Ölüdeniz Yamaç Paraşütü",
    slug: "fethiye-oludeniz-yamac-parasutu",
    description: "Babadağ'dan süzülerek Ölüdeniz'in turkuaz sularını gökyüzünden keşfedin. Adrenalin tutkunları için eşsiz bir deneyim.",
    location: {
      province: "Muğla",
      district: "Fethiye"
    },
    coordinates: { lat: 36.5458, lng: 29.1171 },
    categories: ["Doğa & Macera", "Deniz Yaşamı"],
    tags: ["yamaç paraşütü", "babadağ", "deniz"],
    price_try: 2200,
    duration_days: 1,
    rating: 4.8,
    featured_image: "https://images.unsplash.com/photo-1520111586790-2bd19183416e?auto=format&fit=crop&w=800&q=80",
    gallery_images: []
  },
  {
    id: "3",
    title: "Cumalıkızık Tarihi Köy Turu",
    slug: "cumalikizik-tarihi-koy-turu",
    description: "Tarihi Osmanlı evleri ve dar sokaklarıyla ünlü, UNESCO mirası köyde serpme kahvaltı ve kültür turu.",
    location: {
      province: "Bursa",
      district: "Yıldırım"
    },
    coordinates: { lat: 40.1764, lng: 29.1719 },
    categories: ["Kültür & Tarih", "Gastronomi"],
    tags: ["osmanlı", "unesco", "kahvaltı"],
    price_try: 850,
    duration_days: 1,
    rating: 4.7,
    featured_image: "https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=800&q=80",
    gallery_images: []
  },
  {
    id: "4",
    title: "Gaziantep Lezzet ve Bakırcılar Turu",
    slug: "gaziantep-lezzet-ve-bakircilar-turu",
    description: "UNESCO tescilli zengin Antep mutfağı, Zeugma Mozaik Müzesi ve tarihi Bakırcılar Çarşısı'nda dolu dolu gezi.",
    location: {
      province: "Gaziantep",
      district: "Şahinbey"
    },
    coordinates: { lat: 37.0662, lng: 37.3833 },
    categories: ["Gastronomi", "Kültür & Tarih"],
    tags: ["baklava", "mozaik", "çarşı"],
    price_try: 900,
    duration_days: 2,
    rating: 4.8,
    featured_image: "https://images.unsplash.com/photo-1596538166567-6aa8cdeb6ba3?auto=format&fit=crop&w=800&q=80",
    gallery_images: []
  },
  {
    id: "5",
    title: "Kaş Dalış ve Kekova Tekne Turu",
    slug: "kas-dalis-ve-kekova-tekne-turu",
    description: "Batık şehir Kekova'da yüzme molaları ve Kaş'ın pırıl pırıl denizinde tüplü dalış.",
    location: {
      province: "Antalya",
      district: "Kaş"
    },
    coordinates: { lat: 36.2023, lng: 29.6389 },
    categories: ["Deniz Yaşamı", "Doğa & Macera"],
    tags: ["dalış", "tekne", "batık şehir"],
    price_try: 1800,
    duration_days: 1,
    rating: 4.9,
    featured_image: "https://images.unsplash.com/photo-1555810237-77299380fb35?auto=format&fit=crop&w=800&q=80",
    gallery_images: []
  }
];
