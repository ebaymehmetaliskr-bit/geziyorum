import { MapPin, Star, Clock } from 'lucide-react';
import { TourListing } from '../types';
import { Link } from 'react-router-dom';
import { LazyImage } from './LazyImage';

interface ListingCardProps {
  listing: TourListing;
  key?: string | number;
  onClick?: (listing: TourListing) => void;
}

export function ListingCard({ listing, onClick }: ListingCardProps) {
  const CardContent = (
    <>
      {/* Image & Badge */}
      <div className="relative overflow-hidden rounded-t-2xl">
        <LazyImage 
          src={listing.featured_image || 'https://images.unsplash.com/photo-1524230659092-07f99a75c013?auto=format&fit=crop&w=800&q=80'} 
          alt={listing.title} 
          wrapperClassName="w-full aspect-[4/3]"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm pointer-events-none flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
          <span className="text-xs font-semibold text-gray-900 tracking-wide uppercase">{listing.categories[0]}</span>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-sm pointer-events-none flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
          <span className="text-xs font-bold text-gray-900">{listing.rating}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col bg-white">
        <h3 className="text-lg font-bold text-gray-900 mb-3 leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors">
          {listing.title}
        </h3>
        
        <div className="flex flex-col gap-2.5 mb-2 mt-auto">
          <div className="flex items-center text-gray-600 text-sm font-medium">
            <MapPin className="w-4 h-4 mr-1.5 shrink-0 text-orange-500" />
            <span className="truncate">{listing.location.province}{listing.location.district ? `, ${listing.location.district}` : ''}</span>
          </div>
          
          {listing.duration_days && listing.duration_days !== "Süre Belirtilmemiş" && (
            <div className="flex items-center text-gray-700 text-xs font-bold bg-orange-50/50 self-start px-2.5 py-1 rounded-md border border-orange-100/50">
              <Clock className="w-3.5 h-3.5 mr-1.5 shrink-0 text-orange-500" />
              <span>{listing.duration_days}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-0.5">
              Fiyat
            </span>
            <span className="text-xl font-black text-gray-900 tracking-tight">
              {listing.display_price && listing.display_price !== "Fiyat Belirtilmemiş" 
                ? listing.display_price 
                : listing.price_try > 0 ? `₺${listing.price_try.toLocaleString('tr-TR')}` : 'Ücretsiz'}
            </span>
          </div>
          <div className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-orange-500/20 group-hover:bg-orange-600 group-hover:shadow-orange-600/30 transition-all duration-300">
            İncele
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link 
      to={`/tour/${listing.id}`}
      className="cursor-pointer rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group block text-left"
    >
      {CardContent}
    </Link>
  );
}

